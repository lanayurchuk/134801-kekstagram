'use strict';

function createCallback(url, callback, callbackName) {
  window[callbackName] = function(data) {
    callback(data);
  };

  var script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}

module.exports = createCallback;
