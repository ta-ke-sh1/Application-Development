$.fn.stars = function () {
    return $(this).each(function () {
        const rating = $(this).data("rating");
        const numStars = $(this).data("numStars");
        const fullStar = '<i class="fa fa-star checked"></i>'.repeat(Math.floor(rating));
        const halfStar = (rating % 1 !== 0) ? '<i class="fa fa-star-half-alt"></i>' : '';
        const noStar = '<i class="fa fa-star"></i>'.repeat(Math.floor(numStars - rating));
        $(this).html(`${fullStar}${halfStar}${noStar}`);
    });
}

