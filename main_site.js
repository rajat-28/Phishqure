const checkedUrls= new Array()


chrome.storage.local.get(['unwarnUrls'],(result)=>{
    if(!result){
        chrome.storage.local.set({unwarnUrls:[]})
    }
    else{
        // console.log(result.unwarnUrls)
    }
})

chrome.storage.local.get(['warnURLs','unwarnUrls'],function(result){
    const {warnURLs}=result
    const uniqueArray2 = [...new Set(result.unwarnUrls)]
    // console.log(`warned urls are ${}`)
    const uniqueArray = [...new Set(result.warnURLs)];
    // console.log(`the warnUrls are ${warnURLs.url}`)
    // console.log(uniqueArray)

    // displaying the warned urls
    const displayDiv = document.getElementById('warnURLs');
        uniqueArray.forEach(url => {
            const b=document.createElement('input')
            b.type='checkbox'
            b.id=`checkbox-${url}`
            b.name='mycheckbox'
            b.value=url

            // check if the box is checked or not
            b.addEventListener('change',(event)=>{
                if(event.target.checked){
                    console.log("added")
                    console.log(typeof(url))
                    checkedUrls.push(url);
                }
                else{
                    let index = array.indexOf(elementToRemove);

                    // If the element exists in the array, remove it
                    if (index !== -1) {
                        array.splice(index, 1);
                    }
                }
            })
// display the url on the screen
            const p = document.createElement('p');
            p.textContent = url;
            const container = document.createElement('div');
            container.style.display = 'flex'; // To align checkbox and text inline
            container.style.alignItems = 'center'; // Center align items

            // Append checkbox and paragraph to the container
            container.appendChild(b);
            container.appendChild(p);

            // Append the container to the display div
            displayDiv.appendChild(container);
        });
    const displayDiv2=document.getElementById('unwarnUrls')
    if(!checkedUrls){
        displayDiv2.innerHTML="<i>There is no url in non warning list</i>"
    }
    else{
        uniqueArray2.forEach(
            url=>{
                const p2=document.createElement('p')
                p2.textContent=url
                const container2=document.createElement('div')
                container2.style.display='flex'
                container2.style.alignItems='center'
                // container2.appendChild(unc)
                container2.appendChild(p2)
                displayDiv2.appendChild(container2)
                
            }
        )
    }



})
const form=document.getElementById('urlform')
form.addEventListener('submit',(e)=>{
    // e.preventDefault()
    // console.log(checkedUrls)

    chrome.storage.local.get(['warnURLs','unwarnUrls'],(result)=>{
    let  {warnURLs,unwarnUrls}=result
    console.log(warnURLs)
    console.log(unwarnUrls)
let UpdatedwarnUrl = warnURLs.filter(url => !checkedUrls.includes(url))
let newlyRemvoved=warnURLs.filter(url=>checkedUrls.includes(url))
UpdatedwarnUrl = [...new Set(UpdatedwarnUrl)];
newlyRemvoved = [...new Set(newlyRemvoved)];

console.log(`updated warn url are ${UpdatedwarnUrl}`)
console.log(`newly removed url are ${newlyRemvoved.item}`)

if(!unwarnUrls){
unwarnUrls=newlyRemvoved

}
else{
    unwarnUrls=[...unwarnUrls,...newlyRemvoved]

}
chrome.storage.local.set({warnURLs:UpdatedwarnUrl,unwarnUrls:unwarnUrls},()=>{
    // console.log("value changed")
})
    })
})

const button=document.getElementById("unwarn_clear")

button.addEventListener("click",function clearunwarn(){
    chrome.storage.local.set({unwarnUrls:[]},()=>{
        alert("Your all warned url have been erased")
        location.reload()
    })

})
