(function() {

    var _selected = false;
    var shakeURL = browser.runtime.getURL("./styles/shake.css");
    var fadeURL = browser.runtime.getURL("./styles/fade.css");
    var clockIMG_URL = browser.runtime.getURL("icons/bell-96.png");
    addFadeCSS();

    /**
     * Adds custom notification button to every examBox > BtnHolder.
     */
    function addCustomButtons(exam_boxes, _color) {
        for (let box of exam_boxes) {
            let CustomButton = document.createElement("img");
            /**
            CustomButton.textContent = "به من اطلاع بده";
            CustomButton.classList.add("btn", "examBtn", "contentBtn");
            **/
            CustomButton.classList.add("notification-button");
            CustomButton.setAttribute("src", clockIMG_URL);
            CustomButton.setAttribute("height", "40");
            CustomButton.style.marginLeft = "10px";
            CustomButton.style.filter = _color;
            box.getElementsByClassName("btnHolder")[0].prepend(CustomButton);
            /** console.log("custom buttons added"); */
        }
        sendSelectedClass();
    }

    /**
     * Style the selected button and add 
     * appropriate classes. 
     */
    function selectbtn(e) {
        e.target.style.filter = "none";
        e.target.classList.add("selected-class");
        document.querySelectorAll(".notification-button").forEach(item => {
            if (!item.classList.contains("selected-class")) {
                item.style.opacity = "0";
                setTimeout(function(){item.parentNode.removeChild(item);}, 50);
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
        let exb_btn_holdr = getClassexamBox(class_title)[0].querySelectorAll(".btnHolder")[0]
        b = exb_btn_holdr.getElementsByTagName("button")[0];
        c = exb_btn_holdr.getElementsByClassName("disableBtn")[0];
        return [b || c]
    }

    /** get examBox (class title main container) by class title */
    function getClassexamBox(class_title) {
        let exam_boxes = document.querySelectorAll(".examBox");
        for (let box of exam_boxes) {
            if (box.getElementsByTagName('h4')[0].textContent == class_title) {
                return [box];
            }
        }
    }

    /** Return all the classes that are not due yet. */
    function get_undue_classes() {
        let classes = [];
        for (let box of document.querySelectorAll(".examBox")) {
            if (box.getElementsByClassName("btnHolder")[0].lastElementChild.textContent != "زمان جلسه پایان یافته") {
                classes.push(box);
            }
        }
        return classes;
    }

    /** Shake animation to notification button. */
    function addShakeCSS() {
        let _link = document.createElement('link');
        _link.setAttribute('rel', 'stylesheet');
        _link.setAttribute('href', shakeURL);
        document.head.appendChild(_link);
    }

    /** Fade animation for notification buttons. (setting the animation duration 
     * longer could cause unwanted behavior due to doube clicking. */
    function addFadeCSS() {
        let _link = document.createElement('link');
        _link.setAttribute('rel', 'stylesheet');
        _link.setAttribute('href', fadeURL);
        document.head.appendChild(_link);
    }

    /** Make decision based on the enter button text */
    function handlebtntext(_class) {
        /** console.log("handling this"); */
        let pass = false;
        /** console.log(`class is: ${_class}`); */
        enter_btn = getClassEnterbtn(_class)[0];
        _case = enter_btn.innerText;
        /** console.log(`class enter button is: ${_case}`); */
        if (_case == "زمان جلسه پایان یافته") {
            /** console.log("DUE BUZZZZZ!!!"); */
        } else if (_case == "زمان جلسه فرا نرسیده") {
            setTimeout((function () {location.reload()}), 60000);
        } else if (_case == "ورود دانشجو") {
            /** console.log("BUZZZZZ!!!!"); */
            document.getElementsByClassName("selected-class")[0].classList.add("class-enter");
            addShakeCSS();
            pass = true;
            myPort.postMessage({pass: true, selected_class: _class});
        };
        return pass;
    };

    let myPort = browser.runtime.connect({name:"port-from-cs"});
    /** console.log("content script restarting"); */
    myPort.postMessage({});

    myPort.onMessage.addListener(function(m) {
        /** console.log(`bs: selected class is ${m.selected_class}`); */
        /** console.log(`selected status: ${_selected}`); */
        if (m.selected_class == undefined) {
            /** console.log("start selecting"); */
            addCustomButtons(get_undue_classes(),"grayscale(100%)");
        } else if (m.selected_class !== undefined && _selected == false) {
            addCustomButtons(getClassexamBox(m.selected_class),"none");
            document.getElementsByClassName("notification-button")[0].click();
            handlebtntext(m.selected_class);
        } else if (m.selected_class !== undefined && _selected == true) { 
            /** console.log("already selected"); */
            /** console.log("handle this"); */
            let pass =  handlebtntext(m.selected_class);
            /** console.log(`found enter: ${pass}`); */
        }
    })
})()        
