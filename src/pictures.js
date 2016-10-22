'use strict';

(function() {
  var filters = document.querySelector('.filters');
  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var templateContainer = 'content' in template ? template.content : template;

  // разметка для вывода изображения
  var templateElement = templateContainer.querySelector('.picture');

  // ширина и высота загруженной фотографии
  var WIDTH = 182;
  var HEIGHT = 182;

  var pictures = [
    {
      'likes': 40,
      'comments': 12,
      'url': 'photos/1.jpg'
    }, {
      'likes': 125,
      'comments': 49,
      'url': 'photos/2.jpg'
    }, {
      'likes': 350,
      'comments': 20,
      'url': 'failed.jpg'
    }, {
      'likes': 61,
      'comments': 0,
      'url': 'photos/4.jpg'
    }, {
      'likes': 100,
      'comments': 18,
      'url': 'photos/5.jpg'
    }, {
      'likes': 88,
      'comments': 56,
      'url': 'photos/6.jpg'
    }, {
      'likes': 328,
      'comments': 24,
      'url': 'photos/7.jpg'
    }, {
      'likes': 4,
      'comments': 31,
      'url': 'photos/8.jpg'
    }, {
      'likes': 328,
      'comments': 58,
      'url': 'photos/9.jpg'
    }, {
      'likes': 25,
      'comments': 65,
      'url': 'photos/10.jpg'
    }, {
      'likes': 193,
      'comments': 31,
      'url': 'photos/11.jpg'
    }, {
      'likes': 155,
      'comments': 7,
      'url': 'photos/12.jpg'
    }, {
      'likes': 369,
      'comments': 26,
      'url': 'photos/13.jpg'
    }, {
      'likes': 301,
      'comments': 42,
      'url': 'photos/14.jpg'
    }, {
      'likes': 241,
      'comments': 27,
      'url': 'photos/15.jpg'
    }, {
      'likes': 364,
      'comments': 2,
      'url': 'photos/16.jpg'
    }, {
      'likes': 115,
      'comments': 21,
      'url': 'photos/17.jpg'
    }, {
      'likes': 228,
      'comments': 29,
      'url': 'photos/18.jpg'
    }, {
      'likes': 53,
      'comments': 26,
      'url': 'photos/19.jpg'
    }, {
      'likes': 240,
      'comments': 46,
      'url': 'photos/20.jpg'
    }, {
      'likes': 290,
      'comments': 69,
      'url': 'photos/21.jpg'
    }, {
      'likes': 283,
      'comments': 33,
      'url': 'photos/22.jpg'
    }, {
      'likes': 344,
      'comments': 65,
      'url': 'photos/23.jpg'
    }, {
      'likes': 216,
      'comments': 27,
      'url': 'photos/24.jpg'
    }, {
      'likes': 241,
      'comments': 36,
      'url': 'photos/25.jpg'
    }, {
      'likes': 100,
      'comments': 11,
      'url': 'photos/26.mp4',
      'preview': 'photos/26.jpg'
    }];

  filters.classList.add('hidden');
  renderPictures();
  filters.classList.remove('hidden');

  function getPictureElement(picture) {
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

  function renderPictures() {
    pictures.forEach(function(picture) {
      var newElement = getPictureElement(picture);
      container.appendChild(newElement);
    });
  }
})();
