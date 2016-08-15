function Pagination (rootSelector, total, current) {
	this.root = $(rootSelector); 
	this.total = total; 
	var current =  current || 0;
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
	this.render(); 
	this.installListeners(); 

}

Pagination.prototype = {
	render: function () {
		var current = this.current();
		var root = this.root; 
		function renderLink (params) { 
			var li = $('<li><a></a></li>'); 
			switch (params.type) {
				case 'dots': li.addClass('disabled').children('a').text('...'); 
							break;
				case 'number': if (params.active) li.addClass('active'); 
							   else li.children('a').attr('href', '#'); 
							   li.children('a').text(params.value); 
						   break;
				case 'arrow': if (params.value < 0) li.addClass('previous').children('a').html('&laquo;'); 
								else li.addClass('next').children('a').html('&raquo;'); 
								if (params.disabled) li.addClass('disabled'); 
								else li.children('a').attr('href', '#'); 
			}
			root.append(li);

		}
		this.root.empty();
		var centerLeft = Math.max(1, current -2); 
		var centerRight = Math.min(this.total - 2, current + 2); 
        var leftDots = centerLeft > 2; 
        var rightDots = centerRight < this.total - 3; 
        if (centerLeft == 2) centerLeft--; 
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
	installListeners: function () { 
		this.root.click( this.handleClick.bind(this) ); 
	},
	handleClick: function(event) { // 
		var current = this.current();
		var target = $(event.target); 
		if ( !target.is('a[href]')) return; 
		event.preventDefault(); 
		if ( target.parent().hasClass('previous') ) { 
			if ( current > 0) --current;
		} else if ( target.parent().hasClass('next') ) { 
			if ( current < this.total - 1) ++current;
		} else {
			current = +target.text() - 1; 
		}		

        this.current(current);
	},
	notify: function () {
		if (this.onPageChange) this.onPageChange(this.current());
	}
}
$(document).ready(function () { 
	var page = new Pagination('.pagination', 11, 4);
	page.onPageChange = function(page) {
		console.log(page);
	}

})

