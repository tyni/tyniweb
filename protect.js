// protect.js — production‑ready Auth0 gate for tyniweb portfolio

let auth0Client = null;

async function initAuth() {
  try {
    // Ensure Auth0 SDK is available
    if (typeof auth0?.createAuth0Client !== "function") {
      console.error("Auth0 SDK not loaded.");
      return;
    }

    auth0Client = await auth0.createAuth0Client({
      domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
      client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
      authorizationParams: {
        redirect_uri: "https://tyniweb.com/portfolio.html",
        audience: "https://tyniweb.com/api",
        scope: "openid profile email"
      }
    });

    console.log("Auth0 client initialized.");

    const query = window.location.search;
    const hash = window.location.hash;
    if (query.includes("code=") && query.includes("state=") || hash.includes("code=") && hash.includes("state=")) {
      try {
        console.log("Handling Auth0 redirect callback...");
        await auth0Client.handleRedirectCallback();
        console.log("Redirect callback handled.");
        window.history.replaceState({}, document.title, "/portfolio.html");
      } catch (err) {
        console.error("Auth0 redirect error:", err);
      }
    }

    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log("Authenticated:", isAuthenticated);

    if (!isAuthenticated) {
      console.warn("User is NOT authenticated — skipping redirect for debugging.");
      // window.location.href = "login.html"; // TEMPORARILY DISABLED
      return;
    }

    document.body.classList.remove("auth-loading");
    document.body.classList.add("auth-ready");

    setupLogout();
    logVisit();

  } catch (err) {
    console.error("initAuth failed:", err);
    window.location.href = "login.html";
  }
}

async function logVisit() {
  try {
    const user = await auth0Client.getUser();
    if (!user?.email) {
      console.warn("User email not found — skipping visit log.");
      return;
    }

    await fetch("https://script.google.com/macros/s/AKfycbx_GM5iIAY1xaLJsKaArGUm6q98PL5UWWOwHn_8E2SN-203qFvI-EICZasfQMsDmfvS/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "visit",
        email: user.email,
        userAgent: navigator.userAgent,
        page: "portfolio"
      })
    });

    console.log("Visit logged for:", user.email);
  } catch (err) {
    console.warn("Visit logging failed:", err);
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) {
    console.warn("Logout button not found.");
    return;
  }

  logoutBtn.onclick = () => {
    auth0Client.logout({
      logoutParams: {
        returnTo: "https://tyniweb.com/index.html"
      }
    });
  };
}

document.addEventListener("DOMContentLoaded", initAuth);
