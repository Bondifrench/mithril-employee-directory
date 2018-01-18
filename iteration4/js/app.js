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
			var searchKey = event.target.value; 
			ctrl.searchKey(searchKey);
			args.searchHandler(searchKey);
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
				config: m.route,
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
	controller: function (args) {
		var ctrl = this;
		ctrl.employees = m.prop([]);
		ctrl.searchHandler = function (key) {
			args.service.findByName(key).then(function (result) {
				// ctrl.searchKey(key); <--- see line 58 of https://github.com/ccoenraets/react-employee-directory/blob/master/iteration4/js/app.js
				ctrl.employees(result);
			})
		}

	},
	view: function(ctrl, args) {
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