var sug = $('.sug')[0];
var target = $('.target')[0];

$.on(target, 'keyup', function () {
    if (target.value !== '') {
        sug.style.display = 'block';
    } else {
        sug.style.display = 'none';
    }
});


$.delegate(sug, 'a', 'mouseover', function (event) {
    var current = $('.sug-now')[0];
    var eventTarget = event.target || event.srcElement;
    var index = +eventTarget.getAttribute('data-index');
    highLight(index);
});

$.delegate(sug, 'a', 'mouseout', function (event) {
    var eventTarget = event.target || event.srcElement;
    removeClass(eventTarget, 'sug-now');
});

$.on(target, 'keyup', function (event) {
    if (event.keyCode === 38) {
        var current = $('.sug-now')[0];
        var index;
        if (current) {
            index = +current.getAttribute('data-index');
            if (index === 0) {
                index = $('.sug-item').length - 1;
            } else {
                index--;
            }
        } else {
            index = $('.sug-item').length - 1;
        }
        highLight(index);
    }

    if (event.keyCode === 40) {
        var current = $('.sug-now')[0];
        var index;
        if (current) {
            index = +current.getAttribute('data-index');
            if (index == $('.sug-item').length - 1) {
                index = 0
            } else {
                index++;
            }
        } else {
            index = 0
        }
        highLight(index);
    }

    if (event.keyCode === 13) {
        var content = $('.sug-now')[0].innerHTML;
        target.value = content;
    }
});

function highLight(index) {
    var targetItem = $('.sug-item')[index];
    if ($('.sug-now')[0]) {
        removeClass($('.sug-now')[0], 'sug-now');
    }
    addClass(targetItem, 'sug-now');
}

$.delegate($('.sug')[0], 'a', 'click', function (event) {
    var eventTarget = event.target || event.srcElement;
    var content = eventTarget.innerHTML;
    target.value = content;
});
