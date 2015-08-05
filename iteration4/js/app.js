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
	controller: function (options) {
		var ctrl = this;
		ctrl.employees = m.prop([]);
		ctrl.searchHandler = function (key) {
			options.service.findByName(key).then(function (result) {
				// ctrl.searchKey(key); <--- see line 58 of https://github.com/ccoenraets/react-employee-directory/blob/master/iteration4/js/app.js
				ctrl.employees(result);
			})
		}

	},
	view: function(ctrl, options) {
		return m('div', [
			m.component(Header, {
				text: 'Employee Directory'
			}),
			m.component(SearchBar, {searchHandler: ctrl.searchHandler}),
			m.component(EmployeeList, {
				employees: ctrl.employees()
			})
		])
	}
}

m.mount(document.body, m.component(HomePage, {service: employeeService}));