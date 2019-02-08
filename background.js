chrome.runtime.onInstalled.addListener(function () {
  // replace all rules
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // with a new rule
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            urlContains: 'https://www.netflix.com/watch'
          }
        })
      ],
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});
