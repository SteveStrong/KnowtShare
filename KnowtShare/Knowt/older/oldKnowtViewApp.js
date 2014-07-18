

(function (app, fo, undefined) {



}(knowtApp, Foundry))


function KnowtViewApp(fo, hub, toastr, $log, dialogService, undefined) {


    var namespace = "KnowtShare";
    var workSpace = fo.ws.makeNoteWorkspace(namespace, {
        canvasId: 'drawingCanvas',
        panZoomCanvasId: 'panZoomCanvas',
        pipId: 'PIP',
    });

    var ctrl = new KnowtViewVM(workSpace, fo, hub, toastr, $log, dialogService);

    ctrl.doAuthorRequestClearAsync = function (onYes, onNo) {
        //do not run if page is empty
        if (ctrl.isDocumentEmpty) {
            ctrl.doClear; //this make sure we are in a known state
            onYes && onYes();
            return;
        }

        dialogService.doPopupDialog({
            headerTemplate: '<p>The author of this content is requesting you clear your screen.</p>',
            bodyTemplate: '<p>Select Yes to clear your screen and sync with the author.</p><p>Select No to ignore the content for now and use resync command to sync later.</p>',
            footerTemplate: 'dialogFooter.html'
        },
        {
            onInitialize: function ($modalInstance) {
                $modalInstance.InitializeAsYesNo();
            },
            onOK: function () {
                ctrl.doClear;
            },
            onCancel: function () {
            }
        });
    };

    ctrl.doClearAsync = function (onComplete) {
        //do not run if page is empty
        if (ctrl.isDocumentEmpty) {
            ctrl.doClear; //this make sure we are in a known state
            onComplete && onComplete();
            return;
        }

        dialogService.doPopupDialog({
            headerTemplate: 'ClearAllHeader.html',
            bodyTemplate: 'ClearAllBody.html',
            footerTemplate: 'ClearAllFooter.html',
        },
        {
            onExit: onComplete,
        },
        {
            ClearNotes: function () {
                ctrl.doCommand('doClear');
                dialogService.doCloseDialog();
            },
            SaveDocumentFirst: function () {
               ctrl.doCommand('doSaveFilePicker');
               dialogService.doCloseDialog();
            },
        });
    };

    ctrl.doClearFileDropAsync = function (onComplete) {
        //do not run if page is empty
        if (ctrl.isDocumentEmpty) {
            ctrl.doClear; //this make sure we are in a known state
            onComplete && onComplete();
            return;
        }

        dialogService.doPopupDialog({
            headerTemplate: 'ClearFileDropHeader.html',
            bodyTemplate: 'ClearFileDropBody.html',
            footerTemplate: 'ClearFileDropFooter.html'
        },
          {
              onExit: onComplete,
          },
        {
            ClearExistingNotes: function () {
                ctrl.doCommand('doClear');
                dialogService.doCloseDialog();
            },
            SaveThenClear: function () {
               ctrl.doCommand('doSaveFilePicker');
               dialogService.doCloseDialog();
            },
            MergeNotes: function () {
                dialogService.doDismissDialog();
            },
        });
    };

    ctrl.doDeleteAsync = function (onComplete) {
        //do not run if page is empty
        if (ctrl.isDocumentEmpty) {
            onComplete && onComplete();
            return;
        }

        dialogService.doPopupDialog({
            headerTemplate: 'ConfirnDeleteHeader.html',
            bodyTemplate: 'ConfirnDeleteBody.html',
            footerTemplate: 'ConfirnDeleteFooter.html',
        },
        {
            onExit: onComplete,
        },
        {
            SaveAttached: function () {
                ctrl.doCommand('doDeleteSelectedSaveSubcomponents');
                dialogService.doCloseDialog();
            },
            DeleteAll: function () {
                ctrl.doCommand('doDeleteSelected');
                dialogService.doCloseDialog();
            },
        });

    };

    ctrl.elementSelected = function (sourceElement) {
        var target, tag;

        var page = ctrl.page;

        target = fo.utils.getParentElementWithAttribute(sourceElement, 'data-toggleSubcomponents');
        if (target) {
            tag = target.getAttribute ? target.getAttribute('data-toggleSubcomponents') : '';
            var shape = page.getSubcomponent(tag, true);
            ctrl.doCommand(function () {
                if (shape) {
                    shape.showSubcomponents = !shape.showSubcomponents;
                }
            });
            return;
        }

        target = Foundry.utils.getParentElementWithAttribute(sourceElement, 'data-pinAsRoot');
        if (target) {
            tag = target.getAttribute ? target.getAttribute('data-pinAsRoot') : '';
            ctrl.doCommand(function () {
                var shape = page.getSubcomponent(tag, true);
                page.selectShape(undefined, true);
                fo.publish('PinAsRoot', [page, shape]);
            });
            return;
        }

        target = Foundry.utils.getParentElementWithAttribute(sourceElement, 'data-toggleSelected');
        if (target) {
            tag = target.getAttribute ? target.getAttribute('data-toggleSelected') : '';
            ctrl.doCommand(function () {
                var shape = page.getSubcomponent(tag, true);
                if (shape && shape.isSelected) {
                    ctrl.doOpenSelected;
                } else {
                    page.selectShape(shape, true);
                }
            });
            return;
        }

        page.selectShape(undefined, true);
    };

    ctrl.currentModelTarget = function () {
        if (ctrl.isDrawingView) return ctrl.model;

        var found = ctrl.page.selectedContext();
        found = !found ? found : found.findParentWhere(function (item) {
            return item.isOfType('note')
        });
        var root = ctrl.pinAsRootShape ? ctrl.pinAsRootShape.context : ctrl.model;
        if (ctrl.pinAsRootShape === ctrl.page) root = ctrl.model;
        return found ? found : root;
    }

    ctrl.currentViewTarget = function () {
        if (ctrl.isDrawingView) return ctrl.page;

        var found = ctrl.page.selectedShape();
        found = !found ? found : found.findParentWhere(function (item) {
            return item.isOfType('note')
        });

        var root = ctrl.pinAsRootShape ? ctrl.pinAsRootShape : ctrl.page;
        return found ? found : root;
    }

    ctrl.establishManagedProperty("doConfirmClear", function () {
        ctrl.doClearAsync(function (cmd) {
            setTimeout(function () {
                ctrl.doCommand(cmd);
            }, 200);
        });
    });

    ctrl.establishManagedProperty("doConfirmClearFileDropAsync", function () {
        ctrl.doClearFileDropAsync(function (cmd) {
            setTimeout(function () {
                ctrl.doCommand(cmd);
            }, 200);
        });
    });

    ctrl.establishManagedProperty("doConfirmDelete", function () {
        var page = ctrl.drawing.page;
        if (page) {
            var shape = page.selectedShape();
            if (!shape) return;
            var count = shape.Subcomponents.count;
            if (!count) {
                ctrl.doDeleteSelected;
                return;
            }
            ctrl.doDeleteAsync(function (cmd) {
                setTimeout(function () {
                    ctrl.doCommand(cmd);
                }, 200);
            });
        }
    });


    ctrl.establishManagedProperty("doNewDocument", function () {
        if (ctrl.isDocumentSaved) {
            ctrl.doClear;
            return;
        }

        workSpace.copyDocumentFrom(ctrl);
        workSpace.userSaveFileDialog(function (payload, name, ext) {
            if (ext && ext.endsWith('.knt')) {
                ctrl.doClear;
            }
        }, '.knt', ctrl.documentName);
    });

    ctrl.establishManagedProperty("doOpenFilePicker", function () {
        workSpace.userOpenFileDialog(function (payload, name, ext) {
            if (ext && ext.endsWith('.knt')) {
                ctrl.doClearFileDropAsync(function () {
                        //there may be cases where a dropped file want to ADD TO the content

                        fo.runWithUIRefreshLock(function () {
                            var clear = ctrl.isDocumentEmpty;
                            if (clear) ctrl.doClear;

                            ctrl.refreshModelFromPayload(payload, clear);
                        });
                        ctrl.doRepaint;
                });
            }
        }, '.knt')
    });

    ctrl.establishManagedProperty("doSaveFilePicker", function () {
        workSpace.copyDocumentFrom(ctrl);
        workSpace.userSaveFileDialog(function (payload, name, ext) {
            if (ext && ext.endsWith('.knt')) {
                workSpace.copyDocumentTo(ctrl);
                ctrl.doRepaint;
            }
        }, '.knt', ctrl.documentName);
    });

    ctrl.establishManagedProperty("doCloseDocument", function () {
        ctrl.doNewDocument;
    });


    ctrl.establishManagedProperty("doSaveAsHTMLFilePicker", function () {

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

            //result = result && '<ul><li>{0}</li>'.format(result);
            result = result && '<ul>{0}'.format(result);

            if (model.Subcomponents.count) {
                var list = model.Subcomponents.map(function (item) {
                    return formatModelAsSimpleHtml(item);
                });

                var details = list.map(function (item) {
                    //return '<li>{0}</li>'.format(item);
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

        workSpace.copyDocumentFrom(ctrl);
        workSpace.userSaveFileDialog(function (payload, name, ext) {
            if (ext && ext.endsWith('.html')) {
                var html = formatAsHtmlPage(ctrl.model);
                fo.writeTextFileAsync(html, name, ext)
                workSpace.copyDocumentTo(ctrl);
                ctrl.doRepaint;
            }
        }, '.html', ctrl.documentName);
    });


    ctrl.establishManagedProperty("doSaveAsPNGFilePicker", function () {
        workSpace.copyDocumentFrom(ctrl);
        workSpace.userSaveFileDialog(function (payload, name, ext) {
            if (ext && ext.endsWith('.png')) {
                workSpace.saveCanvasAsBlob(name, ext);
                workSpace.copyDocumentTo(ctrl);
                ctrl.doRepaint;
            }
        }, '.png', ctrl.documentName);
    });


    //http://stackoverflow.com/questions/12225951/how-to-save-html5-canvas-as-an-image-file-in-window-8-metro-app

    ctrl.establishManagedProperty("doPasteNote", function () {
        var dt = window.clipboardData;
        if (dt) {
            var text = dt.getData('Text');
            ctrl.pasteTextToNote(text);
            ctrl.doModelSmash;
        }
    });

    ctrl.createKnowtification = function (geo, header, text) {
        
        var obj = fo.KnowtShare.newNote({
            author: ctrl.userNickName,
            userId: ctrl.userId,
            noteText: text,
            headerText: header,
            noteUri: '',
            geo: geo,
        });

        var uniqueID = obj.uniqueID;
        var target = this.currentModelTarget();
        target.captureSubcomponent(obj, uniqueID);

        fo.publish('Knowtify', [uniqueID, obj, geo]);
        return obj;
    };

 
    ctrl.establishManagedProperty("doAddNote", function () {
        var obj = ctrl.createNote().note;
        ctrl.openEdit(obj);
        ctrl.doModelSmash;
    });

    ctrl.establishManagedProperty("doAddAnnotation", function () {
        var target = ctrl.page.selectedContext();
        if (!target) return; //annotations must connect to existing selected items

        var obj = fo.KnowtShare.newAnnotation({
            author: ctrl.userNickName,
            userId: ctrl.userId,
        });

        var shape = undefined;
        var uniqueID = obj.uniqueID;

        ctrl.model.captureSubcomponent(obj, uniqueID);

        var view = this.currentViewTarget();
        if (view) {
            shape = fo.KnowtShare.newAnnotationShape({
                uniqueID: uniqueID,
                context: obj,
            });

            //annotations are only subcomponents of the page
            var page = this.page;
            page.captureSubcomponent(shape, uniqueID);
            shape.setDefaultDropLocation(); //must be called after add to page

            page.selectShape(shape, true);
            page.introduceShape(shape, function () {
                //now add the link which creates the annotation
                var link = fo.KnowtShare.newLinkShape({
                    sourceID: shape.myName,
                    targetID: target.myName
                });
                page.addSubcomponent(link, fo.utils.generateUUID());
                page.render();
            });
            page.updatePIP();
        }
        //keep a Annotation private do not publish
        //fo.publish('Added', [uniqueID, obj, shape]);

        ctrl.openEdit(obj);
    });

    ctrl.establishManagedProperty("canDoUnDo", function () {
        return fo.undo.canUndo();
    });

    ctrl.establishManagedProperty("doUnDo", function () {
        if (!fo.undo.canUndo()) return;
        fo.undo.unDo();
        ctrl.smashProperty('canDoUnDo');
        //save current changed state
        ctrl.doSessionSave;
    });

    fo.subscribe('viewMode', function (vm, mode) {
    });


    fo.subscribe('identityMode', function (vm, mode) {
    });

    fo.subscribe('collaborationMode', function (vm, mode) {
    });

    fo.subscribe('interactionMode', function (vm, mode) {
    });

    fo.subscribe('BoxingStarted', function (page, box, ev) {
    });

    fo.subscribe('BoxingMoved', function (page, box, ev) {
        if (box.area < 200) return;
    });

    //start and finish are in drawing coords
    fo.subscribe('BoxingFinished', function (page, box, boxed, ev) {
    });
  


    return ctrl;
};
