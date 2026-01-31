// auth.js — stable login flow for tyniweb

console.log("auth.js loaded");

let auth0Client = null;

// Define tyniLogin immediately so the button never calls an undefined function
window.tyniLogin = async function () {
  if (!auth0Client || typeof auth0Client.loginWithRedirect !== "function") {
    console.error("Auth0 client not ready or invalid.");
    alert("Login system not ready. Please refresh the page and try again.");
    return;
  }

  try {
    console.log("Calling loginWithRedirect with client_id:", auth0Client.options.client_id);
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
        redirect_uri: "https://tyniweb.com/portfolio.html",
        audience: "https://tyniweb.com/api",
        scope: "openid profile email"
      }
    });
  } catch (err) {
    console.error("Login redirect failed:", err);
    alert("Login failed. Please try again.");
  }
};

async function initAuth() {
  const redirectUri = "https://tyniweb.com/portfolio.html";
  console.log("Redirect URI:", redirectUri);

  try {
    auth0Client = await auth0.createAuth0Client({
      domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
      client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
      authorizationParams: {
        redirect_uri: redirectUri
      }
    });

    console.log("Auth0 client initialized:", auth0Client);

    // Handle Auth0 redirect callback
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      try {
        await auth0Client.handleRedirectCallback();
        console.log("Handled redirect callback");
      } catch (err) {
        console.error("Auth0 redirect error on login page:", err);
      }

      window.history.replaceState({}, document.title, "/login.html");
    }

    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log("User is authenticated:", isAuthenticated);

  } catch (err) {
    console.error("Error initializing Auth0 client:", err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.onclick = window.tyniLogin;

  initAuth();
});
