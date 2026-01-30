// protect.js — production‑ready Auth0 gate for tyniweb portfolio

let auth0Client = null;

async function initAuth() {
  // Create Auth0 client with explicit redirect URI
  auth0Client = await createAuth0Client({
    domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
    client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
    authorizationParams: {
      redirect_uri: "https://tyniweb.com/portfolio.html"
    }
  });

  // Handle Auth0 redirect callback (after login)
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    try {
      await auth0Client.handleRedirectCallback();
    } catch (err) {
      console.error("Auth0 redirect error:", err);
    }

    // Clean the URL after Auth0 callback
    window.history.replaceState({}, document.title, "/portfolio.html");
  }

  // Check authentication state
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (!isAuthenticated) {
    // Not logged in → send to login page
    window.location.href = "login.html";
    return;
  }

  // Authenticated → reveal page
  document.body.classList.remove("auth-loading");
  document.body.classList.add("auth-ready");

  // Log visit to Google Apps Script
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

// Logout handler
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

// Initialize everything
initAuth();
setupLogout();
