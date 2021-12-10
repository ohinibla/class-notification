let popup_port = browser.runtime.connect({name:"port-from-popup"});
console.log("popup script starting");
popup_port.postMessage({});

popup_port.onMessage.addListener(function(m) {
    document.getElementById("selected-class").textContent = m.selected_class;
})
