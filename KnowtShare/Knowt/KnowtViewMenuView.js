
(function (app, fo, undefined) {

    var showPanZoomWhenDrawingView = true;

    fo.defineType(app.defaultNS('menuView'), {
        viewMode: 'drawing', //text, drawing
        showPanZoomWhenDrawingView: true,
        doToggleView: function () {
            if (this.isDrawingView) {
                this.gotoTextView;
            } else {
                this.gotoDrawingView;
            }
        },
        gotoDrawingView: function () {
            this.viewMode = 'drawing';
            fo.publish("viewMode", [this, this.viewMode]);

            if (showPanZoomWhenDrawingView) {
                showPanZoomWhenDrawingView = false;
                var drawing = this.drawing;
                drawing && drawing.doTogglePanZoomWindow;
            }
        },
        isDrawingView: function () {
            return 'drawing'.matches(this.viewMode);
        },
        gotoTextView: function () {
            this.viewMode = 'text';
            fo.publish("viewMode", [this, this.viewMode]);

            var drawing = this.drawing;
            if (drawing && drawing.isPanZoomWindowOpen) {
                drawing.doTogglePanZoomWindow;
                showPanZoomWhenDrawingView = true;
            }
        },
        isTextView: function () {
            return 'text'.matches(this.viewMode);
        },


    },
    function (properties, subcomponents, parent) {

        var result = fo.makeAdaptor(properties);
        //subscribe to any do* of goto* messages...
        result.subscribeToCommands();



        return result;
    });


}(knowtApp, Foundry));

