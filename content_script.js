var _selected = false;
addFadeCSS();

/**
 * Adds custom notification button to every examBox > BtnHolder.
 */
function addCustomButtons(exam_boxes, _color) {
    for (let box of exam_boxes) {
        let CustomButton = document.createElement("a");
        CustomButton.classList.add("notification-button");
        CustomButton.classList.add("btn", "examBtn", "contentBtn");
        CustomButton.style.backgroundColor = _color;
        CustomButton.textContent = "به من اطلاع بده";
        box.getElementsByClassName("btnHolder")[0].prepend(CustomButton);
    }
    sendSelectedClass();
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
            item.style.opacity = "0";
            setTimeout(function(){item.parentNode.removeChild(item);}, 1000);
        }
    })
}

/**
 * Add click even listener to custom notification buttons and
 * send appropriate message with the title of the selected class to the background script.
 */
function sendSelectedClass() {
    document.querySelectorAll(".notification-button").forEach(item => {
        item.addEventListener("click", sendSelectedClassMessage)
    })
}

/**
 send selected button class title with a selected status flag to
 * the background script to handle.
*/
function sendSelectedClassMessage(e) {
    let selected_class_title;
    let selected_class_box;

    if (_selected == true) {
        document.querySelector(".notification-button").remove();
        _selected = "reset";
    } else {
        selected_class_box = e.target.parentNode.parentNode;
        selected_class_title = selected_class_box.getElementsByTagName('h4')[0].textContent;
        _selected = true;
    }
    myPort.postMessage({selected_class: selected_class_title, selected: _selected});
    selectbtn(e);
}

/** Get class status (زمان جلسه پایان یافته, زمان جلسه فرا نرسیده, ورود دانشجو)
 * by class title.
 */
function getClassEnterbtn(class_title) {
    return document.getElementsByClassName("notification-button")[0].parentNode.lastElementChild.textContent;
};

function getClassexamBox(class_title) {
    let exam_boxes = document.querySelectorAll(".examBox");
    for (let box of exam_boxes) {
        if (box.getElementsByTagName('h4')[0].textContent == class_title) {
            return [box];
        }
    }
}

function get_undue_classes() {
    let classes = [];
    for (let box of document.querySelectorAll(".examBox")) {
        if (box.getElementsByClassName("btnHolder")[0].lastElementChild.textContent != "زمان جلسه پایان یافته") {
            classes.push(box);
        }
    }
    return classes;
}

function addShakeCSS() {
    let shakeURL = browser.extension.getURL("shake.css");
    let _link = document.createElement('link');
    _link.setAttribute('rel', 'stylesheet');
    _link.setAttribute('href', shakeURL);
    document.head.appendChild(_link);
}

function addFadeCSS() {
    let fadeURL = browser.extension.getURL("fade.css");
    let _link = document.createElement('link');
    _link.setAttribute('rel', 'stylesheet');
    _link.setAttribute('href', fadeURL);
    document.head.appendChild(_link);
}

function handlebtntext(_class) {
    let enter = false;
    _case = getClassEnterbtn(_class);
    if (_case == "زمان جلسه پایان یافته") {
        console.log("DUE BUZZZZZ!!!");
    } else if (_case == "زمان جلسه فرا نرسیده") {
        setTimeout((function () {location.reload()}), 60000);
    } else if (_case == "ورود دانشجو") {
        console.log("BUZZZZZ!!!!");
        addShakeCSS();
        found = true;
    };
    return enter;
};

let myPort = browser.runtime.connect({name:"port-from-cs"});
console.log("content script restarting");
myPort.postMessage({});

myPort.onMessage.addListener(function(m) {
    console.log(`bs: selected class is ${m.selected_class}`);
    console.log(`selected status: ${_selected}`);
    if (m.selected_class == undefined) {
        console.log("start selecting");
        let exam_boxes = get_undue_classes();
        addCustomButtons(exam_boxes, "red");
    } else if (m.selected_class !== undefined && _selected == false) {
        let exam_boxes = getClassexamBox(m.selected_class);
        addCustomButtons(exam_boxes, "green");
        handlebtntext(m.selected_class);
    } else if (m.selected_class !== undefined && _selected == true) { 
        console.log("already selected");
        console.log("handle this");
        let enter = handlebtntext(m.selected_class);
        console.log(`found enter: ${enter}`);
    }
})
