
// chrome.runtime.sendMessage({
// type:"confirm"
// },(response)=>{
//   console.log(response.Response)
// })

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    console.log(`message from background.js ${message.msg}`)
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
  
