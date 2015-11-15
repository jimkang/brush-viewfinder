var callNextTick = require('call-next-tick');

function UpdateCoordinator(opts) {
  var subscribers = [];

  function subscribe(subscriber) {
    subscribers.push(subscriber);
  }

  function update(updatedData) {
    subscribers.forEach(passData);

    function passData(subscriber) {
      callNextTick(subscriber, updatedData);
    }
  }

  return {
    subscribe: subscribe,
    update: update
  };
}

module.exports = UpdateCoordinator;
