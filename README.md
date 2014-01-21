bSlider
=======

## DOM structure: ##

	.bslider [1]
		.window [0/1]
			.frame [1]
				.item [1..n]
		.controlls [0/1]
			.left [0/1]
			.right [0/1]
			.bullets [1]
				.bullet [0..n]

## Mandatory CSS rules (SASS/LESS syntax) ##

	.slider {
	    position: relative;
	    overflow: hidden;

	    .item {
	        position: relative;
	        float: left;
	    }

	    .frame {
	        position: relative;
	        overflow: hidden;
	    }
	}

## Init ##
	
### Base usage ###

	$('.slider').bSlider();

### All options ###

	$('.slider').bSlider({
		speed: 500, // sets item speed
		auto: false, // allow auto switching. False for disabling, int for delay in ms
		autoHeight: true, // adjust slider height after item switch
		itemMaxWidth: false, // set window width as item width (width 100% is not posible since frame width is sum of items width )
		controlsMaxWidth: false, // controlls element gets 100% width
		step: false, // length of one move. false for item width, int for pixel
		//fixedWidth: true, // all items have same width (better performance)
		onFinishStop: false,
		left: false, // example '#left-buttom' jQuery selector for left control, false if is used default DOM structure as above
		right: false, // example '#right-buttom' jQuery selector for right control, false if is used default DOM structure as above
		stepCount: 1, // int, how many items are slided. Default value 1
		onReady: function() {},
		onSlideBegin: function() {},
		onSlideComplete: function() {},
		onFinish: function() {}
	});