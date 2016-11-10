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
// комбинированный массив со всеми подгружаемыми данными
var newData = [];

var params = {
  from: currentPage * pageSize,
  to: currentPage * pageSize + pageSize,
  filter: activeFilter
};

hide(filters);
load(picturesLoadUrl, params, loadPictures);
autoCompletePage();

function show(element) {
  element.classList.remove('hidden');
}

function hide(element) {
  element.classList.add('hidden');
}

function renderPictures(pictures) {
  pictures.forEach(function(picture, index) {
    var indexPic = index + (pageSize * currentPage);
    var newElement = new Picture(picture, indexPic, gallery);
    container.appendChild(newElement.element);
  });
}

function loadPictures(data) {
  newData = newData.concat(data);
  renderPictures(data);
  gallery.setPictures(newData);
  show(filters);
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
  container.innerHTML = '';
  newData = [];
  currentPage = 0;
  activeFilter = filterName;

  params.from = currentPage;
  params.to = pageSize;
  params.filter = activeFilter;

  load(picturesLoadUrl, params, loadPictures);
  autoCompletePage();
}

function isFooterBottom() {
  var footerRect = footer.getBoundingClientRect();
  var endPage = footerRect.bottom - window.innerHeight;
  return endPage <= GAP;
}

function showNextPage() {
  params.from = ++currentPage * pageSize;
  params.to = params.from + pageSize;
  load(picturesLoadUrl, params, loadPictures);
}

function autoCompletePage() {
  var clientHeight = document.body.clientHeight;
  var scrollHeight = document.body.scrollHeight;
  if (clientHeight < scrollHeight) {
    showNextPage();
  }
}
