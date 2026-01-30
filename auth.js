console.log("auth.js loaded");

let auth0Client = null;

async function initAuth() {
  const redirectUri = "https://tyni.github.io/tyniweb/portfolio.html";
  console.log("Redirect URI:", redirectUri);

  auth0Client = await createAuth0Client({
    domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
    client_id: "jzS1LP3cpq64VAcWTf6YiLWySaGnNHgR",
    authorizationParams: {
      redirect_uri: redirectUri
    }
  });

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/tyniweb/portfolio.html");
  }
}

async function tyniLogin() {
  await auth0Client.loginWithRedirect();
}

initAuth();
