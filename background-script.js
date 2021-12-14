var ClassWatchList;
var chosen_alarm = "bell1";
var audio = document.createElement("audio");
audio.src = browser.runtime.getURL("sounds/"+chosen_alarm+".wav");
var content_script_URL = browser.runtime.getURL("content_script"); 
var registered = null
var _power = "off";

async function register() {
    registered = await browser.contentScripts.register({
        matches: ["<all_urls>"],
        js: [{file: "./content_script.js"}]
    });
    console.log("registed the script");
}

function connected(p) {
	console.log(`connected with port: ${p.name}`);
    console.log(`chosen alarm is: ${chosen_alarm}`);
    console.log(audio);
    if (p.name == "port-from-cs") {
        p.onMessage.addListener(function(m) {
            console.log(m);
            if (m.pass) {
                audio.loop = true;
                audio.play();
                return;
            } else if (m.selected == "reset") {
                ClassWatchList = undefined;
            } else if (m.selected_class != undefined) {
                ClassWatchList = m.selected_class;
            }
            audio.pause();
            p.postMessage({selected_class: ClassWatchList});
        })
    } else if (p.name == "port-from-popup") {
        console.log(`registered status: ${registered}`);
        console.log("receiving messages from popup");
        console.log(`BS _power status: ${_power}`);
        p.onMessage.addListener(function(m) {
            console.log(m);
            if (m.set_alarm == true) {
                chosen_alarm = m.alarm;
                audio.src = browser.runtime.getURL("sounds/"+chosen_alarm+".wav");
                console.log(`changing alarm sound: ${chosen_alarm}`);
            }
            if (m.power == "on") {
                register();
                browser.tabs.executeScript(null, {file: "content_script.js"});
                p.postMessage({selected_class: ClassWatchList})
                _power = m.power;
            } else if (m.power == "off") {
                console.log(`registered status: ${registered}`);
                registered.unregister();
                registered = null;
                browser.tabs.executeScript(null, {file: "content_script_reset.js"});
                ClassWatchList = undefined;
                audio.pause();
                _power = m.power;
            };
            p.postMessage({
                power:_power,
                selected_class: ClassWatchList,
                alarm: chosen_alarm
            })
        })
    }
}
        




browser.runtime.onConnect.addListener(connected);

