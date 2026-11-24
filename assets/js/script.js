(function($){
	'use script';

	// WOW
	new WOW().init();
	/*---Client Testimonial---*/
    var $TestimonialSlider = $('.testimonial-full');
        if($TestimonialSlider.length > 0){
        $('.testimonial-full').owlCarousel({
            autoplay: true,
            loop: false,
            nav: false,
            autoplay: false,
            autoplayTimeout: 8000,
            items: 2,
            margin:30,
            dots:true,
            responsiveClass:true,
            responsive:{
                    0:{
                    items: 1,
                    stagePadding: 0,
                    margin: 0,
                },
                600:{
                    items:1,
                },
                876:{
                    items:1,
                },
                992:{
                    items:2,
                },
            }
        });
    } 
	

	$(".mobile-nav-icon, .off-canvas").click(function () {
	  	if ($('.menu, .off-canvas').hasClass("active")) {
	    	$(".menu, .mobile-nav-icon, .off-canvas").removeClass("active");
	  	}
	  	else {
	    	$(".menu, .off-canvas").removeClass("active");
	    	$('.menu, .mobile-nav-icon, .off-canvas').addClass("active");
	  	}
	});

	// Scroll Area
	$(document).ready(function(){
	    $('.scroll-area').click(function(){
	      	$('html').animate({
	        	'scrollTop' : 0,
	      	},700);
	      	return false;
	    });
	    $(window).on('scroll',function(){
	      	var a = $(window).scrollTop();
	      	if(a>400){
	            $('.scroll-area').slideDown(300);
	        }else{
	            $('.scroll-area').slideUp(200);
	        }
	    });
	});

	 // Popup
    $('a[data-rel^=lightcase]').lightcase({
        transition: 'elastic', /* none, fade, fadeInline, elastic, scrollTop, scrollRight, scrollBottom, scrollLeft, scrollHorizontal and scrollVertical */
        swipe: true,
        maxWidth: 1170,
        maxHeight: 600,
    });

    var $Counter = $('.counter');
        if($Counter.length > 0){
	    $('.counter').counterUp({
	        delay: 10,
	        time: 2000
	    });
	}
	// var mixer = mixitup('.portfolio-item-full');
	// var mixer = mixitup('.portF');
	// var mixer = mixitup('.portF', {
	// 	selectors: {
	// 		target: '.blog-item'
	// 	},
	// 	animation: {
	// 		duration: 100
	// 	}
	// });


	// $(document).ready(function(){
	//   	$(".our-client-full").owlCarousel({
	//   		loop:true,
	//   		center:true,
	//   		items:1,
	//   		autoplay: true,
	//   	});
	// });



	// Sticky Menu
	$(document).ready(function(){
		$(window).on('scroll',function(){
			var scroll = $(window).scrollTop();
			if(scroll < 150){
				$('.header').removeClass('sticky');
			}else{
				$('.header').addClass('sticky');
			}
		});
	});





	$('.menu ul').onePageNav({
		currentClass: 'current',
		changeHash: false,
		scrollSpeed: 150,
		scrollThreshold: 0.5,
	});



}(jQuery));