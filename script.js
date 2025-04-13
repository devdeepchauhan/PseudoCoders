document.addEventListener("DOMContentLoaded", () => {
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const createWalletBtn = document.getElementById("createWalletBtn");
  const finalSignUpBtn = document.getElementById("finalSignUpBtn");

  const otpInput = document.getElementById("otp");
  const otpStatus = document.getElementById("otpStatus");
  const message = document.getElementById("message");
  const keysDiv = document.getElementById("keys");

  let userData = {};
  let otpVerified = false;
  let keysGenerated = false;

  // Step 1️⃣ Send OTP
  sendOtpBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    if (!email) {
      message.innerText = "❌ Please enter your email.";
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        // Change the button to a message
        sendOtpBtn.innerText = "OTP sent to your email!";
        sendOtpBtn.disabled = true;  // Disable the button after sending OTP

        message.innerText = data.message;

        // Show OTP input and verify button after sending OTP
        otpInput.style.display = "inline-block";
        verifyOtpBtn.style.display = "inline-block";
      } else {
        message.innerText = `❌ ${data.error}`;
      }
    } catch (err) {
      message.innerText = `❌ Network error: ${err.message}`;
    }
  });

  // Step 2️⃣ Verify OTP only (no wallet yet)
  verifyOtpBtn.addEventListener("click", async () => {
    // Clear the OTP sent message when verifying OTP
    message.innerText = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const otp = otpInput.value.trim();

    if (!name || !email || !password || !role || !otp) {
      message.innerText = "❌ Please fill all fields and enter OTP.";
      return;
    }

    userData = { name, email, password, role, otp };

    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        otpVerified = true;
        otpStatus.innerText = "✅ OTP verified!";
        message.innerText = "✅ OTP verified. Now click Create Wallet.";
        
        createWalletBtn.style.display = "inline-block";

        // Save keys for later (used when wallet is created)
        userData.publicKey = data.publicKey;
        userData.secretKey = data.secretKey;
      } else {
        otpStatus.innerText = "❌ OTP verification failed.";
        message.innerText = "❌ OTP verification failed. Please try again.";
      }
    } catch (err) {
      otpStatus.innerText = `❌ Network error: ${err.message}`;
    }
  });

  // Step 3️⃣ Show wallet after verifying OTP
  createWalletBtn.addEventListener("click", () => {
    if (!otpVerified || !userData.publicKey || !userData.secretKey) {
      message.innerText = "❌ OTP not verified or keys missing.";
      return;
    }

    keysGenerated = true;
    message.innerText = "✅ Wallet created successfully! Copy your keys.";
    keysDiv.innerText = `🔑 Public Key: ${userData.publicKey}\n🗝️ Secret Key: ${userData.secretKey}\n⚠️ Please store these keys securely.`;

    finalSignUpBtn.style.display = "inline-block";
  });

  // Step 4️⃣ Final Sign-Up Completion
  finalSignUpBtn.addEventListener("click", () => {
    if (!otpVerified || !keysGenerated) {
      message.innerText = "❌ Complete all steps before signing up.";
      return;
    }

    // Show success alert for sign-up
    alert("✅ Sign Up Successful!");

    // After alert, redirect the user
    window.location.href = "signup-success.html";
  });
});
