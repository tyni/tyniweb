// access.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("accessForm");
  const verifyBtn = document.getElementById("verifyCodeBtn");
  const becomeBtn = document.getElementById("becomeMemberBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Generate a daily access code based on date
  function generateDailyCode() {
    const now = new Date();
    const code = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    return code;
  }

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

      const code = generateDailyCode();
      sessionStorage.setItem("accessCode", code);
      sessionStorage.setItem("accessGranted", "false");

      try {
        await fetch("https://tynisigns.com/proxy.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            type: "access",
            name,
            email,
            code
          })
        });

        document.getElementById("accessCode").textContent = code;
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
      const input = document.getElementById("codeInput").value.trim();
      const expected = generateDailyCode();
      if (input === expected) {
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
        const banner = document.getElementById("memberBanner");
        if (banner) banner.style.display = "none";
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
