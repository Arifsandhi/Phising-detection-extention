async function checkUrlWithGoogleSafeBrowsing(url) {
  const apiKey = "AIzaSyDRc-q9PWJbFn6aSYrzHsra85Qbbjne2SM";  //google safe browser API
  const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  const requestBody = {
    client: {
      clientId: "phishing-detector",
      clientVersion: "1.0",
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: url }],
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.matches ? true : false;
  } catch (error) {
    console.log("Error checking URL with Google Safe Browsing API:", error);
    return false;
  }
}

function heuristicCheck(url) {
  const phishingPatterns = [
    "login",
    "secure",
    "account",
    "verification",
    "update",
    "signin",
    "amazon",
    "apple",
    "paypal",
    "bank",
    "facebook",
    "google",
    "microsoft",
    "instagram",
    "comcast",
    "yahoo",
  ];
  const suspiciousTLDs = [".co", ".tk", ".ml", ".ga", ".cf", ".gq"];

  const lowerUrl = url.toLowerCase();
  return (
    phishingPatterns.some((pattern) => lowerUrl.includes(pattern)) ||
    suspiciousTLDs.some((tld) => lowerUrl.endsWith(tld))
  );
}

async function isPhishingLink(link) {
  const isGooglePhishing = await checkUrlWithGoogleSafeBrowsing(link);
  const isHeuristicPhishing = heuristicCheck(link);
  //new line added
  
  return isGooglePhishing || isHeuristicPhishing;
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "validateLinks") {
    const validateLinks = async () => {
      const results = await Promise.all(
        message.links.map(async (link) => ({
          link: link,
          isPhishing: await isPhishingLink(link),
          
        }))
      );
      sendResponse({ results: results });
    };
    validateLinks();
    return true; 
  }
});