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

  var storedFilter = localStorage.getItem('filterPictures');
  this.activeFilter = storedFilter || 'filter-popular';
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

  var throttleTimeout = 100;
  var lastCall = Date.now();
  var self = this;

  this.filters.querySelector('#' + this.activeFilter).checked = true;

  this.renderPictures = this.renderPictures.bind(this);
  this.loadPictures = this.loadPictures.bind(this);
  this.changeFilter = this.changeFilter.bind(this);
  this.removeRenderedPictures = this.removeRenderedPictures.bind(this);
  this.isFooterBottom = this.isFooterBottom.bind(this);
  this.showNextPage = this.showNextPage.bind(this);
  this.autoCompletePage = this.autoCompletePage.bind(this);

  this.hide(this.filters);
  load(this.picturesLoadUrl, this.params, this.loadPictures);

  window.addEventListener('scroll', function() {
    if(Date.now() - lastCall >= throttleTimeout) {
      if (self.isFooterBottom) {
        self.showNextPage();
      }
      lastCall = Date.now();
    }
  });

  this.filters.addEventListener('click', function(evt) {
    if(evt.target.classList.contains('filters-radio')) {
      self.changeFilter(evt.target.id);
    }
  });
}

Pictures.prototype.loadPictures = function(data) {
  this.newData = this.newData.concat(data);
  this.renderPictures(data);
  this.gallery.setPictures(this.newData);
  this.show(this.filters);
  this.autoCompletePage();
};

Pictures.prototype.renderPictures = function(pictures) {
  var self = this;
  var lastIndex = this.pageSize * this.currentPage;
  pictures.forEach(function(picture, index) {
    self.pictureIndex = index + lastIndex;
    var newElement = new Picture(picture, self.pictureIndex, self.gallery);
    self.container.appendChild(newElement.element);
    self.renderedPictures = self.renderedPictures.concat(newElement);
  });
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
  var self = this;
  this.renderedPictures.forEach(function(picture) {
    picture.removeEvent();
    self.container.removeChild(picture.element);
  });
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

Pictures.prototype.show = function(element) {
  element.classList.remove('hidden');
};

Pictures.prototype.hide = function(element) {
  element.classList.add('hidden');
};

var pictures = new Pictures();
pictures();
