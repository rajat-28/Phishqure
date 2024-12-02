const checkedUrls = new Array();

// Initialize `unwarnUrls` if not set
chrome.storage.local.get(['unwarnUrls'], (result) => {
    if (!result.unwarnUrls) {
        chrome.storage.local.set({ unwarnUrls: [] });
    }
});

// Fetch and display warned, unwarned, and safe URLs
chrome.storage.local.get(['warnURLs', 'unwarnUrls', 'safeUrlVisit'], function (result) {
    const uniqueWarnURLs = [...new Set(result.warnURLs || [])];
    const uniqueUnwarnURLs = [...new Set(result.unwarnUrls || [])];
    const uniqueSafeURLs = [...new Set(result.safeUrlVisit || [])];

    // Display warned URLs
    const displayDiv = document.getElementById('warnURLs');
    uniqueWarnURLs.forEach((url) => {
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
        uniqueUnwarnURLs.forEach((url) => {
            const p2 = document.createElement('p');
            p2.textContent = url;
            const container2 = document.createElement('div');
            container2.style.display = 'flex';
            container2.style.alignItems = 'center';
            container2.appendChild(p2);
            displayDiv2.appendChild(container2);
        });
    }

    // Display safe URLs
    const displayDiv3 = document.getElementById("safeSites");
    if (uniqueSafeURLs.length === 0) {
        displayDiv3.innerHTML = "<i>You haven't visited any safe site</i>";
    } else {
        uniqueSafeURLs.forEach((url) => {
            const p3 = document.createElement('p');
            p3.textContent = url;
            const container3 = document.createElement('div');
            container3.style.display = 'flex';
            container3.style.alignItems = 'center';
            container3.appendChild(p3);
            displayDiv3.appendChild(container3);
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

        const updatedWarnURLs = warnURLs.filter((url) => !checkedUrls.includes(url));
        const newlyRemovedURLs = warnURLs.filter((url) => checkedUrls.includes(url));

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

// Function to fetch and display percentages of safe and malicious sites
function displaySitePercentages() {
    chrome.storage.local.get(['warnURLs', 'safeUrlVisit'], (result) => {
        const warnedUrls = result.warnURLs || [];
        const safeUrls = result.safeUrlVisit || [];

        const totalUrls = warnedUrls.length + safeUrls.length;
        let maliciousPercentage = 0;
        let safePercentage = 0;

        if (totalUrls > 0) {
            maliciousPercentage = ((warnedUrls.length / totalUrls) * 100).toFixed(2);
            safePercentage = ((safeUrls.length / totalUrls) * 100).toFixed(2);
        }

        // Update the displayed percentages on main.html
        document.querySelector('.cs-stat .cs-number').textContent = `${safePercentage}%`;
        document.querySelector('.cs-stat:last-child .cs-number').textContent = `${maliciousPercentage}%`;
    });
}

// Refresh the percentages on page load and whenever storage changes
document.addEventListener('DOMContentLoaded', displaySitePercentages);
chrome.storage.onChanged.addListener(displaySitePercentages);
