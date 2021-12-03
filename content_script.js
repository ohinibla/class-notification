function logger() {
    console.log("content script sending message.");
    browser.runtime.sendMessage({"message": "hello"});
}

logger();