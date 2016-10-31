'use strict';

function getPictureElement(picture, index) {
  var gallery = require('./gallery');

  var template = document.querySelector('#picture-template');
  var templateContainer = 'content' in template ? template.content : template;

  // разметка для вывода изображения
  var templateElement = templateContainer.querySelector('.picture');

  // ширина и высота загруженной фотографии
  var WIDTH = 182;
  var HEIGHT = 182;

  var pictureElement = templateElement.cloneNode(true);
  var photoElement = pictureElement.querySelector('img');

  var photo = new Image();

  photo.onload = function() {
    photoElement.src = photo.src;
    photoElement.width = WIDTH;
    photoElement.height = HEIGHT;
  };

  photo.onerror = function() {
    pictureElement.classList.add('picture-load-failure');
  };

  pictureElement.onclick = function(evt) {
    gallery.show(index);
    evt.preventDefault();
  };

  photo.src = picture.url;

  return pictureElement;
}

module.exports = getPictureElement;
