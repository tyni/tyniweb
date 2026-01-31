// access.js

let generatedCode = null;

// Handle access request form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("accessForm");
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

      // Send to Google Apps Script
      await fetch("https://your-google-apps-script-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name,
          email,
          message: `Requested access. Code: ${generatedCode}`
        })
      });

      // Show code and prompt for entry
      document.getElementById("accessCode").textContent = generatedCode;
      document.getElementById("accessForm").style.display = "none";
      document.getElementById("accessCodeSection").style.display = "block";
    });
  }

  const verifyBtn = document.getElementById("verifyCodeBtn");
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

  const becomeBtn = document.getElementById("becomeMemberBtn");
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
});
