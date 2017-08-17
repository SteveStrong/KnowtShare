
(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('menuCreate'), {
        documentSpec: {
            documentName: 'defaultKnowts',
            documentExt: '.knt',
        },
        doReadFromLocalStorage: function () {
            this.sessionRestore();
        },
        doWriteToLocalStorage: function () {
            this.sessionSave();
        },

        doOpenDecisionTree: function () {
            this.openFilePicker('.knt');
        },

        doOpenDataTable: function () {
            this.openFilePicker('.csv');
        },


    },
    function (properties, subcomponents, parent) {

        var space = parent;
        var result = fo.makeAdaptor(properties);
        //subscribe to any do* of goto* messages...
        result.subscribeToCommands();


        result.sessionRestore = function() {
            space.doSessionRestore();
        }

        result.sessionSave = function () {
            space.doSessionSave();
        }



        result.openFilePicker = function (extension, onComplete) {
            space.userOpenFileDialog(function (payload, name, ext) {
                if (ext && ext.endsWith(extension)) {
                    fo.publish('fileAdded' + extension, [payload, name, ext]);
                }
                onComplete && onComplete();
            }, extension);
        }



        return result;
    });

}(knowtApp, Foundry));