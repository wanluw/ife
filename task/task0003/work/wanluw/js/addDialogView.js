define(function (require) {
    var model = require('./model');
    var state = require('./state');
    var categoryView = require('./categoryView');
    var util = require('./util');
    var each = util.each;
    var $ = util.$.bind(util);

    var addDialogView = {
        elem: $('.dialog-category')[0],
        mask:$('.mask')[0],
        show: function () {
            this.buildOptions();
            util.show(this.elem);
            util.show(this.mask);
        },
        hide: function () {
            util.hide(this.elem);
            util.hide(this.mask);
        },
        buildOptions: function () {
            var listItemLink = $('.list-item-link');
            var option = '<option>分类列表</option>';
            each(listItemLink, function (item) {
                var listItem = item.innerHTML;
                var num = item.getAttribute('data-id');
                option += '<option data-num="' + num + '">' + listItem + '</option>';
            });
            $('.dialog-select')[0].innerHTML = option;
        },
        bindEvents: function () {
            var self = this;
            //新增分类
            util.click($('.category-ft-link')[0], function (event) {
                event.preventDefault();
                self.show();
            });

            //取消添加分类
            util.click($('.category-cancel')[0], function (event) {
                event.preventDefault();
                $('#categoryName').value = '';
                self.hide();
            });

            //保存新分类
            util.click($('.category-save')[0], function (event) {
                event.preventDefault();
                var name = $('#categoryName').value;
                name = util.parseHTML(name);
                var savePath = $('#savePath').value;

                if (name) {
                    var obj = {
                        id: model.getId(),
                        name: name,
                        todo: 0,
                        children: []
                    };
                    if (savePath === '分类列表') {
                        obj.type = 'category';
                        model.addCategory(obj);
                    } else {
                        obj.type = 'list';
                        var num;
                        each($('#savePath').childNodes, function (item) {
                            if (item.selected === true) {
                                num = +item.getAttribute('data-num');
                            }
                        });
                        var categoryData = model.getCategory(num).categoryData;
                        model.addSubCategory(num, obj)
                    }
                }
                categoryView.render(model.data, state);
                $('#categoryName').value = '';
                self.hide();
            });
        },
        init: function () {
            this.bindEvents();
        }
    };
    return addDialogView;
});