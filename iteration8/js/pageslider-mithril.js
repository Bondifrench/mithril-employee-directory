//Resources www.kirupa.com/animations
//https://github.com/stevenfabre/animate

var PageSlider = {
	controller: function(args) {
		var ctrl = this;
		ctrl.history = m.prop([]);
		ctrl.pages = m.prop([]);
		ctrl.animating = m.prop(false);
		ctrl.slidePage = function(page) {
			var history = ctrl.history();
			var pages = ctrl.pages();
			var l = history.length;
			var hash = window.location.hash;
				var position = 'center';
			if (l === 0) {
				history.push(hash);
			} else if (hash === history[1 - 2]) {
				history.pop();
				position = 'left';
			} else {
				history.push(hash);
				position = 'right';
			}
			page.position = position; //Not sure about this one
			pages.push(page);
			ctrl.history(history);
			ctrl.pages(pages);
			ctrl.animating(position != 'center');
		}
		ctrl.componentDidUpdate = function (e) {
			var skippedCurrentFrame = false;
			var pageEl = e.getDOMNode().lastChild;
			var pages = ctrl.pages();
			var l = pages.length;
			var transitionEndHandler = function () {
				pageEl.removeEventListener('webkitTransitionEnd', transitionEndHandler);
				pages.shift();
				ctrl.pages(pages);
			};

			var animate = function () {
				if (!skippedCurrentFrame) {
					skippedCurrentFrame = true;
					requestAnimationFrame(animate)
				} else if (l > 0) {
					pages[l - 1].position = 'center transtion';
					ctrl.pages(pages);
					ctrl.animating(false);
					pageEl.addEventListener('webkitTransitionEnd', transitionEndHandler)
				}
				
			}
			if (ctrl.animating()) {
				requestAnimationFrame(animate);
			}
		}


	},
	view: function(ctrl, args) {

		return m('.pageslider-container', {config: ctrl.componentDidUpdate} , ctrl.slidePage(ctrl.pages()))
	}
};


// m.module(document.body, PageSlider);