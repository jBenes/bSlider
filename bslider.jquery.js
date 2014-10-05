/**
* jQuery-bSlider
* url: https://github.com/jBenes/jQuery-bSlider
*/

(function ( $ ) {
$.fn.bSlider = function( options ) {

	var default_settings = $.extend(true, {
		speed: 500,
		auto: false,
		autoHeight: true,
		itemMaxWidth: false,
		controlsMaxWidth: false,
		step: false,
		onFinishStop: false,
		left: false,
		right: false,
		stepCount: 1,
		method: 'slide',
		elements: {
			main: '.bslider',
			window: '.window',
			frame: '.frame',
			item: '.item',
			controls: '.controls',
			left: '.left',
			right: '.right',
			bullet: '.bullet',
			bulletHtml: '<span class="bullet"></span>',
			bullets: '.bullets',
			rewind: '.rewind',
			activeClass: 'active'
		},
		onReady: function(slider, settings) {},
		onSlideBegin: function(slider, settings, active) {},
		onSlideComplete: function(slider, settings) {},
		onFinish: function(slider, settings) {}
		//fixedWidth: true
	}, options );

	var _name = 'bSlider';

	var slide = function(slider, way, callback) {
		// get slider data
		if(typeof way === 'undefined') {
			var way = slider[1];
			var slider = slider[0];
		}
		var data = slider.data()[_name];
		var settings = data.settings;
		// choose active element
		if(way == 'left') {
			if(data.active < settings.stepCount) {
				var active = data.count - settings.stepCount;
			}
			else var active = data.active - settings.stepCount;
		} else if (way == 'right') {
			if(data.active >= data.count - data.size) {
				var active =  0;
			}
			else var active = data.active + settings.stepCount;
		} else {
			var active = way;
		}
		active = Math.ceil(active);

		// get choosen item
		var item = $(settings.elements.item + ':nth-child('+(active+1)+')', slider);
		if($(settings.elements.bullets, slider).length > 0) {
			$(settings.elements.bullet + ':nth-child('+(active+1)+')', slider).addClass(settings.elements.activeClass).siblings().removeClass(settings.elements.activeClass);
		}

		settings.onSlideBegin.call( this, slider, settings, active );


		// moove frame
		animateCss = {
			left: -1 * active * data.step
		}

		if(settings.method == 'fade') {
			//item.fadeIn(settings.speed).siblings().fadeOut(settings.speed);
			item.stop().fadeTo(
				settings.speed,
				1,
				function() {

					settings.onSlideComplete.call( this, slider, settings );

					if(data.settings.onFinishStop && data.active +1 == data.count) {
						settings.onFinish.call( this, slider, settings );
					}

					if(data.auto !== false && (!data.settings.onFinishStop || data.active +1 != data.count)) {
						clearInterval(data.auto);
						//data.auto = setInterval(slide, settings.auto, [slider, 'right']);
						var param = [slider, 'right'];
						data.auto = setTimeout( (function(param) {
							return function() {
								slide(param);
							};
						})(param) , settings.auto);
					}
				}
			).siblings().stop().fadeTo(
				settings.speed,
				0
			);
		} else {
			data.frame.animate(
				animateCss,
				{
					duration: settings.speed,
					queue: false,
					complete: function() {

						settings.onSlideComplete.call( this, slider, settings );

						if(data.settings.onFinishStop && data.active +1 == data.count) {
							settings.onFinish.call( this, slider, settings );
						}

						if(data.auto !== false && (!data.settings.onFinishStop || data.active +1 != data.count)) {
							clearInterval(data.auto);
							//data.auto = setInterval(slide, settings.auto, [slider, 'right']);
							var param = [slider, 'right'];
							data.auto = setTimeout( (function(param) {
								return function() {
									slide(param);
								};
							})(param) , settings.auto);
						}
					}
				}
			);
		}

		// change class of selected item
		item.addClass(settings.elements.activeClass).siblings().removeClass(settings.elements.activeClass);
		// set frame height if wanted
		if(settings.autoHeight) {

			data.frame.animate({height: item.outerHeight(true)}, { duration: settings.speed, queue: false });
		}

		// save data again
		data.active = active;
		slider.data(_name, data);
	}

	return this.each(function() {
		var settings = jQuery.extend(true, {}, default_settings);
		// data object
		var data = {}
		// slider object
		$this = $(this);

		var $bullets = $(settings.elements.bullets, $this);

		var actualSlider = $(this);
		// get active element
		if($(settings.elements.item + '.' + settings.elements.activeClass, $this).length == 0) {
			active = 0;
		} else {
			active = $(settings.elements.item + '.' + settings.elements.activeClass, $this).index();
		}

		if (!settings.left) {
			settings.left = $(settings.elements.controls + ' ' + settings.elements.left, $(this));
		}
		else {
			settings.left = $(settings.left);
		}

		if (!settings.right) {
			settings.right = $(settings.elements.controls + ' ' + settings.elements.right, $(this));
		}
		else {
			settings.right = $(settings.right);
		}
		// autoresizing controlls wrapper, if allowed
		if(settings.controlsMaxWidth) {
			var controls = $(settings.elements.controls, $this);

			controls.width(parseInt($this.width()));

			controls.addClass(_name+'-controls-resize');

			$(window).unbind('resize.'+_name+'-controls').bind('resize.'+_name+'-controls', function(e) {
				$('.'+_name+'-controls-resize').each(function() {
					var slider = $(this).parents(settings.elements.main);
					$(this).width(parseInt(slider.width()));
				});
			});

			controls.show();
		}

		// set width of browser if allowed
		if(settings.itemMaxWidth) {
			$(settings.elements.item, $this).width(parseInt($this.width()) - parseInt($(settings.elements.item, $this).first().css('padding-left')) - parseInt($(settings.elements.item, $this).first().css('padding-right')));

			$this.addClass(_name+'-resize');

			$(window).unbind('resize.'+_name).bind('resize.'+_name, function(e) {
				$('.'+_name+'-resize').each(function() {
					var slider = $(this);
					var data = slider.data()[_name];

					var width = slider.width();
					//slider.find('.item').width(parseInt(width) - parseInt($('.item', slider).first().css('padding-left')) - parseInt($('.item', slider).first().css('padding-right')));
					var new_width = parseInt(width) - parseInt($(settings.elements.item, slider).first().css('padding-left')) - parseInt($(settings.elements.item, slider).first().css('padding-right'));
					$(settings.elements.item, slider).width(new_width);

					if(settings.method == 'fade') {
						data.frame.width(new_width);
					} else {
						data.frame.css({
							left: -1 * data.active * width,
							width: data.count * width
						});
					}

					if(!data.settings.step) var step = $(settings.elements.item, slider).first().outerWidth(true);

					data.step = step;
					data.width = width;
					slider.data(_name, data);
				});

			});
		}
		var frame_width = 0;
		// loop items, set items count
		var count = $(settings.elements.item, $this).each(function() {
			frame_width += $(this).outerWidth(true);
			// copy data-background from item as their bg img
			var attr = $(this).attr('data-background');
			if (typeof attr !== 'undefined' && attr !== false) {
				$(this).css('background-image', 'url('+$(this).attr('data-background')+')');
			}
			// if we have fade effect, set item absolute
			if(settings.method == 'fade') {
				$(this).css({
					'position': 'absolute',
					'left': '0',
					'top': '0'
				});
			}

			$bullets.append(settings.elements.bulletHtml);
		}).length;
		// get item width
		var item = $(settings.elements.item + ':nth-child('+(active+1)+')', $this);
		var frame = $(settings.elements.frame, $this);
		if(settings.step) var step = settings.step;
		else var step = item.outerWidth(true);
		var height = item.outerHeight(true);
		if($(settings.elements.window, $this).length > 0) var size = $(settings.elements.window, $this).outerWidth(true) / item.outerWidth(true);
		else var size = $this.outerWidth(true) / item.outerWidth(true);

		// if we have fade effect, set frame width as item width
		if(settings.method == 'fade') {
			frame_width = item.outerWidth(true);
		}
		// reset frame position
		frame.css({
			left: -1 * active * step,
			height: height,
			width: frame_width
		});
		// set active class to curent item
		item.addClass(settings.elements.activeClass).siblings().removeClass(settings.elements.activeClass);
		if(settings.method == 'fade') {
			item.show().siblings().hide();
		}

		// bing left event
		settings.left.bind('click.'+_name, function() {
			slide(actualSlider, 'left');
		});
		// bind right event
		settings.right.bind('click.'+_name, function() {
			slide(actualSlider, 'right');
		});
		// bind bullet event
		$(settings.elements.bullet, $bullets).bind('click.'+_name, function() {
			slide($(this).parents(settings.elements.main), $(this).index());
		});

		$(settings.elements.rewind, $this).bind('click.'+_name, function() {
			slide($(this).parents(settings.elements.main), 0);
		});

		$(settings.elements.bullet + ':nth-child('+(active+1)+')', $this).addClass(settings.elements.activeClass);

		settings.onReady.call( this, $this, settings );
		// bind auto slide
		if(settings.auto) {
			//data.auto = setInterval(slide, settings.auto, [$this, 'right']);
			var param = [$this, 'right'];
			data.auto = setTimeout( (function(param) {
				return function() {
					slide(param);
				};
			})(param) , settings.auto);
		} else {
			data.auto = false;
		}

		data.active = active;
		data.count = count;
		data.step = step;
		data.size = size;
		data.frame = frame;
		data.settings = settings;

		$this.data(_name, data);

	});

};
}( jQuery ));