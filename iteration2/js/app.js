var Header = {
	view: function(ctrl, options) {
		return m('h1.title', options.text);
	}
};

var SearchBar = {
	view: function() {
		return m('input[type=search]');
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
	view: function() {
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
			m.component(SearchBar),
			m.component(EmployeeList, {
				employees: employees
			})
		])
	}
}

m.mount(document.body, HomePage);