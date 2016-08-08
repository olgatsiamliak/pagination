function Pagination (rootSelector, total, current) {
	this.root = $(rootSelector); // селектор контейнера
	this.total = total; // итого страниц	
	var current =  current || 0; // если значение не задано, то = 0
	this.current = function (value) {
		if (!arguments.length) return current;
		if (typeof(value) != 'number') return;
		if ( value < 0 ) value = 0;
		else if ( value >= this.total ) value = this.total - 1;
		if (current != value) {
			current = value;
			this.notify();
			this.render();
		}
		  
	}
	this.render(); // метод, который генерирует разметку компонента 
	this.installListeners(); // метод, который расставляет все орбаботчики, делаем однократно

}

Pagination.prototype = {
	render: function () {
		var current = this.current();
		var root = this.root; // записали в переменную текущий контекст this, чтобы в ф-ции renderLink он был доступен
		function renderLink (params) { 
			var li = $('<li><a></a></li>'); // шаблон, который верен для всех элементов нашего pagination
			switch (params.type) {
				case 'dots': li.addClass('disabled').children('a').text('...'); // если тип многоточие, то добавляем класс disabled (чтоб ссыль была не кликабельна)
							break;
				case 'number': if (params.active) li.addClass('active'); // если есть в объекте параметр active, то вешаем класс
							   else li.children('a').attr('href', '#'); // если нет активный, то добавляем атрибут href
							   li.children('a').text(params.value); // записываем контент
						   break;
				case 'arrow': if (params.value < 0) li.addClass('previous').children('a').html('&laquo;'); // если стрелки, то добавляем класс следующий/ предыдущий и текст
								else li.addClass('next').children('a').html('&raquo;'); 
								if (params.disabled) li.addClass('disabled'); // если есть параметр disable, т.е. активные крайние элементы, то делаем не кликабельными стрелки
								else li.children('a').attr('href', '#'); // в остальных случая добавляем атрибут href
			}
			root.append(li);

		}
		this.root.empty();
		var centerLeft = Math.max(1, current -2); // левая сторона от активного элемента (1 - если крайнее значение активно)
		var centerRight = Math.min(this.total - 2, current + 2); // правая стороны от активного элемента (итого - 2 для крайнего элемента)
        var leftDots = centerLeft > 2; // многоточие появляется если разница больше двух элементов
        var rightDots = centerRight < this.total - 3; 
        if (centerLeft == 2) centerLeft--; // если разница два элемента, значит ставим элемент, вместо многоточия
        if (centerRight == this.total - 3) centerRight++;

		renderLink({
				type: 'arrow',
				value: -1,
				disabled: current == 0
			})
		renderLink({
				type: 'number',
				value: 1,
				active: current == 0
			})
		if (leftDots) renderLink({
				type: 'dots'
			})

		for (var i = centerLeft; i <= centerRight; ++i) { 
			renderLink({
				type: 'number',
				value: i + 1,
				active: current == i
			})
		}

		if (rightDots) renderLink({
			type: 'dots'
		})		

		renderLink({
			type: 'number',
			value: this.total,
			active: current == this.total - 1
		})

		renderLink({
			type: 'arrow',
			value: +1,
			disabled: current == this.total - 1
		})

	},
	installListeners: function () { // вешаем событие клика на корневой элемент; устанавливаем обработчик; функция nofity; меняем модель и вызываем функцию render;
		this.root.click( this.handleClick.bind(this) ); // клик на контейнер и обработчик с закреплением контекста this
	},
	handleClick: function(event) { // 
		var current = this.current();
		var target = $(event.target); // записали событие клика в переменную  
		if ( !target.is('a[href]')) return; // если кликнули не по a, у которой есть href, то нам это не интересно
		event.preventDefault(); // дефолтные браузеровские штуки событий заблокировали
		if ( target.parent().hasClass('previous') ) { // если кликнули по стрелке предыдущий, то активный класс вешаем на активный - 1
			if ( current > 0) --current;
		} else if ( target.parent().hasClass('next') ) { // если по следующей, то активная будет + 1
			if ( current < this.total - 1) ++current;
		} else {
			current = +target.text() - 1; // по всех других случаях, активный будет текст страницы, преобразованный в число -1 (т.к. нумерация с нуля)
		}		

        this.current(current);
	},
	notify: function () {
		if (this.onPageChange) this.onPageChange(this.current());
	}
}
$(document).ready(function () { // создаем новый экземпляр класса
	var page = new Pagination('.pagination', 11, 4);
	page.onPageChange = function(page) {
		console.log(page);
	}

})

