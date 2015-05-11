function trim(str) {
    var trimRegex = /^[\s\xA0\u3000\uFEFF]+|[\s\xA0\u3000\uFEFF]+$/g;
    return String(str).replace(trimRegex, '');
}

function uniqArray(arr) {
    var newArr = [];
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (indexOf(newArr,arr[i]) === -1) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

function each(arr, fn) {
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        fn(arr[i], i);
    }
}

function indexOf(arr, item) {
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i] === item) {
            return i;
        }
    }
    return -1;
}

function addClass(element, newClassName) {
    var list = element.className.split(/\s+/);
    if (indexOf(list, newClassName) === -1) {
        list.push(newClassName);
    }
    element.className = list.join(' ');
}

function removeClass(element, oldClassName) {
    var list = element.className.split(/\s+/);
    var i = indexOf(list, oldClassName);
    if (i !== -1) {
        list.splice(i, 1);
    }
    element.className = list.join(' ');
}

function getElementsByClassName(className) {
    var result = [];
    var allElem = document.getElementsByTagName('*');
    each(allElem, function (elem, index) {
        var list = elem.className.split(/\s+/);
        if (indexOf(list, className) !== -1) {
            result.push(elem);
        }
    })
    return result;
}

function $(selector) {
    if (selector.slice(0, 1) === '#') {
        selector = selector.slice(1);
        return document.getElementById(selector);
    } else if (selector.slice(0, 1) === '.') {
        selector = selector.slice(1);
        return getElementsByClassName(selector);
    } else {
        return document.getElementsByTagName(selector);
    }
}

function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, listener);
    }
}

$.on = addEvent;

function removeEvent(element, event, listener) {
    if (element.removeEventListener) {
        element.removeEventListener(event, listener, false);
    } else if (element.detachEvent) {
        element.detachEvent('on' + event, listener);
    }
}

$.un = removeEvent;

function addClickEvent(element, listener) {
    addEvent(element, 'click', listener);
}

$.click = addClickEvent;

function addEnterEvent(element, listener) {
    addEvent(element, 'keyup', function(event) {
        if (event.keyCode === 13) {
            listener();
        }
    });
}

$.enter = addEnterEvent;


function delegateEvent(element, tag, eventName, listener) {
    addEvent(element, eventName, function (event) {
        var target = event.target || event.srcElement;
        if (target.nodeName.toLowerCase() === tag) {
            listener(event);
        }
    });
}

$.delegate = delegateEvent;


$.animate = function (options) {
    var start = +(new Date());
    var id = setInterval(function () {
        var timePassed = +(new Date()) - start;
        var percent = timePassed / options.duration;

        if (percent > 1) {
            percent = 1;
        }

        options.fn(percent);
        if (percent === 1) {
            clearInterval(id);
        }
    }, 16);
};
