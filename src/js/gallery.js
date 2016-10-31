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
  var self = this;

  this.closeElement.onclick = function() {
    self.hide();
  };

  this.galleryImage.onclick = function() {
    if (number < self.pictures.length - 1) {
      self.setActivePicture(++number);
    } else {
      number = 0;
      self.setActivePicture(0);
    }
  };

  this.galleryContainer.classList.remove('invisible');
  this.setActivePicture(number);
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

  var bigImage = this.pictures[number];

  this.galleryImage.src = bigImage.url;
  this.galleryLikes.textContent = bigImage.likes;
  this.galleryComments.textContent = bigImage.comments;
};

module.exports = new Gallery();
