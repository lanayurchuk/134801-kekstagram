'use strict';

var load = require('./load');
var Gallery = require('./gallery');
var Picture = require('./picture');

var gallery = new Gallery();

var filters = document.querySelector('.filters');
var container = document.querySelector('.pictures');
var footer = document.querySelector('footer');

var picturesLoadUrl = '/api/pictures';

var storedFilter = localStorage.getItem('filterPictures');
var activeFilter = storedFilter ? storedFilter : 'filter-popular';
var currentPage = 0;
var pageSize = 12;
var throttleTimeout = 100;
var GAP = 100;
var lastCall = Date.now();
// комбинированный массив со всеми подгружаемыми данными
var newData = [];
var renderedPictures = [];
var pictureIndex = 0;

var params = {
  from: currentPage * pageSize,
  to: currentPage * pageSize + pageSize,
  filter: activeFilter
};

if(storedFilter) {
  filters.querySelector('#' + storedFilter).checked = true;
}

hide(filters);
load(picturesLoadUrl, params, loadPictures);

function show(element) {
  element.classList.remove('hidden');
}

function hide(element) {
  element.classList.add('hidden');
}

function renderPictures(pictures) {
  var lastIndex = pageSize * currentPage;
  pictures.forEach(function(picture, index) {
    pictureIndex = index + lastIndex;
    var newElement = new Picture(picture, pictureIndex, gallery);
    container.appendChild(newElement.element);
    renderedPictures = renderedPictures.concat(newElement);
  });
}

function loadPictures(data) {
  newData = newData.concat(data);
  renderPictures(data);
  gallery.setPictures(newData);
  show(filters);
  autoCompletePage();
}

window.addEventListener('scroll', function() {
  if(Date.now() - lastCall >= throttleTimeout) {
    if (isFooterBottom) {
      showNextPage();
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
  removeRenderedPictures();

  newData = [];
  currentPage = 0;
  activeFilter = filterName;
  params = {
    from: currentPage,
    to: pageSize,
    filter: activeFilter
  };

  localStorage.setItem('filterPictures', params.filter);
  load(picturesLoadUrl, params, loadPictures);
}

function removeRenderedPictures() {
  renderedPictures.forEach(function(picture) {
    picture.removeEvent();
    container.removeChild(picture.element);
  });
  renderedPictures = [];
}

function isFooterBottom() {
  var footerRect = footer.getBoundingClientRect();
  var endPage = footerRect.bottom - window.innerHeight;
  return endPage <= GAP;
}

function showNextPage() {
  currentPage++;
  params = {
    from: currentPage * pageSize,
    to: currentPage * pageSize + pageSize,
    filter: activeFilter
  };

  load(picturesLoadUrl, params, loadPictures);
}

function autoCompletePage() {
  var clientHeight = document.body.clientHeight;
  var scrollHeight = document.body.scrollHeight;
  if (clientHeight < scrollHeight) {
    showNextPage();
  }
}
