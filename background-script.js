var ClassWatchList;
var chosen_alarm = "bell1";
var audio = document.createElement("audio");
audio.src = browser.runtime.getURL("sounds/"+chosen_alarm+".wav");
var content_script_URL = browser.runtime.getURL("content_script"); 
var registered = null
var _power = "off";

/** Register content script, user this instead of manifest key to be
 * able to remove script based on power button
 * action */
async function register() {
    registered = await browser.contentScripts.register({
        matches: ["https://srbiau.daan.ir/session-list*"],
        js: [{file: "./content_script.js"}]
    });
    /** console.log("registed the script"); */
}

/** make a notification */
function notify(class_title_notif) {
    browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.runtime.getURL("icons/bell-48.png"),
        "title": "class notification",
        "imageUrl": browser.runtime.getURL("icons/bell-96.png"), 
        "message": "\n" + class_title_notif + "\n" + "!استاد وارد کلاس شده است"
        });
}

function connected(p) {
	/** console.log(`connected with port: ${p.name}`); */
    /** console.log(`chosen alarm is: ${chosen_alarm}`); */
    /** console.log(audio); */
    /** handle messages from content script */
    if (p.name == "port-from-cs") {
        p.onMessage.addListener(function(m) {
            /** console.log(m); */
            if (m.pass) {
                audio.loop = true;
                audio.play();
                notify(m.selected_class);
                return;
            } else if (m.selected == "reset") {
                ClassWatchList = undefined;
            } else if (m.selected_class != undefined) {
                ClassWatchList = m.selected_class;
            }
            audio.pause();
            p.postMessage({selected_class: ClassWatchList});
        })
    /** handle messages from popup */
    } else if (p.name == "port-from-popup") {
        /** console.log(`registered status: ${registered}`); */
        /** console.log("receiving messages from popup"); */
        /** console.log(`BS _power status: ${_power}`); */
        p.onMessage.addListener(function(m) {
            /** console.log(m); */
            if (m.set_alarm == true) {
                chosen_alarm = m.alarm;
                audio.src = browser.runtime.getURL("sounds/"+chosen_alarm+".wav");
                /** console.log(`changing alarm sound: ${chosen_alarm}`); */
            }
            if (m.power == "on") {
                register();
                browser.tabs.executeScript(null, {file: "content_script.js"});
                p.postMessage({selected_class: ClassWatchList})
                _power = m.power;
            } else if (m.power == "off") {
                /** console.log(`registered status: ${registered}`); */
                registered.unregister();
                registered = null;
                /** just registering won't remove notification buttons */
                browser.tabs.executeScript(null, {file: "content_script_reset.js"});
                ClassWatchList = undefined;
                audio.pause();
                _power = m.power;
            };
            /** Send state regardless of action to be able to preset choices 
             * when popup and content scripts restart. */
            p.postMessage({
                power:_power,
                selected_class: ClassWatchList,
                alarm: chosen_alarm
            })
        })
    }
}
        
browser.runtime.onConnect.addListener(connected);
