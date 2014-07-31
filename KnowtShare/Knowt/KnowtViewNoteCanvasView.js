

(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('noteCanvasView'), {
        space: fo.fromParent,
        currentPage: function () {
            return this.space.rootPage;
        },
        pages: function () {
            var path = [];
            var self = this.space.drawing;
            var parent = this.currentPage;
            while (parent && parent != self) {
                path.push(parent);
                parent = parent.myParent;
            }
            return path.reverse();
        },
        title: function () {
            return this.currentPage.title;
        },
        pageStats: function () {
            var page = this.currentPage;
            return page.canvasWH + ' ' + page.drawingWH + ' scale:' + parseInt(100 * page.scale) /100;
        }
    });


}(knowtApp, Foundry));
