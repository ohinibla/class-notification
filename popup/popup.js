let popup_port = browser.runtime.connect({name:"port-from-popup"});
console.log("popup script starting");
var power_stat; 
popup_port.postMessage({});

popup_port.onMessage.addListener(function(m) {
    power_stat = m.power;
    console.log(`power status: ${power_stat}`);
    if (m.power == "off") {
        document.getElementById("power-button").style.left = "50px";
        document.getElementById("power-button-container").style.backgroundColor = "darkgray";
    } else if (m.power == "on") {
        document.getElementById("power-button").style.left = "100px";
        document.getElementById("power-button-container").style.backgroundColor = "#57b45c";
    }
    document.getElementById("selected-class").textContent = m.selected_class;
})

let power_button = document.getElementById("power-button-container");
power_button.addEventListener("click", function() {
    if (power_stat == "off") {
        power_stat = "on";
        document.getElementById("power-button").style.left = "70px";
        document.getElementById("power-button-container").style.backgroundColor = "#57b45c";
        popup_port.postMessage({"power": power_stat});
    } else if (power_stat == "on") {
        power_stat = "off";
        document.getElementById("power-button").style.left = "20px";
        document.getElementById("power-button-container").style.backgroundColor = "darkgray";
        popup_port.postMessage({"power": power_stat});
    }
})
