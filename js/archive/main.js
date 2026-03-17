/*! ===================================
 *  Author: BBDesign & WPHunters
 *  -----------------------------------
 *  Email(support):
 * 	bbdesign_sp@yahoo.com
 *  ===================================
 */

var axisJS = {

    // Init preloader & unloader
    PreloaderInit: function() {
        $('body').jpreLoader({
            autoClose: true,
            loaderVPos: 0,
            onetimeLoad: true
        }, function() {
            $(window).trigger('jqOnLoad');
        });

        // fade out page after click
        $(document).on('click', 'a:not([href=#])', function() {
            var $this = $(this),
                linkTarget = $this.attr('href');

            if ($this.attr('target') != undefined) return true;

            $('body').animate({
                opacity: 0
            }, 'fast', function() {
                location.href = linkTarget;
            });
            return false;
        });
    },


    // Header processing
    HeaderInit: function() {
        var $window = $(window),
            header = $('#main-header'),
            headShadow = header.find('.shadow-helper'),
            menu = header.find('ul.menu'),
            menuToggle = header.find('.menu-toggle'),
            toggleClass = 'open';

        // fallback to static icons
        if (!Modernizr.csstransforms) {
            menuToggle.find('.icon').attr('class', 'entypo menu');
            menuToggle = menuToggle.find('.entypo:eq(0)');
            toggleClass = 'cancel-o';
        }

        menuToggle.on('click', function() {
            menuToggle.toggleClass(toggleClass);
            menu.stop().slideToggle(300);
            headShadow.toggleClass('open');
        });

        // safari 8 hack & shadow processing
        $window.on('scroll', function() {
            if ($window.scrollTop() <= 0 && !header.hasClass('ontop')) header.addClass('ontop');
            if ($window.scrollTop() > 0 && header.hasClass('ontop')) header.removeClass('ontop');

            if (headShadow.css('opacity') == 1 && $window.scrollTop() >= 100) return;
            headShadow.css('opacity', $window.scrollTop() / 100);
        });
    },


    // Big Sections
    BigSections: function() {
        var set_height = $(window).height();
        if (set_height <= 500) set_height = 500;

        var sections = $('.hero-section').css('display', 'block');
        sections.filter(':not([data-disable-resize])').css('height', set_height);
    },


    // Parallax scrolling
    ParallaxInit: function() {
        var selector = $('[data-parallax]');

        // disable for touch devices
        if (selector.length <= 0 || Modernizr.touch) return;

        selector.each(function() {
            // declare the variable to affect the defined data-type
            var $scroll = $(this);

            // speed and direction
            var speed = $scroll.attr('data-parallax') || 3;
            var type = $scroll.attr('data-parallax-type') || 'bg';

            // run parallax engine
            $scroll.parallax('50%', speed, type);
        });
    },


    // Convert ul's to select's
    Ul2Select: function() {
        var elems = $('ul.convert-to-select');

        elems.each(function() {
            var $this = $(this),
                id = 'select_' + $.randomID();
            $('<select class="mobile-filter visible-xs-block" id="' + id + '" />').insertAfter($this);

            $this.find('> li').each(function() {
                var el = $(this);
                $('<option />', {
                    'value': el.attr('href'),
                    'text': el.text(),
                    'data-filter': el.attr('data-filter')
                }).appendTo('#' + id);
            });
        });
    },


    // Isotope plugin integration
    IsotopeInit: function() {
        var containers = $('.isotope[data-isotope-id]');

        containers.each(function() {
            var $this = $(this),
                containerId = $this.attr('data-isotope-id'),
                filterElem = $('.desktop-filter[data-isotope-id="' + containerId + '"]'),
                filterItems = filterElem.find('> li a');

            // isotope
            $this.isotope({
                itemSelector: 'li',
                layoutMode: 'packery'
            });

            // filters
            filterItems.on('click', function() {
                $(this).parents('li').addClass('active').siblings().removeClass('active');
                $this.isotope({
                    filter: $(this).attr('data-filter')
                });
                return false;
            });
            filterElem.parent().find('.mobile-filter').on('change', function() {
                filterItems.eq($(this)[0].selectedIndex).trigger('click');
            });
        });
    },


    // Sliders
    SlidersInit: function() {
        // photo sliders
        var photoSlider = $('.slick.photo-slider, .slick.testimonials'),
            defaultSettings = {
                adaptiveHeight: true,
                autoplaySpeed: 5000,
                arrows: false,
                dots: !Modernizr.touch,
                slide: 'article, div'
            };

        photoSlider.each(function() {
            var $this = $(this),
                settings = defaultSettings;

            if ($this.hasClass('vertical')) settings.vertical = true;
            if ($this.hasClass('with-arrows')) settings.arrows = true;
            if ($this.attr('slick-autoplay') !== undefined) settings.autoplay = true;

            $this.slick(settings);
        });
    },


    // Smooth scroll
    SmoothScrollInit: function() {
        $('a[data-toggle="smoothscroll"]').click(function() {
            if (location.pathname.replace(/^\//, '') != this.pathname.replace(/^\//, '') && location.hostname != this.hostname) return true;

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        });
    },


    // Google Maps
    GoogleMapsInit: function() {
        if (!google || !google.maps) return;

        // default options for map constructor
        var defaultOptions = {
            streetViewControl: false,
            scrollwheel: false,
            panControl: true,
            mapTypeControl: false,
            overviewMapControl: false,
            zoomControl: true,
            center: new google.maps.LatLng(40.805478, -73.96522499999998),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: true
        };

        //if(Modernizr.touch) defaultOptions['draggable'] = false;

        // loop through elements
        $('.place-map').each(function() {
            var $this = $(this),
                lat = parseFloat($this.data('lat')),
                long = parseFloat($this.data('long')),
                infoWindowContent = $this.html();

            $this.html(''); // clear element

            var elem_id = 'map_' + $.randomID();
            $this.append('<div id="' + elem_id + '" class="embed-responsive-item"/>');

            var options = $.extend(defaultOptions, {
                zoom: $this.data('zoom') || 14,
                center: new google.maps.LatLng(lat, long)
            });

            var map = new google.maps.Map(document.getElementById(elem_id), options);
            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(lat, long)
            });
            var infowindow = new google.maps.InfoWindow({
                content: infoWindowContent
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });

            google.maps.event.addListenerOnce(map, 'idle', function() {
                $this.addClass('initialized');
            });

            infowindow.open(map, marker);
        });
    },


    // Forms Validation
    FormsInit: function() {
        // default form submitting function
        var defaultHappyFunction = function(mailchimp) {
            return function(e) {
                e.preventDefault(); // prevent form submission
                var $form = $(e.target); // get the form instance

                // use ajax to submit form data
                $.ajax($form.attr('action'), {
                    type: 'post',
                    data: $form.serialize(),
                    dataType: (mailchimp) ? 'jsonp' : 'html',
                    jsonp: 'c',

                    complete: function(xhr) {

                        var selector_ok = '.alert.alert-success',
                            selector_error = '.alert.alert-danger',
                            validateCond = (xhr.status != 200);

                        // mailchimp validation
                        if (mailchimp) {
                            var response = xhr.responseJSON;
                            validateCond = (response && response.result !== 'success');
                            if (validateCond) xhr.responseText = response.msg;
                        }

                        if (validateCond) {
                            $(selector_ok, $form).fadeOut('fast');
                            $(selector_error, $form).find('span').html(xhr.responseText);
                            $(selector_error, $form).fadeIn('fast');
                        } else {
                            $(selector_error, $form).fadeOut('fast');
                            $(selector_ok, $form).fadeIn('fast');

                            // reset form
                            $form[0].reset();
                        }
                    }
                });
            }
        };


        // contact form
        $('#contact_form').isHappy({
            classes: {
                field: 'has-error'
            },

            fields: {
                '#fullname_field': {
                    required: true,
                    test: formHappy.betweenLength,
                    arg: {
                        min: 3,
                        max: 150
                    }
                },

                '#email_field': {
                    required: true,
                    test: formHappy.email
                },

                '#company_field': {
                    required: true,
                    test: formHappy.betweenLength,
                    arg: {
                        min: 3,
                        max: 150
                    }
                },

                '#phone_field': {
                    required: false,
                    test: formHappy.maxLength,
                    arg: 20
                },

                '#message_field': {
                    required: true,
                    test: formHappy.betweenLength,
                    arg: {
                        min: 15,
                        max: 3000
                    }
                }
            },

            happy: defaultHappyFunction()
        });


        // subscribe form
        var subscribeForm = $('#subscribe_form');
        if (subscribeForm.length) {
            subscribeForm.attr('action', subscribeForm.attr('action').replace('/post', '/post-json'));
            subscribeForm.isHappy({
                classes: {
                    field: 'has-error'
                },

                fields: {
                    '#email_field': {
                        required: true,
                        test: formHappy.email
                    }
                },

                happy: defaultHappyFunction(true)
            });
        }
    },


    // Tabs system(based on slick slider)
    TabsInit: function() {
        var tabs = $('[data-slick-tabs]');
        if (!tabs || !$.fn.slick) return;

        tabs.each(function() {
            $(this).slick({
                arrows: false,
                adaptiveHeight: true,
                draggable: false,
                touchMove: false,
                swipe: false
            });
        });

        $('[data-toggle="slick-tab"]').on('click', function() {
            var $this = $(this),
                target = $($this.attr('href'));

            if (!target) return true;

            // turn slider
            var slideIndex = target.attr('index');
            target.parents('.slick-slider').slickGoTo(slideIndex);

            // switch active state
            $this.parents('li').addClass('active')
                .siblings().removeClass('active');
            return false;
        });
    },


    // Counters
    CountUpInit: function() {
        if (typeof countUp === 'undefined') return;

        $('[data-countup] .number').each(function() {
            var $this = $(this),
                uniqueId = 'counter-' + $.randomID();

            $this.text(0).attr('id', uniqueId).appear();
            var counter = new countUp(uniqueId, 0, $this.attr('data-value'), 0, 2.5);

            $this.on('appear.onscroll', function() {
                counter.start();
                $(this).unbind('appear.onscroll');
            });
        });

        $.force_appear();
    },


    // YouTube BG video
    YTPlayerInit: function() {
        if (typeof $.fn.YTPlayer !== 'function') return;

        var elems = $('[data-video-bg]');
        elems.each(function() {
            var $this = $(this),
                id = 'ytvideo_' + $.randomID();
            $this.attr('id', id);

            $this.YTPlayer({
                videoURL: $this.attr('data-video-bg'),
                containment: '#' + id,
                showControls: false,
                autoPlay: true,
                loop: true,
                mute: true,
                startAt: 0,
                opacity: 1,
                addRaster: false,
                quality: 'default',
                onReady: function() {
                    $this.addClass('ready')
                }
            });
        });
    }
};

axisJS.__refreshIsotope = function() {
    $('.isotope[data-isotope-id]').each(function() {
        var isotope = $(this).data('isotope');
        if(!isotope) { return; }

        isotope.layout();
    });
};

(function($) {
    'use strict';

    // helpers
    FastClick.attach(document.body);
    $.randomID = function() {
        return Math.random().toString(36).substr(2);
    };

    // run functions
    $(document).ready(function() {
        axisJS.TabsInit();
        axisJS.PreloaderInit();
        axisJS.HeaderInit();
        axisJS.Ul2Select();
        axisJS.SlidersInit();
        axisJS.SmoothScrollInit();
        axisJS.FormsInit();
        axisJS.CountUpInit();
        axisJS.YTPlayerInit();
    });

    $(window).on('resize jqOnLoad', function() {
        axisJS.BigSections();
	axisJS.__refreshIsotope();
    });

    $(window).on('jqOnLoad', function() {
        axisJS.ParallaxInit();

        $(window).trigger('resize');
    });

    $(window).on('load', function() {
        axisJS.GoogleMapsInit();
        axisJS.IsotopeInit();
	axisJS.__refreshIsotope();

        $(window).trigger('resize');
    });

})(jQuery);