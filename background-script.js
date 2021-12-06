var ClassWatchList;
var init_status = "init";

_send();

/**
 * Log acknowledgement and contents of the message to the console.
 */
function _ACK(message) {
    /**
     * if (!(ClassWatchList.includes(message.selected_class))) {
     * ClassWatchList.push(message.selected_class);
     * };
     */
    ClassWatchList = message.selected_class
    _send();
};
 
  function sendMessageToTabs(tabs) {
    for (let tab of tabs) {
      browser.tabs.sendMessage(
        tab.id,
        {
            selected_class: ClassWatchList,
            status: init_status
        }
      )
    };
    console.log(`background-script sending message`);
  };

  function onError(error) {
      console.error(`some error occurred: $(error)`);
  }

  function _send() {
    browser.tabs.query({
      currentWindow: true,
      active: true
    }).then(sendMessageToTabs).catch(onError);
};

/**
 * Send initial message with the proper status and ClassWatchList.
 */

/**
 * Listen for message from the content script.
 */
browser.runtime.onMessage.addListener(_ACK);

