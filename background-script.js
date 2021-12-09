var ClassWatchList;
var audio = new Audio(browser.runtime.getURL("notification.wav"));
var portFromCS;

function connected(p) {
  portFromCS = p;
  portFromCS.onMessage.addListener(function(m) {
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
      portFromCS.postMessage({selected_class: ClassWatchList});
  });
}

browser.runtime.onConnect.addListener(connected);
