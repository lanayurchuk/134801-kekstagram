'use strict';

function getPictureElement(picture) {
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

  photo.src = picture.url;

  return pictureElement;
}

function Picture(picture, index, galleryObj) {
  this.data = picture;
  this.gallery = galleryObj;
  this.index = index;

  this.element = getPictureElement(this.data);

  this.showGallery = this.showGallery.bind(this);
  this.element.addEventListener('click', this.showGallery);
}

Picture.prototype.showGallery = function(evt) {
  evt.preventDefault();
  this.gallery.show(this.index);
  this.removeEvent();
};

Picture.prototype.removeEvent = function() {
  this.element.removeEventListener('click', this.showGallery);
};

module.exports = Picture;
