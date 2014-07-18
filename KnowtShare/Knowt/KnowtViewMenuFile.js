
(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('menuFile'), {
        space: {},
        activeDocument: function() {
            var doc = this.space.activeDocument;
            return doc;
        },
        doReadFromLocalStorage: function () {
            this.space.doSessionRestore();
        },
        doWriteToLocalStorage: function () {
            this.space.doSessionSave();
        },
        doNewDocument: function () {
            //rely on this being implemented  in the content menu
            fo.publish('doConfirmClear', []);
        },
        doOpenFilePicker: function () {
            this.space.openFilePicker(this.activeDocument); 
            //fo.publish('error', ['doOpenFilePicker', 'not implemented']);
        },
        doSaveFilePicker: function () {
            this.space.saveFilePicker(this.activeDocument);
            //fo.publish('error', ['doSaveFilePicker', 'not implemented']);
        },
        doCloseDocument: function () {
            //rely on this being implemented  in the content menu
            fo.publish('doConfirmClear', []);
        },
        doSaveAsHTMLFilePicker: function () {
            fo.publish('error', ['doSaveAsHTMLFilePicker', 'not implemented']);

        },
        doSaveAsPNGFilePicker: function () {
            fo.publish('error', ['doSaveAsPNGFilePicker', 'not implemented']);

        },
    },
    function (properties, subcomponents, parent) {

        var result = fo.makeAdaptor(properties);
        //subscribe to any do* of goto* messages...
        result.subscribeToCommands();



        return result;
    });

}(knowtApp, Foundry));