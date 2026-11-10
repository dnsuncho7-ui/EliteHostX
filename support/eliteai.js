"use strict";

const express = require("express");

const SUPPORT_CATEGORIES = {
    account: "Account & Login",
    billing: "Billing & Payments",
    hosting: "Hosting Plans",
    server: "Minecraft Server",
    technical: "Technical Support",
    other: "Other"
};

function isAdmin(req) {
    const role = String(req.user?.role || "")
        .trim()
        .toUpperCase();

    return role === "ADMIN" || role === "OWNER";
}

function requireLogin(req, res, next) {
    if (
        !req.isAuthenticated ||
        !req.isAuthenticated() ||
        !req.user
    ) {
        return res.status(401).json({
            error: "Debes iniciar sesión para acceder al soporte."
        });
    }

    next();
}

function requireAdmin(req, res, next) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            error: "No tienes permisos de administrador."
        });
    }

    next();
}

function validId(value) {
    const id = Number(value);

    return Number.isSafeInteger(id) && id > 0
        ? id
        : null;
}

/* ================================================
   DATABASE
================================================ */

async function initializeSupportDatabase(pool) {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS support_tickets (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGINT NOT NULL
                REFERENCES users(id) ON DELETE CASCADE,
            subject VARCHAR(120) NOT NULL,
            category VARCHAR(30) NOT NULL DEFAULT 'other',
            status VARCHAR(20) NOT NULL DEFAULT 'open'
                CHECK (
                    status IN (
                        'open',
                        'in_progress',
                        'answered',
                        'closed'
                    )
                ),
            priority VARCHAR(20) NOT NULL DEFAULT 'normal'
                CHECK (
                    priority IN ('low', 'normal', 'high')
                ),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        ALTER TABLE support_tickets
        ADD COLUMN IF NOT EXISTS category
        VARCHAR(30) NOT NULL DEFAULT 'other'
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS support_ticket_messages (
            id BIGSERIAL PRIMARY KEY,
            ticket_id BIGINT NOT NULL
                REFERENCES support_tickets(id) ON DELETE CASCADE,
            sender_id BIGINT
                REFERENCES users(id) ON DELETE SET NULL,
            sender_type VARCHAR(20) NOT NULL
                CHECK (sender_type IN ('user', 'admin')),
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS support_tickets_user_idx
        ON support_tickets(user_id, updated_at DESC)
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS support_tickets_status_idx
        ON support_tickets(status, updated_at DESC)
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS support_ticket_messages_ticket_idx
        ON support_ticket_messages(ticket_id, created_at)
    `);

    console.log("[SUPPORT] Tablas de soporte preparadas.");
}

/* ================================================
   ROUTER
================================================ */

function createSupportRouter({ pool, requireDatabase }) {
    const router = express.Router();

    router.use(requireDatabase);
    router.use(requireLogin);

    /* --------------------------------
       SUPPORT STATUS
    -------------------------------- */

    router.get("/status", (req, res) => {
        res.set("Cache-Control", "no-store");

        res.json({
            name: "EliteHostX Support",
            status: "online",
            tickets: true,
            categories: Object.keys(SUPPORT_CATEGORIES),
            admin: isAdmin(req)
        });
    });

    /* --------------------------------
       CREATE TICKET
    -------------------------------- */

    router.post("/tickets", async (req, res, next) => {
        let client;

        try {
            const category = String(
                req.body?.category || ""
            ).trim().toLowerCase();

            const subject = String(
                req.body?.subject || ""
            ).trim();

            const message = String(
                req.body?.message || ""
            ).trim();

            if (!SUPPORT_CATEGORIES[category]) {
                return res.status(400).json({
                    error: "Selecciona una categoría válida."
                });
            }

            if (subject.length < 3 || subject.length > 120) {
                return res.status(400).json({
                    error: "El asunto debe tener entre 3 y 120 caracteres."
                });
            }

            if (message.length < 5 || message.length > 4000) {
                return res.status(400).json({
                    error: "El mensaje debe tener entre 5 y 4000 caracteres."
                });
            }

            client = await pool.connect();

            await client.query("BEGIN");

            const ticketResult = await client.query(
                `INSERT INTO support_tickets
                    (user_id, subject, category, status, priority)
                 VALUES ($1, $2, $3, 'open', 'normal')
                 RETURNING
                    id,
                    subject,
                    category,
                    status,
                    priority,
                    created_at,
                    updated_at`,
                [
                    req.user.id,
                    subject,
                    category
                ]
            );

            const ticket = ticketResult.rows[0];

            await client.query(
                `INSERT INTO support_ticket_messages
                    (ticket_id, sender_id, sender_type, content)
                 VALUES ($1, $2, 'user', $3)`,
                [
                    ticket.id,
                    req.user.id,
                    message
                ]
            );

            await client.query("COMMIT");

            console.log(
                `[SUPPORT] Ticket #${ticket.id} created by user ${req.user.id}.`
            );

            res.status(201).json({
                ticket
            });

        } catch (error) {
            if (client) {
                await client.query("ROLLBACK").catch(() => {});
            }

            console.error("[SUPPORT] Create ticket error:", error);
            next(error);

        } finally {
            client?.release();
        }
    });

    /* --------------------------------
       USER TICKET LIST
    -------------------------------- */

    router.get("/tickets", async (req, res, next) => {
        try {
            const result = await pool.query(
                `SELECT
                    id,
                    subject,
                    category,
                    status,
                    priority,
                    created_at,
                    updated_at
                 FROM support_tickets
                 WHERE user_id = $1
                 ORDER BY updated_at DESC
                 LIMIT 100`,
                [req.user.id]
            );

            res.set("Cache-Control", "no-store");

            res.json({
                tickets: result.rows
            });

        } catch (error) {
            next(error);
        }
    });

    /* --------------------------------
       TICKET DETAILS AND MESSAGES
    -------------------------------- */

    router.get("/tickets/:id", async (req, res, next) => {
        try {
            const ticketId = validId(req.params.id);

            if (!ticketId) {
                return res.status(400).json({
                    error: "Ticket inválido."
                });
            }

            const admin = isAdmin(req);

            const params = admin
                ? [ticketId]
                : [ticketId, req.user.id];

            const condition = admin
                ? "t.id = $1"
                : "t.id = $1 AND t.user_id = $2";

            const ticketResult = await pool.query(
                `SELECT
                    t.id,
                    t.user_id,
                    t.subject,
                    t.category,
                    t.status,
                    t.priority,
                    t.created_at,
                    t.updated_at,
                    u.display_name AS user_name,
                    u.email AS user_email
                 FROM support_tickets t
                 JOIN users u ON u.id = t.user_id
                 WHERE ${condition}`,
                params
            );

            if (!ticketResult.rows.length) {
                return res.status(404).json({
                    error: "Ticket no encontrado."
                });
            }

            const messagesResult = await pool.query(
                `SELECT
                    id,
                    sender_type,
                    content,
                    created_at
                 FROM support_ticket_messages
                 WHERE ticket_id = $1
                 ORDER BY created_at ASC
                 LIMIT 500`,
                [ticketId]
            );

            res.set("Cache-Control", "no-store");

            res.json({
                ticket: ticketResult.rows[0],
                messages: messagesResult.rows
            });

        } catch (error) {
            next(error);
        }
    });

   
    /* --------------------------------
       DELETE OWN TICKET
    -------------------------------- */

    router.delete("/tickets/:id", async (req, res, next) => {
        let client;

        try {
            const ticketId = validId(req.params.id);

            if (!ticketId) {
                return res.status(400).json({
                    error: "Ticket inválido."
                });
            }

            client = await pool.connect();
            await client.query("BEGIN");

            const ticketResult = await client.query(
                `SELECT id
                 FROM support_tickets
                 WHERE id = $1 AND user_id = $2
                 FOR UPDATE`,
                [ticketId, req.user.id]
            );

            if (!ticketResult.rows.length) {
                await client.query("ROLLBACK");

                return res.status(404).json({
                    error: "Ticket no encontrado."
                });
            }

            await client.query(
                `DELETE FROM support_ticket_messages
                 WHERE ticket_id = $1`,
                [ticketId]
            );

            await client.query(
                `DELETE FROM support_tickets
                 WHERE id = $1 AND user_id = $2`,
                [ticketId, req.user.id]
            );

            await client.query("COMMIT");

            console.log(
                `[SUPPORT] Ticket #${ticketId} deleted by user ${req.user.id}.`
            );

            return res.json({
                success: true,
                message: "Ticket eliminado correctamente."
            });

        } catch (error) {
            if (client) {
                await client.query("ROLLBACK").catch(() => {});
            }

            console.error("[SUPPORT] User ticket deletion error:", error);
            next(error);

        } finally {
            client?.release();
        }
    });

    /* --------------------------------
       SEND TICKET MESSAGE
    -------------------------------- */

    router.post("/tickets/:id/messages", async (req, res, next) => {
        let client;

        try {
            const ticketId = validId(req.params.id);

            const content = String(
                req.body?.content || ""
            ).trim();

            if (!ticketId) {
                return res.status(400).json({
                    error: "Ticket inválido."
                });
            }

            if (content.length < 1 || content.length > 4000) {
                return res.status(400).json({
                    error: "El mensaje debe tener entre 1 y 4000 caracteres."
                });
            }

            client = await pool.connect();

            await client.query("BEGIN");

            const ticketResult = await client.query(
                `SELECT id, user_id, status
                 FROM support_tickets
                 WHERE id = $1
                 FOR UPDATE`,
                [ticketId]
            );

            const ticket = ticketResult.rows[0];

            if (
                !ticket ||
                (
                    !isAdmin(req) &&
                    String(ticket.user_id) !== String(req.user.id)
                )
            ) {
                await client.query("ROLLBACK");

                return res.status(404).json({
                    error: "Ticket no encontrado."
                });
            }

            if (ticket.status === "closed") {
                await client.query("ROLLBACK");

                return res.status(409).json({
                    error: "Este ticket está cerrado."
                });
            }

            const senderType = isAdmin(req)
                ? "admin"
                : "user";

            const messageResult = await client.query(
                `INSERT INTO support_ticket_messages
                    (ticket_id, sender_id, sender_type, content)
                 VALUES ($1, $2, $3, $4)
                 RETURNING
                    id,
                    sender_type,
                    content,
                    created_at`,
                [
                    ticketId,
                    req.user.id,
                    senderType,
                    content
                ]
            );

            const nextStatus = senderType === "admin"
                ? "answered"
                : "open";

            await client.query(
                `UPDATE support_tickets
                 SET status = $2,
                     updated_at = NOW()
                 WHERE id = $1`,
                [
                    ticketId,
                    nextStatus
                ]
            );

            await client.query("COMMIT");

            res.status(201).json({
                message: messageResult.rows[0],
                status: nextStatus
            });

        } catch (error) {
            if (client) {
                await client.query("ROLLBACK").catch(() => {});
            }

            console.error("[SUPPORT] Send message error:", error);
            next(error);

        } finally {
            client?.release();
        }
    });

    /* ================================================
       ADMIN
    ================================================ */

    router.get(
        "/admin/tickets",
        requireAdmin,
        async (req, res, next) => {
            try {
                const result = await pool.query(
                    `SELECT
                        t.id,
                        t.subject,
                        t.category,
                        t.status,
                        t.priority,
                        t.created_at,
                        t.updated_at,
                        u.display_name AS user_name,
                        u.email AS user_email
                     FROM support_tickets t
                     JOIN users u ON u.id = t.user_id
                     ORDER BY
                        CASE t.status
                            WHEN 'open' THEN 1
                            WHEN 'in_progress' THEN 2
                            WHEN 'answered' THEN 3
                            ELSE 4
                        END,
                        t.updated_at DESC
                     LIMIT 200`
                );

                res.set("Cache-Control", "no-store");

                res.json({
                    tickets: result.rows
                });

            } catch (error) {
                next(error);
            }
        }
    );

    /* --------------------------------
       ADMIN UPDATE TICKET
    -------------------------------- */

    router.patch(
        "/admin/tickets/:id",
        requireAdmin,
        async (req, res, next) => {
            try {
                const ticketId = validId(req.params.id);

                const status = String(
                    req.body?.status || ""
                ).trim();

                const priority = String(
                    req.body?.priority || ""
                ).trim();

                const allowedStatuses = [
                    "open",
                    "in_progress",
                    "answered",
                    "closed"
                ];

                const allowedPriorities = [
                    "low",
                    "normal",
                    "high"
                ];

                if (!ticketId) {
                    return res.status(400).json({
                        error: "Ticket inválido."
                    });
                }

                if (
                    status &&
                    !allowedStatuses.includes(status)
                ) {
                    return res.status(400).json({
                        error: "Estado no válido."
                    });
                }

                if (
                    priority &&
                    !allowedPriorities.includes(priority)
                ) {
                    return res.status(400).json({
                        error: "Prioridad no válida."
                    });
                }

                if (!status && !priority) {
                    return res.status(400).json({
                        error: "No hay cambios para guardar."
                    });
                }

                const result = await pool.query(
                    `UPDATE support_tickets
                     SET
                        status = COALESCE(NULLIF($2, ''), status),
                        priority = COALESCE(NULLIF($3, ''), priority),
                        updated_at = NOW()
                     WHERE id = $1
                     RETURNING
                        id,
                        subject,
                        category,
                        status,
                        priority,
                        updated_at`,
                    [
                        ticketId,
                        status,
                        priority
                    ]
                );

                if (!result.rows.length) {
                    return res.status(404).json({
                        error: "Ticket no encontrado."
                    });
                }

                res.json({
                    ticket: result.rows[0]
                });

            } catch (error) {
                next(error);
            }
        }
    );


    /* --------------------------------
       ADMIN DELETE TICKET
    -------------------------------- */

    router.delete(
        "/admin/tickets/:id",
        requireAdmin,
        async (req, res, next) => {
            let client;

            try {
                const ticketId = validId(req.params.id);

                if (!ticketId) {
                    return res.status(400).json({
                        error: "Ticket inválido."
                    });
                }

                client = await pool.connect();
                await client.query("BEGIN");

                const ticketResult = await client.query(
                    `SELECT id
                     FROM support_tickets
                     WHERE id = $1
                     FOR UPDATE`,
                    [ticketId]
                );

                if (!ticketResult.rows.length) {
                    await client.query("ROLLBACK");

                    return res.status(404).json({
                        error: "Ticket no encontrado."
                    });
                }

                await client.query(
                    `DELETE FROM support_ticket_messages
                     WHERE ticket_id = $1`,
                    [ticketId]
                );

                await client.query(
                    `DELETE FROM support_tickets
                     WHERE id = $1`,
                    [ticketId]
                );

                await client.query("COMMIT");

                console.log(
                    `[SUPPORT] Ticket #${ticketId} deleted by admin ${req.user.id}.`
                );

                return res.json({
                    success: true,
                    message: "Ticket eliminado correctamente."
                });

            } catch (error) {
                if (client) {
                    await client.query("ROLLBACK").catch(() => {});
                }

                console.error("[SUPPORT] Admin ticket deletion error:", error);
                next(error);

            } finally {
                client?.release();
            }
        }
        );

    return router;
}

/* ================================================
   EXPORTS
================================================ */

module.exports = {
    initializeSupportDatabase,
    createSupportRouter
};