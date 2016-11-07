'use strict';

var createCallback = require('./load');
var Gallery = require('./gallery');
var Picture = require('./picture');

var gallery = new Gallery();

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
  pictures.forEach(function(picture, index) {
    var newElement = new Picture(picture, index, gallery);
    container.appendChild(newElement.element);
  });
}

function loadPictures(data) {
  renderPictures(data);
  gallery.setPictures(data);
  show(filters);
}
