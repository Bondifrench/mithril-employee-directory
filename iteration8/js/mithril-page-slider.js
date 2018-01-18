// "use strict";
// Object.defineProperty(exports, "__esModule", {
// 	value: true
// });

// function _interopRequireDefault(obj) {
// 	return obj && obj.__esModule ? obj : {
// 		"default": obj
// 	}
// }
// var _mithril = require("mithril");
// var _mithril2 = _interopRequireDefault(_mithril);
// require("./mithril-page-slider.css!");
var DEFAULT_SLIDER_ID = "default";
var DEFAULT_DURATION = 360;
var DEFAULT_ORIENTATION = "ltr";
var RTL_ORIENTATION = "rtl";
var DIRECTION_FORWARD = 1;
var DIRECTION_FORWARD_CLASS = "forward";
var DIRECTION_BACKWARD = -1;
var DIRECTION_BACKWARD_CLASS = "backward";
var vms = {};
var pageSlider = {};
var prefixes = ["webkit", "moz", "ms", "o", ""];
var prefixedEvent = function prefixedEvent(element, type, callback) {
	for (var p = 0; p < prefixes.length; p++) {
		if (!prefixes[p]) {
			type = type.toLowerCase()
		}
		element.addEventListener(prefixes[p] + type, callback, false)
	}
};
var ViewModel = function ViewModel() {
	var transition = m.prop({});
	return {
		pageElements: {},
		transition: transition,
		clearTransition: function clearTransition() {
			transition().page = undefined
		},
		hasTransition: function hasTransition() {
			return transition().page !== undefined
		},
		current: m.prop(),
		currentId: m.prop(),
		previous: m.prop(),
		next: m.prop(),
		history: m.prop({}),
		depth: m.prop(0)
	}
};
var getViewModel = function getViewModel() {
	var id = arguments[0] === undefined ? DEFAULT_SLIDER_ID : arguments[0];
	vms[id] = vms[id] || new ViewModel;
	return vms[id]
};
var pageElProps = function pageElProps(which, key, duration, vm) {
	return {
		key: key,
		config: function config(el, inited) {
			if (inited) {
				return
			}
			vm.pageElements[which] = el
		},
		style: {
			"-webkit-animation-duration": duration + "ms",
			"animation-duration": duration + "ms"
		}
	}
};
var slide = function slide(opts) {
	var sliderId = opts.slider || DEFAULT_SLIDER_ID;
	var vm = getViewModel(sliderId);
	if (vm.hasTransition()) {
		return
	}
	var route = opts.route || m.route();
	var id = opts.id || route;
	if (vm.currentId() === id) {
		return
	}
	var transition = {
		page: opts.page,
		id: id,
		route: route,
		done: opts.done,
		direction: opts.direction || DIRECTION_FORWARD,
		orientation: opts.rtl ? RTL_ORIENTATION : DEFAULT_ORIENTATION,
		duration: opts.duration || DEFAULT_DURATION
	};
	if (!vm.current()) {
		vm.current(transition.page);
		vm.currentId(transition.id);
		vm.history()[transition.route] = 0;
		if (transition.done) {
			transition.done()
		}
		vm.clearTransition()
	} else {
		var depth = vm.depth();
		var historyDepth = vm.history()[route];
		var newDepth = historyDepth !== undefined ? historyDepth : depth + transition.direction;
		var backward = opts.direction === DIRECTION_BACKWARD ? true : newDepth < depth;
		vm.depth(newDepth);
		vm.history()[route] = newDepth;
		if (backward) {
			transition.direction = DIRECTION_BACKWARD;
			vm.previous(transition.page)
		} else {
			transition.direction = DIRECTION_FORWARD;
			vm.next(transition.page)
		}
		vm.transition(transition)
	}
	m.redraw()
};
var slideDone = function slideDone(vm) {
	var transition = vm.transition();
	var route = transition.route;
	var done = transition.done;
	vm.current(transition.page);
	vm.currentId(transition.id);
	if (transition.direction === DIRECTION_BACKWARD) {
		vm.next(vm.current());
		vm.previous(null)
	} else {
		vm.previous(vm.current());
		vm.next(null)
	}
	vm.clearTransition();
	m.route(route);
	if (done) {
		done()
	}
};
var createView = function createView(opts, sliderId) {
	var vm = getViewModel(sliderId);
	var previous = vm.previous();
	var current = vm.current();
	var next = vm.next();
	var transition = vm.transition();
	var isAnimating = vm.hasTransition();
	var orientation = transition.orientation;
	var duration = transition.duration !== undefined ? transition.duration : DEFAULT_DURATION;
	var directionClass = transition.direction === DIRECTION_FORWARD ? DIRECTION_FORWARD_CLASS : DIRECTION_BACKWARD_CLASS;
	var pages = [
	previous ? m(".page.previous", pageElProps("previous", 1, duration, vm), previous) : null, 
	current ? m(".page.current", pageElProps("current", 2, duration, vm), current) : null, 
	next ? m(".page.next", pageElProps("next", 3, duration, vm), next) : null
	];
	if (orientation === RTL_ORIENTATION) {
		pages.reverse()
	}

	function _ref() {
		slideDone(vm)
	}
	return m("div", {
		"class": ["pageSlider", isAnimating ? "animating" : null, directionClass, orientation, opts["class"] || null].join(" "),
		config: function config() {
			if (isAnimating) {
				var done = _ref;
				prefixedEvent(vm.pageElements.current, "AnimationEnd", done)
			}
		}
	}, pages)
};
var slideConfig = function slideConfig(fn, opts) {
	return function(element, inited) {
		if (inited) {
			return
		}
		element.onclick = function(e) {
			e.preventDefault();
			opts.route = element.getAttribute("href");
			fn(opts)
		}
	}
};
pageSlider.slideInConfig = function(opts) {
	return slideConfig(pageSlider.slideIn, opts)
};
pageSlider.slideOutConfig = function(opts) {
	return slideConfig(pageSlider.slideOut, opts)
};
pageSlider.slideIn = function(opts) {
	opts.direction = DIRECTION_FORWARD;
	slide(opts)
};
pageSlider.slideOut = function(opts) {
	opts.direction = DIRECTION_BACKWARD;
	slide(opts)
};
pageSlider.view = function(ctrl) {
	var opts = arguments[1] === undefined ? {} : arguments[1];
	var sliderId = opts.slider || DEFAULT_SLIDER_ID;
	var vm = getViewModel(sliderId);
	if (!vm.hasTransition()) {
		var page = opts.page;
		if (page) {
			slide({
				slider: sliderId,
				page: page,
				id: opts.id,
				route: opts.route,
				done: opts.done,
				rtl: opts.rtl
			})
		}
	}
	return createView(opts, sliderId)
};

// module.exports = pageSlider;