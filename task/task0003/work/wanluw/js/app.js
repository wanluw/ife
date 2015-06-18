define(function (require) {
    var model = require('./model');
    var taskView = require('./taskView');
    var contentView = require('./contentView');
    var categoryView = require('./categoryView');
    var addDialogView = require('./addDialogView');

    var app = {
        init: function () {
            model.init();
            categoryView.init();
            taskView.init();
            contentView.init();
            addDialogView.init();
        }
    };

    return app;
});

