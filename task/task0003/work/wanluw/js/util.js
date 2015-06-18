define(function () {

    var util = {
        each: function (arr, fn) {
            for (var i = 0, iLen = arr.length; i < iLen; i++) {
                fn(arr[i], i);
            }
        },
        parseHTML: function (str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },
        indexOf: function (arr, item) {
            for (var i = 0, iLen = arr.length; i < iLen; i++) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
        },
        hasClass: function (element, className) {
            var list = element.className.split(/\s+/);
            return this.indexOf(list, className) === -1 ? false : true;
        },
        addClass: function (element, newClassName) {
            var list = element.className.split(/\s+/);
            if (this.indexOf(list, newClassName) === -1) {
                list.push(newClassName);
            }
            element.className = list.join(' ');
        },
        removeClass: function (element, oldClassName) {
            var list = element.className.split(/\s+/);
            var i = this.indexOf(list, oldClassName);
            if (i !== -1) {
                list.splice(i, 1);
            }
            element.className = list.join(' ');
        },
        show: function (element, type) {
            element.style.display = type || 'block'
        },
        hide: function (element) {
            element.style.display = 'none';
        },
        getElementsByClassName: function (className) {
            var self = this;
            var result = [];
            var allElem = document.getElementsByTagName('*');
            this.each(allElem, function (elem, index) {
                var list = elem.className.split(/\s+/);
                if (self.indexOf(list, className) !== -1) {
                    result.push(elem);
                }
            })
            return result;
        },
        $: function (selector) {
            if (selector.slice(0, 1) === '#') {
                selector = selector.slice(1);
                return document.getElementById(selector);
            } else if (selector.slice(0, 1) === '.') {
                selector = selector.slice(1);
                return this.getElementsByClassName(selector);
            } else {
                return document.getElementsByTagName(selector);
            }
        },
        on: function (element, event, listener) {
            if (element.addEventListener) {
                element.addEventListener(event, listener, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + event, listener);
            }
        },
        un: function (element, event, listener) {
            if (element.removeEventListener) {
                element.removeEventListener(event, listener, false);
            } else if (element.detachEvent) {
                element.detachEvent('on' + event, listener);
            }
        },
        click: function (element, listener) {
            this.on(element, 'click', listener);
        },
        enter: function (element, listener) {
            this.on(element, 'keyup', function (event) {
                if (event.keyCode === 13) {
                    listener();
                }
            });
        },
        delegate: function (element, tag, eventName, listener) {
            var self = this;
            this.on(element, eventName, function (event) {
                var target = event.target || event.srcElement;
                if (tag.slice(0, 1) === '.') {
                    var className = tag.slice(1);
                    if (self.hasClass(target, className)) {
                        listener(event);
                    }
                } else if (target.nodeName.toLowerCase() === tag) {
                    listener(event);
                }
            });
        },
        firstChild: function (element) {
            var firstElem = element.firstChild;
            while (firstElem && firstElem.nodeType !== 1) {
                firstElem = firstElem.nextSibling;
            }
            return firstElem;
        },
        nextElement: function (element) {
            var nextElement = element.nextSibling;
            while (nextElement && nextElement.nodeType !== 1) {
                nextElement = nextElement.nextSibling;
            }
            return nextElement;
        },
        previousElement: function (element) {
            var previousElement = element.previousSibling;
            while (previousElement && previousElement.nodeType !== 1) {
                previousElement = previousElement.previousSibling;
            }
            return previousElement;
        }
    }
    return util;
});