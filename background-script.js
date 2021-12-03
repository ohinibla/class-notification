function receiver(message) {
    console.log("background script receiving message.");
    console.log(message);
};

browser.runtime.onMessage.addListener(receiver);