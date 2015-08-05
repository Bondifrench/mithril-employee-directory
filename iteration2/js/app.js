var Header = {
	view: function(ctrl, args) {
		return m('h1.title', args.text);
	}
};

var SearchBar = {
	view: function() {
		return m('input[type=search]');
	}
};

var EmployeeListItem = {
	view: function(ctrl, args) {
		return m('li', [
			m('a', {
				href: '#employees/' + args.employee.id
			}, [
				m('span', args.employee.firstName),
				m('span', args.employee.lastName)
			])
		])
	}
};

var EmployeeList = {
	view: function(ctrl, args) {
		var items = args.employees.map(function(employee) {
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