// auth.js — stable login flow for tyniweb

console.log("auth.js loaded");

let auth0Client = null;

// Define tyniLogin immediately so the button never calls an undefined function
window.tyniLogin = async function () {
  if (!auth0Client) {
    console.error("Auth0 client not initialized yet.");
    return;
  }

  try {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: "https://tyniweb.com/portfolio.html"
      }
    });
  } catch (err) {
    console.error("Login redirect failed:", err);
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
  const emailPrompt = document.getElementById("emailPrompt");
  const submitEmailBtn = document.getElementById("submitEmailBtn");

  if (loginBtn) {
    loginBtn.onclick = () => {
      emailPrompt.style.display = "block";
      loginBtn.style.display = "none";
    };
  }

  if (submitEmailBtn) {
    submitEmailBtn.onclick = window.tyniLogin;
  }

  initAuth();
});
