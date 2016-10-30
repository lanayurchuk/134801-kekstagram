'use strict';

var getPictureElement = require('./picture');
var createCallback = require('./load');

var filters = document.querySelector('.filters');
var container = document.querySelector('.pictures');
var callbackNamePictures = 'CallbackPictures';
var picturesLoadUrl = 'http://localhost:1507/api/pictures?callback=' + callbackNamePictures;

hide(filters);
createCallback(picturesLoadUrl, loadPictures, callbackNamePictures);

function show(element) {
  element.classList.remove('hidden');
}

function hide(element) {
  element.classList.add('hidden');
}

function renderPictures(pictures) {
  pictures.forEach(function(picture) {
    var newElement = getPictureElement(picture);
    container.appendChild(newElement);
  });
}

function loadPictures(data) {
  renderPictures(data);
  show(filters);
}
