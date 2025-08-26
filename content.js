// Auto login for CU Internet
if (window.location.hostname === "172.16.2.1") {
  chrome.storage.local.get(["uid", "password"], (data) => {
    if (data.uid && data.password) {
      const usernameField = document.querySelector('input[name="username"]');
      const passwordField = document.querySelector('input[name="password"]');
      const loginBtn = document.querySelector('input[type="submit"]');

      if (usernameField && passwordField && loginBtn) {
        usernameField.value = data.uid;
        passwordField.value = data.password;
        loginBtn.click();
      }
    }
  });
}

//Utility to wait for an element until it appears
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsedTime = 0;

    const checkExist = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkExist);
        resolve(element);
      } else if (elapsedTime >= timeout) {
        clearInterval(checkExist);
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }
      elapsedTime += interval;
    }, interval);
  });
}

// Auto login for CLMS using waitForElement
if (window.location.hostname === "lms.cuchd.in") {
  chrome.storage.local.get(["uid", "cuimsPassword", "cuimsAutoLogin"], async (data) => {
    if (data.cuimsAutoLogin && data.uid && data.cuimsPassword) {
      if (sessionStorage.getItem("lmsLoginAttempted") === "true") return;

      try {
        const uidField = await waitForElement("#username");
        const pwdField = await waitForElement("#password");
        const loginBtn = await waitForElement("#loginbtn");

        uidField.value = data.uid;
        pwdField.value = data.cuimsPassword;
        sessionStorage.setItem("lmsLoginAttempted", "true");
        loginBtn.click();

        // Watch for login error
        const errorContainer = document.querySelector("#login");
        if (errorContainer) {
          const observer = new MutationObserver(() => {
            const errorBox = document.querySelector(".loginerrors");
            if (errorBox && errorBox.innerText.includes("Invalid login")) {
              // console.warn("Invalid login detected. Auto login will stop for this tab.");
              observer.disconnect();
            }
          });

          observer.observe(errorContainer, { childList: true, subtree: true });
        }

      } catch (error) {
        // console.warn("Auto login failed:", error.message);
      }
    }
  });
}
