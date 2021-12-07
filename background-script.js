var ClassWatchList;

let portFromCS;

function connected(p) {
  portFromCS = p;
  portFromCS.onMessage.addListener(function(m) {
  console.log(m);
    if (m.selected_class != undefined) {
      ClassWatchList = m.selected_class;
    }
    portFromCS.postMessage({selected_class: ClassWatchList});
  });
}

browser.runtime.onConnect.addListener(connected);

