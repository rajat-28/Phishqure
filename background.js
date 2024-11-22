var malicious_site;
var SQLI;
var warned;
var uniqueArray=new Array();



async function sendURLtoflask(url,tabId)
{
  fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: url })  // Send the URL as input to the Flask server
})
.then(response => response.json())  // Parse the JSON response
.then(data => {
    console.log('Prediction:', data.prediction);  // Log the result
    // Here you can take further action based on the result
    if (data.prediction === 'Phishing') {
      console.log("Entered in the phising zone")
        // warned=true
        if(!uniqueArray.includes(url)){
          // console.log("hello inside the activeTab")
      storeURL(url)
      chrome.tabs.sendMessage(tabId,{msg:"warning"},(response)=>{
        // console.log(response.response)
      })}
    } else {
        warned=false
        console.log("url is safe")
      SafeSitevisted(url)  // this the call to the function which store the safe url that we visit 
    }
})
.catch(error => {
    console.error('Error fetching prediction from Flask server:', error);
});
}

function getwarnurl(){

  chrome.storage.local.get(['unwarnUrls'],(result)=>{
    // console.log(result.unwarnUrls)
    uniqueArray = [...new Set(result.unwarnUrls)];
    console.log(uniqueArray)
  })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get(['maliciousSiteChecked', 'sqlInjectionChecked'],function(result){
    malicious_site=result.maliciousSiteChecked ? true : false    
  })
  getwarnurl()
  // console.log(uniqueArray)
 if(malicious_site){ 
chrome.tabs.query({active:true,currentWindow:true},async function(tabs){
  var activeTab=tabs[0]
await sendURLtoflask(activeTab.url,tabId)
  
})}
    
  });


  // to send the Warning URLs
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  if(message.type==="warnURLs"){
    chrome.storage.local.get(['warnURLs'], (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ warnURLs: result.warnURLs || [] });
      }
    });
  }
  
    
  return true
})

function storeURL(url) {
  // Retrieve existing URLs from local storage
  chrome.storage.local.get(['warnURLs'], (result) => {
    // Initialize warnURLs if it doesn't exist
    let warnURLs = result.warnURLs || [];

    // Add the new URL with the current timestamp
    warnURLs.push(url);

    // Save the updated list back to local storage
    chrome.storage.local.set({ warnURLs: warnURLs }, () => {
      // console.log('URL stored:', url);
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