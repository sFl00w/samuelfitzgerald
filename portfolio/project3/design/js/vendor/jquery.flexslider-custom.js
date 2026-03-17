	$(window).load(function() {
					    
	$('.flexslider').flexslider({
	animation: "move",
	slideshow: true,  
	slideshowSpeed: 5000,
	animationSpeed: 600,
	start: function(slider){
	$('body').removeClass('loading');
	}
	});

	});
