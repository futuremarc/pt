chrome.idle.onStateChanged.addListener(idleStateChange);
chrome.runtime.onInstalled.addListener(onInstall);
chrome.browserAction.onClicked.addListener(onBrowserAction);




function onInstall(data) {
  console.log(data)

  if (data.reason == "install") { //new install

    var url = 'https://passti.me'
    chrome.tabs.create({
      url: url
    });

  } else if (data.reason == "update") {} //send msg notifying of updates

}


function idleStateChange(data) {
  console.log(data);

  chrome.tabs.query({}, function(tabs) {

    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, {
        idleState: data
      });

    })

  });

}


function onBrowserAction(activeTab) {
  console.log(activeTab)

  var url = 'https://passti.me'

  chrome.tabs.create({
    url: url
  });

}





