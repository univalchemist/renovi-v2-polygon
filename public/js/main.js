/*----------------------------------------------

[ALL CONTENTS]

1. Preloader
2. Responsive Menu
3. Navigation 
4. Slides
5. Load More
6. Shuffle
7. Contact Form

/*----------------------------------------------
1. Preloader
----------------------------------------------*/

$( document ).ready(function() {
    'use strict';

    /*----------------------------------------------
    1. Preloader
    ----------------------------------------------*/
    
    /*----------------------------------------------
    2. Responsive Menu
    ----------------------------------------------*/
    (function ($) {

        'use strict';

        function navResponsive() {

            let navbar = $('.navbar .items');
            let menu = $('#menu .items');

            menu.html('');
            navbar.clone().appendTo(menu);

            $('.menu .icon-arrow-right').removeClass('icon-arrow-right').addClass('icon-arrow-down');
        }

        navResponsive();

        $(window).on('resize', function () {
            navResponsive();
        })

        $('.menu .dropdown-menu').each(function() {

            var children = $(this).children('.dropdown').length;
            $(this).addClass('children-'+children);
        })

        
        $('.menu .nav-item.dropdown').each(function() {

            var children = $(this).children('.nav-link');
            children.addClass('prevent');
        })

        $(document).on('click', '#menu .nav-item .nav-link', function (event) {

            if($(this).hasClass('prevent')) {
                event.preventDefault();
            }

            var nav_link = $(this);

            nav_link.next().toggleClass('show');

            if(nav_link.hasClass('smooth-anchor')) {
                $('#menu').modal('hide');
            }
        })
    }(jQuery));

    /*----------------------------------------------
    3. Navigation
    ----------------------------------------------*/
    (function ($) {

        'use strict';

        var position = $(window).scrollTop();
        var toTop    = $('#scroll-to-top');
        var navbar   = $('.navbar');

        $(document).ready(function() {
            if (position > 0) {
                navbar.hide();
            }
        })

        toTop.hide();

        $(window).scroll(function () {

            let scroll = $(window).scrollTop();
            let navbar = $('.navbar');

            if (!navbar.hasClass('relative')) {

                if (scroll > position) {

                    if (window.screen.width >= 767) {

                        navbar.fadeOut('fast');

                    } else {

                        navbar.addClass('navbar-sticky');
                    }

                    toTop.fadeOut('fast');

                } else {

                    if (position < 76) {

                        navbar.slideDown('fast').removeClass('navbar-sticky');

                    } else {

                        navbar.slideDown('fast').addClass('navbar-sticky');
                    }


                    if (position > 1023) {

                        if (window.screen.width >= 767) {

                            toTop.fadeIn('fast');
                        }

                    } else {

                        toTop.fadeOut('fast');

                    }

                }

                position = scroll;

            }
        })

        $('.nav-link').each(function() {
            let href = $(this).attr('href');
            if (href.length > 1 && href.indexOf('#') != -1) {
                $(this).addClass('smooth-anchor');
            }
        })

        $(document).on('click', '.smooth-anchor', function (event) {

            event.preventDefault();

            $('html, body').animate({

                scrollTop: $($.attr(this, 'href')).offset().top

            }, 500);
        })

        $('.dropdown-menu').each(function () {

            let dropdown = $(this);

            dropdown.hover(function () {

                dropdown.parent().find('.nav-link').first().addClass('active');

            }, function () {

                dropdown.parent().find('.nav-link').first().removeClass('active');

            })
        })
    }(jQuery));

    /*----------------------------------------------
    7. Contact Form
    ----------------------------------------------*/
    (function ($) {

        'use strict';

        var form = $('#contact-form');

        var formMessages = $('.form-message');

        $(form).submit(function (e) {

            e.preventDefault();

            var formData = $(form).serialize();

            $.ajax({
                type: 'POST',
                url: $(form).attr('action'),
                data: formData
            })
            .done(function (response) {

                $(formMessages).removeClass('error');
                $(formMessages).addClass('success');

                $(formMessages).text(response);

                $('#contact-form input,#contact-form textarea').val('');
            })
            .fail(function (data) {

                $(formMessages).removeClass('success');
                $(formMessages).addClass('error');

                if (data.responseText !== '') {
                    $(formMessages).text(data.responseText);
                } else {
                    $(formMessages).text('Oops! An error occured and your message could not be sent.');
                }
            });
        });

    }(jQuery));

});