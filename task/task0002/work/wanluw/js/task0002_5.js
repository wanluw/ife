$.delegate($('.main')[0], 'li', 'mouseover', function (event) {
    var eventTarget = event.target || event.srcElement;
    addClass(eventTarget, 'current');
});

$.delegate($('.main')[0], 'li', 'mouseout', function (event) {
    var eventTarget = event.target || event.srcElement;
    removeClass(eventTarget, 'current');
});

var mousemoveHandler = function (event) {
    var eventTarget = event.target || event.srcElement;
    var mouseTop = event.clientY;
    var mouseLeft = event.clientX;

    var elemTop = mouseTop - eventTarget.getAttribute('data-top');
    var elemLeft = mouseLeft - eventTarget.getAttribute('data-left');

    eventTarget.style.top = elemTop + 'px';
    eventTarget.style.left = elemLeft + 'px';

};

$.delegate($('.main')[0], 'li', 'mousedown', function (event) {
    var eventTarget = event.target || event.srcElement;
    var elemTop = eventTarget.offsetTop;
    var elemLeft = eventTarget.offsetLeft;

    var mouseTop = event.clientY;
    var mouseLeft = event.clientX;

    var diffTop = mouseTop - elemTop;
    var diffLeft = mouseLeft - elemLeft;

    eventTarget.setAttribute('data-top', diffTop);
    eventTarget.setAttribute('data-left', diffLeft);
    eventTarget.style.position = 'absolute';
    eventTarget.style.top = elemTop + 'px';
    eventTarget.style.left = elemLeft + 'px';

    $.on(eventTarget, 'mousemove', mousemoveHandler);
});


var list = {
    left: {
        elem: $('.list-left')[0],
        parent: $('.main-left')[0]
    },
    right: {
        elem: $('.list-right')[0],
        parent: $('.main-right')[0]
    }
};

for (var type in list) {
    var item = list[type];
    var parent = item.parent;
    item.topMin = parent.offsetTop;
    item.leftMin = parent.offsetLeft;
    item.topMax = item.topMin + parent.clientHeight;
    item.leftMax = item.leftMin + parent.clientWidth;
}


$.delegate($('.main')[0], 'li', 'mouseup', function (event) {
    var eventTarget = event.target || event.srcElement;
    removeEvent(eventTarget, 'mousemove', mousemoveHandler);

    var mouseTop = event.clientY;
    var mouseLeft = event.clientX;

    var currentList = eventTarget.parentNode;
    var currentType = currentList.getAttribute('data-type');
    var targetType = currentType === 'left' ? 'right' : 'left';
    var currentMain = list[currentType].parent;
    var anotherMain = list[targetType].parent;
    var anotherList = list[targetType].elem;

    var targetLeftMin = list[targetType].leftMin;
    var targetLeftMax = list[targetType].leftMax;
    var targetTopMin = list[targetType].topMin;
    var targetTopMax = list[targetType].topMax;

    if ((mouseLeft > targetLeftMin) && (mouseLeft < targetLeftMax) && (mouseTop > targetTopMin) && (mouseTop < targetTopMax)) {
        var current = eventTarget;
        currentList.removeChild(current);
        current.removeAttribute('data-left');
        current.removeAttribute('data-top');
        current.removeAttribute('style');
        removeClass(current, 'current');
        anotherList.appendChild(current);
    } else {
        eventTarget.removeAttribute('data-left');
        eventTarget.removeAttribute('data-top');
        eventTarget.removeAttribute('style');
        removeClass(eventTarget, 'current');
    }
});
