
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

        for (const keyword of item.keywords) {
            const normalizedKeyword = normalize(keyword);

            if (normalizedMessage.includes(normalizedKeyword)) {
                score += normalizedKeyword.split(" ").length * 3;
            }
        }

        return { item, score };
    });

    results.sort((a, b) => b.score - a.score);

    if (!results.length || results[0].score === 0) {
        return null;
    }

    return results[0].item;
}

async function generateResponse(input) {
    const message = String(input || "").trim();

    if (!message) {
        return {
            answer: "Escribe una pregunta para que pueda ayudarte.",
            category: "other",
            confidence: 0
        };
    }

    if (isGreeting(message)) {
        return {
            answer: "¡Hola! Soy EliteAI, el asistente de EliteHostX. ¿Qué te gustaría saber sobre nuestros servicios?",
            category: "other",
            confidence: 1
        };
    }

    if (!isEliteHostTopic(message)) {
        return {
            answer: "Solo puedo responder preguntas relacionadas con EliteHostX. ¿Qué te gustaría saber sobre nuestra web o nuestros servicios?",
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

        if (result.found) {
            const answer = [
                "He encontrado esta información en EliteHostX:",
                "",
                ...result.fragments.map(text => "• " + text),
                "",
                "Fuentes consultadas:",
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
        answer: "No encontré información suficiente sobre esa pregunta en las páginas públicas de EliteHostX. No quiero inventarte una respuesta. Puedes consultar nuestro Support Center.",
        category: "other",
        confidence: 0,
        sources: []
    };
}

module.exports = {
    generateResponse
};
