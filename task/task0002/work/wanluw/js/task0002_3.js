$.delegate($('.slider-ft')[0], 'a', 'click', function (event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
    var eventTarget = event.target || event.srcElement;
    var index = eventTarget.getAttribute('data-index');
    select(index);
})

function select(index) {
    var circleElem = $('.slider-ft-item')[index];
    removeClass($('.current-slider')[0], 'current-slider');
    addClass(circleElem, 'current-slider');
    var targetMarginLeft = -index * 640;
    var currentMarginLeft = $('.slider-bd')[0].style.marginLeft;
    currentMarginLeft = currentMarginLeft === '' ? 0 : parseFloat(currentMarginLeft, 10);
    var diff = targetMarginLeft - currentMarginLeft;
    $.animate({
        duration: 500,
        fn: function (percent) {
            $('.slider-bd')[0].style.marginLeft = currentMarginLeft + diff * percent + 'px';
        }
    });
}