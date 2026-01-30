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

async function logVisit() {
  const user = await auth0Client.getUser();

  fetch("https://script.google.com/macros/s/AKfycbx_GM5iIAY1xaLJsKaArGUm6q98PL5UWWOwHn_8E2SN-203qFvI-EICZasfQMsDmfvS/exec", {
    method: "POST",
    body: JSON.stringify({
      email: user.email,
      userAgent: navigator.userAgent,
      page: "portfolio"
    })
  });
}

logVisit();

protectPage();
