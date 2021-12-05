/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function ListenForClicks() {
    document.addEventListener("click", (e) => {

        /**
         * Send an "add notification" to the content script in the active tab.
         */
        function addNotification(tabs) {
            let ClassName = e.target.textContent;
            browser.tabs.sendMessage(tabs[0].id, {command: "add notificaton"});
        };

        /**
         * Log the error to console.
         */
        function reportError(error) {
            console.error(`Could not add notification: ${error}`);
        }

        /**
         * Get the active tab,
         * then call "addNotification()".
         */
        if (e.target.classList.contains("class")) {
            browser.tabs.query({active: true, currentWindow: true})
            .then(addNotification)
            .catch(reportError);
        };
    });
}

/**
 * Construct a list of buttons with the class names
 */
function listClassNames(message) {
    for (let ClassName of message.class_names) {
        let Classdiv = document.createElement("div")
        let ClassBtn = document.createElement("button");
        Classdiv.className = "class-name";
        ClassBtn.textContent = ClassName;
        Classdiv.appendChild(ClassBtn);
        document.getElementById("popup-content").appendChild(Classdiv);
    }
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute uninoti content script: $(error.message)`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */

console.log('executing popup script');
browser.tabs.executeScript({file: "/content_scripts/uninoti.js"});
browser.runtime.onMessage.addListener(listClassNames)
