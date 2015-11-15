var test = require('tape');
var UpdateCoordinator = require('../update-coordinator');
var Immutable = require('immutable');

test('Basic test', function basicTest(t) {
  var lists = [
    Immutable.List.of([1, 2, 3]),
    Immutable.List.of([2, 3, 4]),
    Immutable.List.of([4, 5, 6, 7])
  ];

  t.plan(3 * lists.length);
  
  var updateCoordinator = UpdateCoordinator({
  });

  updateCoordinator.subscribe(updateCheckerA);
  updateCoordinator.subscribe(updateCheckerB);
  updateCoordinator.subscribe(updateCheckerC);

  updateCoordinator.update(lists[0].toJS());
  updateCoordinator.update(lists[1].toJS());
  updateCoordinator.update(lists[2].toJS());

  var updateCountA = 0;
  var updateCountB = 0;
  var updateCountC = 0;

  function updateCheckerA(newData) {
    t.deepEqual(
      newData,
      lists[updateCountA].toJS(),
      'Data for update ' + updateCountA + ' passed correctly to checker A.'
    );

    updateCountA += 1;
  }

  function updateCheckerB(newData) {
    t.deepEqual(
      newData,
      lists[updateCountB].toJS(),
      'Data for update ' + updateCountB + ' passed correctly to checker B.'
    );

    updateCountB += 1;
  }

  function updateCheckerC(newData) {
    t.deepEqual(
      newData,
      lists[updateCountC].toJS(),
      'Data for update ' + updateCountC + ' passed correctly to checker C.'
    );

    updateCountC += 1;
  }
});
