'use strict';

function getSearchString(params) {
  return Object.keys(params).map(function(param) {
    return [param, params[param]].join('=');
  }).join('&');
}

function load(url, params, callback) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', url + '?' + getSearchString(params));

  xhr.addEventListener('load', function(evt) {
    try {
      var data = JSON.parse(evt.target.response);
      callback(data);
    } catch(err) {
      console.log(err);
    }
  });

  xhr.send();
}

module.exports = load;
