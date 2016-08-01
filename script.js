function Pagination (rootSelector, total, current) {
	this.root = $(rootSelector); // селектор контейнера
	this.total = total; // итого страниц
	this.current = current || 0; // если значение не задано, то = 0
	this.render(); // метод, который генерирует разметку компонента 
	this.installListeners(); // метод, который расставляет все орбаботчики, делаем однократно
}

Pagination.prototype = {
	render: function () {
		this.root.empty(); // удалить все с контейнера
		for (var i = 1; i <= this.total; ++i) { 
			var li = $('<li><a href="#">' + i + '</a></li>'); // шаблон одного элемента навигации (страницы)
			if ((i - 1) == this.current ) li.addClass('active').children('a').removeAttr('href'); // если элемент активный, то вешаем класс и удаляем аттрибут href у ссылки
			li.appendTo(this.root); // добавляем li к контейнеру root
		}
	},
	installListeners: function () { // вешаем событие клика на корневой элемент; устанавливаем обработчик; функция nofity; меняем модель и вызываем функцию render;

	}

}

$(document).ready(function () { // создаем новый экземпляр класса
	new Pagination('.pagination', 25, 5);
})

