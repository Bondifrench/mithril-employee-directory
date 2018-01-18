var Header = {
	view: function(ctrl, args) {
		return m('header.bar.bar-nav', [
			m('a', {
				// config: m.route,
				href: window.location.pathname,
				class: 'icon icon-left-nav pull-left' + (args.back ? '' : ' hidden')
			}),
			m('h1.title', args.text)

		])
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
		return m('.bar.bar-standard.bar-header-secondary', [
			m('input[type=search]', {
				value: ctrl.searchKey(),
				oninput: ctrl.searchHandler //oninput fires at each single character change in the field
					// onchange fires when the field is blurred etc. see https://developer.mozilla.org/en-US/docs/Web/Events/change
			})
		])
	}
};

var EmployeeListItem = {
	view: function(ctrl, args) {
		return m('li.table-view-cell.media', [
			m('a', {
				config:m.route,
				href: window.location.href + 'employees/' + args.employee.id
			}, [
				m('img.media-object.small.pull-left', {
					src: 'pics/' + args.employee.firstName + '_' + args.employee.lastName + '.jpg'
				}),

				m('span', args.employee.firstName),
				m('span', ' '),
				m('span', args.employee.lastName),
				m('p', args.employee.title)
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
		return m('ul.table-view', items);
	}
}

var HomePage = {
	controller: function(args) {
		var ctrl = this;
		ctrl.employees = m.prop([]);
		ctrl.searchHandler = function(key) {
			args.service.findByName(key).then(function(result) {
				// ctrl.searchKey(key); <--- see line 58 of https://github.com/ccoenraets/react-employee-directory/blob/master/iteration4/js/app.js
				ctrl.employees(result);
			})
		}

	},
	view: function(ctrl, args) {
		return m('div', [
			m.component(Header, {
				text: 'Employee Directory',
				back: false
			}),
			m.component(SearchBar, {
				searchHandler: ctrl.searchHandler
			}),
			m('div.content', [
				m.component(EmployeeList, {
					employees: ctrl.employees()
				})
			])
		])
	}
}

var EmployeePage = {
	controller: function(args) {
		var ctrl = this;
		ctrl.employee = m.prop({});
		args.service.findById(m.route.param('Id')).then(function(result) {
			ctrl.employee(result)
		})
	},
	view: function(ctrl, args) {
		return m('div', [
			m.component(Header, {
				text: 'Employee Details',
				back: true
			}),
			m('.card', [
				m('ul.table-view', [
					m('li.table-view-cell.media', [
						m('img.media-object.big.pull-left', {
							src: 'pics/' + ctrl.employee().firstName + '_' + ctrl.employee().lastName + '.jpg'
						}),
						m('h1', [
							m('span', ctrl.employee().firstName),
							m('span', ' '),
							m('span', ctrl.employee().lastName)
						]),
						m('p', ctrl.employee().title)
					]),
					m('li.table-view-cell.media', [
						m('a.push-right', {
							href: 'tel:' + ctrl.employee().officePhone
						}, [
							m('span.media-object.pull-left.icon.icon-call'),
							m('.media-body', 'Call Office', [
								m('p', ctrl.employee().officePhone)
							])
						])
					]),
					m('li.table-view-cell.media', [
						m('a.push-right', {
							href: 'sms:' + ctrl.employee().mobilePhone
						}, [
							m('span.media-object.pull-left.icon.icon-sms'),
							m('.media-body', 'SMS', [
								m('p', ctrl.employee().mobilePhone)
							])
						])
					]),
					m('li.table-view-cell.media', [
						m('a.push-right', {
							href: 'mailto:' + ctrl.employee().email
						}, [
							m('span.media-object.pull-left.icon.icon-email'),
							m('.media-body', 'Email', [
								m('p', ctrl.employee().email)
							])
						])
					])
				])
			])
		])
	}
}

m.route.mode = "hash";
m.route(document.body, '/', {
	'/': m.component(HomePage, {
		service: employeeService
	}),
	'/employees/:Id': m.component(EmployeePage, {
		service: employeeService
	})
})