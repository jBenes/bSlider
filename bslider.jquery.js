/**
* bSlideer
* Desctiption: simple slider for jQuery
* Features: auto sliding, left/right controlls, bullet controls
* Author: Jiri Benes
* Version: 1.0.5
* TODO:
* - bullets support
* - autoswitch postponing
* - disabling loop
* BUG
* - fix integer step
*
* Usage:
* 	DOM structure:
* 		.bslider [1]
*			.window [0/1]
*				.frame [1]
*					.item [1..n]
*				.controlls [0/1]
*					.left [0/1]
*					.right [0/1]
*					.bullets [1]
*						.bullet [0..n]
*	CSS:
*		.slider {
*		    position: relative;
*		    overflow: hidden;
*
*		    .item {
*		        position: relative;
*		        float: left;
*		    }
*
*		    .frame {
*		        position: relative;
*		        overflow: hidden;
*		    }
*		}
*	JS:
*		$('.slider').bSlider();
*		or
*		$('.slider').bSlider({
*			speed: 500, // sets item speed
*			auto: false, // allow auto switching. False for disabling, int for delay in ms
*			autoHeight: true, // adjust slider height after item switch
*			itemMaxWidth: false, // set window width as item width (width 100% is not posible since frame width is sum of items width )
*			controlsMaxWidth: false, // controlls element gets 100% width
*			step: false, // length of one move. false for item width, int for pixel
*			//fixedWidth: true, // all items have same width (better performance)
*			onFinishStop: false,
*			left: false, // example '#left-buttom' jQuery selector for left control, false if is used default DOM structure as above
*			right: false, // example '#right-buttom' jQuery selector for right control, false if is used default DOM structure as above
*			stepCount: 1, // int, how many items are slided. Default value 1
*			onReady: function() {},
*			onSlideBegin: function() {},
*			onSlideComplete: function() {},
*			onFinish: function() {}
*		});
*/

(function ( $ ) {
$.fn.bSlider = function( options ) {

	var settings = $.extend({
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
		onReady: function() {},
		onSlideBegin: function() {},
		onSlideComplete: function() {},
		onFinish: function() {}
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
		var item = $('.item:nth-child('+(active+1)+')', slider);
		if($('.bullets', slider).length > 0) {
			$('.bullet:nth-child('+(active+1)+')', slider).addClass('active').siblings().removeClass('active');
		}

		settings.onSlideBegin.call( this, slider );
		

		// moove frame
		animateCss = {			
			left: -1 * active * data.step
		}

		data.frame.animate(
			animateCss, 
			{
				duration: settings.speed,
				queue: false,
				complete: function() {

					settings.onSlideComplete.call( this, slider );

					if(data.settings.onFinishStop && data.active +1 == data.count) {
						settings.onFinish.call( this, slider );
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

		// change class of selected item
		item.addClass("active").siblings().removeClass("active");
		// set frame height if wanted
		if(settings.autoHeight) {
			//alert(item.html());
			data.frame.animate({height: item.outerHeight(true)}, { duration: settings.speed, queue: false });
		}
		
		// save data again
		data.active = active;
		slider.data(_name, data);
	}

	return this.each(function() {
		// data object
		var data = {}
		// slider object
		$this = $(this);

		var actualSlider = $(this);
		// get active element
		if($('.item.active', $this).length == 0) {
			active = 0;
		} else {
			active = $('.item.active', $this).index();
		}

		if (!settings.left) {
			settings.left = $('.controls .left', $(this));
		}
		else {
			settings.left = $(settings.left);	
		}

		if (!settings.right) {
			settings.right = $('.controls .right', $(this));
		}
		else {
			settings.right = $(settings.right);
		}

		if(settings.controlsMaxWidth) {
			var controls = $('.controls', $this);
			
			controls.width(parseInt($this.width()));

			controls.addClass(_name+'-controls-resize');

			$(window).unbind('resize.'+_name+'-controls').bind('resize.'+_name+'-controls', function(e) {
				$('.'+_name+'-controls-resize').each(function() {
					var slider = $(this).parents('.bslider');
					$(this).width(parseInt(slider.width()));
				});
			});
		}

		// set width of browser if allowed
		if(settings.itemMaxWidth) {
			$('.item', $this).width(parseInt($this.width()) - parseInt($('.item', $this).first().css('padding-left')) - parseInt($('.item', $this).first().css('padding-right')));

			$this.addClass(_name+'-resize');

			$(window).unbind('resize.'+_name).bind('resize.'+_name, function(e) {
				$('.'+_name+'-resize').each(function() {
					var slider = $(this);
					var data = slider.data()[_name];

					var width = slider.width();
					//slider.find('.item').width(parseInt(width) - parseInt($('.item', slider).first().css('padding-left')) - parseInt($('.item', slider).first().css('padding-right')));
					$('.item', slider).width(parseInt(width) - parseInt($('.item', slider).first().css('padding-left')) - parseInt($('.item', slider).first().css('padding-right')));

					data.frame.css({
						left: -1 * data.active * width,
						width: data.count * width
					});

					if(!data.settings.step) var step = $('.item', slider).first().outerWidth(true);

					data.step = step;
					data.width = width;
					slider.data(_name, data);
				});
				
			});
		}
		var frame_width = 0;
		// loop items, set items count
		var count = $('.item', $this).each(function() {
			frame_width += $(this).outerWidth(true);
			// copy data-background from item as their bg img
			var attr = $(this).attr('data-background');
			if (typeof attr !== 'undefined' && attr !== false) {
				$(this).css('background-image', 'url('+$(this).attr('data-background')+')');
			}
		}).length;
		// get item width
		var item = $('.item:nth-child('+(active+1)+')', $this);
		var frame = $('.frame', $this);
		if(settings.step) var step = settings.step;
		else var step = item.outerWidth(true);
		var height = item.outerHeight(true);
		if($('.window', $this).length > 0) var size = $('.window', $this).outerWidth(true) / item.outerWidth(true);
		else var size = $this.outerWidth(true) / item.outerWidth(true);
		// reset frame position
		frame.css({
			left: -1 * active * step,
			height: height,
			width: frame_width
		});
		// set active class to curent item
		item.addClass("active").siblings().removeClass("active");

		// bing left event
		settings.left.bind('click.'+_name, function() {
			slide(actualSlider, 'left');
		});
		// bind right event
		settings.right.bind('click.'+_name, function() {
			slide(actualSlider, 'right');
		});
		// bind bullet event
		$('.controls .bullet', $this).bind('click.'+_name, function() {
			slide($(this).parents('.bslider'), $(this).index());
		});

		$('.rewind', $this).bind('click.'+_name, function() {
			slide($(this).parents('.bslider'), 0);
		});

		$('.bullet:nth-child('+(active+1)+')', $this).addClass('active');

		settings.onReady.call( this, $this );
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