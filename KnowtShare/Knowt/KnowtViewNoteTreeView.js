

(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('noteTreeView'), {
        space: fo.fromParent,
        currentPage: function () {
            return this.space.rootPage;
        },
        pinAsRootShape: function () {
            return this.currentPage;
        },
        selectionPath: function () {
            var path = [];
            var self = this.space.drawing;
            var parent = this.pinAsRootShape;
            while (parent && parent != self) {
                path.push(parent);
                parent = parent.myParent;
            }
            return path.reverse();
        },
        modelElements: function () {
            var context = this.pinAsRootShape.context;
            context = context || this.model;
            return context.Subcomponents.elements;
        },
        shapeElements: function () {
            return this.pinAsRootShape.Subcomponents.elements;
        }
    },
    function (properties, subcomponents, parent) {

        var result = fo.makeComponent(properties, subcomponents, parent);

        result.doPinAsRoot = function (shape) {
            var model = shape && shape.context;
            if (shape) {
                this.pinAsRootShape = shape;
            } else {
                this.smashProperty('pinAsRootShape');
            }
        };

        fo.subscribeComplete('WorkspaceClear', function (space) {
            result.smashProperty('pinAsRootShape');
            $scope.safeApply();
        });

        result.selectShape = function (shape) {
            this.currentPage.selectShape(shape, true);
        };

        result.unselectShape = function () {
            this.currentPage.selectShape(undefined, true);
        };


        return result;
    });



}(knowtApp, Foundry));
