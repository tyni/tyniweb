// access.js

let generatedCode = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("accessForm");
  const verifyBtn = document.getElementById("verifyCodeBtn");
  const becomeBtn = document.getElementById("becomeMemberBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Handle access request form
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();

      if (!name || !email) {
        alert("Please enter your name and email.");
        return;
      }

      // Generate access code
      generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      sessionStorage.setItem("accessCode", generatedCode);

      try {
        // Send to Google Apps Script
        await fetch("https://script.google.com/macros/s/AKfycbx_GM5iIAY1xaLJsKaArGUm6q98PL5UWWOwHn_8E2SN-203qFvI-EICZasfQMsDmfvS/exec", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "access",
            name,
            email,
            code: generatedCode
          })
        });

        // Show code and prompt
        document.getElementById("accessCode").textContent = generatedCode;
        form.style.display = "none";
        document.getElementById("accessCodeSection").style.display = "block";
      } catch (error) {
        console.error("Access request failed:", error);
        alert("There was a problem submitting your request. Please try again.");
      }
    });
  }

  // Verify access code
  if (verifyBtn) {
    verifyBtn.addEventListener("click", () => {
      const input = document.getElementById("codeInput").value.trim().toUpperCase();
      const stored = sessionStorage.getItem("accessCode");
      if (input === stored) {
        sessionStorage.setItem("accessGranted", "true");
        window.location.href = "/portfolio.html";
      } else {
        alert("Incorrect code. Please try again.");
      }
    });
  }

  // Become a member
  if (becomeBtn) {
    becomeBtn.addEventListener("click", () => {
      const email = prompt("Enter your email to become a member:");
      if (email) {
        localStorage.setItem("memberEmail", email);
        alert("Thanks! You’re now a member.");
        document.getElementById("memberBanner").style.display = "none";
      }
    });
  }

  // Auto-login for members
  if (localStorage.getItem("memberEmail")) {
    sessionStorage.setItem("accessGranted", "true");
  }

  // Logout clears session
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "/login.html";
    });
  }
});
