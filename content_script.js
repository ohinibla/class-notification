(function() {

    /**
     * Doesn't inject duplicate scripts.
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
    };
    
    /**
     * Add click even listener to custom notification buttons and
     * send appropriate message with the title of the selected class to the background script.
     */
    function sendSelectedClass() {
        document.querySelectorAll(".notification-button").forEach(item => {
            item.addEventListener("click", (e) => {
                let class_title = e.target.parentNode.parentNode.getElementsByTagName('h4')[0].innerText;
                browser.runtime.sendMessage({"selected_class": class_title});
                e.target.style.backgroundColor = "green";
                e.target.classList.add("selected-class");
                document.querySelectorAll(".notification-button").forEach(item => {
                    if (!item.classList.contains("selected-class")) {
                        item.remove();
                    }
                })
            })
        })
    };


    addCustomButton();
    sendSelectedClass();


})();

browser.runtime.onMessage.addListener(request => {
    console.log("Message from the background script:");
    console.log(request.selected_classes);
  });