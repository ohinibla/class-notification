var ClassWatchList;
var audio = new Audio(browser.runtime.getURL("notification.wav"));
var portFromCS;

function connected(p) {
	console.log(p);
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
        p.onMessage.addListener(function(m) {
            console.log(m);
            console.log("sending message to popup");
            p.postMessage({selected_class: ClassWatchList});
       })
    }
}

browser.runtime.onConnect.addListener(connected);
