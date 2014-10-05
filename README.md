jQuery-bSlider
==============

Simple jQuery slider

## Installation ##

Install via bower

```
bower install --save jquery-bslider
```

Link library

```html
<script src="bower_compoents/jquery-bslider/bslider.jquery.min.js"></script>
```

## DOM structure: ##

```css
.bslider [1]
	.window [0/1] (window element needed only if controls should be outside of frame with items)
		.frame [1]
			.item [1..n]
	.controlls [0/1]
		.left [0/1]
		.right [0/1]
		.bullets [1]
			.bullet [0..n]
```

## Mandatory CSS rules (SASS/LESS syntax) ##

```css
.bslider {
	position: relative;
	overflow: hidden; // needed only without .window element

	.window {
		overflow: hidden;
	}

	.item {
		position: relative;
		float: left;
	}

	.frame {
		position: relative;
		overflow: hidden;
	}
}
```

## Init ##

### Base usage ###

```JavaScript
$('.bslider').bSlider();
```

### All options ###

```JavaScript
$('.bslider').bSlider({
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
	method: 'slide', // slide or fade
	elements: { // element selectors and classes can be overriden
		main: '.bslider',
		window: '.window',
		frame: '.frame',
		item: '.item',
		controls: '.controls',
		left: '.left',
		right: '.right',
		bullet: '.bullet',
		bulletHtml: '<span class="bullet"></span>',
		rewind: '.rewind',
		activeClass: 'active' // this must be a class, not whole selector
	},
	onReady: function(slider, settings) {},
	onSlideBegin: function(slider, settings, active) {},
	onSlideComplete: function(slider, settings) {},
	onFinish: function(slider, settings) {}
});
```