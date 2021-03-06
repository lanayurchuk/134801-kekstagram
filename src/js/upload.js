/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  var cleanupResizer = function() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  };

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  var updateBackground = function() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  };

  //Валидация формы
  var resizeX = document.querySelector('#resize-x');
  var resizeY = document.querySelector('#resize-y');
  var resizeSize = document.querySelector('#resize-size');
  var resizeFwd = document.querySelector('#resize-fwd');
  var uploadResizeControls = document.querySelector('.upload-resize-controls');

  resizeX.addEventListener('input', checkInputValues);
  resizeY.addEventListener('input', checkInputValues);
  resizeSize.addEventListener('input', checkInputValues);

  //валидация введеных данных
  function checkInputValues() {
    var left = parseInt(resizeX.value, 10);
    var top = parseInt(resizeY.value, 10);
    var size = parseInt(resizeSize.value, 10);
    var wrongValues = isNaN(left) || isNaN(top) || isNaN(size);
    var resizeWidth = (left + size) <= currentResizer._image.naturalWidth;
    var resizeHeight = (top + size) <= currentResizer._image.naturalHeight;

    resizeX.min = 0;
    resizeY.min = 0;
    resizeSize.min = 0;

    if (wrongValues || !resizeWidth || !resizeHeight) {
      resizeFwd.disabled = true;
      return false;
    }

    resizeFwd.disabled = false;
    return true;
  }

    /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    return checkInputValues();
  }

   /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  var showMessage = function(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  };

  var hideMessage = function() {
    uploadMessage.classList.add('invisible');
  };

  uploadForm.addEventListener('change', changeUploadForm);
  resizeForm.addEventListener('reset', resetResizeForm);
  resizeForm.addEventListener('submit', submitResizeForm);
  filterForm.addEventListener('reset', resetFilterForm);
  filterForm.addEventListener('submit', submitFilterForm);
  filterForm.addEventListener('change', changeFilterForm);

  /**
   * Двусторонняя связь между формой кадрирования и объектом Resizer.
   * Синхронизировались их значений между собой.
   */
  window.addEventListener('resizerchange', getCurrentResizerData);
  uploadResizeControls.addEventListener('input', setNewResizerData);

  function getCurrentResizerData() {
    var constraints = currentResizer.getConstraint();

    resizeX.value = Math.round(constraints.x);
    resizeY.value = Math.round(constraints.y);
    resizeSize.value = Math.round(constraints.side);
  }

  function setNewResizerData() {
    var left = parseInt(resizeX.value, 10);
    var top = parseInt(resizeY.value, 10);
    var size = parseInt(resizeSize.value, 10);

    currentResizer.setConstraint(left, top, size);
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  function changeUploadForm(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        });

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  }

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  function resetResizeForm(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  }

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  function submitResizeForm(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {

      var image = currentResizer.exportImage().src;

      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      resizeForm.classList.add('invisible');
      applyStoredFilter();
      filterForm.classList.remove('invisible');
    }
  }

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  function resetFilterForm(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  }

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  function submitFilterForm(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();
    setFilterCookie();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  }

  function setFilterCookie() {
    var cookies = window.Cookies;
    var filters = filterForm.elements['upload-filter'];
    var selectedFilter = filters.value;

    cookies.set('upload-filter', selectedFilter, { expires: getDaysAfterHopper() });
  }

  function applyStoredFilter() {
    var cookies = window.Cookies;
    var selectedFilter = cookies.get('upload-filter');

    if (!selectedFilter) {
      return;
    }

    var imagePreview = document.querySelector('.filter-image-preview');
    var filter = document.querySelector('#upload-filter-' + selectedFilter);

    imagePreview.classList.add('filter-' + selectedFilter);
    filter.checked = true;
  }

  // Количество дней, прошедших с последнего прошедшего дня рождения Грейс Хоппер
  function getDaysAfterHopper() {
    var today = new Date();
    var todayYear = today.getFullYear();
    var birthHopper = new Date(todayYear, 11, 9);
    var msPerDay = 24 * 60 * 60 * 1000;

    if (today < birthHopper) {
      birthHopper.setFullYear(todayYear - 1);
    }

    var cookieTime = Math.floor((today - birthHopper) / msPerDay);
    return cookieTime;
  }

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  function changeFilterForm() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  }

  cleanupResizer();
  updateBackground();
})();
