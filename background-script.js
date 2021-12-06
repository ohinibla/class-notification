var ClassWatchList = [];


/**
 * Log acknowledgement and contents of the message to the console.
 */
function _ACK(message) {
    console.log('receiving messages');
    console.log(message);
    if (!(ClassWatchList.includes(message.selected_class))) {
        ClassWatchList.push(message.selected_class);
    };
    _send();
};



 function onError(error) {
    console.error(`Error: ${error}`);
  };
  
  function sendMessageToTabs(tabs) {
    for (let tab of tabs) {
      browser.tabs.sendMessage(
        tab.id,
        {selected_classes: ClassWatchList}
      )
    };
  };

  function _send() {
    browser.tabs.query({
      currentWindow: true,
      active: true
    }).then(sendMessageToTabs).catch(onError);
};

/**
 * Listen for message from the content script.
 */
browser.runtime.onMessage.addListener(_ACK);