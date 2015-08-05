var Header = {
	view: function(ctrl, options) {
		return m('header.bar.bar-nav', [
			m('a', {
				href: '#',
				class: '.icon.icon-left-nav.pull-left' + (options.back ? '' : ' hidden')
			}),
			m('h1.title', options.text)

		])
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
	view: function(ctrl, options) {
		return m('li.table-view-cell.media', [
			m('a', {
				href: window.location.href + 'employees/' + options.employee.id
			}, [
				m('img.media-object.small.pull-left', {
					src: 'pics/' + options.employee.firstName + '_' + options.employee.lastName + '.jpg'
				}),

				m('span', options.employee.firstName),
				m('span', options.employee.lastName),
				m('p', options.employee.title)
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
		return m('ul.table-view', items);
	}
}

var HomePage = {
	controller: function(options) {
		var ctrl = this;
		ctrl.employees = m.prop([]);
		ctrl.searchHandler = function(key) {
			options.service.findByName(key).then(function(result) {
				// ctrl.searchKey(key); <--- see line 58 of https://github.com/ccoenraets/react-employee-directory/blob/master/iteration4/js/app.js
				ctrl.employees(result);
			})
		}

	},
	view: function(ctrl, options) {
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
	controller: function(options) {
		var ctrl = this;
		ctrl.employee = m.prop({});
		options.service.findById(m.route.param('Id')).then(function(result) {
			ctrl.employee(result)
		})
	},
	view: function(ctrl, options) {
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
							href: 'mailto' + ctrl.employee().email
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

m.route(document.body, '/', {
	'/': m.component(HomePage, {
		service: employeeService
	}),
	'/employees/:Id': m.component(EmployeePage, {
		service: employeeService
	})
})