function animate(targetTime) {
    var nowTime = (new Date()).getTime();
    var diff = Math.floor((targetTime - nowTime) / 1000);

    if (diff !== 0) {
        setTimeout(function () {
            animate(targetTime);
        }, 1000);
    }

    var diffDay = Math.floor(diff / 86400);
    var diffHour = Math.floor(diff % 864000 / 3600);
    var diffMinute = Math.floor(diff % 86400 % 3600 / 60);
    var diffSecond = diff % 86400 % 3600 % 60;
    var content = diffDay + '天' + diffHour + '小时' + diffMinute + '分' + diffSecond + '秒';
    $('.countdown')[0].innerHTML = content;
}

function getDate() {
    var date = $('.date')[0].value
    var year = date.slice(0, 4);
    var month = date.slice(5, 7);
    var day = date.slice(8);
    return {
        year: year,
        month: month,
        day: day
    };
}

$.on($('.submit')[0], 'click', function () {
    var targetDate = getDate();
    var year = targetDate.year;
    var month = targetDate.month;
    var day = targetDate.day;
    var contentText = '距离' + year + '年' + month + '月' + day + '日还有';
    $('.text')[0].innerHTML = contentText;

    var targetTime = new Date(year, month - 1, day).getTime();
    animate(targetTime);
});