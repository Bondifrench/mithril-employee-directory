var Header = {
	view: function(ctrl, args) {
		return m('h1.title', args.text);
	}
};

var SearchBar = {
	controller: function(args) {
		var ctrl = this;
		ctrl.searchKey = m.prop('');
		ctrl.searchHandler = function(event) {
			ctrl.searchKey(event.target.value);
			args.searchHandler(event.target.value);
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