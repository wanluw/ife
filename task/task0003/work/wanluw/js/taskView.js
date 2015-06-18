define(function (require) {
    var util = require('./util');
    var model = require('./model');
    var contentView = require('./contentView');
    var state = require('./state');
    var $ = util.$.bind(util);

    var taskView = {
        elem: $('.task')[0],
        render: function (subCategoryId, type) {

            var tasksData = model.getTasksGroupByDate(subCategoryId, type);
            if (tasksData) {
                var tpl = $('#tplTask').innerHTML;
                var result = tmpl(tpl, {
                    tasksData: tasksData
                });
                $('.task-bd')[0].innerHTML = result;
                util.each($('.task-date'), function (item) {
                    util.show(item);
                })
                util.show($('.task-bd')[0]);
            }
        },
        resetRender: function () {
            $('.task-bd')[0].innerHTML = '';
            state.currentTaskHeadType = false;
            util.removeClass($('.target-task-hd')[0], 'target-task-hd');
        },
        renderHead: function (type) {
            var target = $('.target-task-hd');
            util.each($('.task-hd-item'), function (item) {
                util.removeClass(item, 'target-task-hd');
            });
            if (type === 'all') {
                util.addClass($('.task-hd-item')[0], 'target-task-hd');
            } else if (type === 'unfinished') {
                util.addClass($('.task-hd-item')[1], 'target-task-hd');
            } else {
                util.addClass($('.task-hd-item')[2], 'target-task-hd');
            }
        },
        init: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            var self = this;
            // task hd选择
            util.delegate($('.task-hd')[0], '.task-hd-item', 'click', function (event) {
                event.preventDefault();
                if (state.currentSubCategoryID === null) {
                    alert('请选择大分类下的小分类！');
                    return;
                }
                var eventTarget = event.target || event.srcElement;
                var type = eventTarget.getAttribute('data-type');
                self.renderHead(type);
                state.currentTaskHeadType = type;
                self.render(state.currentSubCategoryID, type)
            });

            //新增任务
            util.click($('.task-ft-link')[0], function (event) {
                event.preventDefault();

                if (state.currentSubCategoryID === null) {
                    alert('请先选择任务创建地址(大分类下的小分类)');
                    return;
                }

                contentView.renderAdd();

                self.render(state.currentSubCategoryID, state.currentTaskHeadType);
                state.currentInputType = 'add';
            });

            //content内容填充
            util.delegate($('.task-bd')[0], '.task-title', 'click', function (event) {
                event.preventDefault();
                var eventTarget = event.target || event.srcElement;

                util.each($('.task-title'), function (item) {
                    util.removeClass(item, 'target-task-title');
                })
                util.addClass(eventTarget, 'target-task-title');
                state.currentTaskID = +$('.target-task-title')[0].getAttribute('data-id');

                contentView.renderDetail(state.currentTaskID);
            });
        }
    };
    return taskView;

});