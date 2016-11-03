'use strict';

function Gallery() {
  this.pictures = [];
  this.activePicture = 0;
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.closeElement = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.galleryImage = this.galleryContainer.querySelector('.gallery-overlay-image');
}

Gallery.prototype.setPictures = function(pictures) {
  this.pictures = pictures;
};

Gallery.prototype.show = function(number) {
  this.closeElement.onclick = this.hide.bind(this);
  this.galleryImage.onclick = this.showNextImage.bind(this);
  this.galleryContainer.classList.remove('invisible');
  this.setActivePicture(number);
};

Gallery.prototype.showNextImage = function() {
  var index = (this.activePicture < this.pictures.length - 1) ? ++this.activePicture : 0;
  this.setActivePicture(index);
};

Gallery.prototype.hide = function() {
  this.galleryContainer.classList.add('invisible');
  this.closeElement.onclick = null;
  this.galleryImage.onclick = null;
};

Gallery.prototype.setActivePicture = function(number) {
  this.activePicture = number;

  this.galleryLikes = this.galleryContainer.querySelector('.likes-count');
  this.galleryComments = this.galleryContainer.querySelector('.comments-count');

  var image = this.pictures[number];

  this.galleryImage.src = image.url;
  this.galleryLikes.textContent = image.likes;
  this.galleryComments.textContent = image.comments;
};

module.exports = Gallery;
