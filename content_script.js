/**
 * Send content-script start message to background-script
 */


(function() {

    /**
     * Avoid injecting duplicate scripts.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    /**
     * Adds custom notification button to every examBox > BtnHolder.
     */
    function addCustomButton() {
        let exam_boxes = document.querySelectorAll(".examBox");
    
        for (let box of exam_boxes) {
            let CustomButton = document.createElement("a");
            CustomButton.classList.add("notification-button");
            CustomButton.classList.add("btn", "examBtn", "contentBtn");
            CustomButton.style.backgroundColor = "red";
            CustomButton.textContent = "ورود استاد را به من اطلاع بده";
            box.getElementsByClassName("btnHolder")[0].prepend(CustomButton);
        }
    }
    
    /**
     * Style the selected button and add 
     * appropriate classes. 
     */
    function selectbtn(e) {
        e.target.style.backgroundColor = "green";
        e.target.classList.add("selected-class");
        document.querySelectorAll(".notification-button").forEach(item => {
            if (!item.classList.contains("selected-class")) {
                item.remove();
            }
        })
    }

    /**
     * Add click even listener to custom notification buttons and
     * send appropriate message with the title of the selected class to the background script.
     */
    function sendSelectedClass() {
        document.querySelectorAll(".notification-button").forEach(item => {
            item.addEventListener("click", (e) => {
                let class_title = e.target.parentNode.parentNode.getElementsByTagName('h4')[0].textContent;
                browser.runtime.sendMessage({"selected_class": class_title});
                selectbtn(e);
            })
        })
    };

    addCustomButton();
    sendSelectedClass();

})();

/**
 * Get enter class button by the class title.
 */
function getClassEnterbtn(class_title) {
    return document.getElementsByClassName("selected-class")[0].parentNode.lastElementChild.textContent;
};

function handlebtntext(_class) {
    _case = getClassEnterbtn(_class);

    if (_case == "زمان جلسه پایان یافته") {
        console.log("DUE BUZZZZZ!!!");
    } else if (_case == "زمان جلسه فرا نرسیده") {
        setTimeout((function () {location.reload()}), 6000);
    } else if (_case == "ورود دانشجو") {
        console.log("BUZZZZZ!!!!");
    }

};

browser.runtime.onMessage.addListener(message => {
    console.log(`content-script receiving message: ${message} - status: ${message.status}`);
    handlebtntext(message.selected_class);
});
