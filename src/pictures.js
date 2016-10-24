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

  filters.classList.add('hidden');

  var callbackNamePictures = 'CallbackPictures';
  var picturesLoadUrl = 'http://localhost:1507/api/pictures?callback=' + callbackNamePictures;

  loadPictures(picturesLoadUrl, renderPictures);

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

  function renderPictures(pictures) {
    pictures.forEach(function(picture) {
      var newElement = getPictureElement(picture);
      container.appendChild(newElement);
    });
  }

  function loadPictures(url, callback) {
    window[callbackNamePictures] = function(data) {
      callback(data);
    }

    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }
})();
