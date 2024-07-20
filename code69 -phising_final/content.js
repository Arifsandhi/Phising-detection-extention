// content.js
(function () {
  const anchorTags = Array.from(document.querySelectorAll("a"));
  const hrefs = anchorTags.map((a) => a.href);

  chrome.runtime.sendMessage(
    { action: "extractLinks", links: hrefs },
    (response) => {
      response.results.forEach((result, index) => {
        if (result.isPhishing || result.isClickjacking) {
          anchorTags[index].style.color = "red" ;
        } else {
          anchorTags[index].style.color = "green";
        }
      });
    }
  );
})();
