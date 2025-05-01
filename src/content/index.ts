import CartDetector from "./cartDetector";

// Initialize cart detector when the content script loads
const cartDetector = CartDetector.getInstance();

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_CART") {
    sendResponse(cartDetector.getCurrentCart());
  }
  return true;
});

// Cleanup when the content script is unloaded
window.addEventListener("unload", () => {
  cartDetector.cleanup();
});
