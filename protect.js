// protect.js

// Redirect to login if no session access
if (sessionStorage.getItem("accessGranted") !== "true") {
  window.location.href = "/login.html";
}

// Optional: auto-login for members
if (localStorage.getItem("memberEmail")) {
  sessionStorage.setItem("accessGranted", "true");
}
