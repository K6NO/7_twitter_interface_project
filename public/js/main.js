jQuery(document).ready(function ($) {
    'use strict';

    var socket = io().connect();

    let countCharacters  = (field) => {
        $('#tweet-char').text(140 - $(field).val().length);
    }

    $('#tweettextarea').on('keyup', function () {
        countCharacters(this);
    });

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

    socket.on('tweet', function (res) {
        console.log(res.id);
        console.log(res.text);
        console.log(res.created_at);
        console.log(res.retweet_count);
        console.log(res.favorite_count);
        console.log(res.user.name);
        console.log(res.user.screen_name);
        console.log(res.user.profile_image_url_https);


        var $tweet = $('.app--tweet--list li:first').clone();
        $tweet.attr('data-tweet-id', res.id);
        let slicedDate = res.created_at.slice(0,10);
        $tweet.find('.app--tweet--timestamp').text(slicedDate);
        $tweet.find('> p').text(res.text);

        //if (res.retweet_count) {
            $tweet.find('.app--retweet strong').text(res.retweet_count);
        //} else {
        //    $tweet.find('.app--retweet strong').text('66');
        //}

        //if (res.favorite_count) {
            $tweet.find('.app--like strong').text(res.favorite_count);
        //} else {
        //    $tweet.find('.app--like strong').text('66');
        //}

        $tweet.find('.app--tweet--author h4').text(res.user.name);
        $tweet.find('.app--screen--name').text(' @' + res.user.screen_name);
        $tweet.find('.app--avatar').attr('style', 'background-image: url(' + res.user.profile_image_url_https + ')');
        $tweet.find('.app--avatar img').attr('src', res.user.profile_image_url_https);


        $('.app--tweet--list').prepend($tweet);

    });
});