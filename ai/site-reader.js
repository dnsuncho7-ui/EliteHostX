
const SITE_URL = new URL(
    process.env.ELITEAI_SITE_URL || "https://elitehostx.bond"
);

const MAX_PAGES = 25;
const CACHE_TIME = 30 * 60 * 1000;
const REQUEST_TIMEOUT = 10000;

let cachedPages = [];
let lastCrawl = 0;

function normalize(text) {
    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function decodeEntities(text) {
    return text
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#(\d+);/g, (_, code) =>
            String.fromCodePoint(Number(code))
        )
        .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
            String.fromCodePoint(parseInt(code, 16))
        );
}

function extractPage(html, url) {
    const title =
        html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";

    const headings = [
        ...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)
    ].map(match =>
        match[1].replace(/<[^>]+>/g, " ")
    );

    const clean = html
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/<(script|style|noscript|svg)[^>]*>[\s\S]*?<\/\1>/gi, " ")
        .replace(/<[^>]+>/g, " ");

    const text = decodeEntities(clean)
        .replace(/\s+/g, " ")
        .trim();

    return {
        title: decodeEntities(title.replace(/<[^>]+>/g, "").trim()),
        headings: headings.map(value =>
            decodeEntities(value.replace(/\s+/g, " ").trim())
        ).filter(Boolean),
        text,
        url: url.toString()
    };
}

function getInternalLinks(html, currentUrl) {
    const links = [];

    for (const match of html.matchAll(
        /href\s*=\s*["']([^"']+)["']/gi
    )) {
        try {
            const url = new URL(match[1], currentUrl);

            if (url.origin !== SITE_URL.origin) continue;
            if (!["http:", "https:"].includes(url.protocol)) continue;

            url.hash = "";

            if (url.pathname.startsWith("/api/")) continue;
            if (url.pathname.startsWith("/auth/")) continue;

            if (/\.(png|jpg|jpeg|gif|svg|webp|css|js|pdf|zip)$/i.test(url.pathname)) {
                continue;
            }

            links.push(url.toString());
        } catch {
            // Ignorar enlaces inválidos.
        }
    }

    return [...new Set(links)];
}

async function fetchText(url) {
    const response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        headers: {
            "User-Agent": "EliteAI-SiteReader/0.3"
        }
    });

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html") &&
        !contentType.includes("application/xml")) {
        return null;
    }

    return response.text();
}

async function readRobots() {
    try {
        const text = await fetch(
            new URL("/robots.txt", SITE_URL),
            { signal: AbortSignal.timeout(5000) }
        ).then(response =>
            response.ok ? response.text() : ""
        );

        const lines = text.split(/\r?\n/);
        let applies = false;
        const blocked = [];

        for (const rawLine of lines) {
            const line = rawLine.split("#")[0].trim();
            if (!line) continue;

            const separator = line.indexOf(":");
            if (separator < 0) continue;

            const key = line.slice(0, separator).trim().toLowerCase();
            const value = line.slice(separator + 1).trim();

            if (key === "user-agent") {
                applies = value === "*";
            }

            if (applies && key === "disallow" && value) {
                blocked.push(value);
            }
        }

        return blocked;
    } catch {
        return [];
    }
}

function isBlocked(url, rules) {
    return rules.some(rule => url.pathname.startsWith(rule));
}

async function crawlSite() {
    if (cachedPages.length &&
        Date.now() - lastCrawl < CACHE_TIME) {
        return cachedPages;
    }

    const blockedRules = await readRobots();

    const startUrl = new URL("/", SITE_URL);

    if (isBlocked(startUrl, blockedRules)) {
        return cachedPages;
    }

    const visited = new Set();
    const queue = [startUrl.toString()];
    const pages = [];

    try {
        const sitemap = await fetchText(
            new URL("/sitemap.xml", SITE_URL)
        );

        if (sitemap) {
            for (const match of sitemap.matchAll(
                /<loc>([\s\S]*?)<\/loc>/gi
            )) {
                try {
                    const url = new URL(
                        decodeEntities(match[1].trim()),
                        SITE_URL
                    );

                    if (url.origin === SITE_URL.origin) {
                        queue.push(url.toString());
                    }
                } catch {
                    // Ignorar URL inválida.
                }
            }
        }
    } catch {
        // El sitio puede no tener sitemap.
    }

    while (queue.length && pages.length < MAX_PAGES) {
        const batch = [];

        while (queue.length && batch.length < 4) {
            const next = queue.shift();

            if (!next || visited.has(next)) continue;

            visited.add(next);

            const url = new URL(next);

            if (isBlocked(url, blockedRules)) continue;

            batch.push(url);
        }

        const results = await Promise.all(
            batch.map(async url => {
                try {
                    const html = await fetchText(url);

                    if (!html) return null;

                    return {
                        url,
                        html,
                        page: extractPage(html, url)
                    };
                } catch {
                    return null;
                }
            })
        );

        for (const result of results) {
            if (!result) continue;

            pages.push(result.page);

            for (const link of getInternalLinks(
                result.html,
                result.url
            )) {
                if (!visited.has(link) &&
                    !queue.includes(link) &&
                    pages.length + queue.length < MAX_PAGES * 2) {
                    queue.push(link);
                }
            }
        }
    }

    if (pages.length) {
        cachedPages = pages;
        lastCrawl = Date.now();
    }

    return cachedPages;
}

const STOP_WORDS = new Set([
    "que", "como", "para", "por", "con", "una", "uno",
    "las", "los", "del", "de", "el", "la", "en", "es",
    "son", "hay", "tiene", "tienen", "puedo", "puede",
    "quiero", "donde", "cuando", "cual", "cuanto",
    "me", "mi", "tu", "su", "y", "o", "un"
]);

function getWords(text) {
    return normalize(text)
        .split(" ")
        .filter(word =>
            word.length > 2 && !STOP_WORDS.has(word)
        );
}

function scoreText(text, words) {
    const normalized = normalize(text);
    let score = 0;

    for (const word of words) {
        if (normalized.includes(word)) {
            score++;
        }
    }

    return score;
}

function findRelevantSentences(page, words) {
    const sentences = page.text
        .split(/(?<=[.!?])\s+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 30);

    return sentences
        .map(sentence => ({
            text: sentence,
            score: scoreText(sentence, words)
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
}

async function searchSite(question) {
    const pages = await crawlSite();
    const words = getWords(question);

    if (!pages.length || !words.length) {
        return {
            found: false,
            sources: [],
            pagesRead: pages.length
        };
    }

    const results = pages.map(page => {
        const headingText = [
            page.title,
            ...page.headings
        ].join(" ");

        const headingScore = scoreText(headingText, words) * 3;
        const contentScore = scoreText(page.text, words);

        return {
            page,
            score: headingScore + contentScore,
            sentences: findRelevantSentences(page, words)
        };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

    const sources = results.map(result => ({
        title: result.page.title || "EliteHostX",
        url: result.page.url
    }));

    const fragments = [];
    const seen = new Set();

    for (const result of results) {
        for (const sentence of result.sentences) {
            if (seen.has(sentence.text)) continue;

            seen.add(sentence.text);
            fragments.push(sentence.text);
        }
    }

    return {
        found: fragments.length > 0,
        fragments: fragments.slice(0, 8),
        sources,
        pagesRead: pages.length
    };
}

module.exports = {
    crawlSite,
    searchSite
};
