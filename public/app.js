
"use strict";

const authScreen = document.getElementById("authScreen");
const dashboard = document.getElementById("appDashboard");
const serverForm = document.getElementById("serverForm");
const serverContainer = document.getElementById("serverContainer");

let currentUser = null;


/* --------------------------------
   ELITEHOSTX MODALS AND TOASTS
-------------------------------- */

function showEliteToast(message, type = "success") {
  let stack = document.querySelector(".ehx-toast-stack");

  if (!stack) {
    stack = document.createElement("div");
    stack.className = "ehx-toast-stack";
    stack.setAttribute("aria-live", "polite");
    document.body.appendChild(stack);
  }

  const toast = document.createElement("div");
  toast.className = `ehx-toast ehx-toast-${type}`;

  const mark = document.createElement("span");
  mark.className = "ehx-toast-mark";
  mark.textContent = type === "error" ? "!" : type === "info" ? "i" : "✓";

  const text = document.createElement("span");
  text.textContent = message;

  toast.append(mark, text);
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();

    if (!stack.children.length) {
      stack.remove();
    }
  }, 4000);
}

function openEliteModal({
  title = "EliteHostX",
  description = "",
  fields = [],
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  danger = false
} = {}) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.className = "ehx-modal-overlay";

    const card = document.createElement("section");
    card.className = "ehx-modal-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "ehxModalTitle");

    const header = document.createElement("header");
    header.className = "ehx-modal-header";

    const heading = document.createElement("div");
    heading.innerHTML = `
      <span class="ehx-modal-kicker">ELITEHOSTX ACCOUNT</span>
      <h2 id="ehxModalTitle">${escapeModalHTML(title)}</h2>
    `;

    const close = document.createElement("button");
    close.type = "button";
    close.className = "ehx-modal-close";
    close.textContent = "×";
    close.setAttribute("aria-label", "Close");

    header.append(heading, close);

    const body = document.createElement("div");
    body.className = "ehx-modal-body";

    if (description) {
      const paragraph = document.createElement("p");
      paragraph.className = "ehx-modal-description";
      paragraph.textContent = description;
      body.appendChild(paragraph);
    }

    const controls = [];

    fields.forEach(field => {
      const wrapper = document.createElement("label");
      wrapper.className = "ehx-modal-field";
      wrapper.textContent = field.label;

      const input = document.createElement("input");
      input.type = field.type || "text";
      input.name = field.name;
      input.placeholder = field.placeholder || "";
      input.value = field.value || "";
      input.required = field.required !== false;
      input.autocomplete = field.autocomplete || "off";

      if (field.maxLength) {
        input.maxLength = field.maxLength;
      }

      wrapper.appendChild(input);
      body.appendChild(wrapper);
      controls.push(input);
    });

    const error = document.createElement("p");
    error.className = "ehx-modal-error";
    error.hidden = true;
    body.appendChild(error);

    const footer = document.createElement("footer");
    footer.className = "ehx-modal-footer";

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "ehx-modal-cancel";
    cancel.textContent = cancelText;

    const submit = document.createElement("button");
    submit.type = "button";
    submit.className = "ehx-modal-submit";
    submit.textContent = confirmText;

    if (danger) {
      submit.classList.add("danger");
    }

    footer.append(cancel, submit);
    card.append(header, body, footer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    let finished = false;

    function finish(value) {
      if (finished) return;
      finished = true;
      document.removeEventListener("keydown", onKeyDown);
      overlay.remove();
      resolve(value);
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        finish(null);
      }

      if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
        event.preventDefault();
        submit.click();
      }
    }

    function showError(message) {
      error.textContent = message;
      error.hidden = false;
    }

    close.addEventListener("click", () => finish(null));
    cancel.addEventListener("click", () => finish(null));

    overlay.addEventListener("click", event => {
      if (event.target === overlay) finish(null);
    });

    submit.addEventListener("click", () => {
      const values = Object.fromEntries(
        controls.map(input => [
          input.name,
          input.type === "password"
            ? input.value
            : input.value.trim()
        ])
      );

      for (const input of controls) {
        if (input.required && !input.value.trim()) {
          showError("Please complete all required fields.");
          input.focus();
          return;
        }
      }

      finish(values);
    });

    document.addEventListener("keydown", onKeyDown);

    if (controls.length) {
      controls[0].focus();
    } else {
      submit.focus();
    }
  });
}

function escapeModalHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

async function profileRequest(path, payload) {
  const response = await fetch(path, {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || "Unable to update your profile.");
  }

  if (!data.user) {
    throw new Error("The server did not return the updated profile.");
  }

  return data.user;
}

function refreshProfileDisplay() {
  if (!currentUser) return;

  const displayName = currentUser.name || currentUser.email || "User";

  document.getElementById("profileAvatar").textContent =
    displayName.charAt(0).toUpperCase();

  document.getElementById("profileAvatar").title = displayName;
  document.getElementById("accountName").textContent = displayName;

  document.getElementById("settingsCurrentName").textContent =
    currentUser.name || "Not set";

  document.getElementById("settingsEmail").textContent =
    currentUser.email || "Not available";
}

const HOSTING_PLANS = [
  { id: "corona", name: "CORONA", ram: 8, cpu: 4, disk: 80, color: "#e7bd45", glow: "#e7bd45", gem: "crown" },
  { id: "esmeralda", name: "ESMERALDA", ram: 12, cpu: 6, disk: 120, color: "#35d39a", glow: "#20b879", gem: "emerald" },
  { id: "diamante", name: "DIAMANTE", ram: 16, cpu: 8, disk: 160, color: "#65d5ff", glow: "#55c9f2", gem: "diamond" },
  { id: "netherite", name: "NETHERITE", ram: 24, cpu: 10, disk: 240, color: "#c4c8d2", glow: "#8b929f", gem: "netherite" },
  { id: "rubi", name: "RUBÍ", ram: 32, cpu: 12, disk: 320, color: "#ff718b", glow: "#e85d75", gem: "ruby" },
  { id: "amatista", name: "AMATISTA", ram: 48, cpu: 16, disk: 480, color: "#c49aff", glow: "#a879ed", gem: "amethyst" }
];

const SUPPORT_CATEGORIES = {
  account: "Account & Login",
  billing: "Billing & Payments",
  hosting: "Hosting Plans",
  server: "Minecraft Server",
  technical: "Technical Support",
  other: "Other"
};

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
    title: "Support Center",
    description: "Contact the EliteHostX support team."
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
    showEliteToast(error.message || "Unable to sign out.", "error");
  }
}

document.getElementById("logoutButton").addEventListener("click", logout);
document.getElementById("settingsLogout").addEventListener("click", logout);


/* --------------------------------
   ACCOUNT SETTINGS - INLINE EDITING
-------------------------------- */

// Abrir edición del nombre
document.getElementById("changeNameButton").addEventListener("click", () => {
  if (!currentUser) return;

  const form = document.getElementById("editNameForm");
  const input = document.getElementById("editNameInput");
  const button = document.getElementById("changeNameButton");

  input.value = currentUser.name || "";
  form.classList.remove("hidden");
  button.classList.add("hidden");
  input.focus();
});

// Cancelar edición del nombre
document.getElementById("cancelNameEdit").addEventListener("click", () => {
  document.getElementById("editNameForm").classList.add("hidden");
  document.getElementById("changeNameButton").classList.remove("hidden");
});

// Guardar nombre
document.getElementById("editNameForm").addEventListener("submit", async event => {
  event.preventDefault();

  if (!currentUser) return;

  const form = event.currentTarget;
  const input = document.getElementById("editNameInput");
  const button = form.querySelector('[type="submit"]');
  const cleanName = input.value.trim();

  if (cleanName.length < 2 || cleanName.length > 60) {
    showEliteToast("Your name must contain between 2 and 60 characters.", "error");
    input.focus();
    return;
  }

  button.disabled = true;
  button.textContent = "SAVING...";

  try {
    const updatedUser = await profileRequest("/api/profile/name", {
      name: cleanName
    });

    currentUser = { ...currentUser, ...updatedUser };
    refreshProfileDisplay();

    form.reset();
    form.classList.add("hidden");
    document.getElementById("changeNameButton").classList.remove("hidden");

    showEliteToast("Your display name has been updated.");
  } catch (error) {
    showEliteToast(error.message, "error");
  } finally {
    button.disabled = false;
    button.textContent = "SAVE";
  }
});


// Abrir edición del correo
document.getElementById("changeEmailButton").addEventListener("click", () => {
  if (!currentUser) return;

  if (currentUser.provider && currentUser.provider !== "local") {
    showEliteToast(
      "Email changes are unavailable for accounts connected through Google or Discord.",
      "info"
    );
    return;
  }

  const form = document.getElementById("editEmailForm");
  const input = document.getElementById("editEmailInput");
  const password = document.getElementById("editEmailPassword");
  const button = document.getElementById("changeEmailButton");

  input.value = "";
  password.value = "";

  form.classList.remove("hidden");
  button.classList.add("hidden");
  input.focus();
});

// Cancelar edición del correo
document.getElementById("cancelEmailEdit").addEventListener("click", () => {
  const form = document.getElementById("editEmailForm");

  form.reset();
  form.classList.add("hidden");

  document.getElementById("changeEmailButton").classList.remove("hidden");
});

// Guardar correo
document.getElementById("editEmailForm").addEventListener("submit", async event => {
  event.preventDefault();

  if (!currentUser) return;

  const form = event.currentTarget;
  const emailInput = document.getElementById("editEmailInput");
  const passwordInput = document.getElementById("editEmailPassword");
  const button = form.querySelector('[type="submit"]');

  const email = emailInput.value.trim();
  const currentPassword = passwordInput.value;

  if (!email || !currentPassword) {
    showEliteToast("Complete both fields.", "error");
    return;
  }

  button.disabled = true;
  button.textContent = "SAVING...";

  try {
    const updatedUser = await profileRequest("/api/profile/email", {
      email,
      currentPassword
    });

    currentUser = { ...currentUser, ...updatedUser };
    refreshProfileDisplay();

    form.reset();
    form.classList.add("hidden");
    document.getElementById("changeEmailButton").classList.remove("hidden");

    showEliteToast("Your email address has been updated.");
  } catch (error) {
    showEliteToast(error.message, "error");
  } finally {
    button.disabled = false;
    button.textContent = "SAVE";
  }
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
    showEliteToast("Choose a plan and enter a server name.", "error");
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

  showEliteToast(
  "Configuration saved locally. A real Minecraft server has not been created yet.",
  "info"
);
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

    remove.addEventListener("click", async () => {
  const confirmation = await openEliteModal({
    title: "Delete configuration",
    description: `Are you sure you want to delete "${server.name}"? This only deletes the saved configuration.`,
    confirmText: "DELETE",
    danger: true
  });

  if (!confirmation) return;

  saveServers(
    getServers().filter(item => item.id !== server.id)
  );

  renderServers();

  showEliteToast("Configuration deleted.", "success");
});

    info.append(title, details, status);
    actions.append(remove);
    card.append(info, actions);
    serverContainer.append(card);
  });
}

/* ================================================
   ELITEHOSTX SUPPORT CENTER
   Ticket-based conversations. No AI assistant.
================================================ */

let supportInitialized = false;
let supportAdmin = false;
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
    throw new Error(
      data.error || `Support request failed (${response.status}).`
    );
  }

  return data;
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

function getCategoryName(category) {
  return SUPPORT_CATEGORIES[category] || "Other";
}

function getStatusName(status) {
  const statuses = {
    open: "Open",
    answered: "Answered",
    closed: "Closed",
    pending: "Pending",
    in_progress: "In progress"
  };

  return statuses[status] || status || "Open";
}

function getPriorityName(priority) {
  const priorities = {
    low: "Low",
    normal: "Normal",
    high: "High"
  };

  return priorities[priority] || "Normal";
}

/* --------------------------------
   SUPPORT INITIALIZATION
-------------------------------- */

function bindSupportEvents() {
  if (supportInitialized) return;

  supportInitialized = true;

  document.querySelectorAll("[data-support-view]").forEach(button => {
    button.addEventListener("click", () => {
      switchSupportView(button.dataset.supportView);
    });
  });

  const newTicketButton = document.getElementById("openNewTicket");
  const closeTicketButton = document.getElementById("closeNewTicket");
  const newTicketForm = document.getElementById("newTicketForm");

  newTicketButton?.addEventListener("click", openNewTicketForm);
  closeTicketButton?.addEventListener("click", closeNewTicketForm);

  document.querySelectorAll("[data-open-ticket-form]").forEach(button => {
    button.addEventListener("click", openNewTicketForm);
  });

  document.getElementById("refreshMyTickets")
    ?.addEventListener("click", loadMyTickets);

  document.getElementById("refreshAdminTickets")
    ?.addEventListener("click", loadAdminTickets);
}

async function loadEliteSupport() {
  if (!currentUser) return;

  bindSupportEvents();
  clearSupportNotice();

  try {
    // This endpoint is retained only to determine whether the user is an admin.
    const data = await supportRequest("/status");

    supportAdmin = data.admin === true;

    const adminTab = document.getElementById("adminSupportTab");

    if (adminTab) {
      adminTab.classList.toggle("hidden", !supportAdmin);
    }

    await loadMyTickets();
  } catch (error) {
    console.error("Support initialization error:", error);
    showSupportNotice(
      error.message || "Unable to connect to the support center.",
      "error"
    );
  }
}

/* --------------------------------
   SUPPORT VIEW SWITCHING
-------------------------------- */

function switchSupportView(view) {
  if (view === "admin" && !supportAdmin) {
    showSupportNotice(
      "You do not have permission to access the administration panel.",
      "error"
    );
    return;
  }

  const views = {
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
    button.classList.toggle(
      "active",
      button.dataset.supportView === view
    );
  });

  clearSupportNotice();

  if (view === "tickets") {
    loadMyTickets();
  }

  if (view === "admin") {
    loadAdminTickets();
  }
}

/* --------------------------------
   NEW TICKET FORM
-------------------------------- */

function openNewTicketForm() {
  const panel = document.getElementById("newTicketPanel");

  if (!panel) return;

  panel.classList.remove("hidden");
  panel.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

  document.getElementById("ticketCategory")?.focus();
}

function closeNewTicketForm() {
  const panel = document.getElementById("newTicketPanel");

  if (!panel) return;

  panel.classList.add("hidden");
}

async function createSupportTicket(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = document.getElementById("createTicketButton");
  const categoryInput = document.getElementById("ticketCategory");
  const subjectInput = document.getElementById("ticketSubject");
  const messageInput = document.getElementById("ticketInitialMessage");

  if (!currentUser) {
    showSupportNotice(
      "Your session has expired. Please sign in again.",
      "error"
    );
    return;
  }

  if (!form || !categoryInput || !subjectInput || !messageInput) {
    showSupportNotice(
      "The ticket form could not be loaded. Refresh the page and try again.",
      "error"
    );
    return;
  }

  const category = categoryInput.value.trim();
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();

  if (!category || !SUPPORT_CATEGORIES[category]) {
    showSupportNotice("Please select a valid support category.", "error");
    categoryInput.focus();
    return;
  }

  if (subject.length < 3 || subject.length > 120) {
    showSupportNotice(
      "The subject must contain between 3 and 120 characters.",
      "error"
    );
    subjectInput.focus();
    return;
  }

  if (message.length < 5 || message.length > 4000) {
    showSupportNotice(
      "Your message must contain between 5 and 4000 characters.",
      "error"
    );
    messageInput.focus();
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "CREATING TICKET...";
  }

  try {
    const data = await supportRequest("/tickets", {
      method: "POST",
      body: JSON.stringify({
        category,
        subject,
        message
      })
    });

    const ticket = data.ticket;

    if (!ticket || !ticket.id) {
      throw new Error("The server did not return the new ticket.");
    }

    currentUserTicketId = ticket.id;

    form.reset();
    closeNewTicketForm();

    await loadMyTickets();

    showSupportNotice(
      `Ticket #${ticket.id} created successfully. You can now chat with our support team.`,
      "success"
    );

  } catch (error) {
    console.error("[SUPPORT] Ticket creation error:", error);

    showSupportNotice(
      error.message || "Unable to create your ticket.",
      "error"
    );

  } finally {
    if (button) {
      button.disabled = false;
      button.innerHTML = 'CREATE CONVERSATION <span>➤</span>';
    }
  }
}

/* --------------------------------
   USER TICKET LIST
-------------------------------- */

async function loadMyTickets() {
  if (!currentUser) return;

  const list = document.getElementById("myTicketList");
  const detail = document.getElementById("myTicketDetail");

  if (!list || !detail) return;

  list.innerHTML = `<p class="support-loading">Loading conversations...</p>`;

  try {
    const data = await supportRequest("/tickets");
    const tickets = data.tickets || [];

    if (!tickets.length) {
      currentUserTicketId = null;

      list.innerHTML = `
        <div class="support-list-empty">
          <span>◈</span>
          <p>No conversations yet.</p>
          <small>Create a ticket to contact the EliteHostX support team.</small>
        </div>
      `;

      detail.innerHTML = `
        <div class="ticket-empty">
          <div class="ticket-empty-icon">◈</div>
          <h3>Your support conversations</h3>
          <p>Create a ticket to start a private conversation with our team.</p>
          <button type="button" class="secondary-button" data-open-ticket-form>
            ＋ CREATE A TICKET
          </button>
        </div>
      `;

      detail.querySelector("[data-open-ticket-form]")
        ?.addEventListener("click", openNewTicketForm);

      return;
    }

    if (
      !currentUserTicketId ||
      !tickets.some(ticket =>
        String(ticket.id) === String(currentUserTicketId)
      )
    ) {
      currentUserTicketId = tickets[0].id;
    }

    list.innerHTML = tickets.map(ticket => `
      <button
        type="button"
        class="support-ticket-item ${String(ticket.id) === String(currentUserTicketId) ? "active" : ""}"
        data-ticket-id="${escapeSupportHTML(ticket.id)}"
      >
        <span class="ticket-item-top">
          <strong>${escapeSupportHTML(ticket.subject)}</strong>
          <div class="ticket-detail-actions">
  <div class="ticket-detail-actions">
  <span class="ticket-status status-${escapeSupportHTML(ticket.status)}">
    ${escapeSupportHTML(getStatusName(ticket.status))}
  </span>

  <button
    type="button"
    id="deleteAdminTicket"
    class="danger-button"
  >
    DELETE TICKET
  </button>
</div>

  <button
    type="button"
    id="deleteUserTicket"
    class="danger-button"
  >
    DELETE TICKET
  </button>
</div>
        </span>

        <span class="support-ticket-category">
          ${escapeSupportHTML(getCategoryName(ticket.category))}
        </span>

        <small>
          #${escapeSupportHTML(ticket.id)}
          · ${escapeSupportHTML(formatSupportDate(ticket.updated_at || ticket.created_at))}
        </small>
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

    list.innerHTML = `
      <p class="support-error">${escapeSupportHTML(error.message)}</p>
    `;
  }
}

/* --------------------------------
   DELETE USER TICKET
-------------------------------- */

async function deleteUserSupportTicket(ticketId) {
  const confirmation = await openEliteModal({
    title: "Delete support ticket",
    description: `Are you sure you want to permanently delete ticket #${ticketId}? All messages in this conversation will also be deleted.`,
    confirmText: "DELETE TICKET",
    danger: true
  });

  if (!confirmation) return;

  try {
    await supportRequest(
      `/tickets/${encodeURIComponent(ticketId)}`,
      {
        method: "DELETE"
      }
    );

    if (String(currentUserTicketId) === String(ticketId)) {
      currentUserTicketId = null;
    }

    showEliteToast("Support ticket deleted successfully.", "success");

    await loadMyTickets();

  } catch (error) {
    console.error("[SUPPORT] Ticket deletion error:", error);
    showEliteToast(error.message || "Unable to delete ticket.", "error");
  }
}

/* --------------------------------
   USER TICKET CHAT
-------------------------------- */

async function loadUserTicketDetail() {
  if (!currentUserTicketId) return;

  const detail = document.getElementById("myTicketDetail");

  detail.innerHTML = `<p class="support-loading">Loading conversation...</p>`;

  try {
    const data = await supportRequest(
      `/tickets/${encodeURIComponent(currentUserTicketId)}`
    );

    const ticket = data.ticket;
    const messages = data.messages || [];

    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    detail.innerHTML = `
      <div class="ticket-detail-heading">
        <div>
          <span class="support-kicker">
            SUPPORT TICKET #${escapeSupportHTML(ticket.id)}
          </span>

          <h3>${escapeSupportHTML(ticket.subject)}</h3>

          <p>
            ${escapeSupportHTML(getCategoryName(ticket.category))}
            · Created ${escapeSupportHTML(formatSupportDate(ticket.created_at))}
          </p>
        </div>

        <span class="ticket-status status-${escapeSupportHTML(ticket.status)}">
          ${escapeSupportHTML(getStatusName(ticket.status))}
        </span>
      </div>

      <div class="ticket-chat-info">
        <span>✦</span>
        <div>
          <strong>EliteHostX Support</strong>
          <small>Private ticket conversation</small>
        </div>
      </div>

      <div class="ticket-message-list" id="userTicketMessages" aria-live="polite"></div>

      ${
        ticket.status === "closed"
          ? `
            <div class="ticket-closed-note">
              This conversation is closed. Create a new ticket if you need more assistance.
            </div>
          `
          : `
            <form id="userTicketReplyForm" class="ticket-reply-form">
              <textarea
                id="userTicketReply"
                maxlength="4000"
                rows="3"
                placeholder="Write your message..."
                required
              ></textarea>

              <button type="submit" class="support-submit-button">
                SEND MESSAGE <span>➤</span>
              </button>
            </form>
          `
      }
    `;

    const messageList = document.getElementById("userTicketMessages");

    if (!messages.length) {
      messageList.innerHTML = `
        <p class="support-loading">No messages in this conversation yet.</p>
      `;
    } else {
      messages.forEach(message => {
        appendTicketMessage(messageList, message, "user");
      });
    }

    messageList.scrollTop = messageList.scrollHeight;

document.getElementById("deleteUserTicket")
  ?.addEventListener("click", () => {
    deleteUserSupportTicket(ticket.id);
  });

    const form = document.getElementById("userTicketReplyForm");

    if (form) {
      form.addEventListener("submit", sendUserTicketReply);
    }
  } catch (error) {
    console.error("Ticket detail error:", error);

    detail.innerHTML = `
      <p class="support-error">${escapeSupportHTML(error.message)}</p>
    `;
  }
}

/* --------------------------------
   TICKET MESSAGE RENDERING
-------------------------------- */

function appendTicketMessage(container, message, viewer = "user") {
  const item = document.createElement("article");

  const isAdmin = message.sender_type === "admin";
  const isOwnMessage = viewer === "user" ? !isAdmin : isAdmin;

  item.className = [
    "ticket-message",
    isAdmin ? "ticket-admin-message" : "ticket-user-message",
    isOwnMessage ? "ticket-own-message" : "ticket-other-message"
  ].join(" ");

  const heading = document.createElement("strong");

  heading.textContent = isAdmin
    ? "EliteHostX Support"
    : (viewer === "admin"
      ? (message.sender_name || "Customer")
      : "You");

  const content = document.createElement("p");
  content.textContent = message.content;

  const date = document.createElement("small");
  date.textContent = formatSupportDate(message.created_at);

  item.append(heading, content, date);
  container.append(item);
}

/* --------------------------------
   USER REPLY
-------------------------------- */

async function sendUserTicketReply(event) {
  event.preventDefault();

  const input = document.getElementById("userTicketReply");
  const button = event.submitter;
  const content = input.value.trim();

  if (!content || !currentUserTicketId) return;

  if (button) {
    button.disabled = true;
    button.textContent = "SENDING...";
  }

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

    showSupportNotice("Your message has been sent.", "success");
  } catch (error) {
    showSupportNotice(error.message, "error");

    if (button) {
      button.disabled = false;
      button.innerHTML = 'SEND MESSAGE <span>➤</span>';
    }
  }
}

/* ================================================
   ADMIN SUPPORT CENTER
================================================ */

async function loadAdminTickets() {
  if (!supportAdmin) return;

  const list = document.getElementById("adminTicketList");
  const detail = document.getElementById("adminTicketDetail");

  if (!list || !detail) return;

  list.innerHTML = `<p class="support-loading">Loading support queue...</p>`;

  try {
    const data = await supportRequest("/admin/tickets");
    const tickets = data.tickets || [];

    if (!tickets.length) {
      currentAdminTicketId = null;

      list.innerHTML = `
        <div class="support-list-empty">
          <span>♛</span>
          <p>No support tickets.</p>
          <small>New customer requests will appear here.</small>
        </div>
      `;

      detail.innerHTML = `
        <div class="ticket-empty">
          <div class="ticket-empty-icon">♛</div>
          <h3>Support queue is clear</h3>
          <p>There are no customer conversations to review right now.</p>
        </div>
      `;

      return;
    }

    if (
      !currentAdminTicketId ||
      !tickets.some(ticket =>
        String(ticket.id) === String(currentAdminTicketId)
      )
    ) {
      currentAdminTicketId = tickets[0].id;
    }

    list.innerHTML = tickets.map(ticket => `
      <button
        type="button"
        class="support-ticket-item ${String(ticket.id) === String(currentAdminTicketId) ? "active" : ""}"
        data-admin-ticket-id="${escapeSupportHTML(ticket.id)}"
      >
        <span class="ticket-item-top">
          <strong>${escapeSupportHTML(ticket.subject)}</strong>
          <span class="ticket-status status-${escapeSupportHTML(ticket.status)}">
            ${escapeSupportHTML(getStatusName(ticket.status))}
          </span>
        </span>

        <span class="support-ticket-category">
          ${escapeSupportHTML(getCategoryName(ticket.category))}
        </span>

        <small>
          ${escapeSupportHTML(ticket.email || ticket.user_email || "Customer")}
          · #${escapeSupportHTML(ticket.id)}
        </small>
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

    list.innerHTML = `
      <p class="support-error">${escapeSupportHTML(error.message)}</p>
    `;
  }
}

/* --------------------------------
   ADMIN TICKET CHAT
-------------------------------- */

async function loadAdminTicketDetail() {
  if (!supportAdmin || !currentAdminTicketId) return;

  const detail = document.getElementById("adminTicketDetail");

  detail.innerHTML = `<p class="support-loading">Loading conversation...</p>`;

  try {
    const data = await supportRequest(
      `/tickets/${encodeURIComponent(currentAdminTicketId)}`
    );

    const ticket = data.ticket;
    const messages = data.messages || [];

    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    detail.innerHTML = `
      <div class="ticket-detail-heading">
        <div>
          <span class="support-kicker">
            CUSTOMER REQUEST #${escapeSupportHTML(ticket.id)}
          </span>

          <h3>${escapeSupportHTML(ticket.subject)}</h3>

          <p>
            ${escapeSupportHTML(ticket.email || ticket.user_email || "Customer")}
            · ${escapeSupportHTML(getCategoryName(ticket.category))}
          </p>
        </div>

        <span class="ticket-status status-${escapeSupportHTML(ticket.status)}">
          ${escapeSupportHTML(getStatusName(ticket.status))}
        </span>
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

        <button
          type="button"
          id="saveAdminTicket"
          class="secondary-button"
        >
          SAVE CHANGES
        </button>
      </div>

      <div class="ticket-chat-info">
        <span>♛</span>
        <div>
          <strong>Customer conversation</strong>
          <small>Reply as EliteHostX Support</small>
        </div>
      </div>

      <div class="ticket-message-list" id="adminTicketMessages" aria-live="polite"></div>

      ${
        ticket.status === "closed"
          ? `
            <div class="ticket-closed-note">
              This ticket is closed. Reopen it to send another response.
            </div>
          `
          : `
            <form id="adminTicketReplyForm" class="ticket-reply-form">
              <textarea
                id="adminTicketReply"
                maxlength="4000"
                rows="3"
                placeholder="Write a response to the customer..."
                required
              ></textarea>

              <button type="submit" class="support-submit-button">
                SEND RESPONSE <span>➤</span>
              </button>
            </form>
          `
      }
    `;

    const messageList = document.getElementById("adminTicketMessages");

    if (!messages.length) {
      messageList.innerHTML = `
        <p class="support-loading">No messages in this conversation yet.</p>
      `;
    } else {
      messages.forEach(message => {
        appendTicketMessage(messageList, message, "admin");
      });
    }

    messageList.scrollTop = messageList.scrollHeight;

    document.getElementById("saveAdminTicket")
      ?.addEventListener("click", saveAdminTicketChanges);

      document.getElementById("deleteAdminTicket")
  ?.addEventListener("click", () => {
    deleteAdminSupportTicket(ticket.id);
  });

    document.getElementById("adminTicketReplyForm")
      ?.addEventListener("submit", sendAdminTicketReply);
  } catch (error) {
    console.error("Admin ticket detail error:", error);

    detail.innerHTML = `
      <p class="support-error">${escapeSupportHTML(error.message)}</p>
    `;
  }
}

/* --------------------------------
   DELETE ADMIN TICKET
-------------------------------- */

async function deleteAdminSupportTicket(ticketId) {
  if (!supportAdmin) return;

  const confirmation = await openEliteModal({
    title: "Delete customer ticket",
    description: `Are you sure you want to permanently delete customer ticket #${ticketId}? All messages will also be deleted.`,
    confirmText: "DELETE TICKET",
    danger: true
  });

  if (!confirmation) return;

  try {
    await supportRequest(
      `/admin/tickets/${encodeURIComponent(ticketId)}`,
      {
        method: "DELETE"
      }
    );

    if (String(currentAdminTicketId) === String(ticketId)) {
      currentAdminTicketId = null;
    }

    showEliteToast("Customer ticket deleted successfully.", "success");

    await loadAdminTickets();

  } catch (error) {
    console.error("[SUPPORT] Admin ticket deletion error:", error);
    showEliteToast(error.message || "Unable to delete ticket.", "error");
  }
}

/* --------------------------------
   ADMIN UPDATE TICKET
-------------------------------- */

async function saveAdminTicketChanges() {
  if (!supportAdmin || !currentAdminTicketId) return;

  const button = document.getElementById("saveAdminTicket");
  const status = document.getElementById("adminTicketStatus").value;
  const priority = document.getElementById("adminTicketPriority").value;

  button.disabled = true;
  button.textContent = "SAVING...";

  try {
    await supportRequest(
      `/admin/tickets/${encodeURIComponent(currentAdminTicketId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
          priority
        })
      }
    );

    showSupportNotice("Ticket updated successfully.", "success");

    await loadAdminTickets();
  } catch (error) {
    showSupportNotice(error.message, "error");
  } finally {
    button.disabled = false;
    button.textContent = "SAVE CHANGES";
  }
}

/* --------------------------------
   ADMIN REPLY
-------------------------------- */

async function sendAdminTicketReply(event) {
  event.preventDefault();

  if (!supportAdmin || !currentAdminTicketId) return;

  const input = document.getElementById("adminTicketReply");
  const button = event.submitter;
  const content = input.value.trim();

  if (!content) return;

  if (button) {
    button.disabled = true;
    button.textContent = "SENDING...";
  }

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

    if (button) {
      button.disabled = false;
      button.innerHTML = 'SEND RESPONSE <span>➤</span>';
    }
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
   GLOBAL SUPPORT FORM LISTENER
   Garantiza que el formulario funcione
   aunque falle la inicialización visual.
-------------------------------- */

document.addEventListener("submit", event => {
  if (event.target?.id !== "newTicketForm") {
    return;
  }

  createSupportTicket(event);
});

/* --------------------------------
   INITIALIZE APPLICATION
-------------------------------- */

// Hide all pages before checking the user session.
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
