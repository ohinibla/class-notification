/**
 * get the name of the classes, then
 * create and style an button node pointing to
 * that class, then insert the node into the document.
 */
 function getClassNames() {
    let class_names = [];
    let exam_boxes = document.querySelectorAll(".examBox");

    for (let box of exam_boxes) {
        let class_name = box.getElementsByTagName('h4')[0].innerText;
        class_names.push(class_name);
    };

    browser.runtime.sendMessage({"class_names": class_names,});
};

(function() {

    if (window.hasRun) {
        return;
    };
    window.hasRun = true;


    /**
     * add a custom button to every examBox
     */
    function addCustomButton() {
        let exam_boxes = document.querySelectorAll(".examBox");

        for (let box of exam_boxes) {
            let CustomButton = document.createElement("a");
            CustomButton.id = "notification-button";
            CustomButton.classList.add("btn", "examBtn", "contentBtn");
            CustomButton.style.backgroundColor = "red";
            CustomButton.style.font.fontsize = "10px";
            CustomButton.textContent = "ورود استاد را به من اطلاع بده";
            box.getElementsByClassName("btnHolder")[0].prepend(CustomButton);
        }
    }

    addCustomButton()

})()


getClassNames();

document.querySelectorAll("#notification-button").forEach(item => {
    item.addEventListener("click", (e) => {
        let class_title = e.target.parentNode.parentNode.getElementsByTagName('h4')[0].innerText;
        e.target.style.backgroundColor = "green";
    })
});