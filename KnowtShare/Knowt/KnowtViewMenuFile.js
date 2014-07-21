
(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('menuFile'), {
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
        doNewDocument: function () {
            //rely on this being implemented  in the content menu
            fo.publish('doConfirmClear', []);
        },
        doOpenFilePicker: function () {
            this.openFilePicker();
            //fo.publish('error', ['doOpenFilePicker', 'not implemented']);
        },
        doSaveFilePicker: function () {
            this.saveFilePicker();
            //fo.publish('error', ['doSaveFilePicker', 'not implemented']);
        },
        doCloseDocument: function () {
            //rely on this being implemented  in the content menu
            fo.publish('doConfirmClear', []);
        },
        doSaveAsHTMLFilePicker: function () {
            this.saveAsHTMLFilePicker();
            //fo.publish('error', ['doSaveAsHTMLFilePicker', 'not implemented']);
        },
        doSaveAsPNGFilePicker: function () {
            this.saveAsPNGFilePicker();
            //fo.publish('error', ['doSaveAsPNGFilePicker', 'not implemented']);
        },
    },
    function (properties, subcomponents, parent) {

        var space = parent;
        var result = fo.makeAdaptor(properties);
        //subscribe to any do* of goto* messages...
        result.subscribeToCommands();

        space.activeDocument = fo.makeComponent(result.documentSpec, {}, space);

        result.sessionRestore = function() {
            space.doSessionRestore();
        }

        result.sessionSave = function () {
            space.doSessionSave();
        }


        result.saveFilePicker = function (documentSpec, onComplete) {
            var doc = documentSpec ? documentSpec : space.copyDocumentSpecTo(space.activeDocument);
            space.userSaveFileDialog(function (payload, name, ext) {
                if (ext && ext.endsWith('.knt')) {
                    space.isDocumentSaved = true;
                    space.documentName = name;
                    space.documentExt = ext;
                    space.payloadSaveAs(payload, name, ext);
                    fo.publish('DocumentChanged', [space])
                }
                onComplete && onComplete();
            }, '.knt', doc.documentName);
        };


        result.openFilePicker = function (documentSpec, onComplete) {
            var doc = documentSpec ? documentSpec : space.copyDocumentSpecTo(space.activeDocument);
            space.userOpenFileDialog(function (payload, name, ext) {
                if (ext && ext.endsWith('.knt')) {
                    space.payloadToCurrentModel(payload);
                    space.isDocumentSaved = true;
                    space.documentName = name;
                    space.documentExt = ext;
                    fo.publish('DocumentChanged', [space]);
                }
                onComplete && onComplete();
            }, '.knt', doc.documentName);
        }


        result.saveAsPNGFilePicker = function (documentSpec, onComplete) {
            var doc = documentSpec ? documentSpec : space.copyDocumentSpecTo(space.activeDocument);
            space.userSaveFileDialog(function (payload, name, ext) {
                if (ext && ext.endsWith('.png')) {
                    space.saveCanvasAsBlob(name, ext);
                    fo.publish('DocumentChanged', [space]);
                }
            }, '.png', doc.documentName);
        };


        //SRS
        //this template should come from the stencil in the future
        function formatModelAsSimpleHtml(model) {
            var result = '';

            if (model.isTextDifferent) {
                result += '<h2>{0}</h2>'.format(model.headerText);
                result += '<span>{0}</span>'.format(model.noteText);
            }
            else if (model.headerText) {
                result += '<span>{0}</span>'.format(model.headerText);
            }
            if (model.hasImageUri) {
                result += '<img src="{0}" height="100px" style="margin-left:10px"></img>'.format(model.imageUri);
            }
            if (model.hasNoteUri) {
                result += '<a href="{0}" target="_blank" style="margin-left:10px">link</a>'.format(model.noteUri);
            }

            result = result && '<ul>{0}'.format(result);

            if (model.Subcomponents.count) {
                var list = model.Subcomponents.map(function (item) {
                    return formatModelAsSimpleHtml(item);
                });

                var details = list.map(function (item) {
                    return item;

                }).join('');
                result += details;
            }

            result += '</ul>';
            return result;
        }

        function formatAsHtmlPage(model) {
            var result = "<!DOCTYPE html>";
            result += "<head>";
            result += "</head>";
            result += "<body>";
            result += '<h1>{0}</h1>'.format(ctrl.documentTitle + model.title);
            //maybe add some styles here...

            result += model.Subcomponents.map(formatModelAsSimpleHtml).join();


            result += "</body>";
            result += "</html>";
            return result;
        }



        result.saveAsHTMLFilePicker = function (documentSpec, onComplete) {
            var doc = documentSpec ? documentSpec : space.copyDocumentSpecTo(space.activeDocument);
            space.userSaveFileDialog(function (payload, name, ext) {
                if (ext && ext.endsWith('.html')) {
                    var html = formatAsHtmlPage(space.rootModel);
                    fo.writeTextFileAsync(html, name, ext)

                    fo.publish('DocumentChanged', [space]);
                }
            }, '.html', doc.documentName);
        };

        return result;
    });

}(knowtApp, Foundry));