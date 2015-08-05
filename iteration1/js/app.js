var Header = {
	view: function (ctrl, options) {
		return m('h1.title', options.text);
	}
};

var SearchBar = {
	view: function () {
		return m('input[type=search]');
	}
};

var EmployeeList = {
	view: function () {
		return m('ul', [
			m('li', 'Leo Horie'),
			m('li', 'Barney Carroll')
			])
	}
};

var HomePage = {
	view: function () {
		return m('div', [
			m.component(Header, {text: 'Employee Directory'}),
			m.component(SearchBar),
			m.component(EmployeeList)
			])
	}
}

m.mount(document.body, HomePage);