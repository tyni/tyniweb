// auth.js — login flow for tyniweb private portfolio

console.log("auth.js loaded");

let auth0Client = null;

async function initAuth() {
  const redirectUri = "https://tyniweb.com/portfolio.html";
  console.log("Redirect URI:", redirectUri);

  auth0Client = await createAuth0Client({
    domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
    client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
    authorizationParams: {
      redirect_uri: redirectUri
    }
  });

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    try {
      await auth0Client.handleRedirectCallback();
    } catch (err) {
      console.error("Auth0 redirect error on login page:", err);
    }

    // Clean URL after Auth0 callback
    window.history.replaceState({}, document.title, "/login.html");
  }
}

async function tyniLogin() {
  if (!auth0Client) {
    console.error("Auth0 client not initialized yet.");
    return;
  }

  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: "https://tyniweb.com/portfolio.html"
    }
  });
}

initAuth();
window.tyniLogin = tyniLogin;
