
const { KNOWLEDGE } = require("./knowledge");
const { searchSite } = require("./site-reader");

function normalize(text) {
    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

const TOPIC_WORDS = [
    "elitehostx", "elitehost", "hosting", "minecraft",
    "servidor", "servidores", "server", "servers",
    "plan", "planes", "ram", "procesador", "cpu", "ssd",
    "dashboard", "panel", "cuenta", "registro", "registrarme",
    "login", "sesion", "contrasena", "soporte", "support",
    "ticket", "tickets", "factura", "pago", "pagos",
    "precio", "precios", "consola", "console", "archivo",
    "archivos", "file manager", "crear servidor", "instancia",
    "pterodactyl", "wings", "corona", "esmeralda",
    "diamante", "netherite", "rubi", "amatista",
    "paper", "purpur", "spigot", "vanilla", "settings",
    "configuracion", "configuraciones"
];

function isGreeting(message) {
    return /^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos|que tal)$/.test(
        normalize(message)
    );
}

function isEliteHostTopic(message) {
    const normalized = normalize(message);

    return TOPIC_WORDS.some(word => {
        const normalizedWord = normalize(word);
        return normalized.includes(normalizedWord);
    });
}

function findKnowledge(message) {
    const normalizedMessage = normalize(message);

    const results = KNOWLEDGE.map(item => {
        let score = 0;
        let matchedKeywords = 0;
        let longestMatch = 0;

        for (const keyword of item.keywords) {
            const normalizedKeyword = normalize(keyword);

            if (!normalizedKeyword) continue;

            if (normalizedMessage.includes(normalizedKeyword)) {
                const wordCount = normalizedKeyword.split(" ").length;

                score += wordCount * 10;
                matchedKeywords++;

                if (wordCount > longestMatch) {
                    longestMatch = wordCount;
                }
            }
        }

        // Priorizar frases específicas y varias coincidencias.
        score += matchedKeywords * 2;
        score += longestMatch * 5;

        return {
            item,
            score,
            matchedKeywords,
            longestMatch
        };
    });

    results.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }

        return b.longestMatch - a.longestMatch;
    });

    if (!results.length || results[0].score === 0) {
        return null;
    }

    return results[0].item;
}

async function generateResponse(input) {
    const message = String(input || "").trim();

    if (!message) {
        return {
            answer: "Escribe una pregunta para que pueda ayudarte con EliteHostX.",
            category: "other",
            confidence: 0
        };
    }

    if (isGreeting(message)) {
        const greeting = KNOWLEDGE.find(item => item.id === "greeting");

        return {
            answer: greeting.answer,
            category: "other",
            confidence: 1,
            sources: []
        };
    }

    if (!isEliteHostTopic(message)) {
        return {
            answer: "Soy EliteAI, el asistente de EliteHostX. Mi conocimiento está limitado a nuestra plataforma, nuestros servicios, planes de hosting, cuentas y herramientas del dashboard. No puedo responder preguntas generales que no estén relacionadas con EliteHostX, pero puedo ayudarte con cualquier consulta sobre nuestros servicios.",
            category: "other",
            confidence: 1,
            sources: []
        };
    }

    const knownAnswer = findKnowledge(message);

    if (knownAnswer) {
        return {
            answer: knownAnswer.answer,
            category: knownAnswer.category,
            confidence: 1,
            sources: [{
                title: "Base de conocimientos oficial de EliteHostX",
                url: "https://elitehostx.bond/"
            }]
        };
    }

    try {
        const result = await searchSite(message);

        if (result.found && result.fragments?.length) {
            const answer = [
                "He encontrado información relacionada en las páginas públicas de EliteHostX.",
                "",
                "### Información encontrada",
                "",
                ...result.fragments.map(text => "• " + text),
                "",
                "### Fuentes consultadas",
                ...result.sources.map(source =>
                    "• " + source.title + ": " + source.url
                )
            ].join("\n");

            return {
                answer,
                category: "elitehostx",
                confidence: 0.8,
                sources: result.sources || [],
                pagesRead: result.pagesRead || 0
            };
        }
    } catch (error) {
        console.error("[ELITEAI] Site reader error:", error);
    }

    return {
        answer: "He revisado la información disponible en la base de conocimientos y en las páginas públicas de EliteHostX, pero no encontré datos suficientes para responder esa pregunta con precisión.\n\nPrefiero no inventar características, precios o funciones que no estén confirmados.\n\nSi necesitas una respuesta específica sobre tu cuenta, un plan o un problema técnico, puedes entrar en Support Center y crear un ticket para que el equipo revise tu consulta.",
        category: "other",
        confidence: 0,
        sources: []
    };
}

module.exports = {
    generateResponse
};
