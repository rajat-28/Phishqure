chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`Message from background.js: ${message.msg}`);
  
  if (message.action === 'reloadPage') {
    console.log("Message from the popup.js in the background");
    location.reload();
  }

  if (message.msg === 'warning') {
    if (!document.getElementById('http-warning-overlay')) {
      // Create the main warning container
      const messageDiv = document.createElement('div');
      messageDiv.style.position = 'fixed';
      messageDiv.style.top = '0';
      messageDiv.style.left = '0';
      messageDiv.style.width = '100%';
      messageDiv.style.height = '100%';
      messageDiv.style.backgroundColor = 'white';
      messageDiv.style.color = 'black';
      messageDiv.style.zIndex = '9999';
      messageDiv.style.display = 'flex';
      messageDiv.style.flexDirection = 'column';
      messageDiv.style.justifyContent = 'center';
      messageDiv.style.alignItems = 'center';

      // Create the image element
      const img = document.createElement('img');
      img.src = chrome.runtime.getURL('warning.png');
      img.style.height = '200px';
      img.alt = 'Warning Image';

      // Create the warning message and buttons
      const heading = document.createElement('h1');
      heading.textContent = 'Warning: Unsecured Website';

      const paragraph = document.createElement('p');
      paragraph.textContent = 'You are about to visit a non-secure (HTTP) website.';

      const goBackButton = document.createElement('button');
      goBackButton.textContent = 'Go Back';
      goBackButton.style.marginRight = '10px';

      const continueButton = document.createElement('button');
      continueButton.textContent = 'Continue to Website';

      // Append elements to the warning container
      messageDiv.appendChild(img);
      messageDiv.appendChild(heading);
      messageDiv.appendChild(paragraph);
      messageDiv.appendChild(goBackButton);
      messageDiv.appendChild(continueButton);

      // Append the warning container to the body
      document.body.appendChild(messageDiv);

      // Add event listeners to the buttons
      goBackButton.addEventListener('click', () => {
        window.history.back(); // Navigate back
      });

      continueButton.addEventListener('click', () => {
        messageDiv.remove(); // Remove the warning
      });
    }
  }

  if (chrome.runtime.lastError) {
    console.error('Error sending message to content script:', chrome.runtime.lastError.message);
    return false;
  }

  sendResponse({ response: "Message sent to content.js" });
  return true;
});

// Form submission handling
let sqliSite;
chrome.storage.local.get(['sqlInjectionChecked'], (result) => {
  sqliSite = result.sqlInjectionChecked ? true : false;
  console.log(`SQLi check is ${sqliSite}`);
});

function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');

  if (sqliSite) {
    fetch('http://localhost:5000/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.username === "Warn" || data.password === "Warn") {
          alert("This is a malicious query. Your info will not be submitted.");
          location.reload();
        } else {
          event.target.submit();
          location.reload();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

// Attach event listeners to all forms
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', handleFormSubmit);
});

// Unified warning popup
function showWarningPopup(message, onCancel) {
  if (document.getElementById('warning-popup')) return;

  const overlay = document.createElement('div');
  overlay.id = 'warning-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  const popup = document.createElement('div');
  popup.id = 'warning-popup';
  popup.style.width = '400px';
  popup.style.padding = '20px';
  popup.style.backgroundColor = 'white';
  popup.style.borderRadius = '8px';
  popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  popup.style.textAlign = 'center';

  const icon = document.createElement('div');
  icon.style.width = '100px';
  icon.style.height = '100px';
  icon.style.margin = '0 auto';
  icon.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/128/6897/6897039.png")';
  icon.style.backgroundSize = 'contain';
  icon.style.backgroundRepeat = 'no-repeat';

  const warningText = document.createElement('p');
  warningText.textContent = message;
  warningText.style.marginTop = '20px';
  warningText.style.color = '#FF5252';
  warningText.style.fontWeight = 'bold';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Close';
  cancelButton.style.marginTop = '20px';
  cancelButton.style.padding = '10px 20px';
  cancelButton.style.backgroundColor = '#FF5252';
  cancelButton.style.color = 'white';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '8px';
  cancelButton.style.fontSize = '16px';
  cancelButton.style.cursor = 'pointer';

  popup.appendChild(icon);
  popup.appendChild(warningText);
  popup.appendChild(cancelButton);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  cancelButton.addEventListener('click', () => {
    if (onCancel) onCancel();
    document.body.removeChild(overlay);
    location.reload();
  });
}
