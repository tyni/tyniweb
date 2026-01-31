// auth.js — hardened popup login for tyniweb

console.log("auth.js loaded");

let auth0Client = null;

async function createClient() {
  return await auth0.createAuth0Client({
    domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
    client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
    audience: "https://tyniweb.com/api",
    scope: "openid profile email"
  });
}

async function initAuth() {
  try {
    auth0Client = await createClient();
    console.log("Auth0 client initialized.");

    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log("User is authenticated:", isAuthenticated);

    if (isAuthenticated) {
      const user = await auth0Client.getUser();
      console.log("Already logged in as:", user.email);
      window.location.href = "/portfolio.html";
    }
  } catch (err) {
    console.error("Error initializing Auth0 client:", err);
  }
}

async function tyniLogin() {
  const loginBtn = document.getElementById("loginBtn");

  if (!auth0Client) {
    console.error("Auth0 client not ready.");
    alert("Login system not ready. Please refresh the page and try again.");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Opening secure login...";

  try {
    await auth0Client.loginWithPopup({
      authorizationParams: {
        client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR", // force it in
        audience: "https://tyniweb.com/api",
        scope: "openid profile email"
      }
    });

    const user = await auth0Client.getUser();
    console.log("Logged in as:", user.email);
    sessionStorage.setItem("userEmail", user.email);

    window.location.href = "/portfolio.html";
  } catch (err) {
    console.error("Popup login failed:", err);
    alert("Login popup was blocked or failed. Please allow popups and try again.");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "request access";
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.disabled = true;

  await initAuth();

  if (loginBtn) {
    loginBtn.disabled = false;
    loginBtn.onclick = tyniLogin;
  }
});
