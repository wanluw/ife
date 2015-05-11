var MAX = 10;

function getTags() {
    var hobbys = $('.hobby')[0].value;
    var re = /\n|\u0020|\u3000|,|，|、|;/;
    var rawTags = hobbys.split(re);
    var resultTags = [];
    each(rawTags, function (item) {
        var value = trim(item);
        if (value !== '') {
            resultTags.push(value);
        }
    });
    resultTags = uniqArray(resultTags);
    return resultTags;

}

function validate() {
    var tags = getTags();
    if (tags.length > 0 && tags.length <= MAX) {
        isValidateOK = true;
        $('.warning')[0].innerHTML = '';
    } else {
        isValidateOK = false;
        $('.warning')[0].innerHTML = '长度不符合要求！';
    }
}

function setContent() {
    var tags = getTags();
    var text = '';
    each(tags, function (item, index) {
        text += ''
            + '<p>'
            +     '<label for="option-' + index + '">'
            +         '<input id="option-' + index + '" type="checkbox">' + item
            +     '</label>'
            + '</p>';
    });
    $('.tags')[0].innerHTML = text;
}

var isValidateOK = false;

$.click($('.submit')[0], function () {
    if (isValidateOK) {
        setContent();
    }
});

$.on($('.hobby')[0], 'keyup', function () {
    validate();
});
