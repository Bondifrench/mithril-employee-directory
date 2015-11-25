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

		// Using factory function:
		// var searchKey = m.prop('');
		// function searchHandler(e) {
		// 	searchKey(e.target.value);
		// 	args.searchHandler(e.target.value);
		// }
		// return {
		// 	searchKey: m.prop(''),
		// 	searchHandler: searchHandler
		// }

		// Using `this`:
		// this.searchKey = m.prop('');
		// this.searchHandler = function (e) {
		// 	this.searchKey(e.target.value);
		// 	args.searchHandler(e.target.value);
		// }.bind(this)
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

var HomePage = {
	controller: function() {
		var ctrl = this;
		ctrl.searchHandler = function(key) {
			alert('Search key:' + key);
		}
	},
	view: function(ctrl) {
		return m('div', [
			m.component(Header, {
				text: 'Employee Directory'
			}),
			m.component(SearchBar, {
				searchHandler: ctrl.searchHandler
			}),
			m.component(EmployeeList, {
				employees: employees
			})
		])
	}
}

m.mount(document.body, HomePage);