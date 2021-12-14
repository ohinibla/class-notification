let popup_port = browser.runtime.connect({name:"port-from-popup"});
console.log("popup script starting");
var power_stat; 
popup_port.postMessage({});
var power-button = document.getElementById("power-button").style.left = "50px";
var power-button-continer = document.getElementById("power-button-container").style.backgroundColor = "darkgray";

popup_port.onMessage.addListener(function(m) {
    power_stat = m.power;
    console.log(m.alarm);
    document.getElementById(m.alarm).checked = true;
    console.log(`power status: ${power_stat}`);
    if (m.power == "off") {
        power-button.style.left = "50px";
        power-button-container = style.backgroundColor = "darkgray";
    } else if (m.power == "on") {
        power-button.style.left = "100px";
        power-button-container.style.backgroundColor = "#57b45c";
    }
    document.getElementById("selected-class").textContent = m.selected_class;
})

/** Main handler for power button functionality */
let power_button = document.getElementById("power-button-container");
power_button.addEventListener("click", function() {
    if (power_stat == "off") {
        power_stat = "on";
        power-button.style.left = "70px";
        power-button-container.style.backgroundColor = "#57b45c";
        popup_port.postMessage({"power": power_stat});
    } else if (power_stat == "on") {
        power_stat = "off";
        power-button.style.left = "20px";
        power-button-container.style.backgroundColor = "darkgray";
        popup_port.postMessage({"power": power_stat});
    }
})

document.querySelectorAll(".tablinks").forEach(_tab => {
    _tab.addEventListener("click", openCity)})

document.getElementById("default").click();

document.querySelectorAll("input").forEach(btn => {
    btn.addEventListener("click", choose_alarm)
})

function openCity(e) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(e.target.innerText).style.display = "block";
  e.target.className += " active";
}

/** Choose the selected alarm and send the appropriate message
 * and play a preview */
function choose_alarm(e) {
    let chosen_alarm = e.target.id;
    console.log(browser.runtime.getURL("sounds/"+chosen_alarm))
    popup_port.postMessage({set_alarm: true, alarm: chosen_alarm});
    var audio = new Audio(browser.runtime.getURL("sounds/"+chosen_alarm+".wav"));
    audio.play();
    e.target.checked = true;
    setTimeout(function(){audio.pause();}, 3000);
}
