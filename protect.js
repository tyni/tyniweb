// protect.js — production‑ready Auth0 gate for tyniweb portfolio

let auth0Client = null;

async function initAuth() {
  // Ensure Auth0 library is loaded
  if (typeof auth0?.createAuth0Client !== "function") {
    console.error("Auth0 library not loaded");
    return;
  }

  auth0Client = await auth0.createAuth0Client({
    domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
    client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
    authorizationParams: {
      redirect_uri: "https://tyniweb.com/portfolio.html"
    }
  });

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    try {
      await auth0Client.handleRedirectCallback();
    } catch (err) {
      console.error("Auth0 redirect error:", err);
    }

    window.history.replaceState({}, document.title, "/portfolio.html");
  }

  const isAuthenticated = await auth0Client.isAuthenticated();

  if (!isAuthenticated) {
    window.location.href = "login.html";
    return;
  }

  document.body.classList.remove("auth-loading");
  document.body.classList.add("auth-ready");

  logVisit();
}

async function logVisit() {
  try {
    const user = await auth0Client.getUser();
    if (!user || !user.email) return;

    await fetch(
      "https://script.google.com/macros/s/AKfycbx_GM5iIAY1xaLJsKaArGUm6q98PL5UWWOwHn_8E2SN-203qFvI-EICZasfQMsDmfvS/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "visit",
          email: user.email,
          userAgent: navigator.userAgent,
          page: "portfolio"
        })
      }
    );
  } catch (err) {
    console.warn("Visit logging failed:", err);
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.onclick = () => {
    auth0Client.logout({
      logoutParams: {
        returnTo: "https://tyniweb.com/index.html"
      }
    });
  };
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setupLogout();
  initAuth();
});
