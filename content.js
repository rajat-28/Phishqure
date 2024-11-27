

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    console.log(`message from background.js ${message.msg}`)
    if(message.action === 'reloadPage'){
      console.log("message from the popup.js in the background")
      location.reload()
    }
    if (message.msg === 'warning') {
      // Check if the overlay is already present
      if (!document.getElementById('http-warning-overlay')) {       
        // content.js
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
img.src = chrome.runtime.getURL('warning.png');  // Get the correct URL for the image
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
  window.history.back();  // Navigate back
});

continueButton.addEventListener('click', () => {
  messageDiv.remove();  // Remove the warning
});

      }
    }
    if(chrome.runtime.lastError){
      console.error('Error sending message to content script:', chrome.runtime.lastError.message);
      return false
    }
    sendResponse({response:"message sent to the content.js"})
    return true
  })


// for the form checking 
var sqli_site
chrome.storage.local.get(['sqlInjectionChecked'],function(result){
  sqli_site=result.sqlInjectionChecked ? true : false    
  console.log(`sqli box is ${sqli_site}`)
})
// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(event.target);
  const username = formData.get('username'); // Replace with the actual username field name
  const password = formData.get('password'); // Replace with the actual password field name

  // Send data to the backend
  if(sqli_site){
  fetch('http://localhost:5000/submit', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
  })
  .then(response => response.json())
  .then(data => {
      if(data.username==="Warn" || data.password==="Warn"){
        // alert("This is the malicious query your info will not be submited")
        showWarningPopup(
          "This is a malicious query. You can not continue further!!",
          
          () => {
              // User cancels
              console.log("User chose to cancel.");
          }
      );
        // location.reload()

      }
      else{
        event.target.submit()
        location.reload()
      }
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}
  // Optionally, you can still submit the form if needed
  // event.target.submit();
}

// Attach event listeners to all forms
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', handleFormSubmit);
});
function showWarningPopup(message, onCancel) {
  // Check if the popup is already present
  if (document.getElementById('warning-popup')) {
      return;
  }

  // Create the overlay for warning popup
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

  // Create the popup container
  const popup = document.createElement('div');
  popup.id = 'warning-popup';
  popup.style.width = '300px';
  popup.style.padding = '20px';
  popup.style.backgroundColor = 'white';
  popup.style.borderRadius = '16px';
  popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  popup.style.textAlign = 'center';
  popup.style.fontFamily = `'Arial', sans-serif`;

  // Add icon
  const icon = document.createElement('div');
    icon.style.width = '100px';
    icon.style.height = '100px';
    icon.style.margin = '0 auto';
    icon.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/128/6897/6897039.png")'; // Replace with the Oops!! icon image URL
    icon.style.backgroundSize = 'contain';
    icon.style.backgroundRepeat = 'no-repeat';
    popup.appendChild(icon);


  // Add warning message
  const warningText = document.createElement('p');
  warningText.textContent = message;
  warningText.style.marginTop = '20px';
  warningText.style.color = '#FF5252'; // Red color for Oops message
  warningText.style.fontWeight = 'bold';
  popup.appendChild(warningText);

  // Add buttons
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Close';
  cancelButton.style.marginTop = '20px';
  cancelButton.style.padding = '10px 20px';
  cancelButton.style.backgroundColor = '#FF5252'; // Red button
  cancelButton.style.color = 'white';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '8px';
  cancelButton.style.fontSize = '16px';
  cancelButton.style.cursor = 'pointer';
  cancelButton.style.fontWeight = 'bold';

  // Append elements
  popup.appendChild(cancelButton);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Add event listeners
  cancelButton.addEventListener('click', () => {
      if (onCancel) onCancel();
      document.body.removeChild(overlay);
      location.reload(); // Reload the page
  });
}


