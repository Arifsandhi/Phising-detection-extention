// popup.js



document.getElementById("scan").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"],
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractLinks") {
    const results = document.getElementById("results");
    results.innerHTML = "";
+
    chrome.runtime.sendMessage(
      { action: "validateLinks", links: message.links },
      (response) => {
        response.results.forEach((result) => {
          const listItem = document.createElement("li");
          const linkSpan = document.createElement("span");
          linkSpan.textContent = result.link;
          if (result.isPhishing ) {   
            linkSpan.style.color = "red";
          }
          listItem.appendChild(linkSpan);

          const statusSpan = document.createElement("span");
          statusSpan.textContent = `Phishing: ${result.isPhishing} `;  
          statusSpan.style.display = "block"; 
          listItem.appendChild(statusSpan);

          results.appendChild(listItem);
        });
      }
    );
  }
});
