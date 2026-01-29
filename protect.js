let auth0Client = null;

async function protectPage() {
  auth0Client = await createAuth0Client({
    domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
    client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR"
  });

  const isAuthenticated = await auth0Client.isAuthenticated();

  if (!isAuthenticated) {
    window.location.href = "login.html";
  }
}

async function logout() {
  await auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin + "/tyniweb/index.html"
    }
  });
}

protectPage();
