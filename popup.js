document.addEventListener("DOMContentLoaded", () => {
  const cuimsToggle = document.getElementById("cuimsAutoLoginToggle");
  const cuimsLinks = document.getElementById("cuimsLinks");
  const cuimsMessage = document.getElementById("cuimsMessage");

  // Load saved toggle state and password
  chrome.storage.local.get(["cuimsAutoLogin", "cuimsPassword"], (data) => {
    const isEnabled = data.cuimsAutoLogin || false;
    const hasPassword = !!data.cuimsPassword;

    cuimsToggle.checked = isEnabled;
    cuimsLinks.style.display = isEnabled ? "block" : "none";
    cuimsMessage.style.display = isEnabled && !hasPassword ? "block" : "none";
  });

  // On toggle change
  cuimsToggle.addEventListener("change", () => {
    const isChecked = cuimsToggle.checked;

    chrome.storage.local.set({ cuimsAutoLogin: isChecked }, () => {
      chrome.storage.local.get("cuimsPassword", (data) => {
        const hasPassword = !!data.cuimsPassword;

        cuimsLinks.style.display = isChecked ? "block" : "none";
        cuimsMessage.style.display = isChecked && !hasPassword ? "block" : "none";
      });
    });
  });
});
