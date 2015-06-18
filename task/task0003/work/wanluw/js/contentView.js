define(function (require) {
    var model = require('./model');
    var state = require('./state');
    var util = require('./util');
    var $ = util.$.bind(util);

    var isTitleValid = true;
    var isDateValid = true;
    var isContentValid = true;

    var contentView = {
        elem: $('.content')[0],
        elems: {
            name: $('.name')[0],
            date: $('.content-date')[0],
            content: $('.content-ft-item')[0],
            titleTips: $('.title-tips')[0],
            dateTips: $('.date-tips')[0],
            contentTips: $('.newContent-tips')[0]
        },
        show: function () {
            util.show($('.content-form')[0]);
        },
        hide: function () {
            util.hide($('.content-form')[0]);
        },
        renderInit: function () {
            this.show();

            this.elems.titleTips.innerHTML = '';
            this.elems.dateTips.innerHTML = '';
            this.elems.contentTips.innerHTML = '';
        },
        clearInput: function () {
            this.elems.name.value = '';
            this.elems.date.value = '';
            this.elems.content.value = '';
        },
        renderAdd: function () {
            this.renderInit();

            $('.content-hd-label')[0].innerHTML = '新建任务标题:';

            util.show($('.content-ft-button')[0]);

            util.hide($('.content-hd-link')[0]);

            this.makeInputEditable();

            this.clearInput();
        },
        renderDetail: function (taskID) {
            this.renderInit();

            this.makeInputUneditable();

            $('.content-hd-label')[0].innerHTML = '标题:';

            var taskData = model.getTask(taskID).taskData;
            var contentTitle = taskData.name;
            var date = taskData.date;
            var content = taskData.content;

            this.elems.name.value = contentTitle;
            this.elems.date.value = date;
            this.elems.content.value = content;

            util.hide($('.content-ft-button')[0]);

            if (util.hasClass($('.target-task-title')[0], 'task-unfinished')) {
                util.show($('.content-hd-link')[0]);
            } else {
                util.hide($('.content-hd-link')[0]);
            }

        },
        init: function () {
            this.bindEvents();
        },
        makeInputEditable: function () {
            this.elems.name.removeAttribute('disabled');
            this.elems.date.removeAttribute('disabled');
            this.elems.content.removeAttribute('disabled');
        },
        makeInputUneditable: function () {
            this.elems.name.setAttribute('disabled', 'disabled');
            this.elems.date.setAttribute('disabled', 'disabled');
            this.elems.content.setAttribute('disabled', 'disabled');
        },
        renderEdit: function () {
            this.makeInputEditable();
            util.show($('.content-ft-button')[0]);
            state.currentInputType = 'edit';
        },
        doneTask: function (taskID) {

            this.editTask(state.currentTaskID, {
                isFinish: true
            });
            util.removeClass($('.target-task-title')[0], 'task-unfinished');
            util.addClass($('.target-task-title')[0], 'task-finished');
            util.hide($('.content-hd-link')[0]);
            util.hide($('.content-ft-button')[0]);
        },
        editTask: function (taskID, data) {
            model.editTask(taskID, data);
        },
        addTask: function (taskID, data) {
            model.addTask(taskID, data);
        },
        checkDateValid: function (inputDateValue) {
            var inputDate = new Date(inputDateValue);
            if (Object.prototype.toString.call(inputDate) === '[object Date]') {
                if (isNaN(inputDate.getTime())) {
                    return false;
                } else {
                    var dashFirst = this.elems.date.value.charAt(4);
                    var dashSecond = this.elems.date.value.charAt(7);
                    var length = this.elems.date.value.length;
                    if (length !== 10 || dashFirst !== '-' || dashSecond !== '-') {
                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                return false;
            }
        },
        bindEvents: function () {
            var self = this;

            //编辑
            util.on($('.compile')[0], 'click', function (event) {
                event.preventDefault();
                self.renderEdit();
            });

            //完成
            util.click($('.finish')[0], function (event) {
                event.preventDefault();
                if (confirm('完成任务？')) {
                    self.doneTask(state.currentTaskID);
                    var taskView = require('./taskView');
                    taskView.render(state.currentSubCategoryID, state.currentTaskHeadType);
                    var categoryView = require('./categoryView');
                    categoryView.render(model.data, state);
                }
            });

            //取消保存
            util.delegate(self.elem, '.task-cancel', 'click', function (event) {
                event.preventDefault();
                if (confirm('确定不保存')) {
                    self.hide();
                }
            });

            //确定保存
            util.delegate(self.elem, '.task-save', 'click', function (event) {
                event.preventDefault();

                if (isTitleValid && isDateValid && isContentValid) {

                    if (confirm('确定保存')) {
                        var name = $('.name')[0].value || '无标题';
                        var date = self.elems.date.value;
                        var content = self.elems.content.value;
                        name = util.parseHTML(name);
                        date = util.parseHTML(date);
                        content = util.parseHTML(content);

                        if (state.currentInputType === 'add') {
                            var taskData = {
                                id: model.getId(),
                                type: 'task',
                                name: name,
                                isFinish: false,
                                date: date,
                                content: content
                            }
                            self.addTask(state.currentSubCategoryID, taskData);
                            var categoryView = require('./categoryView');
                            categoryView.render(model.data, state);
                        } else {
                            self.editTask(state.currentTaskID, {
                                name: name,
                                date: date,
                                content: content
                            });
                        }
                        state.currentInputType = false;
                        var taskView = require('./taskView');
                        taskView.render(state.currentSubCategoryID, state.currentTaskHeadType);
                        self.hide();
                    }
                } else {
                    alert('格式不符合要求，无法保存')
                }
            });

            //内容输入格式的要求提示
            util.delegate(self.elem, '.name', 'keyup', function () {
                if (self.elems.name.value.length > 16) {
                    isTitleValid = false;
                    self.elems.titleTips.innerHTML = '最多15个字符';
                } else {
                    isTitleValid = true;
                    self.elems.titleTips.innerHTML = '';
                }

            });

            util.delegate(self.elem, '.content-date', 'keyup', function () {
                var inputDateValue = self.elems.date.value;
                isDateValid = self.checkDateValid(inputDateValue);
                if (!isDateValid) {
                    self.elems.dateTips.innerHTML = '输入日期格式yyyy-mm-dd';
                } else {
                    self.elems.dateTips.innerHTML = '';
                }

            });

            util.delegate(self.elem, '.content-ft-item', 'keyup', function () {
                if (self.elems.content.value.length > 2000) {
                    isContentValid = false;
                    self.elems.contentTips.innerHTML = '字数不能超过2000';
                } else {
                    isContentValid = true;
                    self.elems.contentTips.innerHTML = '';
                }
            });
        }
    };
    return contentView;
});