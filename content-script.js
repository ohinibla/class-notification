function ClassTitle() {
    console.log("content script sending message.");
    var class_titles = [];
    var exam_boxes = document.querySelectorAll(".examBox");
    for (let box of exam_boxes) {
        class_name = box.getElementsByTagName('h4')[0].innerText;
        class_titles.push(class_name);
    };

    browser.runtime.sendMessage({
        "class_titles": class_titles,
    });
};

ClassTitle();