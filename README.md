# 💻 CU Internet Auto Login Extension

This Chrome extension **automatically logs you into the Chandigarh University Internet Authentication Portal, CUIMS & LMS** and provides a quick **logout option for Internet Logout** via a popup.

---

## 🔧 How to Install in Google Chrome

1. **Download** or **clone** this repository to your computer.

2. Open Google Chrome and go to:  
   `chrome://extensions/`

3. Enable **Developer Mode** (toggle in the top-right corner).

4. Click **“Load unpacked”** and select the folder where the extension files are located.

5. You will now see the **CU Internet Auto Login** extension added to your browser.

---

## ✏️ How to Set Your UID and Password

1. Click the extension icon in your Chrome toolbar.  
   *(Pin it if needed to keep it visible.)*

2. In the popup, click on **“Setup”**.

3. Enter your **Student UID**, **Internet Password** and **CUIMS Password**.

4. Click **Save**.

✅ Once saved, your credentials are securely stored in Chrome's local storage, so you don’t need to re-enter them every time — even after restarting your browser or PC.

---

## 🚀 Features

- 🔐 Auto-login to CU Internet Portal
- 🔐 Auto-login to CUIMS and LMS  
- 📤 One-click Internet Logout  
- 💾 Save UID & Password securely using Chrome Storage  
- 🖱️ Easy-to-use Popup UI  
- ⌨️ Keyboard shortcut to launch popup (Ctrl + Shift + Y)

---

## ⌨️ Keyboard Shortcut (Auto-Set)

You can quickly open the **CU Internet Auto Login** popup using the keyboard shortcut:

> **Ctrl + Shift + Y**

✅ This shortcut is already **pre-configured** in the extension — no need to set manually.

If you want to change it:

1. Go to `chrome://extensions/shortcuts`  
2. Find **CU Internet Auto Login**  
3. Modify the shortcut as per your preference
---

## 🔒 Security Note

- Your UID and password are stored securely using Chrome's local storage API.
- Credentials are used **only locally** and **never sent to any external server**.
- You can always update or delete your credentials from the setup page.

---

## 📁 Project Structure

```text
CU-Internet-Auto-Login/
├── background.js
├── content.js
├── cuimslogin.js
├── popup.html
├── popup.js
├── setup.html
├── setup.js
├── update.html
├── icon.png
├── cuims.png
├── lms.png
├── manifest.json
└── README.md
```

---

## 💡 Notes

- The extension works only on CU Internet portal.
- Works with both **Chrome** and **Edge** browsers.
- For security, passwords are not visible once saved.

---

## 🔐 Disclaimer

This extension is developed for educational purposes only. You are responsible for your usage and data security.

---

> Made with ❤️ for Chandigarh University students.


