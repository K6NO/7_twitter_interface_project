jQuery(document).ready(function ($) {
    'use strict';

    // connect IO

    var socket = io().connect();

    // functions to count tweet length and refresh number
    let countCharacters  = (field) => {
        $('#tweet-char').text(140 - $(field).val().length);
    };

    $('#tweettextarea').on('keyup', function () {
        countCharacters(this);
    });

    // AJAX call when user posts a new tweet
    $('button.button-submit').on('click', (e) => {
        e.preventDefault();
        var text = $('#tweettextarea').val();

        $.ajax({
            type : 'POST',
            url : '/',
            data : {tweet : text},
            success : (res) => {
                $('#tweettextarea').val('');
                countCharacters('#tweettextarea')
            },
            error : (err) => {
              console.log('Error when sending ajax request to the server.');
            }
        });
    return false;
    });

    // when new tweet arrives, copy the last list element, change parameters and add it to the beginning of the list
    socket.on('tweet', function (res) {

        var $tweet = $('.app--tweet--list li:first').clone();

        $tweet.attr('data-tweet-id', res.id);
        let slicedDate = res.created_at.slice(0,10);
        $tweet.find('.app--tweet--timestamp').text(slicedDate);
        $tweet.find('> p').text(res.text);
        $tweet.find('.app--retweet strong').text(res.retweet_count);
        $tweet.find('.app--like strong').text(res.favorite_count);
        $tweet.find('.app--tweet--author h4').text(res.user.name);
        $tweet.find('.app--screen--name').text(' @' + res.user.screen_name);
        $tweet.find('.app--avatar').attr('style', 'background-image: url(' + res.user.profile_image_url_https + ')');
        $tweet.find('.app--avatar img').attr('src', res.user.profile_image_url_https);

        $('.app--tweet--list').prepend($tweet);

    });
});