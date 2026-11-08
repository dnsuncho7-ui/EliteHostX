"use strict";

const authScreen = document.getElementById("authScreen");
const dashboard = document.getElementById("appDashboard");
const serverForm = document.getElementById("serverForm");
const serverContainer = document.getElementById("serverContainer");

let currentUser = null;

const HOSTING_PLANS = [
  { id: "corona", name: "CORONA", ram: 8, cpu: 4, disk: 80, color: "#e7bd45", glow: "#e7bd45", gem: "crown" },
  { id: "esmeralda", name: "ESMERALDA", ram: 12, cpu: 6, disk: 120, color: "#35d39a", glow: "#20b879", gem: "emerald" },
  { id: "diamante", name: "DIAMANTE", ram: 16, cpu: 8, disk: 160, color: "#65d5ff", glow: "#55c9f2", gem: "diamond" },
  { id: "netherite", name: "NETHERITE", ram: 24, cpu: 10, disk: 240, color: "#c4c8d2", glow: "#8b929f", gem: "netherite" },
  { id: "rubi", name: "RUBÍ", ram: 32, cpu: 12, disk: 320, color: "#ff718b", glow: "#e85d75", gem: "ruby" },
  { id: "amatista", name: "AMATISTA", ram: 48, cpu: 16, disk: 480, color: "#c49aff", glow: "#a879ed", gem: "amethyst" }
];

const SECTION_INFO = {
  dashboard: {
    title: "Dashboard",
    description: "Your EliteHostX account overview."
  },
  "my-servers": {
    title: "My Servers",
    description: "View and manage your server configurations."
  },
  "create-server": {
    title: "Create Server",
    description: "Configure a new Minecraft server."
  },
  "hosting-plans": {
    title: "Hosting Plans",
    description: "Compare the resources available in each plan."
  },
  "file-manager": {
    title: "File Manager",
    description: "Manage your server files."
  },
  console: {
    title: "Console",
    description: "View your server console."
  },
  settings: {
    title: "Settings",
    description: "Manage your account preferences."
  },
  support: {
    title: "EliteAI Support",
    description: "Get help from your EliteHostX AI assistant."
  }
};

/* --------------------------------
   PLAN IMAGES
-------------------------------- */

function planImage(plan) {
  const palettes = {
    crown: ["#fff2a8", "#d49a19", "#8a5a08"],
    emerald: ["#a8ffd9", "#18b879", "#07583f"],
    diamond: ["#e4fbff", "#55c9f2", "#2473b5"],
    netherite: ["#e2e5eb", "#777f8e", "#343b49"],
    ruby: ["#ffc0ca", "#e33d61", "#82152f"],
    amethyst: ["#f0d9ff", "#a879ed", "#56318f"]
  };

  const [light, mid, dark] = palettes[plan.gem];

  const art = plan.gem === "crown"
    ? `<path d="M18 35 8 13l20 13 12-20 12 20 20-13-10 22-44 0Z" fill="url(#g)" stroke="${light}" stroke-width="2"/><path d="M20 42h40l-4 12H24Z" fill="${dark}"/><circle cx="40" cy="12" r="4" fill="${light}"/>`
    : plan.gem === "netherite"
      ? `<path d="M40 5 67 20 62 53 40 70 18 53 13 20Z" fill="url(#g)" stroke="${light}" stroke-width="2"/><path d="m40 5 0 65M13 20l49 33M67 20 18 53" stroke="${light}" stroke-opacity=".55" stroke-width="2"/>`
      : `<path d="M40 5 65 25 55 58 40 70 25 58 15 25Z" fill="url(#g)" stroke="${light}" stroke-width="2"/><path d="M40 5 40 70M15 25h50M25 58l15-33 15 33" fill="none" stroke="${light}" stroke-opacity=".65" stroke-width="2"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${light}"/><stop offset=".48" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><ellipse cx="40" cy="72" rx="24" ry="5" fill="#000" opacity=".25"/>${art}</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/* --------------------------------
   RENDER HOSTING PLANS
-------------------------------- */

function renderPlans() {
  const grid = document.getElementById("plansGrid");
  const choices = document.getElementById("planChoice");

  if (grid) {
    grid.innerHTML = HOSTING_PLANS.map(plan => `
      <article class="plan-card" style="--plan-color:${plan.color};--plan-glow:${plan.glow}">
        <div class="plan-art">
          <img src="${planImage(plan)}" alt="${plan.name}">
        </div>
        <span class="plan-label">ELITEHOSTX PLAN</span>
        <h3>${plan.name}</h3>
        <p class="plan-ram">${plan.ram} GB RAM</p>
        <div class="plan-specs">
          <span>⚡ ${plan.cpu} CPU</span>
          <span>▣ ${plan.disk} GB SSD</span>
        </div>
        <p class="plan-price">PRECIO PRÓXIMAMENTE</p>
        <button type="button" class="plan-select-button" data-plan="${plan.id}">
          SELECT PLAN
        </button>
      </article>
    `).join("");

    grid.querySelectorAll("[data-plan]").forEach(button => {
      button.addEventListener("click", () => {
        navigateTo("create-server");

        const radio = document.querySelector(
          `input[name="hostingPlan"][value="${button.dataset.plan}"]`
        );

        if (radio) radio.checked = true;
      });
    });
  }

  if (choices) {
    choices.innerHTML = HOSTING_PLANS.map((plan, index) => `
      <label class="plan-option">
        <input
          type="radio"
          name="hostingPlan"
          value="${plan.id}"
          ${index === 0 ? "checked" : ""}
          required
        >
        <img src="${planImage(plan)}" alt="${plan.name}">
        <strong>${plan.name}</strong>
        <small>${plan.ram} GB RAM · ${plan.cpu} CPU · ${plan.disk} GB SSD</small>
      </label>
    `).join("");
  }
}

/* --------------------------------
   PAGE NAVIGATION
-------------------------------- */

function navigateTo(section) {
  if (!SECTION_INFO[section]) {
    section = "dashboard";
  }

  const targetId = `section-${section}`;
  const targetPage = document.getElementById(targetId);

  if (!targetPage) {
    console.error(`Page not found: ${targetId}`);
    return;
  }

  document.querySelectorAll("#appDashboard .page-section").forEach(page => {
    page.classList.remove("active");
    page.hidden = true;
    page.setAttribute("aria-hidden", "true");
  });

  targetPage.hidden = false;
  targetPage.classList.add("active");
  targetPage.setAttribute("aria-hidden", "false");

  document.querySelectorAll(".nav-link").forEach(link => {
    const isActive = link.dataset.section === section;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  document.getElementById("pageTitle").textContent =
    SECTION_INFO[section].title;

  document.getElementById("pageDescription").textContent =
    SECTION_INFO[section].description;

  if (section === "my-servers" || section === "dashboard") {
    renderServers();
  }

  if (section === "support") {
    loadEliteSupport();
  }

  history.replaceState(null, "", `#${section}`);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* --------------------------------
   AUTHENTICATION
-------------------------------- */

function showMessage(message, type = "error") {
  const box = document.getElementById("authMessage");

  box.textContent = message;
  box.className = `auth-message ${type}`;
  box.classList.remove("hidden");
}

function clearMessage() {
  const box = document.getElementById("authMessage");

  box.textContent = "";
  box.className = "auth-message hidden";
}

function setAuthMode(mode) {
  clearMessage();

  const isRegister = mode === "register";

  document.getElementById("loginForm").classList.toggle("hidden", isRegister);
  document.getElementById("registerForm").classList.toggle("hidden", !isRegister);
  document.getElementById("loginTab").classList.toggle("active", !isRegister);
  document.getElementById("registerTab").classList.toggle("active", isRegister);
}

function showLogin() {
  currentUser = null;

  dashboard.classList.add("hidden");
  authScreen.classList.remove("hidden");
}

function showDashboard(user) {
  currentUser = user;

  authScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");

  const displayName = user.name || user.email || "User";

  document.getElementById("profileAvatar").textContent =
    displayName.charAt(0).toUpperCase();

  document.getElementById("profileAvatar").title = displayName;
  document.getElementById("accountName").textContent = displayName;

  document.getElementById("settingsCurrentName").textContent =
    user.name || "Not set";

  document.getElementById("settingsEmail").textContent =
    user.email || "Not available";

  renderPlans();
  renderServers();
  navigateTo("dashboard");
}

/* --------------------------------
   ACCOUNT SERVER STORAGE
-------------------------------- */

function getStorageKey() {
  return currentUser
    ? `elitehostx_servers_${currentUser.id}`
    : null;
}

function getServers() {
  const key = getStorageKey();

  if (!key) return [];

  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    console.error("Error reading servers:", error);
    return [];
  }
}

function saveServers(servers) {
  const key = getStorageKey();

  if (key) {
    localStorage.setItem(key, JSON.stringify(servers));
  }
}

/* --------------------------------
   SIDEBAR AND PAGE BUTTONS
-------------------------------- */

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    navigateTo(link.dataset.section);
  });
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    navigateTo(button.dataset.go);
  });
});

document.getElementById("heroCreate").addEventListener("click", () => {
  navigateTo("create-server");
});

document.getElementById("loginTab").addEventListener("click", () => {
  setAuthMode("login");
});

document.getElementById("registerTab").addEventListener("click", () => {
  setAuthMode("register");
});

/* --------------------------------
   LOGIN
-------------------------------- */

document.getElementById("loginForm").addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();

  const button = document.getElementById("loginSubmit");

  button.disabled = true;
  button.textContent = "SIGNING IN...";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to sign in.");
    }

    showDashboard(data.user);
  } catch (error) {
    showMessage(error.message);
  } finally {
    button.disabled = false;
    button.textContent = "SIGN IN";
  }
});

/* --------------------------------
   REGISTER
-------------------------------- */

document.getElementById("registerForm").addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();

  const password = document.getElementById("registerPassword").value;
  const confirmation = document.getElementById("registerPasswordConfirm").value;

  if (password !== confirmation) {
    showMessage("The passwords do not match.");
    return;
  }

  const button = document.getElementById("registerSubmit");

  button.disabled = true;
  button.textContent = "CREATING ACCOUNT...";

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: document.getElementById("registerName").value,
        email: document.getElementById("registerEmail").value,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to create account.");
    }

    showDashboard(data.user);
  } catch (error) {
    showMessage(error.message);
  } finally {
    button.disabled = false;
    button.textContent = "CREATE ACCOUNT";
  }
});

/* --------------------------------
   LOGOUT
-------------------------------- */

async function logout() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error("Unable to sign out.");
    }

    showLogin();
    setAuthMode("login");
  } catch (error) {
    console.error("Logout error:", error);
    alert(error.message || "Unable to sign out.");
  }
}

document.getElementById("logoutButton").addEventListener("click", logout);
document.getElementById("settingsLogout").addEventListener("click", logout);

/* --------------------------------
   ACCOUNT SETTINGS
-------------------------------- */

document.getElementById("changeNameButton").addEventListener("click", () => {
  if (!currentUser) return;

  const nextName = prompt(
    "Enter the display name for this browser session:",
    currentUser.name || ""
  );

  if (nextName === null) return;

  const cleanName = nextName.trim().slice(0, 60);

  if (cleanName.length < 2) {
    alert("The display name must contain at least 2 characters.");
    return;
  }

  currentUser.name = cleanName;

  document.getElementById("accountName").textContent = cleanName;
  document.getElementById("profileAvatar").textContent =
    cleanName.charAt(0).toUpperCase();

  document.getElementById("settingsCurrentName").textContent = cleanName;

  alert("Display name updated for this session. Permanent profile editing is not connected yet.");
});

/* --------------------------------
   CREATE SERVER CONFIGURATION
-------------------------------- */

serverForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!currentUser) {
    showLogin();
    return;
  }

  const name = document.getElementById("serverName").value.trim();
  const software = document.getElementById("serverSoftware").value;
  const version = document.getElementById("serverVersion").value;

  const selectedPlanId =
    document.querySelector('input[name="hostingPlan"]:checked')?.value;

  const selectedPlan = HOSTING_PLANS.find(
    plan => plan.id === selectedPlanId
  );

  if (!name || !selectedPlan) {
    alert("Choose a plan and enter a server name.");
    return;
  }

  const servers = getServers();

  servers.push({
    id: crypto.randomUUID(),
    name,
    software,
    version,
    planId: selectedPlan.id,
    planName: selectedPlan.name,
    ram: selectedPlan.ram,
    cpu: selectedPlan.cpu,
    disk: selectedPlan.disk,
    createdAt: new Date().toISOString()
  });

  saveServers(servers);

  serverForm.reset();

  renderServers();
  navigateTo("my-servers");

  alert("Configuration saved. A real Minecraft server has not been created yet.");
});

/* --------------------------------
   RENDER MY SERVERS
-------------------------------- */

function renderServers() {
  if (!currentUser || !serverContainer) return;

  const servers = getServers();

  document.getElementById("totalServers").textContent = servers.length;
  document.getElementById("activeServers").textContent = "0";

  const totalRam = servers.reduce(
    (sum, server) => sum + Number(server.ram || 0),
    0
  );

  document.getElementById("totalRam").textContent = `${totalRam} GB`;

  serverContainer.innerHTML = "";

  if (servers.length === 0) {
    serverContainer.innerHTML = `
      <div class="empty-icon">▣</div>
      <h2>No servers yet</h2>
      <p>You haven't created any Minecraft servers. Start by creating your first one.</p>
      <button type="button" class="primary-button" data-go="create-server">
        CREATE MY FIRST SERVER
      </button>
    `;

    serverContainer.querySelector("[data-go]").addEventListener("click", () => {
      navigateTo("create-server");
    });

    return;
  }

  servers.forEach(server => {
    const card = document.createElement("article");
    card.className = "server-card";

    const info = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = server.name;

    const details = document.createElement("p");
    details.textContent =
      `${server.software} · Minecraft ${server.version} · ${server.planName} · ${server.ram} GB RAM · ${server.cpu} CPU · ${server.disk} GB SSD`;

    const status = document.createElement("span");
    status.className = "server-status";
    status.textContent = "● CONFIGURATION SAVED";

    const actions = document.createElement("div");
    actions.className = "server-actions";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger-button";
    remove.textContent = "DELETE";

    remove.addEventListener("click", () => {
      if (!confirm(`Delete the saved configuration "${server.name}"?`)) {
        return;
      }

      saveServers(
        getServers().filter(item => item.id !== server.id)
      );

      renderServers();
    });

    info.append(title, details, status);
    actions.append(remove);
    card.append(info, actions);
    serverContainer.append(card);
  });
}

/* --------------------------------
   ELITEAI SUPPORT CENTER
-------------------------------- */

let supportInitialized = false;
let supportAdmin = false;
let currentConversationId = null;
let currentUserTicketId = null;
let currentAdminTicketId = null;

async function supportRequest(path, options = {}) {
  const response = await fetch(`/api/support${path}`, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
    headers: {
      "Accept": "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || `Support request failed (${response.status}).`);
  }

  return data;
}

function showSupportNotice(message, type = "info") {
  const notice = document.getElementById("supportNotice");

  if (!notice) return;

  notice.textContent = message;
  notice.className = `support-notice ${type}`;
  notice.classList.remove("hidden");
}

function clearSupportNotice() {
  const notice = document.getElementById("supportNotice");

  if (!notice) return;

  notice.textContent = "";
  notice.className = "support-notice hidden";
}

function escapeSupportHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function formatSupportDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function switchSupportView(view) {
  if (view === "admin" && !supportAdmin) {
    showSupportNotice("You do not have permission to access the administration panel.", "error");
    return;
  }

  const views = {
    chat: document.getElementById("supportChatView"),
    tickets: document.getElementById("supportTicketsView"),
    admin: document.getElementById("supportAdminView")
  };

  Object.entries(views).forEach(([name, element]) => {
    if (!element) return;

    const active = name === view;
    element.classList.toggle("hidden", !active);
    element.classList.toggle("active", active);
  });

  document.querySelectorAll("[data-support-view]").forEach(button => {
    button.classList.toggle("active", button.dataset.supportView === view);
  });

  clearSupportNotice();

  if (view === "tickets") {
    loadMyTickets();
  }

  if (view === "admin" && supportAdmin) {
    loadAdminTickets();
  }
}

function bindSupportEvents() {
  if (supportInitialized) return;

  supportInitialized = true;

  document.querySelectorAll("[data-support-view]").forEach(button => {
    button.addEventListener("click", () => {
      switchSupportView(button.dataset.supportView);
    });
  });

  document.getElementById("newAIConversation").addEventListener("click", createAIConversation);

  document.getElementById("aiChatForm").addEventListener("submit", sendAIMessage);

  document.getElementById("refreshMyTickets").addEventListener("click", loadMyTickets);
  document.getElementById("refreshAdminTickets").addEventListener("click", loadAdminTickets);
}

async function loadEliteSupport() {
  if (!currentUser) return;

  bindSupportEvents();
  clearSupportNotice();

  try {
    const data = await supportRequest("/status");

    supportAdmin = data.admin === true;

    const adminTab = document.getElementById("adminSupportTab");
    adminTab.classList.toggle("hidden", !supportAdmin);

    const statusText = document.querySelector(".eliteai-status");

    if (statusText) {
      statusText.innerHTML = `
        <span class="status-dot"></span>
        ${data.status === "online" ? "ELITEAI ONLINE" : "ELITEAI READY"}
      `;
    }

    await loadConversations();
  } catch (error) {
    console.error("EliteAI initialization error:", error);
    showSupportNotice(error.message || "Unable to connect to EliteAI.", "error");
  }
}

/* --------------------------------
   AI CONVERSATIONS
-------------------------------- */

async function loadConversations() {
  const list = document.getElementById("aiConversationList");

  list.innerHTML = `<p class="support-loading">Loading conversations...</p>`;

  try {
    const data = await supportRequest("/conversations");
    const conversations = data.conversations || [];

    if (!conversations.length) {
      currentConversationId = null;

      list.innerHTML = `
        <div class="support-list-empty">
          <span>✦</span>
          <p>No conversations yet.</p>
          <small>Start a new conversation with EliteAI.</small>
        </div>
      `;

      renderAIWelcome();
      return;
    }

    if (!currentConversationId ||
        !conversations.some(item => String(item.id) === String(currentConversationId))) {
      currentConversationId = conversations[0].id;
    }

    list.innerHTML = conversations.map(conversation => `
      <button
        type="button"
        class="ai-conversation-item ${String(conversation.id) === String(currentConversationId) ? "active" : ""}"
        data-conversation-id="${escapeSupportHTML(conversation.id)}"
      >
        <span class="conversation-symbol">✦</span>
        <span class="conversation-copy">
          <strong>${escapeSupportHTML(conversation.title || "New conversation")}</strong>
          <small>${escapeSupportHTML(formatSupportDate(conversation.updated_at))}</small>
        </span>
      </button>
    `).join("");

    list.querySelectorAll("[data-conversation-id]").forEach(button => {
      button.addEventListener("click", () => {
        currentConversationId = button.dataset.conversationId;

        list.querySelectorAll(".ai-conversation-item").forEach(item => {
          item.classList.toggle("active", item === button);
        });

        loadConversationMessages();
      });
    });

    await loadConversationMessages();
  } catch (error) {
    console.error("Conversation loading error:", error);
    list.innerHTML = `<p class="support-error">${escapeSupportHTML(error.message)}</p>`;
  }
}

async function createAIConversation() {
  const button = document.getElementById("newAIConversation");

  button.disabled = true;

  try {
    const data = await supportRequest("/conversations", {
      method: "POST",
      body: JSON.stringify({})
    });

    currentConversationId = data.conversation.id;

    await loadConversations();
    document.getElementById("aiChatInput").focus();
  } catch (error) {
    showSupportNotice(error.message, "error");
  } finally {
    button.disabled = false;
  }
}

function renderAIWelcome() {
  const messages = document.getElementById("aiChatMessages");

  messages.innerHTML = `
    <div class="ai-welcome-message">
      <div class="ai-welcome-icon">✦</div>
      <h3>Welcome to EliteAI</h3>
      <p>Ask me about EliteHostX, hosting plans, your account or support.</p>
      <span>How can I help you today?</span>
    </div>
  `;
}

function appendAIMessage(sender, content, createdAt = null) {
  const messages = document.getElementById("aiChatMessages");
  const isUser = sender === "user";

  const wrapper = document.createElement("div");
  wrapper.className = `ai-message ${isUser ? "user-message" : "assistant-message"}`;

  const avatar = document.createElement("div");
  avatar.className = "ai-message-avatar";
  avatar.textContent = isUser ? "U" : "✦";

  const body = document.createElement("div");
  body.className = "ai-message-body";

  const name = document.createElement("strong");
  name.textContent = isUser ? "You" : "EliteAI";

  const text = document.createElement("p");
  text.textContent = content;

  const time = document.createElement("small");
  time.textContent = formatSupportDate(createdAt);

  body.append(name, text, time);
  wrapper.append(avatar, body);
  messages.append(wrapper);
}

async function loadConversationMessages() {
  const messages = document.getElementById("aiChatMessages");

  if (!currentConversationId) {
    renderAIWelcome();
    return;
  }

  messages.innerHTML = `<p class="support-loading">Loading messages...</p>`;

  try {
    const data = await supportRequest(
      `/conversations/${encodeURIComponent(currentConversationId)}/messages`
    );

    messages.innerHTML = "";

    const items = data.messages || [];

    if (!items.length) {
      renderAIWelcome();
      return;
    }

    items.forEach(message => {
      appendAIMessage(message.sender, message.content, message.created_at);
    });

    messages.scrollTop = messages.scrollHeight;
  } catch (error) {
    console.error("Message loading error:", error);
    messages.innerHTML = `<p class="support-error">${escapeSupportHTML(error.message)}</p>`;
  }
}

async function sendAIMessage(event) {
  event.preventDefault();

  const input = document.getElementById("aiChatInput");
  const button = document.getElementById("aiSendButton");
  const message = input.value.trim();

  if (!message) return;

  button.disabled = true;
  input.disabled = true;

  try {
    if (!currentConversationId) {
      const created = await supportRequest("/conversations", {
        method: "POST",
        body: JSON.stringify({})
      });

      currentConversationId = created.conversation.id;
    }

    const messages = document.getElementById("aiChatMessages");

    if (messages.querySelector(".ai-welcome-message")) {
      messages.innerHTML = "";
    }

    appendAIMessage("user", message, new Date().toISOString());

    input.value = "";

    const typing = document.createElement("div");
    typing.className = "ai-typing";
    typing.id = "eliteAITyping";
    typing.textContent = "EliteAI is thinking...";
    messages.append(typing);
    messages.scrollTop = messages.scrollHeight;

    const data = await supportRequest("/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        conversationId: currentConversationId
      })
    });

    document.getElementById("eliteAITyping")?.remove();

    appendAIMessage(
      "assistant",
      data.answer || "I could not generate an answer. Please try again.",
      new Date().toISOString()
    );

    if (data.ticket) {
      showSupportNotice(
        `A support ticket has been created${data.ticket.id ? ` (#${data.ticket.id})` : ""}. You can follow it in My Tickets.`,
        "success"
      );
    }

    messages.scrollTop = messages.scrollHeight;

    await loadConversations();
  } catch (error) {
    document.getElementById("eliteAITyping")?.remove();

    appendAIMessage(
      "assistant",
      `I couldn't process your message: ${error.message}. Please try again.`
    );
  } finally {
    button.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

/* --------------------------------
   USER SUPPORT TICKETS
-------------------------------- */

async function loadMyTickets() {
  const list = document.getElementById("myTicketList");

  list.innerHTML = `<p class="support-loading">Loading your tickets...</p>`;

  try {
    const data = await supportRequest("/tickets");
    const tickets = data.tickets || [];

    if (!tickets.length) {
      currentUserTicketId = null;

      list.innerHTML = `
        <div class="support-list-empty">
          <span>◈</span>
          <p>You don't have any tickets yet.</p>
          <small>If EliteAI cannot resolve a question, it can create a ticket for you.</small>
        </div>
      `;

      document.getElementById("myTicketDetail").innerHTML = `
        <div class="ticket-empty">
          <span>◈</span>
          <h3>No support requests</h3>
          <p>Your support tickets will appear here.</p>
        </div>
      `;

      return;
    }

    if (!currentUserTicketId ||
        !tickets.some(ticket => String(ticket.id) === String(currentUserTicketId))) {
      currentUserTicketId = tickets[0].id;
    }

    list.innerHTML = tickets.map(ticket => `
      <button
        type="button"
        class="support-ticket-item ${String(ticket.id) === String(currentUserTicketId) ? "active" : ""}"
        data-ticket-id="${escapeSupportHTML(ticket.id)}"
      >
        <span class="ticket-item-top">
          <strong>#${escapeSupportHTML(ticket.id)} · ${escapeSupportHTML(ticket.subject)}</strong>
          <span class="ticket-status status-${escapeSupportHTML(ticket.status)}">${escapeSupportHTML(ticket.status)}</span>
        </span>
        <small>${escapeSupportHTML(formatSupportDate(ticket.updated_at || ticket.created_at))}</small>
      </button>
    `).join("");

    list.querySelectorAll("[data-ticket-id]").forEach(button => {
      button.addEventListener("click", () => {
        currentUserTicketId = button.dataset.ticketId;

        list.querySelectorAll(".support-ticket-item").forEach(item => {
          item.classList.toggle("active", item === button);
        });

        loadUserTicketDetail();
      });
    });

    await loadUserTicketDetail();
  } catch (error) {
    console.error("Ticket loading error:", error);
    list.innerHTML = `<p class="support-error">${escapeSupportHTML(error.message)}</p>`;
  }
}

async function loadUserTicketDetail() {
  if (!currentUserTicketId) return;

  const detail = document.getElementById("myTicketDetail");
  detail.innerHTML = `<p class="support-loading">Loading ticket...</p>`;

  try {
    const data = await supportRequest(
      `/tickets/${encodeURIComponent(currentUserTicketId)}`
    );

    const ticket = data.ticket;
    const messages = data.messages || [];

    detail.innerHTML = `
      <div class="ticket-detail-heading">
        <div>
          <span class="support-kicker">SUPPORT REQUEST #${escapeSupportHTML(ticket.id)}</span>
          <h3>${escapeSupportHTML(ticket.subject)}</h3>
          <p>Created ${escapeSupportHTML(formatSupportDate(ticket.created_at))}</p>
        </div>
        <span class="ticket-status status-${escapeSupportHTML(ticket.status)}">${escapeSupportHTML(ticket.status)}</span>
      </div>

      <div class="ticket-message-list" id="userTicketMessages"></div>

      ${ticket.status === "closed" ? `
        <div class="ticket-closed-note">This ticket is closed. Contact support through a new request if you need more help.</div>
      ` : `
        <form id="userTicketReplyForm" class="ticket-reply-form">
          <textarea id="userTicketReply" maxlength="4000" placeholder="Write your reply..." required></textarea>
          <button type="submit" class="create-submit">SEND REPLY</button>
        </form>
      `}
    `;

    const messageList = document.getElementById("userTicketMessages");

    if (!messages.length) {
      messageList.innerHTML = `<p class="support-loading">No messages yet.</p>`;
    } else {
      messages.forEach(message => {
        appendTicketMessage(messageList, message);
      });
    }

    const form = document.getElementById("userTicketReplyForm");

    if (form) {
      form.addEventListener("submit", sendUserTicketReply);
    }
  } catch (error) {
    console.error("Ticket detail error:", error);
    detail.innerHTML = `<p class="support-error">${escapeSupportHTML(error.message)}</p>`;
  }
}

function appendTicketMessage(container, message) {
  const item = document.createElement("article");
  const isAdmin = message.sender_type === "admin";

  item.className = `ticket-message ${isAdmin ? "ticket-admin-message" : "ticket-user-message"}`;

  const heading = document.createElement("strong");
  heading.textContent = isAdmin ? "EliteHostX Support" : "You";

  const content = document.createElement("p");
  content.textContent = message.content;

  const date = document.createElement("small");
  date.textContent = formatSupportDate(message.created_at);

  item.append(heading, content, date);
  container.append(item);
}

async function sendUserTicketReply(event) {
  event.preventDefault();

  const input = document.getElementById("userTicketReply");
  const button = event.submitter;
  const content = input.value.trim();

  if (!content || !currentUserTicketId) return;

  if (button) button.disabled = true;

  try {
    await supportRequest(
      `/tickets/${encodeURIComponent(currentUserTicketId)}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content })
      }
    );

    await loadUserTicketDetail();
    await loadMyTickets();
    showSupportNotice("Your reply has been sent.", "success");
  } catch (error) {
    showSupportNotice(error.message, "error");
    if (button) button.disabled = false;
  }
}

/* --------------------------------
   ADMIN SUPPORT PANEL
-------------------------------- */

async function loadAdminTickets() {
  if (!supportAdmin) return;

  const list = document.getElementById("adminTicketList");

  list.innerHTML = `<p class="support-loading">Loading support queue...</p>`;

  try {
    const data = await supportRequest("/admin/tickets");
    const tickets = data.tickets || [];

    if (!tickets.length) {
      currentAdminTicketId = null;

      list.innerHTML = `
        <div class="support-list-empty">
          <span>♛</span>
          <p>No open support requests.</p>
          <small>New user tickets will appear here.</small>
        </div>
      `;

      document.getElementById("adminTicketDetail").innerHTML = `
        <div class="ticket-empty">
          <span>♛</span>
          <h3>Queue is clear</h3>
          <p>There are no tickets to review right now.</p>
        </div>
      `;

      return;
    }

    if (!currentAdminTicketId ||
        !tickets.some(ticket => String(ticket.id) === String(currentAdminTicketId))) {
      currentAdminTicketId = tickets[0].id;
    }

    list.innerHTML = tickets.map(ticket => `
      <button
        type="button"
        class="support-ticket-item ${String(ticket.id) === String(currentAdminTicketId) ? "active" : ""}"
        data-admin-ticket-id="${escapeSupportHTML(ticket.id)}"
      >
        <span class="ticket-item-top">
          <strong>#${escapeSupportHTML(ticket.id)} · ${escapeSupportHTML(ticket.subject)}</strong>
          <span class="ticket-status status-${escapeSupportHTML(ticket.status)}">${escapeSupportHTML(ticket.status)}</span>
        </span>
        <small>${escapeSupportHTML(ticket.email || ticket.user_email || "User")} · ${escapeSupportHTML(formatSupportDate(ticket.updated_at || ticket.created_at))}</small>
      </button>
    `).join("");

    list.querySelectorAll("[data-admin-ticket-id]").forEach(button => {
      button.addEventListener("click", () => {
        currentAdminTicketId = button.dataset.adminTicketId;

        list.querySelectorAll(".support-ticket-item").forEach(item => {
          item.classList.toggle("active", item === button);
        });

        loadAdminTicketDetail();
      });
    });

    await loadAdminTicketDetail();
  } catch (error) {
    console.error("Admin ticket loading error:", error);
    list.innerHTML = `<p class="support-error">${escapeSupportHTML(error.message)}</p>`;
  }
}

async function loadAdminTicketDetail() {
  if (!supportAdmin || !currentAdminTicketId) return;

  const detail = document.getElementById("adminTicketDetail");
  detail.innerHTML = `<p class="support-loading">Loading ticket...</p>`;

  try {
    const data = await supportRequest(
      `/tickets/${encodeURIComponent(currentAdminTicketId)}`
    );

    const ticket = data.ticket;
    const messages = data.messages || [];

    detail.innerHTML = `
      <div class="ticket-detail-heading">
        <div>
          <span class="support-kicker">ADMIN REVIEW · #${escapeSupportHTML(ticket.id)}</span>
          <h3>${escapeSupportHTML(ticket.subject)}</h3>
          <p>${escapeSupportHTML(ticket.email || ticket.user_email || "User")} · ${escapeSupportHTML(formatSupportDate(ticket.created_at))}</p>
        </div>
        <span class="ticket-status status-${escapeSupportHTML(ticket.status)}">${escapeSupportHTML(ticket.status)}</span>
      </div>

      <div class="admin-ticket-controls">
        <label>
          Status
          <select id="adminTicketStatus">
            <option value="open" ${ticket.status === "open" ? "selected" : ""}>Open</option>
            <option value="answered" ${ticket.status === "answered" ? "selected" : ""}>Answered</option>
            <option value="closed" ${ticket.status === "closed" ? "selected" : ""}>Closed</option>
          </select>
        </label>

        <label>
          Priority
          <select id="adminTicketPriority">
            <option value="low" ${ticket.priority === "low" ? "selected" : ""}>Low</option>
            <option value="normal" ${ticket.priority === "normal" ? "selected" : ""}>Normal</option>
            <option value="high" ${ticket.priority === "high" ? "selected" : ""}>High</option>
          </select>
        </label>

        <button type="button" id="saveAdminTicket" class="secondary-button">SAVE CHANGES</button>
      </div>

      <div class="ticket-message-list" id="adminTicketMessages"></div>

      ${ticket.status === "closed" ? `
        <div class="ticket-closed-note">This ticket is closed. Change its status to reopen it before replying.</div>
      ` : `
        <form id="adminTicketReplyForm" class="ticket-reply-form">
          <textarea id="adminTicketReply" maxlength="4000" placeholder="Write a response to the user..." required></textarea>
          <button type="submit" class="create-submit">SEND RESPONSE</button>
        </form>
      `}
    `;

    const messageList = document.getElementById("adminTicketMessages");

    if (!messages.length) {
      messageList.innerHTML = `<p class="support-loading">No messages yet.</p>`;
    } else {
      messages.forEach(message => {
        appendTicketMessage(messageList, message);
      });
    }

    document.getElementById("saveAdminTicket").addEventListener("click", saveAdminTicketChanges);

    const form = document.getElementById("adminTicketReplyForm");

    if (form) {
      form.addEventListener("submit", sendAdminTicketReply);
    }
  } catch (error) {
    console.error("Admin ticket detail error:", error);
    detail.innerHTML = `<p class="support-error">${escapeSupportHTML(error.message)}</p>`;
  }
}

async function saveAdminTicketChanges() {
  if (!supportAdmin || !currentAdminTicketId) return;

  const button = document.getElementById("saveAdminTicket");
  const status = document.getElementById("adminTicketStatus").value;
  const priority = document.getElementById("adminTicketPriority").value;

  button.disabled = true;

  try {
    await supportRequest(
      `/admin/tickets/${encodeURIComponent(currentAdminTicketId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, priority })
      }
    );

    showSupportNotice("Ticket updated successfully.", "success");

    await loadAdminTickets();
  } catch (error) {
    showSupportNotice(error.message, "error");
  } finally {
    button.disabled = false;
  }
}

async function sendAdminTicketReply(event) {
  event.preventDefault();

  if (!supportAdmin || !currentAdminTicketId) return;

  const input = document.getElementById("adminTicketReply");
  const button = event.submitter;
  const content = input.value.trim();

  if (!content) return;

  if (button) button.disabled = true;

  try {
    await supportRequest(
      `/tickets/${encodeURIComponent(currentAdminTicketId)}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content })
      }
    );

    await loadAdminTicketDetail();
    await loadAdminTickets();

    showSupportNotice("Your response has been sent.", "success");
  } catch (error) {
    showSupportNotice(error.message, "error");
    if (button) button.disabled = false;
  }
}

/* --------------------------------
   SESSION CHECK
-------------------------------- */

async function checkSession() {
  try {
    const response = await fetch("/api/me", {
      credentials: "same-origin",
      headers: {
        "Accept": "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      showLogin();
      return;
    }

    const data = await response.json();

    if (data.authenticated && data.user) {
      showDashboard(data.user);
    } else {
      showLogin();
    }
  } catch (error) {
    console.error("Session check error:", error);
    showLogin();
  }
}

/* --------------------------------
   AUTH URL MESSAGES
-------------------------------- */

function checkAuthMessages() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("auth");

  if (status === "failed") {
    showMessage("Unable to sign in with that provider.");
  }

  if (status === "unavailable") {
    showMessage("That sign-in method is not configured yet.");
  }

  if (status) {
    history.replaceState({}, document.title, location.pathname);
  }
}

/* --------------------------------
   API STATUS
-------------------------------- */

async function loadStatus() {
  try {
    const response = await fetch("/api/status", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();

    console.log("EliteHostX:", data);

    if (data.registration !== "enabled") {
      console.warn("Account registration is not enabled.");
    }
  } catch (error) {
    console.error("Connection error:", error);
  }
}

/* --------------------------------
   INITIALIZE APPLICATION
-------------------------------- */

// Hide all pages before the user session is checked.
document.querySelectorAll("#appDashboard .page-section").forEach(page => {
  page.classList.remove("active");
  page.hidden = true;
  page.setAttribute("aria-hidden", "true");
});

renderPlans();
checkAuthMessages();
showLogin();
loadStatus();
checkSession();