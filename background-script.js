function receiver(message) {
    console.log("background script receiving message");
    console.log(message.class_titles);
};

browser.runtime.onMessage.addListener(receiver);
