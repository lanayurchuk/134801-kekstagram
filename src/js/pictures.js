'use strict';

var load = require('./load');
var Gallery = require('./gallery');
var Picture = require('./picture');

function Pictures() {
  this.gallery = new Gallery();

  this.filters = document.querySelector('.filters');
  this.container = document.querySelector('.pictures');
  this.footer = document.querySelector('footer');

  this.picturesLoadUrl = '/api/pictures';
  this.activeFilter = localStorage.getItem('filterPictures') || 'filter-popular';
  this.currentPage = 0;
  this.pageSize = 12;
  this.GAP = 100;
  // комбинированный массив со всеми подгружаемыми данными
  this.newData = [];
  this.renderedPictures = [];
  this.pictureIndex = 0;
  this.params = {
    from: this.currentPage * this.pageSize,
    to: this.currentPage * this.pageSize + this.pageSize,
    filter: this.activeFilter
  };

  this.filters.querySelector('#' + this.activeFilter).checked = true;

  this.hide(this.filters);
  this.loadPictures = this.loadPictures.bind(this);
  load(this.picturesLoadUrl, this.params, this.loadPictures);
  this.attachHandlers();
}

Pictures.prototype.loadPictures = function(data) {
  this.newData = this.newData.concat(data);
  this.renderPictures(data);
  this.gallery.setPictures(this.newData);
  this.show(this.filters);
  this.autoCompletePage();
};

Pictures.prototype.renderPictures = function(pictures) {
  var lastIndex = this.pageSize * this.currentPage;
  pictures.forEach(function(picture, index) {
    this.pictureIndex = index + lastIndex;
    var newElement = new Picture(picture, this.pictureIndex, this.gallery);
    this.container.appendChild(newElement.element);
    this.renderedPictures = this.renderedPictures.concat(newElement);
  }, this);
};

Pictures.prototype.showNextPage = function() {
  this.currentPage++;
  this.params = {
    from: this.currentPage * this.pageSize,
    to: this.currentPage * this.pageSize + this.pageSize,
    filter: this.activeFilter
  };

  load(this.picturesLoadUrl, this.params, this.loadPictures);
};

Pictures.prototype.removeRenderedPictures = function() {
  this.renderedPictures.forEach(function(picture) {
    picture.removeEvent();
    this.container.removeChild(picture.element);
  }, this);
  this.renderedPictures = [];
};

Pictures.prototype.changeFilter = function(filterName) {
  this.removeRenderedPictures();

  this.newData = [];
  this.currentPage = 0;
  this.activeFilter = filterName;
  this.params = {
    from: this.currentPage,
    to: this.pageSize,
    filter: this.activeFilter
  };

  localStorage.setItem('filterPictures', this.params.filter);
  load(this.picturesLoadUrl, this.params, this.loadPictures);
};

Pictures.prototype.isFooterBottom = function() {
  var footerRect = this.footer.getBoundingClientRect();
  var endPage = footerRect.bottom - window.innerHeight;
  return endPage <= this.GAP;
};

Pictures.prototype.autoCompletePage = function() {
  var clientHeight = document.body.clientHeight;
  var scrollHeight = document.body.scrollHeight;
  if (clientHeight < scrollHeight) {
    this.showNextPage();
  }
};

Pictures.prototype.attachHandlers = function() {
  var throttleTimeout = 100;
  var lastCall = Date.now();
  var self = this;

  window.addEventListener('scroll', function() {
    if(Date.now() - lastCall >= throttleTimeout) {
      if (self.isFooterBottom) {
        self.showNextPage();
      }
      lastCall = Date.now();
    }
  });

  this.filters.addEventListener('click', function(event) {
    if(event.target.classList.contains('filters-radio')) {
      self.changeFilter(event.target.id);
    }
  });
};

Pictures.prototype.show = function(element) {
  element.classList.remove('hidden');
};

Pictures.prototype.hide = function(element) {
  element.classList.add('hidden');
};

module.exports = new Pictures();
