// login.js
document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission

  const email = document.getElementById("email").value.trim();
  const password = ""; // Empty because password is not being used yet

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // Sending email, no password for now
    });

    const data = await res.json();
    if (res.ok) {
      alert("Login successful!");
      window.location.href = "landing.html"; // Redirect after successful login
    } else {
      alert(data.error); // Display error if login fails
    }
  } catch (err) {
    console.error("❌ Login failed:", err);
    alert("Login failed, please try again later.");
  }
});
