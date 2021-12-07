var selected = false;

/**
 * Adds custom notification button to every examBox > BtnHolder.
 */
function addCustomButtons(exam_boxes, _color) {
    for (let box of exam_boxes) {
        let CustomButton = document.createElement("a");
        CustomButton.classList.add("notification-button");
        CustomButton.classList.add("btn", "examBtn", "contentBtn");
        CustomButton.style.backgroundColor = _color;
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
            let selected_class_box = e.target.parentNode.parentNode;
            let selected_class_title = selected_class_box.getElementsByTagName('h4')[0].textContent;
            myPort.postMessage({selected_class: selected_class_title, selected: true});
            selectbtn(e);
            selected = true;
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

function getClassexamBox(class_title) {
    let exam_boxes = document.querySelectorAll(".examBox");
    for (let box of exam_boxes) {
        if (box.getElementsByTagName('h4')[0].textContent == class_title) {
            return [box];
        }
    }
}

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
console.log("content script restarting");
myPort.postMessage({_status: "start"});

myPort.onMessage.addListener(function(m) {
    console.log(`bs: selected class is ${m.selected_class}`);
    console.log(selected);
    if (m.selected_class == undefined) {
        console.log("start selecting");
        let exam_boxes = document.querySelectorAll(".examBox");
        addCustomButtons(exam_boxes, "red");
        sendSelectedClass();
    } else if (selected == false) {
        let exam_boxes = getClassexamBox(m.selected_class);
        addCustomButtons(exam_boxes, "green");
        
    } else {
        console.log("already selected");
        console.log("handle this");
    }
})
