// SAME HEIGHT FUNCTION
function sameHeight(selector) {
    var max_height = 0;
    $(selector).each(function () {
        if (max_height < $(this).height()) {
            max_height = $(this).height();
        }
    });
    $(selector).each(function () {
        $(this).height(max_height);
    });
};

// CHECK ATTRIBUTE
$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};
$(document).ready(function () {
    // OPEN MODALS
    $('*[data-modal]').on('click', function () {
        $('body').addClass('modal-open');
        var modal = $(this).data('modal');
        $('.' + modal).fadeIn().addClass('flex');
    });

    // CLOSE MODALS
    $('.modal-container .close-btn, .modal-container .overlay').on('click', function () {
        $('body').removeClass('modal-open');
        $('.modal-container').fadeOut(function () {
            $('.modal-container').removeClass('flex');
        });
        console.log('click');
    });
});