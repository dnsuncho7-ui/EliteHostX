
/* =========================================
   ELITEHOSTX - ELITEAI FLOATING CHAT
   Version 0.2.0
========================================= */

(() => {
    "use strict";

    if (document.getElementById("eliteai-widget")) return;

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    const widget = createElement("div");
    widget.id = "eliteai-widget";

    const launcher = createElement("button", "", "♛");
    launcher.id = "eliteai-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Abrir EliteAI");

    const panel = createElement("section");
    panel.id = "eliteai-panel";
    panel.setAttribute("aria-label", "Chat de EliteAI");

    const header = createElement("div", "eliteai-header");

    const avatar = createElement("div", "eliteai-avatar", "♛");

    const heading = createElement("div", "eliteai-heading");
    const title = createElement("strong", "", "EliteAI");
    const subtitle = createElement("span");

    const onlineDot = createElement("span", "eliteai-online-dot");
    subtitle.append(onlineDot, document.createTextNode("Asistente de EliteHostX"));

    heading.append(title, subtitle);

    const closeButton = createElement("button", "", "×");
    closeButton.id = "eliteai-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Cerrar chat");

    header.append(avatar, heading, closeButton);

    const messages = createElement("div");
    messages.id = "eliteai-messages";
    messages.setAttribute("aria-live", "polite");

    const footer = createElement("div", "eliteai-footer");
    const form = createElement("form");
    form.id = "eliteai-form";

    const input = createElement("input");
    input.id = "eliteai-input";
    input.type = "text";
    input.maxLength = 2000;
    input.placeholder = "Escribe tu mensaje...";
    input.autocomplete = "off";
    input.required = true;
    input.setAttribute("aria-label", "Mensaje para EliteAI");

    const sendButton = createElement("button", "", "➤");
    sendButton.id = "eliteai-send";
    sendButton.type = "submit";
    sendButton.setAttribute("aria-label", "Enviar mensaje");

    form.append(input, sendButton);

    const disclaimer = createElement(
        "div",
        "eliteai-disclaimer",
        "EliteAI puede cometer errores. Verifica la información importante."
    );

    footer.append(form, disclaimer);
    panel.append(header, messages, footer);
    widget.append(panel, launcher);

    document.body.appendChild(widget);

    let isOpen = false;
    let isSending = false;

    function addMessage(text, type) {
        const message = createElement(
            "div",
            `eliteai-message ${type}`,
            text
        );

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;

        return message;
    }

    addMessage(
        "¡Hola! Soy EliteAI, el asistente inteligente de EliteHostX. ¿En qué puedo ayudarte?",
        "bot"
    );

    function openChat() {
        isOpen = true;
        panel.classList.add("eliteai-open");
        launcher.setAttribute("aria-expanded", "true");
        input.focus();
    }

    function closeChat() {
        isOpen = false;
        panel.classList.remove("eliteai-open");
        launcher.setAttribute("aria-expanded", "false");
    }

    launcher.addEventListener("click", () => {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    });

    closeButton.addEventListener("click", closeChat);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (isSending) return;

        const message = input.value.trim();

        if (!message) return;

        addMessage(message, "user");
        input.value = "";

        isSending = true;
        input.disabled = true;
        sendButton.disabled = true;

        const typing = createElement("div", "eliteai-message bot eliteai-processing");

const spinner = createElement("span", "eliteai-spinner");
spinner.setAttribute("aria-hidden", "true");

const processingText = createElement("span", "", "Procesando...");

typing.append(spinner, processingText);
messages.appendChild(typing);
messages.scrollTop = messages.scrollHeight;

        try {
            const response = await fetch("/api/eliteai/chat", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            typing.remove();

            if (response.status === 401) {
                addMessage(
                    "Debes iniciar sesión en EliteHostX para utilizar EliteAI.",
                    "bot"
                );
                return;
            }

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || "No pude procesar tu mensaje."
                );
            }

            addMessage(data.answer, "bot");

        } catch (error) {
            typing.remove();

            console.error("[ELITEAI WIDGET]", error);

            addMessage(
                error.message || "No pude conectar con EliteAI. Inténtalo nuevamente.",
                "bot"
            );
        } finally {
            isSending = false;
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    });

    console.log("[ELITEAI] Chat flotante iniciado.");
})();
