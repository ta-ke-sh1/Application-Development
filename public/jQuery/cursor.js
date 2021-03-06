jQuery(document).ready(function () {
    $(document).on("mousemove", (event) => {
        $(".circle").css({
            left: event.clientX - 2,
            top: event.clientY - 2,
        });
    });

    $(document).on("mousemove", (event) => {
        $(".outer-circle").css({
            left: event.clientX - 20,
            top: event.clientY - 20,
        });
    });

    var cursor = $(".circle");
    var outer_cursor = $(".outer-circle");

    $(window)
        .mouseleave(function () {
            cursor.css({ opacity: "0" });
            outer_cursor.css({ opacity: "0" });
        })
        .mouseenter(function () {
            cursor.css({ opacity: "1" });
            outer_cursor.css({ opacity: "1" });
        });

    $(document).mouseenter(function () {
        outer_cursor.css({ "background-color": "transparent" });
    });

    $(document)
        .mousedown(function () {
            cursor.css({ transform: "scale(.2)" });
            outer_cursor.css({ transform: "scale(.3)" });
        })
        .mouseup(function () {
            cursor.css({ transform: "scale(1)" });
            outer_cursor.css({ transform: "scale(1)" });
        });

    // Button
    $(".card")
        .mouseenter(function () {
            outer_cursor.css({
                "mix-blend-mode": "difference",
                transform: "scale(2)",
                "background-color": "white",
                border: "none",
            });
            cursor.css({ visibility: "hidden" });
            $(".card")
                .find("div")
                .contains("#addCart")
                .css({ visibility: "visible" });
        })
        .mouseleave(function () {
            outer_cursor.css({
                "mix-blend-mode": "normal",
                "background-color": "transparent",
                transform: "scale(1)",
                border: "solid 1px #2f1eb8",
            });
            cursor.css({ visibility: "visible" });
            $(".card")
                .find("div")
                .contains("#addCart")
                .css({ visibility: "hidden" });
        });

    $(".card").hover(function () {
        outer_cursor.css({ transform: "scale(2)" });
    });

    $(".card").mouseleave(function () {
        outer_cursor.css({ transform: "scale(1)" });
    });

    // Image
    $("a")
        .mouseenter(function () {
            outer_cursor.css({
                "mix-blend-mode": "difference",
                "background-color": "white",
                border: "none",
            });
            cursor.css({ visibility: "hidden" });
        })
        .mouseleave(function () {
            outer_cursor.css({
                "mix-blend-mode": "normal",
                "background-color": "transparent",
                transform: "scale(1)",
                border: "solid 1px black",
            });
            cursor.css({ visibility: "visible" });
        });

    $("a").hover(function () {
        outer_cursor.css({ transform: "scale(2)" });
    });

    $("a").mouseleave(function () {
        outer_cursor.css({ transform: "scale(1)" });
    });
});
