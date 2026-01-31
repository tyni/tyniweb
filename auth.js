// auth.js — popup login flow for tyniweb

console.log("auth.js loaded");

let auth0Client = null;

async function initAuth() {
  try {
    auth0Client = await auth0.createAuth0Client({
      domain: "dev-fht8kl3tzpgoptkw.us.auth0.com",
      client_id: "jzSlLP3cpq6AVAcWTf6YiLWySaGnNHgR",
      audience: "https://tyniweb.com/api",
      scope: "openid profile email"
    });

    console.log("Auth0 client initialized:", auth0Client);

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

// Define tyniLogin for popup login
window.tyniLogin = async function () {
  if (!auth0Client || typeof auth0Client.loginWithPopup !== "function") {
    console.error("Auth0 client not ready or invalid.");
    alert("Login system not ready. Please refresh the page and try again.");
    return;
  }

  const loginBtn = document.getElementById("loginBtn");
  loginBtn.disabled = true;
  loginBtn.textContent = "Opening secure login...";

  try {
    await auth0Client.loginWithPopup();

    const user = await auth0Client.getUser();
    console.log("Logged in as:", user.email);

    // Optional: store or log email
    sessionStorage.setItem("userEmail", user.email);

    // Redirect to portfolio
    window.location.href = "/portfolio.html";
  } catch (err) {
    console.error("Popup login failed:", err);
    alert("Login popup was blocked or failed. Please allow popups and try again.");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "request access";
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.disabled = true; // disable until ready

  await initAuth(); // wait for Auth0 client to be ready

  if (loginBtn) {
    loginBtn.disabled = false;
    loginBtn.onclick = window.tyniLogin;
  }
});
