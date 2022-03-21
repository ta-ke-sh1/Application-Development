jQuery(document).ready(function () {
    $(document).on('mousemove', (event) => {
        $('.circle').css({
            left: event.clientX - 2,
            top: event.clientY - 2
        });
    });

    $(document).on('mousemove', (event) => {
        $('.outer-circle').css({
            left: event.clientX - 20,
            top: event.clientY - 20
        });
    });

    setInterval(function () {
        xp += ((mouseX - xp) / 6);
        yp += ((mouseY - yp) / 6);
        $("#outer-circle").css({
            left: xp + 'px',
            top: yp + 'px'
        });
    }, 3000);

    setInterval(function () {
        xp += ((mouseX - xp) / 6);
        yp += ((mouseY - yp) / 6);
        $("#circle").css({
            left: xp + 'px',
            top: yp + 'px'
        });
    }, 20);

    var cursor = $(".circle");
    var outer_cursor = $(".outer-circle");

    $(window).mouseleave(function () {
        cursor.css({ opacity: "0" });
        outer_cursor.css({ opacity: "0" });
    }).mouseenter(function () {
        cursor.css({ opacity: "1" });
        outer_cursor.css({ opacity: "1" });
    });

    $(document).mouseenter(function () {
        outer_cursor.css({ "background-color": "transparent" });
    });

    $(document).mousedown(function () {
        cursor.css({ transform: "scale(.2)" });
        outer_cursor.css({ transform: "scale(.3)" });
    }).mouseup(function () {
        cursor.css({ transform: "scale(1)" });
        outer_cursor.css({ transform: "scale(1)" });
    });

    // Button
    $(".btn").mouseenter(function () {
        outer_cursor.css({ "mix-blend-mode": "difference", "background-color": "white", "border": "none" });
        cursor.css({ 'visibility': 'hidden' });
    }).mouseleave(function () {
        outer_cursor.css({ "mix-blend-mode": "normal", "background-color": "transparent", transform: "scale(1)", "border": "solid 1px #2f1eb8" });
        cursor.css({ 'visibility': 'visible' });
    });

    $(".btn").hover(function () {
        outer_cursor.css({ transform: "scale(2)" });
    });

    $(".btn").mouseleave(function () {
        outer_cursor.css({ transform: "scale(1)" });
    });

    // Image
    $(".students").mouseenter(function () {
        outer_cursor.css({ "mix-blend-mode": "difference", "background-color": "white", "border": "none" });
        cursor.css({ 'visibility': 'hidden' });
    }).mouseleave(function () {
        outer_cursor.css({ "mix-blend-mode": "normal", "background-color": "transparent", transform: "scale(1)", "border": "solid 1px #2f1eb8" });
        cursor.css({ 'visibility': 'visible' });
    });

    $(".students").hover(function () {
        outer_cursor.css({ transform: "scale(2)" });
    });

    $(".students").mouseleave(function () {
        outer_cursor.css({ transform: "scale(1)" });
    });

    // Nav-link
    $(".nav_link").mouseenter(function () {
        outer_cursor.css({ "mix-blend-mode": "difference", "background-color": "white", "border": "none" });
        cursor.css({ 'visibility': 'hidden' });
    }).mouseleave(function () {
        outer_cursor.css({ "mix-blend-mode": "normal", "background-color": "transparent", transform: "scale(1)", "border": "solid 1px #2f1eb8" });
        cursor.css({ 'visibility': 'visible' });
    });

    $(".nav_link").hover(function () {
        outer_cursor.css({ transform: "scale(2)" });
    });

    $(".nav_link").mouseleave(function () {
        outer_cursor.css({ transform: "scale(1)" });
    });
});
