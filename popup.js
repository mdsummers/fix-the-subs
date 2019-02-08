function debug (text) {
  document.getElementById('debug').innerText = text;
}

function handleFile (evt) {
  debug('handleFile');
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    debug('tab query returned');
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function (response) {
      debug('Response from sendMessage');
    });
  });
}
document.getElementById('upload-button').addEventListener('click', handleFile, false);
