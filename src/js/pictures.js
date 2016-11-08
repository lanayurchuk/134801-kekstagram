'use strict';

var load = require('./load');
var Gallery = require('./gallery');
var Picture = require('./picture');

var gallery = new Gallery();

var filters = document.querySelector('.filters');
var container = document.querySelector('.pictures');
var footer = document.querySelector('footer');

var picturesLoadUrl = '/api/pictures';

var activeFilter = 'filter-popular';
var currentPage = 0;
var pageSize = 12;
var throttleTimeout = 100;
var GAP = 100;
var lastCall = Date.now();

var params = {
  from: currentPage * pageSize,
  to: currentPage * pageSize + pageSize,
  filter: activeFilter
};

hide(filters);
load(picturesLoadUrl, params, loadPictures);

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

window.addEventListener('scroll', function() {
  if(Date.now() - lastCall >= throttleTimeout) {
    if (footer.getBoundingClientRect().top - window.innerHeight <= GAP) {
      params.from = ++currentPage * pageSize;
      params.to = params.from + pageSize;

      load(picturesLoadUrl, params, loadPictures);
    }
    lastCall = Date.now();
  }
});

filters.addEventListener('click', function(evt) {
  if(evt.target.classList.contains('filters-radio')) {
    changeFilter(evt.target.id);
  }
});

function changeFilter(filterName) {
  container.innerHTML = '';
  currentPage = 0;
  activeFilter = filterName;

  params.from = currentPage;
  params.to = pageSize;
  params.filter = activeFilter;

  load(picturesLoadUrl, params, loadPictures);
}
