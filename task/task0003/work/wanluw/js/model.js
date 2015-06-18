define(function (require) {
    var util = require('./util');
    var each = util.each;


    var model = {
        data: [],
        init: function () {
            var data = localStorage.getItem('data');
            this.data = data ? JSON.parse(data) : [];
            var id = localStorage.getItem('id');
            this.id = id ? +id : 0;
        },
        setLocalStorage: function () {
            localStorage.setItem('data', JSON.stringify(this.data));
            localStorage.setItem('id', JSON.stringify(this.id));
        },
        getCategory: function (categoryId) {
            var categoryIndex;
            var categoryData;
            each(this.data, function (item, index) {
                if (item.id === categoryId) {
                    categoryData = item;
                    categoryIndex = index;
                }
            });
            return {
                categoryIndex: categoryIndex,
                categoryData: categoryData
            };
        },
        getSubCategory: function (subCategoryId) {
            var subCategoryIndex;
            var subCategoryData;
            var parentCategory;
            each(this.data, function (categoryData, categoryIndex) {
                each(categoryData.children, function (item, index) {
                    if (item.id === subCategoryId) {
                        subCategoryIndex = index;
                        subCategoryData = item;
                        parentCategory = categoryData;
                    }
                });
            });
            return {
                subCategoryIndex: subCategoryIndex,
                subCategoryData: subCategoryData,
                parentCategory: parentCategory
            };
        },
        getTask: function (taskId) {
            var taskIndex;
            var taskData;
            var parentCategory;
            var parentSubCategory;
            each(this.data, function (categoryData, categoryIndex) {
                each(categoryData.children, function (subCategoryData, subCategoryIndex) {
                    each(subCategoryData.children, function (item, index) {
                        if (item.id === taskId) {
                            taskIndex = index;
                            taskData = item;
                            parentCategory = categoryData;
                            parentSubCategory = subCategoryData;
                        }
                    });
                });
            });
            return {
                taskIndex: taskIndex,
                taskData: taskData,
                parentCategory: parentCategory,
                parentSubCategory: parentSubCategory
            };
        },
        deleteCategory: function (categoryId) {
            var categoryIndex = this.getCategory(categoryId).categoryIndex;
            this.data.splice(categoryIndex, 1);
            this.setLocalStorage();
        },
        deleteSubCategory: function (subCategoryId) {
            var subCategoryInfo = this.getSubCategory(subCategoryId);
            var subCategoryIndex = subCategoryInfo.subCategoryIndex;
            var targetCategory = subCategoryInfo.parentCategory;
            targetCategory.children.splice(subCategoryIndex, 1);
            this.setLocalStorage();
        },
        deleteTask: function (taskId) {
            var taskInfo = this.getTask(taskId);
            var taskIndex = taskInfo.taskIndex;
            var targetSubCategory = taskInfo.parentSubCategory;
            subCategoryData.children.splice(taskIndex, 1);
            this.setLocalStorage();
        },
        addCategory: function (categoryData) {
            this.data.push(categoryData);
            this.setLocalStorage();
        },
        addSubCategory: function (categoryId, subCategoryData) {
            var categoryData = this.getCategory(categoryId).categoryData;
            categoryData.children.push(subCategoryData);
            this.setLocalStorage();
        },
        addTask: function (subCategoryId, taskData) {
            var subCategoryData = this.getSubCategory(subCategoryId).subCategoryData;
            subCategoryData.children.push(taskData);
            this.setLocalStorage();
        },
        editCategory: function (categoryId, categoryData) {
            var categoryIndex = this.getCategory(categoryId).categoryIndex;
            this.data.splice(categoryIndex, 1, categoryData);
            this.setLocalStorage();
        },
        editSubCategory: function (subCategoryId, subCategoryData) {
            var subCategoryInfo = this.getSubCategory(subCategoryId);
            var subCategoryIndex = subCategoryInfo.subCategoryIndex;
            var categoryData = subCategoryInfo.parentCategory;
            categoryData.children.splice(subCategoryIndex, 1, subCategoryData);
            this.setLocalStorage();
        },
        editTask: function (taskId, taskData) {
            var currentTask = this.getTask(taskId).taskData;
            for (var key in taskData) {
                currentTask[key] = taskData[key];
            }
            this.setLocalStorage();
        },

        getTasksGroupByDate: function(subCategoryId, type) {
            var result = {};
            var tasks = this.getSubCategory(subCategoryId).subCategoryData.children;
            each(tasks, function (item, index) {
                var date = item.date;
                result[date] = result[date] || [];
                switch (type) {
                    case 'all':
                        result[date].push(item);
                        break;
                    case 'finished':
                        if (item.isFinish === true) {
                            result[date].push(item);
                        }
                        if (result[date].length === 0) {
                            delete result[date];
                        }
                        break;
                    case 'unfinished':
                        if (item.isFinish === false) {
                            result[date].push(item);
                        }
                        if (result[date].length === 0) {
                            delete result[date];
                        }
                        break;
                }
            });
            return result;
        },
        getId: function () {
            return ++this.id;
        }
    }
    return model;
});