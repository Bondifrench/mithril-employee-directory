var Header = {
	view: function(ctrl, options) {
		return m('h1.title', options.text);
	}
};

var SearchBar = {
	controller: function(options) {
		var ctrl = this;
		ctrl.searchKey = m.prop('');
		ctrl.searchHandler = function(event) {
			ctrl.searchKey(event.target.value);
			options.searchHandler(event.target.value);
		};
	},
	view: function(ctrl) {
		return m('input[type=search]', {
			value: ctrl.searchKey(),
			oninput: ctrl.searchHandler
		});
	}
};

var EmployeeListItem = {
	view: function(ctrl, options) {
		return m('li', [
			m('a', {
				href: '#employees/' + options.employee.id
			}, [
				m('span', options.employee.firstName),
				m('span', options.employee.lastName)
			])
		])
	}
};

var EmployeeList = {
	view: function(ctrl, options) {
		var items = options.employees.map(function(employee) {
			return m.component(EmployeeListItem, {
				key: employee.id,
				employee: employee
			})
		})
		return m('ul', items);
	}
}

var HomePage = {
	controller: function () {
		var ctrl = this;
		ctrl.searchHandler = function (key) {
			alert('Search key:' + key);
		}

	},
	view: function(ctrl) {
		var employees = [{
			firstName: 'Leo ',
			lastName: 'Horie '
		}, {
			firstName: 'Barney ',
			lastName: 'Carroll '
		}, {
			firstName: 'Stephan ',
			lastName: 'Hoyer '
		}];
		return m('div', [
			m.component(Header, {
				text: 'Employee Directory'
			}),
			m.component(SearchBar, {searchHandler: ctrl.searchHandler}),
			m.component(EmployeeList, {
				employees: employees
			})
		])
	}
}

m.mount(document.body, HomePage);