(function (){
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    /**
     * get the name of the classes, then
     * create and style an button node pointing to
     * that class, then insert the node into the document.
     */
     function getClassNames() {
        let class_titles = [];
        let exam_boxes = document.querySelectorAll(".examBox");

        for (let box of exam_boxes) {
            class_name = box.getElementsByTagName('h4')[0].innerText;
            class_names.push(class_name);
        };
    
        browser.runtime.sendMessage({"class_names": class_names,});
    };
    
    browser.runtime.onMessage.addListener((message) => {
        console.log(message);
    })
})()