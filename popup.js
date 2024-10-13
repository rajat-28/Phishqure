// script.js

// Function to load and set the checkbox states from Chrome's local storage
function loadCheckboxStates() {
    const maliciousSiteCheckbox = document.getElementById('maliciousSiteCheckbox');
    const sqlInjectionCheckbox = document.getElementById('sqlInjectionCheckbox');

    // Fetch stored checkbox states from chrome.storage.local
    chrome.storage.local.get(['maliciousSiteChecked', 'sqlInjectionChecked'], function(result) {
        maliciousSiteCheckbox.checked = result.maliciousSiteChecked || false; // Default to false if not set
        sqlInjectionCheckbox.checked = result.sqlInjectionChecked || false;   // Default to false if not set
    });
}

// Function to save the checkbox state to Chrome's local storage
function saveCheckboxState(checkboxId, storageKey) {
    const checkbox = document.getElementById(checkboxId);
    const state = {};
    state[storageKey] = checkbox.checked;
    chrome.storage.local.set(state);
}
function sendReloadMessage() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "reloadPage"});
    });
}

// Event listeners to save the state when checkboxes are clicked
document.getElementById('maliciousSiteCheckbox').addEventListener('change', function() {
    saveCheckboxState('maliciousSiteCheckbox', 'maliciousSiteChecked');
    sendReloadMessage()
});

document.getElementById('sqlInjectionCheckbox').addEventListener('change', function() {
    saveCheckboxState('sqlInjectionCheckbox', 'sqlInjectionChecked');
    sendReloadMessage()
});

// Load the checkbox states when the page is loaded
window.onload = loadCheckboxStates;



