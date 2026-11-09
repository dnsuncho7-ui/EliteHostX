
const express = require("express");
const rateLimit = require("express-rate-limit");

const { generateResponse } = require("./engine");

function createEliteAIRouter() {
    const router = express.Router();

    const chatLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 30,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        message: {
            error: "Has enviado demasiados mensajes. Inténtalo más tarde."
        }
    });

    router.use((req, res, next) => {
        if (
            typeof req.isAuthenticated !== "function" ||
            !req.isAuthenticated() ||
            !req.user
        ) {
            return res.status(401).json({
                error: "Debes iniciar sesión para utilizar EliteAI."
            });
        }

        next();
    });

    router.post("/chat", chatLimiter, async (req, res) => {
        try {
            const message = req.body?.message;

            if (typeof message !== "string") {
                return res.status(400).json({
                    error: "El mensaje debe ser texto."
                });
            }

            const cleanMessage = message.trim();

            if (!cleanMessage || cleanMessage.length > 2000) {
                return res.status(400).json({
                    error: "El mensaje debe tener entre 1 y 2000 caracteres."
                });
            }

            const result = await generateResponse(cleanMessage);

            return res.json({
                success: true,
                assistant: "EliteAI",
                version: "0.3.0",
                engine: "EliteAI Native Site Reader",
                answer: result.answer,
                category: result.category,
                confidence: result.confidence,
                sources: result.sources || [],
                pagesRead: result.pagesRead || 0
            });
        } catch (error) {
            console.error("[ELITEAI] Error:", error);

            return res.status(500).json({
                error: "EliteAI tuvo un problema procesando el mensaje."
            });
        }
    });

    router.get("/status", (req, res) => {
        res.json({
            success: true,
            name: "EliteAI",
            version: "0.3.0",
            engine: "EliteAI Native Site Reader",
            externalProviders: false,
            website: "https://elitehostx.bond",
            ready: true
        });
    });

    return router;
}

module.exports = {
    createEliteAIRouter
};
