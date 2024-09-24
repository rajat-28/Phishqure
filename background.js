var malicious_site;
var SQLI;
var warned=true
var uniqueArray=new Array();

function getwarnurl(){

  chrome.storage.local.get(['unwarnUrls'],(result)=>{
    // console.log(result.unwarnUrls)
    uniqueArray = [...new Set(result.unwarnUrls)];
    console.log(uniqueArray)
  })
}
  

// (()=>{
// chrome.storage.local.get(['maliciousSiteChecked', 'sqlInjectionChecked']),function(result){
//   console.log(`result of the site ${result.maliciousSiteChecked}`)
//   console.log(`result of the SQL Injection ${result.sqlInjectionChecked}`)
// }
// })()



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get(['maliciousSiteChecked', 'sqlInjectionChecked'],function(result){
    malicious_site=result.maliciousSiteChecked ? true : false    
  })
  getwarnurl()
  console.log(uniqueArray)
 if(malicious_site){ 
chrome.tabs.query({active:true,currentWindow:true},async function(tabs){
  var activeTab=tabs[0]
  if(activeTab.url.startsWith("http:")){
    if(!uniqueArray.includes(activeTab.url)){
      // console.log("hello inside the activeTab")
  storeURL(activeTab.url)
   await chrome.tabs.sendMessage(tabId,{msg:"warning"},(response)=>{
    // console.log(response.response)
  })}
  }
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
