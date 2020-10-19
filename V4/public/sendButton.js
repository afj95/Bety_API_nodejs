$(".send").on('click', function() {
    $(".text").addClass("active");
    $(".send").addClass("active");
    $(".loader").addClass("active");
    $(".send").delay(1700).queue(function() {
        $(this).addClass("finished").clearQueue();
    });

    $(".done").delay(1600).queue(function() {
        $(this).addClass("active").clearQueue();
    });
})