
const { KNOWLEDGE } = require("./knowledge");

function normalize(text) {
    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function calculateScore(message, keywords) {
    let score = 0;

    for (const keyword of keywords) {
        const normalizedKeyword = normalize(keyword);

        if (!normalizedKeyword) continue;

        if (message === normalizedKeyword) {
            score += 5;
        } else if (message.includes(normalizedKeyword)) {
            score += normalizedKeyword.includes(" ")
                ? 3
                : 2;
        }
    }

    return score;
}

function generateResponse(input) {
    const message = normalize(input);

    if (!message) {
        return {
            answer: "Escribe un mensaje para que pueda ayudarte.",
            category: "other",
            confidence: 0
        };
    }

    let bestMatch = null;
    let bestScore = 0;

    for (const knowledge of KNOWLEDGE) {
        const score = calculateScore(
            message,
            knowledge.keywords
        );

        if (score > bestScore) {
            bestScore = score;
            bestMatch = knowledge;
        }
    }

    if (!bestMatch || bestScore < 2) {
        return {
            answer:
                "Todavía no tengo suficiente conocimiento para responder eso con seguridad. Puedes explicarme un poco más o contactar con nuestro equipo mediante Support Center.",
            category: "other",
            confidence: 0
        };
    }

    return {
        answer: bestMatch.answer,
        category: bestMatch.category,
        confidence: Math.min(bestScore / 8, 1),
        knowledgeId: bestMatch.id
    };
}

module.exports = {
    generateResponse
};
