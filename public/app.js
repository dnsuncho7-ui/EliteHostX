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
    title: "Support",
    description: "Get help with your EliteHostX account."
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

  // Hide EVERY page first.
  document.querySelectorAll("#appDashboard .page-section").forEach(page => {
    page.classList.remove("active");
    page.hidden = true;
    page.setAttribute("aria-hidden", "true");
  });

  // Show ONLY the selected page.
  targetPage.hidden = false;
  targetPage.classList.add("active");
  targetPage.setAttribute("aria-hidden", "false");

  // Update the active sidebar item.
  document.querySelectorAll(".nav-link").forEach(link => {
    const isActive = link.dataset.section === section;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // Update the page heading.
  document.getElementById("pageTitle").textContent =
    SECTION_INFO[section].title;

  document.getElementById("pageDescription").textContent =
    SECTION_INFO[section].description;

  if (section === "my-servers" || section === "dashboard") {
    renderServers();
  }

  // Keep the selected page in the URL.
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