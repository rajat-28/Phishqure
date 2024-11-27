// const checkedUrls= new Array()


// chrome.storage.local.get(['unwarnUrls'],(result)=>{
//     if(!result){
//         chrome.storage.local.set({unwarnUrls:[]})
//     }
//     else{
//         // console.log(result.unwarnUrls)
//     }
// })

// chrome.storage.local.get(['warnURLs','unwarnUrls'],function(result){
//     const {warnURLs}=result
//     const uniqueArray2 = [...new Set(result.unwarnUrls)]
//     // console.log(`warned urls are ${}`)
//     const uniqueArray = [...new Set(result.warnURLs)];
//     // console.log(`the warnUrls are ${warnURLs.url}`)
//     // console.log(uniqueArray)

//     // displaying the warned urls
//     const displayDiv = document.getElementById('warnURLs');
//         uniqueArray.forEach(url => {
//             const b=document.createElement('input')
//             b.type='checkbox'
//             b.id=`checkbox-${url}`
//             b.name='mycheckbox'
//             b.value=url

//             // check if the box is checked or not
//             b.addEventListener('change',(event)=>{
//                 if(event.target.checked){
//                     console.log("added")
//                     console.log(typeof(url))
//                     checkedUrls.push(url);
//                 }
//                 else{
//                     let index = array.indexOf(elementToRemove);

//                     // If the element exists in the array, remove it
//                     if (index !== -1) {
//                         array.splice(index, 1);
//                     }
//                 }
//             })
// // display the url on the screen
//             const p = document.createElement('p');
//             p.textContent = url;
//             const container = document.createElement('div');
//             container.style.display = 'flex'; // To align checkbox and text inline
//             container.style.alignItems = 'center'; // Center align items

//             // Append checkbox and paragraph to the container
//             container.appendChild(b);
//             container.appendChild(p);

//             // Append the container to the display div
//             displayDiv.appendChild(container);
//         });
//     const displayDiv2=document.getElementById('unwarnUrls')
//     if(!checkedUrls){
//         displayDiv2.innerHTML="<i>There is no url in non warning list</i>"
//     }
//     else{
//         uniqueArray2.forEach(
//             url=>{
//                 const p2=document.createElement('p')
//                 p2.textContent=url
//                 const container2=document.createElement('div')
//                 container2.style.display='flex'
//                 container2.style.alignItems='center'
//                 // container2.appendChild(unc)
//                 container2.appendChild(p2)
//                 displayDiv2.appendChild(container2)
                
//             }
//         )
//     }



// })
// const form=document.getElementById('urlform')
// form.addEventListener('submit',(e)=>{
//     // e.preventDefault()
//     // console.log(checkedUrls)

//     chrome.storage.local.get(['warnURLs','unwarnUrls'],(result)=>{
//     let  {warnURLs,unwarnUrls}=result
//     console.log(warnURLs)
//     console.log(unwarnUrls)
// let UpdatedwarnUrl = warnURLs.filter(url => !checkedUrls.includes(url))
// let newlyRemvoved=warnURLs.filter(url=>checkedUrls.includes(url))
// UpdatedwarnUrl = [...new Set(UpdatedwarnUrl)];
// newlyRemvoved = [...new Set(newlyRemvoved)];

// console.log(`updated warn url are ${UpdatedwarnUrl}`)
// console.log(`newly removed url are ${newlyRemvoved.item}`)

// if(!unwarnUrls){
// unwarnUrls=newlyRemvoved

// }
// else{
//     unwarnUrls=[...unwarnUrls,...newlyRemvoved]

// }
// chrome.storage.local.set({warnURLs:UpdatedwarnUrl,unwarnUrls:unwarnUrls},()=>{
//     // console.log("value changed")
// })
//     })
// })

// const button=document.getElementById("unwarn_clear")

// button.addEventListener("click",function clearunwarn(){
//     chrome.storage.local.set({unwarnUrls:[]},()=>{
//         alert("Your all warned url have been erased")
//         location.reload()
//     })

// })





const checkedUrls = new Array();

// Initialize `unwarnUrls` if not set
chrome.storage.local.get(['unwarnUrls'], (result) => {
  if (!result.unwarnUrls) {
    chrome.storage.local.set({ unwarnUrls: [] });
  }
});

// Fetch and display warned and unwarned URLs
chrome.storage.local.get(['warnURLs', 'unwarnUrls'], function(result) {
  const uniqueWarnURLs = [...new Set(result.warnURLs || [])];
  const uniqueUnwarnURLs = [...new Set(result.unwarnUrls || [])];

  // Display warned URLs
  const displayDiv = document.getElementById('warnURLs');
  uniqueWarnURLs.forEach(url => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox-${url}`;
    checkbox.name = 'mycheckbox';
    checkbox.value = url;

    checkbox.addEventListener('change', (event) => {
      if (event.target.checked) {
        checkedUrls.push(url);
      } else {
        const index = checkedUrls.indexOf(url);
        if (index !== -1) checkedUrls.splice(index, 1);
      }
    });

    const p = document.createElement('p');
    p.textContent = url;
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.appendChild(checkbox);
    container.appendChild(p);

    displayDiv.appendChild(container);
  });

  // Display unwarned URLs
  const displayDiv2 = document.getElementById('unwarnUrls');
  if (uniqueUnwarnURLs.length === 0) {
    displayDiv2.innerHTML = "<i>No URLs in the non-warning list</i>";
  } else {
    uniqueUnwarnURLs.forEach(url => {
      const p2 = document.createElement('p');
      p2.textContent = url;
      const container2 = document.createElement('div');
      container2.style.display = 'flex';
      container2.style.alignItems = 'center';
      container2.appendChild(p2);
      displayDiv2.appendChild(container2);
    });
  }
});

// Form submission to update `warnURLs` and `unwarnUrls`
const form = document.getElementById('urlform');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  chrome.storage.local.get(['warnURLs', 'unwarnUrls'], (result) => {
    let warnURLs = result.warnURLs || [];
    let unwarnUrls = result.unwarnUrls || [];

    const updatedWarnURLs = warnURLs.filter(url => !checkedUrls.includes(url));
    const newlyRemovedURLs = warnURLs.filter(url => checkedUrls.includes(url));

    unwarnUrls = [...new Set([...unwarnUrls, ...newlyRemovedURLs])];

    chrome.storage.local.set({ warnURLs: updatedWarnURLs, unwarnUrls: unwarnUrls }, () => {
      console.log("URL lists updated.");
    });
  });
});

// Clear unwarned URLs
const button = document.getElementById("unwarn_clear");
button.addEventListener("click", function clearUnwarn() {
  chrome.storage.local.set({ unwarnUrls: [] }, () => {
    alert("All unwarned URLs have been erased.");
    location.reload();
  });
});

// Fetch and display percentages of safe and malicious sites
// Function to fetch and display percentages of safe and malicious sites
function displaySitePercentages() {
  chrome.storage.local.get(['warnURLs', 'safeUrlVisit'], (result) => {
      const warnedUrls = result.warnURLs || [];
      const unwarnedUrls = result.safeUrlVisit || [];
      
      const totalUrls = warnedUrls.length + unwarnedUrls.length;
      let maliciousPercentage = 0;
      let safePercentage = 0;

      if (totalUrls > 0) {
          maliciousPercentage = ((warnedUrls.length / totalUrls) * 100).toFixed(2);
          safePercentage = ((unwarnedUrls.length / totalUrls) * 100).toFixed(2);
      }

      // Update the displayed percentages on main.html
      document.querySelector('.cs-stat .cs-number').textContent = `${safePercentage}%`;
      document.querySelector('.cs-stat:last-child .cs-number').textContent = `${maliciousPercentage}%`;
  });
}

// Refresh the percentages on page load and whenever storage changes
document.addEventListener('DOMContentLoaded', displaySitePercentages);
chrome.storage.onChanged.addListener(displaySitePercentages);
