// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("EcoCart AI installed");
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CART_UPDATED") {
    // Update storage with new cart data
    chrome.storage.local.set({
      cartSummary: {
        totalItems: message.data.totalItems,
        totalCarbonFootprint: message.data.totalCarbonFootprint,
        greenScore: message.data.greenScore,
        recommendations: message.data.recommendations,
      },
    });
  }
});

// Handle carbon offset requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OFFSET_CARBON") {
    // TODO: Implement carbon offset API integration
    // This would involve:
    // 1. Calculating total carbon footprint
    // 2. Finding appropriate offset projects
    // 3. Processing payment
    // 4. Updating user's green score
  }
});
