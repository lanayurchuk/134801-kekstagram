'use strict';

function Gallery() {
  this.pictures = [];
  this.activePicture = 0;
  this.containerEl = document.querySelector('.gallery-overlay');
  this.closeEl = this.containerEl.querySelector('.gallery-overlay-close');
  this.imageEl = this.containerEl.querySelector('.gallery-overlay-image');
}

Gallery.prototype.setPictures = function(pictures) {
  this.pictures = pictures;
};

Gallery.prototype.show = function(number) {
  this.hide = this.hide.bind(this);
  this.showNextImage = this.showNextImage.bind(this);

  this.closeEl.addEventListener('click', this.hide);
  this.imageEl.addEventListener('click', this.showNextImage);

  this.containerEl.classList.remove('invisible');
  this.setActivePicture(number);
};

Gallery.prototype.showNextImage = function() {
  var index = (this.activePicture < this.pictures.length - 1) ? (this.activePicture + 1) : 0;
  this.setActivePicture(index);
};

Gallery.prototype.hide = function() {
  this.containerEl.classList.add('invisible');
  this.closeEl.removeEventListener('click', this.hide);
  this.imageEl.removeEventListener('click', this.showNextImage);
};

Gallery.prototype.setActivePicture = function(number) {
  this.activePicture = number;

  this.likeEl = this.containerEl.querySelector('.likes-count');
  this.commentEl = this.containerEl.querySelector('.comments-count');

  var image = this.pictures[number];

  this.imageEl.src = image.url;
  this.likeEl.textContent = image.likes;
  this.commentEl.textContent = image.comments;
};

module.exports = Gallery;
