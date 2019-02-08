var sax = require('sax'),
    fs = require('fs'),
    debug = require('debug')('subs');

var dfxp = process.argv[2];
if (!dfxp) throw new Error('first arg should be the sub file');

var parser = sax.createStream(false);

var events = [];

var inP = false, textBuffer, attrs;
parser.on('opentag', function (node) {
  var name = node.name;
  if (node.name === 'P') {
    textBuffer = '';
    inP = true;
    attrs = node.attributes; // BEGIN && END
  }
});
parser.on('text', function (text) {
  if (inP) textBuffer+=text;
});
parser.on('closetag', function (node) {
  if (inP && node === 'P') {
    inP = false;
    var startEvent = {
      time: attrs.BEGIN,
      ms: stringToMs(attrs.BEGIN),
      text: textBuffer
    };
    var endEvent = {
      time: attrs.END,
      ms: stringToMs(attrs.END),
    };
    debug('Start', startEvent);
    events.push(startEvent);
    debug('End', endEvent);
    events.push(endEvent);
  } else if (node === 'BR') {
    textBuffer && (textBuffer+="\n");
  }
});
parser.on('end', function () {
  console.log('Parsed sub events');
  fs.writeFileSync(dfxp + '.json', JSON.stringify(events));
  //show();
});

fs.createReadStream(dfxp)
  .pipe(parser);

function stringToMs (str) {
  var match = str.match(/^([0-9]+):([0-9]{2}):([0-9]{2}).([0-9]{3})$/);
  if (!match) throw new Error('Failed to parse: ' + str);
  return Number(match[4]) +
      (1000 * Number(match[3])) +
      (60 * 1000 * Number(match[2])) +
      (60 * 60 * 1000 * Number(match[1]));
}

function show () {
  var start = Date.now();
  function evt (i) {
    var curr = events[i];
    if (!curr) return;
    var sleepTime = Math.max(start + curr.ms - Date.now(), 0);
    debug('Sleeping for %dms', sleepTime);
    setTimeout(function () {
      var blank = "";
      if (process.stdout.rows) {
        for (var j = 0; j < process.stdout.rows; j++) blank+="\n";
      }
      console.log(blank + (curr.text || ''));
      return evt(i+1);
    }, sleepTime);
  }
  evt(0);
}
