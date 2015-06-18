define(function (require) {
    var util = require('./util');
    var model = require('./model');

    var state = require('./state');

    var $ = util.$.bind(util);


    var categoryView = {
        elem: $('.list')[0],
        render: function () {
            var tpl = $('#tplCategory').innerHTML;
            this.calcTodoNum();
            var result = tmpl(tpl, {
                data: model.data,
                state: state
            });

            this.elem.innerHTML = result;
        },
        init: function () {
            this.render();
            this.bindEvents();
        },
        calcTodoNum: function () {
            util.each(model.data, function (categoryData) {
                if (categoryData.children) {
                    var categoryTodo = 0;
                    util.each(categoryData.children, function (subCategoryData) {
                        var subCategoryTodo = 0;
                        util.each(subCategoryData.children, function (taskData) {
                            if (!taskData.isFinish) {
                                subCategoryTodo++;
                            }
                            subCategoryData.todo = subCategoryTodo;
                        })
                        categoryTodo += subCategoryData.todo;
                    });
                    categoryData.todo = categoryTodo;
                }
            });
        },
        bindEvents: function () {
            var self = this;

            this.bindHoverEvent();

            util.delegate(this.elem, '.defaultCategory', 'click', function (event) {
                event.preventDefault();
            })

            // category list的展开与隐藏
            util.delegate(this.elem, '.list-item-link', 'click', function (event) {
                event.preventDefault();
                var eventTarget = event.target || event.srcElement;
                var currentID = +eventTarget.getAttribute('data-id');
                if (state.currentCategoryID === currentID) {
                    state.currentCategoryID = null;
                } else {
                    state.currentCategoryID = currentID;
                }

                self.render();
            });

            // list-item list-item-delete按键点击删除
            util.delegate(this.elem, '.list-item-delete', 'click', function (event) {
                event.preventDefault();
                if (confirm('确认删除该分类?')) {
                    var eventTarget = event.target || event.srcElement;
                    var previousElement = util.previousElement(eventTarget);
                    var targetElement = util.previousElement(previousElement)
                    var categoryId = +targetElement.getAttribute('data-id');


                    if (model.getSubCategory(state.currentSubCategoryID).parentCategory.id === categoryId) {
                        var taskView = require('./taskView');
                        taskView.resetRender();
                        var contentView = require('./contentView');
                        contentView.hide();
                        state.currentCategoryID = null;
                        state.currentSubCategoryID = null;
                    }
                    model.deleteCategory(categoryId);
                    self.render();
                }
            });

            //list-inner-item list-inner-item-delete按键的点击删除
            util.delegate(this.elem, '.list-inner-item-delete', 'click', function (event) {
                event.preventDefault();
                if (confirm('确认删除该分类?')) {
                    var eventTarget = event.target || event.srcElement;
                    var previousElement = util.previousElement(eventTarget);
                    var subCategoryId = +previousElement.getAttribute('data-id');
                    model.deleteSubCategory(subCategoryId);
                    self.render();

                    if (state.currentSubCategoryID === subCategoryId) {
                        var taskView = require('./taskView');
                        taskView.resetRender();
                        var contentView = require('./contentView');
                        contentView.cleanRender();
                        state.currentSubCategoryID = null;
                    }
                }
            });


            //每个subCategory的选中
            util.delegate(this.elem, '.list-inner-item-title', 'click', function (event) {
                event.preventDefault();
                util.each($('.list-inner-item-title'), function (item) {
                    util.removeClass(item, 'target-list-inner-item');
                })
                var eventTarget = event.target || event.srcElement;
                util.addClass(eventTarget, 'target-list-inner-item');
                var subCategoryId = +eventTarget.getAttribute('data-id');
                state.currentSubCategoryID = subCategoryId;
                state.currentTaskHeadType = 'all';
                var taskView = require('./taskView');
                taskView.render(subCategoryId, state.currentTaskHeadType);
                taskView.renderHead(state.currentTaskHeadType);
            });
        },
        bindHoverEvent: function () {
            // list-item list-item-delete按键的显示与隐藏
            util.delegate(this.elem, '.list-item-link', 'mouseover', function (event) {
                var eventTarget = event.target || event.srcElement;
                var nextElement = util.nextElement(eventTarget);
                var targetElement = util.nextElement(nextElement);
                util.show(targetElement);
            });
            util.delegate(this.elem, '.list-item-delete', 'mouseover', function (event) {
                var eventTarget = event.target || event.srcElement;
                util.show(eventTarget);
            });
            util.delegate(this.elem, '.list-item-link', 'mouseout', function (event) {
                var eventTarget = event.target || event.srcElement;
                var nextElement = util.nextElement(eventTarget);
                var targetElement = util.nextElement(nextElement);
                util.hide(targetElement);
            });
            util.delegate(this.elem, '.list-item-delete', 'mouseout', function (event) {
                var eventTarget = event.target || event.srcElement;
                util.hide(eventTarget);
            });

            //list-inner-item list-inner-item-delete按键的显示与隐藏
            util.delegate(this.elem, '.list-inner-item-title', 'mouseover', function (event) {
                var eventTarget = event.target || event.srcElement;
                var nextElement = util.nextElement(eventTarget);
                util.show(nextElement);
            });
            util.delegate(this.elem, '.list-inner-item-delete', 'mouseover', function (event) {
                var eventTarget = event.target || event.srcElement;
                util.show(eventTarget);
            });
            util.delegate(this.elem, '.list-inner-item-title', 'mouseout', function (event) {
                var eventTarget = event.target || event.srcElement;
                var nextElement = util.nextElement(eventTarget);
                util.hide(nextElement);
            });
            util.delegate(this.elem, '.list-inner-item-delete', 'mouseout', function (event) {
                var eventTarget = event.target || event.srcElement;
                util.hide(eventTarget);
            });
        },
    };

    return categoryView;

});