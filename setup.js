document.addEventListener("DOMContentLoaded", () => {
  const uidInput = document.getElementById("uid"); // Student UID same for LMS and CUIMS
  const passwordInput = document.getElementById("password"); // Internet password
  const cuimsPasswordInput = document.getElementById("cuimsPassword"); // LMS & CUIMS password
  const showPasswordCheckbox = document.getElementById("showPassword");
  const status = document.getElementById("status");

  // Load saved credentials
  chrome.storage.local.get(["uid", "password", "cuimsPassword", "cuimsAutoLogin"], (data) => {
    if (data.uid) uidInput.value = data.uid;
    if (data.password) passwordInput.value = data.password;
    if (data.cuimsPassword) cuimsPasswordInput.value = data.cuimsPassword;
  });

  // Save credentials
  document.getElementById("saveBtn").addEventListener("click", () => {
    const uid = uidInput.value.trim();
    const password = passwordInput.value.trim();
    const cuimsPassword = cuimsPasswordInput.value.trim();

    if (uid && (password || cuimsPassword)) {
      chrome.storage.local.set({
        uid,
        password,
        cuimsPassword
      }, () => {
        status.textContent = "Saved successfully!";
        status.className = "success";
        setTimeout(() => {
          status.textContent = "";
          window.close();
        }, 1000);
      });
    } else {
      status.textContent = "Please enter UID and at least One Password.";
      status.className = "error";
    }
  });


  // Toggle password visibility
  showPasswordCheckbox.addEventListener("change", () => {
    const type = showPasswordCheckbox.checked ? "text" : "password";
    passwordInput.type = type;
    cuimsPasswordInput.type = type;
  });

  // Press Enter key to submit
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("saveBtn").click();
    }
  });
});
