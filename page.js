function loadSubs (subs) {
  // remove any previous instances
  $('#subHolder').remove();
  $('#subLoaderInput').remove();

  function onLoaded () {
      var subHolder = $('<div>')
        .attr('id', 'subHolder')
        .css('position', 'absolute')
        .css('z-index', '999')
        .css('width', '100%')
        .css('text-align', 'center')
        .css('font-size', '2.5em')
        .css('white-space', 'pre')
        .css('-webkit-text-stroke', '0.03em black')
        .css('font-weight', '800')
        .css('margin-top', '1em')
        .text('<placeholder>');
      $('body').append(subHolder);

      subs.forEach(function (s,i) {
          s.endMs = subs[i+1] ? subs[i+1].ms : Infinity;
      });
      var curr;
      v.addEventListener('timeupdate', function (e) {
          var ts = v.currentTime * 1000;
          if (curr && ts > curr.ms && ts < curr.endMs) return; // still in same event
          // find new sub
          var sub = subs.find(function(s) {
              return ts > s.ms && ts < s.endMs;
          });
          if (!sub) return; // can't find =[
          curr = sub;
          subHolder.text(sub.text || '');
      });
  }
  var v;
  var interval = setInterval(function () {
      v = document.getElementsByTagName("video")[0];
      if (!v) return;
      clearInterval(interval);
      onLoaded();
  }, 100);
}

function handleFileEvent (evt) {
  var file = evt.target.files && evt.target.files[0];
  console.log('Input has changed:', file);
  if (!file) return;

  var reader = new FileReader();
  reader.onerror = function (err) {
    console.error('Saw an error loading the sub file:', err);
  };
  reader.onload = function () {
    console.log('Loaded result of length:', reader.result && reader.result.length);
    var subs;
    try {
      subs = JSON.parse(reader.result);
    } catch (err) {
      console.error('Failed to JSON parse the sub file:', err);
      return;
    }
    loadSubs(subs);
  }
  reader.readAsText(file);
}

// Take message from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var input = $('<input/>')
    .attr('type', 'file')
    .attr('id', 'subLoaderInput')
    .attr('accept', '.json')
    .change(handleFileEvent);

  $('body').prepend(input);
  input.click();
  return true;
});
