var test = require('tape');
var createTimeReleaseElementGroupStream = require('../time-release-element-group-stream');

test('Basic test', function basicTest(t) {
  var stream = createTimeReleaseElementGroupStream({
    maxGroups: 5,
    timeBetweenGroups: 200
  });

  stream.on('error', checkError);
  stream.on('data', checkGroup);
  stream.on('end', checkEnd);

  function checkError(error) {
    t.fail('Error from stream.');
    console.log(error);
  }

  function checkGroup(group) {
    t.ok(group.length > 0, 'Group has at least one element.');
    group.forEach(checkElement);
  }

  function checkElement(element) {
    console.log(element);
    t.equal(typeof element.value, 'number', 'Element is an integer.');
    t.ok(!isNaN(element.value), 'number', 'Element has a valid value.');
    t.ok(element.stamp instanceof Date, 'Element has a date stamp.');
  }

  function checkEnd() {
    t.pass('Stream ended.');
    t.end();
  }
});
