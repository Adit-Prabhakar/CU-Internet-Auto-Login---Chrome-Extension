// Prevent auto-login immediately after CUIMS logout
if (
  document.referrer.includes("StudentHome.aspx") &&
  window.location.pathname.includes("Login.aspx")
) {
  sessionStorage.setItem("cuimsJustLoggedOut", "true");
  setTimeout(() => {
    sessionStorage.removeItem("cuimsJustLoggedOut");
  }, 10000);
}

// Prevent auto-login if redirected CUIMS from LMS logout
if (
  document.referrer.includes("lms.cuchd.in") &&
  window.location.pathname.includes("Login.aspx")
) {
  sessionStorage.setItem("cuimsJustLoggedOut", "true");
  setTimeout(() => {
    sessionStorage.removeItem("cuimsJustLoggedOut");
  }, 10000);
}

(() => {
  if (window.cuimsAutoLoginLoaded) return;
  window.cuimsAutoLoginLoaded = true;

  const CONFIG = {
    CAPTCHA_SELECTOR: "img[src*='GenerateCaptcha.aspx']",
    REFRESH_TIMEOUT: 3000,
    OCR_TIMEOUT: 10000,
    OCR_API_KEYS: [
      "K82532878988957", //api 1
      "K81632801188957", //api 2
      "K83010458188957", //api 3
      "K87034556588957", //api 4
      "K81680094288957", //api 5
      "K84396053188957" //api 6
    ],
    OCR_API_URL: "https://api.ocr.space/parse/image"
  };

  const getOcrCount = () =>
    parseInt(sessionStorage.getItem("ocrAttemptsCuims") || "0", 10);

  const incrementOcrCount = () =>
    sessionStorage.setItem("ocrAttemptsCuims", (getOcrCount() + 1).toString());

  const getRandomAPIKey = () =>
    CONFIG.OCR_API_KEYS[Math.floor(Math.random() * CONFIG.OCR_API_KEYS.length)];

  const waitForElement = (selector, timeout = 10000) =>
    new Promise((resolve, reject) => {
      const start = Date.now();
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        } else if (Date.now() - start > timeout) {
          observer.disconnect();
          reject();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

  const notifyUser = (msg) => {
    const banner = document.createElement("div");
    banner.textContent = msg;
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff4d4f;
      color: white;
      padding: 10px;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      z-index: 9999;
      font-family: sans-serif;
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 12000);
  };

  const solveCaptcha = async (imgElement, callback) => {
    let retryCount = 0;

    while (retryCount < 3) {
      if (getOcrCount() >= 3) {
        notifyUser("Auto-login stopped: CAPTCHA limit reached for this tab.\n SORRY! You have to Enter CAPTCHA manually");
        return;
      }

      try {
        const captchaText = await Promise.race([
          extractTextFromImage(imgElement),
          new Promise((_, r) => setTimeout(r, CONFIG.OCR_TIMEOUT, "OCR timeout"))
        ]);

        incrementOcrCount();

        if (/^[a-z0-9]{4}$/i.test(captchaText)) {
          callback(captchaText);
          return;
        }

        retryCount++;
        await refreshCaptcha(imgElement);
        imgElement = await waitForElement(CONFIG.CAPTCHA_SELECTOR);
      } catch {
        retryCount++;
        incrementOcrCount();

        if (getOcrCount() >= 3) {
          notifyUser("Auto-login stopped: CAPTCHA limit reached for this tab.\nOr you may have entered the wrong UID or CUIMS password on the Setup page.");
          return;
        }
      }
    }

    notifyUser("Auto-login failed after multiple CAPTCHA attempts,\nSORRY! You have to Enter CAPTCHA manually");
  };

  const refreshCaptcha = async (imgElement) => {
    try {
      const newSrc = `${imgElement.src.split('?')[0]}?t=${Date.now()}`;
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = reject;
        imgElement.src = newSrc;
        setTimeout(reject, CONFIG.REFRESH_TIMEOUT);
      });
    } catch {
      document.querySelector("#lnkupCaptcha")?.click();
      await waitForElement(CONFIG.CAPTCHA_SELECTOR);
    }
  };

  const extractTextFromImage = async (imgElement) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = imgElement.width;
      canvas.height = imgElement.height;

      ctx.filter = "contrast(150%) brightness(110%) grayscale(100%)";
      ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

      const imageData = canvas.toDataURL("image/png");

      const response = await fetch(CONFIG.OCR_API_URL, {
        method: "POST",
        headers: {
          "apikey": getRandomAPIKey(),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          base64Image: imageData,
          language: "eng",
          OCREngine: "2",
          scale: "true",
          isTable: "false"
        })
      });

      const data = await response.json();
      return data.ParsedResults?.[0]?.ParsedText?.trim().slice(0, 4) || "";
    } catch {
      return "";
    }
  };

  const loginUser = async (userId, password) => {
    if (getOcrCount() >= 3) {
      notifyUser("Auto-login stopped: CAPTCHA limit reached for this tab.\nOr you may have entered the wrong UID or CUIMS password on the Setup page.");
      return;
    }

    try {
      const isPasswordPage = !!document.querySelector("#txtLoginPassword");

      const [firstField, nextButton] = await Promise.all([
        waitForElement(isPasswordPage ? "#txtLoginPassword" : "#txtUserId"),
        waitForElement(isPasswordPage ? CONFIG.CAPTCHA_SELECTOR : 'input[name="btnNext"]')
      ]);

      firstField.value = isPasswordPage ? password : userId;

      if (isPasswordPage) {
        await solveCaptcha(nextButton, async (text) => {
          const [captchaInput, loginBtn] = await Promise.all([
            waitForElement("#txtcaptcha"),
            waitForElement('input[name="btnLogin"]')
          ]);
          captchaInput.value = text;
          loginBtn.click();
        });
      } else {
        nextButton.click();
      }
    } catch {
      incrementOcrCount();
    }
  };

  chrome.storage.local.get(["cuimsAutoLogin", "uid", "cuimsPassword"], (data) => {
    if (!data.cuimsAutoLogin || !data.uid || !data.cuimsPassword) return;
    if (sessionStorage.getItem("cuimsJustLoggedOut") === "true") return;
    requestIdleCallback(() => loginUser(data.uid, data.cuimsPassword));
  });
})();
