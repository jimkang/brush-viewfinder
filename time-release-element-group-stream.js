var probable = require('probable');
var Readable = require('stream').Readable;

function newElementForBase(baseValue) {
  return {
    value: baseValue,
    stamp: new Date(new Date().getTime() + 3600 * probable.roll(96))
  };
}

function generateNewElements(howMany, startingValue) {
  var newElements = [];
  for (var i = 0; i < howMany; ++i) {
    newElements.push(newElementForBase(startingValue + i));
  }
  return newElements;
}

function createElements() {
  var howMany = probable.rollDie(10) + 5;
  return generateNewElements(howMany, probable.roll(100));
}

function createTimeReleaseElementGroupStream(opts) {
  var count = 0;
  var maxGroups = 0;
  var timeBetweenGroups;

  if (opts) {
    maxGroups = opts.maxGroups;
    timeBetweenGroups = opts.timeBetweenGroups;
  }

  if (!timeBetweenGroups) {
    timeBetweenGroups = 2000;
  }

  var stream = Readable({
    objectMode: true
  });
  stream._read = emitElementGroup;
  return stream;

  function emitElementGroup() {
    if (count < maxGroups) {
      setTimeout(pushNewGroup, count * timeBetweenGroups);
      ++count;
    }
    else {
      stream.push(null);
    }
  }

  function pushNewGroup() {
    stream.push(createElements());
  }  
}

module.exports = createTimeReleaseElementGroupStream;
