console.log("auth.js loaded");

let auth0Client = null;

async function initAuth() {
  const redirectUri = "https://tyniweb.com/portfolio.html";
  console.log("Redirect URI:", redirectUri);

  auth0Client = await createAuth0Client({
    domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
    client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
    redirect_uri: redirectUri
  });

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/portfolio.html");
  }
}

async function tyniLogin() {
  await auth0Client.loginWithRedirect({
    redirect_uri: "https://tyniweb.com/portfolio.html"
  });
}

initAuth();
