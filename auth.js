// auth.js — stable login flow for tyniweb

console.log("auth.js loaded");

let auth0Client = null;

// Define tyniLogin immediately so the button never calls an undefined function
window.tyniLogin = async function () {
  if (!auth0Client) {
    console.error("Auth0 client not initialized yet.");
    return;
  }

  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: "https://tyniweb.com/portfolio.html"
    }
  });
};

async function initAuth() {
  const redirectUri = "https://tyniweb.com/portfolio.html";
  console.log("Redirect URI:", redirectUri);

  // Create Auth0 client using the self-hosted script
  auth0Client = await createAuth0Client({
    domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
    client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
    authorizationParams: {
      redirect_uri: redirectUri
    }
  });

  // Handle Auth0 redirect callback
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    try {
      await auth0Client.handleRedirectCallback();
    } catch (err) {
      console.error("Auth0 redirect error on login page:", err);
    }

    window.history.replaceState({}, document.title, "/login.html");
  }
}

// Bind button after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("loginBtn");
  if (btn) btn.onclick = window.tyniLogin;
});

// Initialize Auth0
initAuth();
