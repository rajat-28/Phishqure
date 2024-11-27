
var malicious_site;
var SQLI;
var warned;
var uniqueArray = new Array();
let maliciousSiteCount = 0;  // Track malicious sites
let safeSiteCount = 0;       // Track safe sites

async function sendURLtoflask(url, tabId) {
  fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: url })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Prediction:', data.prediction);
    if (data.prediction === 'Phishing') {
      console.log("Entered the phishing zone");
      if (!uniqueArray.includes(url)) {
        storeURL(url);
        maliciousSiteCount++;
        chrome.storage.local.set({ maliciousSiteCount }, () => {
          console.log("Malicious site count updated.");
        });
        chrome.tabs.sendMessage(tabId, { msg: "warning" });
      }
    } else {
      safeSiteCount++;
      chrome.storage.local.set({ safeSiteCount }, () => {
        console.log("Safe site count updated.");
        warned=false
        console.log("url is safe")
      SafeSitevisted(url) 
      });
    }
  })
  .catch(error => {
    console.error('Error fetching prediction from Flask server:', error);
  });
}

function getwarnurl() {
  chrome.storage.local.get(['unwarnUrls'], (result) => {
    uniqueArray = [...new Set(result.unwarnUrls)];
    console.log(uniqueArray);
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get(['maliciousSiteChecked', 'sqlInjectionChecked'], function(result) {
    malicious_site = result.maliciousSiteChecked ? true : false;
  });
  getwarnurl();
  if (malicious_site) { 
    chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
      var activeTab = tabs[0];
      await sendURLtoflask(activeTab.url, tabId);
    });
  }
});

// Send warning URLs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "warnURLs") {
    chrome.storage.local.get(['warnURLs'], (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ warnURLs: result.warnURLs || [] });
      }
    });
  }
  return true;
});

function storeURL(url) {
  chrome.storage.local.get(['warnURLs'], (result) => {
    let warnURLs = result.warnURLs || [];
    warnURLs.push(url);
    chrome.storage.local.set({ warnURLs: warnURLs }, () => {
      console.log('URL stored:', url);
    });
  });
}

function SafeSitevisted(url){   // it is the function that store the safe urls
  console.log("the safe site function is called")
  chrome.storage.local.get(['safeUrlVisit'],(result)=>{
    let safeUrl= result.safeUrlVisit || []
    safeUrl.push(url)
    chrome.storage.local.set({safeUrlVisit:safeUrl})
    console.log(safeUrl)
  })
}