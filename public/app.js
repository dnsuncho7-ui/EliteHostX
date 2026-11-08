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
  dashboard: ["Dashboard", "Your EliteHostX account overview."],
  "my-servers": ["My Servers", "View the servers configured in your account."],
  "hosting-plans": ["Hosting Plans", "Compare the resources available in each plan."],
  "create-server": ["Create Server", "Configure a server request using one of our hosting plans."],
  "file-manager": ["File Manager", "File access will be available after server-node integration."],
  console: ["Console", "Live server console requires a connected game-server node."],
  settings: ["Settings", "Manage your account preferences."],
  support: ["Support", "Find help with your EliteHostX account."]
};

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

function renderPlans() {
  const grid = document.getElementById("plansGrid");
  const choices = document.getElementById("planChoice");

  if (grid) {
    grid.innerHTML = HOSTING_PLANS.map(plan => `
      <article class="plan-card" style="--plan-color:${plan.color};--plan-glow:${plan.glow}">
        <div class="plan-art"><img src="${planImage(plan)}" alt="${plan.name}" loading="lazy"></div>
        <span class="plan-label">ELITEHOSTX PLAN</span>
        <h3>${plan.name}</h3>
        <p class="plan-ram">${plan.ram} GB RAM</p>
        <div class="plan-specs"><span>⚡ ${plan.cpu} CPU</span><span>▣ ${plan.disk} GB SSD</span></div>
        <p class="plan-price">PRECIO PRÓXIMAMENTE</p>
        <button type="button" class="plan-select-button" data-plan="${plan.id}">SELECT PLAN</button>
      </article>
    `).join("");

    grid.querySelectorAll("[data-plan]").forEach(button => {
      button.addEventListener("click", () => {
        navigateTo("create-server");
        const radio = document.querySelector(`input[name="hostingPlan"][value="${button.dataset.plan}"]`);
        if (radio) radio.checked = true;
      });
    });
  }

  if (choices) {
    choices.innerHTML = HOSTING_PLANS.map((plan, index) => `
      <label class="plan-option">
        <input type="radio" name="hostingPlan" value="${plan.id}" ${index === 0 ? "checked" : ""} required>
        <img src="${planImage(plan)}" alt="${plan.name}">
        <strong>${plan.name}</strong>
        <small>${plan.ram} GB RAM · ${plan.cpu} CPU · ${plan.disk} GB SSD</small>
      </label>
    `).join("");
  }
}

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

  document.getElementById("profileAvatar").textContent = displayName.charAt(0).toUpperCase();
  document.getElementById("profileAvatar").title = displayName;
  document.getElementById("accountName").textContent = displayName;
  document.getElementById("settingsCurrentName").textContent = user.name || "Not set";
  document.getElementById("settingsEmail").textContent = user.email || "Not available";

  renderPlans();
  renderServers();
  navigateTo("dashboard");
}

function getStorageKey() {
  return currentUser ? `elitehostx_servers_${currentUser.id}` : null;
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
  if (key) localStorage.setItem(key, JSON.stringify(servers));
}

function navigateTo(section) {
  if (!SECTION_INFO[section]) section = "dashboard";

  document.querySelectorAll(".page-section").forEach(panel => {
    panel.classList.toggle("active", panel.id === `section-${section}`);
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.section === section);
  });

  document.getElementById("pageTitle").textContent = SECTION_INFO[section][0];
  document.getElementById("pageDescription").textContent = SECTION_INFO[section][1];

  if (section === "my-servers" || section === "dashboard") {
    renderServers();
  }

  history.replaceState(null, "", `#${section}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    navigateTo(link.dataset.section);
  });
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => navigateTo(button.dataset.go));
});

document.getElementById("loginTab").addEventListener("click", () => setAuthMode("login"));
document.getElementById("registerTab").addEventListener("click", () => setAuthMode("register"));

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

document.getElementById("registerForm").addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();

  const password = document.getElementById("registerPassword").value;
  const confirmation = document.getElementById("registerPasswordConfirm").value;

  if (password !== confirmation) {
    return showMessage("The passwords do not match.");
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

async function logout() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
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

document.getElementById("changeNameButton").addEventListener("click", () => {
  if (!currentUser) return;

  const nextName = prompt(
    "Enter the display name for this browser session:",
    currentUser.name || ""
  );

  if (nextName === null) return;

  const cleanName = nextName.trim().slice(0, 60);

  if (cleanName.length < 2) {
    return alert("The display name must contain at least 2 characters.");
  }

  currentUser.name = cleanName;

  document.getElementById("accountName").textContent = cleanName;
  document.getElementById("profileAvatar").textContent = cleanName.charAt(0).toUpperCase();
  document.getElementById("settingsCurrentName").textContent = cleanName;

  alert("Display name updated for this session. To change it permanently, account profile editing must be added to the backend.");
});

async function checkSession() {
  try {
    const response = await fetch("/api/me", {
      credentials: "same-origin",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      return showLogin();
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

serverForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!currentUser) {
    return showLogin();
  }

  const name = document.getElementById("serverName").value.trim();
  const software = document.getElementById("serverSoftware").value;
  const version = document.getElementById("serverVersion").value;
  const selectedPlanId = document.querySelector('input[name="hostingPlan"]:checked')?.value;
  const selectedPlan = HOSTING_PLANS.find(plan => plan.id === selectedPlanId);

  if (!name || !selectedPlan) {
    return alert("Choose a plan and enter a server name.");
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
  renderServers();
  serverForm.reset();
  navigateTo("my-servers");

  alert("Server configuration saved. A real Minecraft server has not been provisioned yet.");
});

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

  if (!servers.length) {
    serverContainer.innerHTML = `
      <div class="empty-icon">▣</div>
      <h2>No servers yet</h2>
      <p>You haven't created any Minecraft servers. Start by creating your first one.</p>
      <button type="button" class="primary-button" data-go="create-server">CREATE MY FIRST SERVER</button>
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
    details.textContent = `${server.software} · Minecraft ${server.version} · ${server.planName} · ${server.ram} GB RAM · ${server.cpu} CPU · ${server.disk} GB SSD`;

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

      saveServers(getServers().filter(item => item.id !== server.id));
      renderServers();
    });

    info.append(title, details, status);
    actions.append(remove);
    card.append(info, actions);
    serverContainer.append(card);
  });
}

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
      showMessage("The account service is currently unavailable. Please try again later.");
    }
  } catch (error) {
    console.error("Connection error:", error);
  }
}

renderPlans();
checkAuthMessages();
showLogin();
loadStatus();
checkSession();