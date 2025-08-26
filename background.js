//Automatically close the authentication login page after successful login.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    (tab.url.includes("172.16.2.1:1000/logout") || tab.url.includes("172.16.2.1:1000/keepalive")) 
  ) {

    setTimeout(() => {
      chrome.tabs.remove(tabId);
    }, 500);
  }
});

//Open Update page when system detects any extention update.
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "update") {
    setTimeout(() => {
      // chrome.tabs.create({ url: "update.html" });
      chrome.tabs.create({ url: "feedback.html" });
    }, 5000); 
  }
});


