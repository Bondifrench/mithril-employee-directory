
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
				href: window.location.href+'employees/' + args.employee.id
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

var EmployeePage = {
	controller: function (args) {
		var ctrl = this;
		ctrl.employee = m.prop({});
		args.service.findById(m.route.param('Id')).then(function (result) {
				ctrl.employee(result)
			})
	},
	view: function (ctrl, args) {
		return m('div',[
			m.component(Header, {text: 'Employee Details'}),
			m('h3', ctrl.employee().firstName + ctrl.employee().lastName),
			ctrl.employee().title
			])
	}	
}

m.route(document.body, '/', {
	'/': m.component(HomePage, {service: employeeService}),
	'/employees/:Id': m.component(EmployeePage, {service: employeeService})
})
