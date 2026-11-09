
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
    "plan", "planes", "ram", "cpu", "ssd",
    "dashboard", "panel", "cuenta", "registro",
    "login", "sesion", "contrasena", "soporte",
    "support", "ticket", "tickets", "factura",
    "pago", "pagos", "precio", "precios",
    "consola", "console", "archivo", "archivos",
    "file manager", "crear servidor", "instancia",
    "pterodactyl", "wings", "rubí", "amatista",
    "corona", "esmeralda", "diamante", "netherite"
];

function isGreeting(message) {
    return /^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos|que tal)$/.test(
        normalize(message)
    );
}

function isEliteHostTopic(message) {
    const normalized = normalize(message);

    return TOPIC_WORDS.some(word =>
        normalized.includes(normalize(word))
    );
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
            confidence: 1
        };
    }

    const result = await searchSite(message);

    if (!result.found) {
        return {
            answer: "No encontré información suficiente sobre esa pregunta en las páginas públicas de EliteHostX. No quiero inventarte una respuesta. Puedes consultar nuestro Support Center.",
            category: "other",
            confidence: 0,
            sources: []
        };
    }

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
        sources: result.sources,
        pagesRead: result.pagesRead
    };
}

module.exports = {
    generateResponse
};
