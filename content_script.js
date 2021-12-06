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
            browser.runtime.sendMessage({"selected_class": class_title,});
            selectbtn(e);
        })
    })
};

/**
 * Get class status (زمان جلسه پایان یافته, زمان جلسه فرا نرسیده, ورود دانشجو)
 * by class title.
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

let myPort = browser.runtime.connect({name:"port-from-cs"});
myPort.postMessage({greeting: "hello from content script"});

myPort.onMessage.addListener(function(m) {
  console.log("In content script, received message from background script: ");
  console.log(m.greeting);
});

document.body.addEventListener("click", function() {
  myPort.postMessage({greeting: "they clicked the page!"});
});