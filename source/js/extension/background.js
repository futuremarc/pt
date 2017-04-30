chrome.idle.onStateChanged.addListener(idleStateChanged);

function idleStateChanged(e) {
  console.log(e);

  chrome.tabs.query({}, function(tabs) {

    tabs.forEach(function(tab) {
      
      chrome.tabs.sendMessage(tab.id, {
        idleState: e
      }, function(res){
        console.log(res)
      });

    })

  });

}