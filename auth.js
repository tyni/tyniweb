console.log("auth.js loaded");

let auth0Client = null;

async function initAuth() {
  console.log("Redirect URI:", window.location.origin + "/tyniweb/portfolio.html");
  auth0Client = await createAuth0Client({
    domain: "dev-fht8kl3tzpgoptkw.us.auth0.com", // e.g. dev-abc123.us.auth0.com
    client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR", // e.g. jzS1LP3cpq64VAcWTf6YiLWySaGnNHgR
    authorizationParams: {
      console.log("Redirect URI:", window.location.origin + "/tyniweb/portfolio.html");
    }
  });

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/tyniweb/portfolio.html");
  }
}

async function login() {
  await auth0Client.loginWithRedirect();
}

initAuth();
