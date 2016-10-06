var getMessage = function(a, b) {
	if (typeof(a) == 'boolean' && a == true) {
		return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
	}
	else if (typeof(a) == 'boolean' && a == false) {
		return 'Переданное GIF-изображение не анимировано';
	}
	else if (typeof(a) == 'number') {
		return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
	}
	else if (Array.isArray(a) && !(Array.isArray(b))) {
		var amountOfRedPoints = 0;
		var i = 0;
		while (i < a.length) {
			amountOfRedPoints += a[i]; 
			i++;
		}
		return 'Количество красных точек во всех строчках изображения: ' + amountOfRedPoints ;
	}
	else if (Array.isArray(a) && Array.isArray(b)) {
		var artifactsSquare = 0;
		var i = 0;
		while (i < a.length) {
			artifactsSquare += a[i] * b[i];
			i++;
		}
		return 'Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей';
	}
	else {
		return 'Переданы некорректные данные';
	}
}