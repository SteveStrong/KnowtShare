
(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('menuContent'), {
        stencil: fo.fromParent,
        dialogService: fo.fromParent,

        rootModel: fo.fromParent,
        rootPage: fo.fromParent,

        userNickName: fo.fromParent,
        userId: fo.fromParent,

        hasSelection: function () {
            return this.currentShape && this.currentShape.isSelected;
        },
        currentNote: function () {
            var found = this.hasSelection && this.currentShape.context;
            return found;
        },
        currentShape: function () {
            var found = this.rootPage && this.rootPage.selectedShape();
            return found;
        },

        doAddNote: function () {
            return this.doCreateNote();
        },
        canOpenSelected: function () {
            return this.hasSelection;
        },
        doOpenSelected: function () {
            this.openEdit(this.currentNote);
        },
        doDuplicateSelected: function () {
            fo.publish('info', ['doDuplicateSelected']);
        },
        canDoDelete: function() {
            return this.hasSelection;
        },
        doConfirmDelete: function () {
            var page = this.rootPage;
            var shape = page && page.selectedShape();
            if (page == shape.myParent ) {
                this.doDeleteSelected;
                return;
            }
            this.doDeleteAsync();
        },
        doReparentSelected: function () {
            var page = this.rootPage;
            if (page) {
                var shape = page.selectedShape();
                if (shape) {
                    var loc = { pinX: shape.pinX, pinY: shape.pinY, index: shape.myIndex() }
                    var oldParent = page.captureSubcomponent(shape);
                    fo.publish('ShapeReparented', [shape, oldParent, shape.myParent, loc]);


                    page.moveToPasteArea(shape);
                    //var pinX = (oldParent.pinX - page.panX) / page.scale - 20;
                    //var pinY = (oldParent.pinY - page.panY) / page.scale - 20;

                    //shape.setXY(pinX, pinY);
                    //fo.publish('ShapeMoved', [shape.myName, undefined, shape])
                }
            }
        },

        doDeleteSelected: function () {
            var page = this.rootPage;
            var shape = page && page.selectedShape();
            if (page && shape) {
                //first move this shape to page before we delete
                if (shape.myParent != page) {
                    this.doReparentSelected;
                }

                page.selectShape(undefined, true);

                var uniqueID = shape.uniqueID || shape.myName;
                var model = this.rootModel.getSubcomponent(uniqueID, true);
                page.farewellShape(shape, function () {
                    fo.publish('Deleted', [uniqueID, model, shape]);

                    fo.undo.do('Deleted', { model: model, shape: shape })
                });
            }
        },

        doDeleteSelectedParentOnly: function () {
            var page = this.rootPage;
            if (page) {
                var shapeParent = page.selectedShape();
                if (shapeParent) {
                    var list = shapeParent.Subcomponents.duplicate();
                    list.forEach(function (shape) {
                        var loc = { pinX: shape.pinX, pinY: shape.pinY, index: shape.myIndex() }
                        var oldParent = page.captureSubcomponent(shape);
                        fo.publish('ShapeReparented', [shape, oldParent, shape.myParent, loc]);

                        page.moveToPasteArea(shape);
                    });

                    this.doDeleteSelected;
                }
            }
        },

        doDeleteSelectedSaveSubcomponents: function () {
            var page = this.rootPage;
            var self = this;
            if (page && page.selectedShape()) {
                page.resetPasteArea();
                page.showPasteArea(function () {
                    self.doDeleteSelectedParentOnly;
                });
            }
        },

        doConfirmClear: function () {
            this.doClearAsync();
        },
        doConfirmClearFileDropAsync: function () {

        },
        doUnDo: function () {
            if (!fo.undo.canUndo()) return;
            fo.undo.unDo();
            this.smashProperty('canDoUnDo');

            //save current changed state
            this.myParent.doSessionSave();
        },
        canDoUnDo: function () {
            return fo.undo.canUndo();
        },
    }, create);

    function create(properties, subcomponents, parent) {

        var obj = fo.makeComponent(properties, subcomponents, parent);
        //subscribe to any do* of goto* messages...
        obj.subscribeToCommands();


        var space = parent;
        fo.subscribe('ShapeSelected', function (view, shape, selections) {
            obj.smashProperty('hasSelection');
        });


        fo.undo.registerActions('Deleted',
            function (payload) { //do before payload is stored
                obj.smashProperty('canDoUnDo');
                //this would be where the object is deleted
                var model = payload.model;
                var shape = payload.shape;

                if (model && model.myParent) {
                    payload.modelParent = model.myParent.myName;
                    model && model.removeFromModel();
                }

                if (shape && shape.myParent) {
                    payload.shapeParent = shape.myParent.myName;
                    payload.pinX = shape.pinX;
                    payload.pinY = shape.pinY;
                    payload.index = shape.myIndex();
                    shape && shape.removeFromModel();
                }
                return payload;
            },
            function (payload) { //process undo because noone else will
                //if stringifed it should be parsed
                var modelParent = payload.modelParent;
                var shapeParent = payload.shapeParent;

                var rootModel = obj.rootModel;
                var rootPage = obj.rootPage;

                var model = payload.model;
                if (modelParent) {
                    var parent = rootModel.getSubcomponent(modelParent, true);
                    parent.captureSubcomponent(model);
                }

                var shape = payload.shape;
                if (shapeParent) {
                    var parent = rootPage.getSubcomponent(shapeParent, true);
                    parent.captureSubcomponent(shape);
                    if (parent == rootPage) {
                        shape.pinX = payload.pinX;
                        shape.pinY = payload.pinY;
                    }

                    rootPage.introduceShape(shape, function () { rootPage.render(); });
                }

                //tell others that the note is back
                fo.publish('Added', [model.uniqueID, model, shape]);
                return payload;
            }
        );

        fo.undo.registerActions('Edited',
              function (payload) { //do before payload is stored
                  obj.smashProperty('canDoUnDo');
                  //this would be where you stringify it;
                  //but for now just hang on to the objects, they should not be
                  //connected to their parents at this point
                  var id = payload.id;
                  var spec = payload.spec;

                  return payload;
              },
              function (payload) { //process undo because noone else will

                  var id = payload.id;
                  var spec = payload.spec;

                  var rootModel = obj.rootModel;

                  var model = rootModel.getSubcomponent(id, true);
                  for (var key in spec) {
                      if (spec[key] != model[key]) {
                          model[key] = spec[key];
                      }
                  }
                  //ctrl.page.render();

                  //tell other users the note has changed
                  fo.publish('ModelChanged', [model]);

                  return payload;
              },
              function (newPayload, oldPayload) {
                  //used to verify this undo should be kept.
                  if (newPayload.id != oldPayload.id) return true;

                  for (var key in newPayload.spec) {
                      if (newPayload.spec[key] != oldPayload.spec[key]) return true;
                  }

                  return false;
              }
          );


        //add code to undo reparenting here...
        fo.undo.registerActions('ShapeReparented',
            function (payload) {
                obj.smashProperty('canDoUnDo');
                //remember the shape is reparented, now you must do the model
                // var model = rootModel.getSubcomponent(payload.shape.myName, true);
                var child = payload.child;
                var newParent = payload.newParent;
                var loc = payload.loc;

                var index = loc.index;

                var model = space.rootModel;
                var modelParent = model.getSubcomponent(newParent.myName, true); //var parentId = found.name;
                modelParent = modelParent ? modelParent : model;

                var modelChild = model.getSubcomponent(child.myName, true);  //var childId = shape.name;
                modelParent.captureSubcomponent(modelChild);

                return payload;
            },
            function (payload) {
                //ok now you need to undo the data model and well as the shapes...
                var child = payload.child;
                var oldParent = payload.oldParent;
                var newParent = payload.newParent;


                var model = space.rootModel;
                var modelParent = model.getSubcomponent(oldParent.myName, true); //var parentId = found.name;
                modelParent = modelParent ? modelParent : model;

                var loc = payload.loc;
                var index = loc.index ? loc.index : modelParent.Subcomponents.count - 1;

                var modelChild = model.getSubcomponent(child.myName, true);  //var childId = shape.name;
                modelParent.captureInsertSubcomponent(index, modelChild);
                //modelParent.captureSubcomponent(modelChild);


                //now fix the presentation 
                var page = space.rootPage;
                var parent = page.getSubcomponent(oldParent.myName, true);
                parent.captureInsertSubcomponent(index, child);
                //parent.captureSubcomponent(child);

                if (parent == page) {
                    child.pinX = loc.pinX;
                    child.pinY = loc.pinY;
                }
                page.forceLayout();

                //tell other users the note has changed (changed back that is)
                fo.publish('Reparented', [child.uniqueID, newParent.uniqueID, oldParent.uniqueID]);

                return payload;
            }
        );

        fo.subscribe('ShapeReparented', function (child, oldParent, newParent, loc) {

            //remember the shape is reparented, now you must do the model
            var payload = { child: child, oldParent: oldParent, newParent: newParent, loc: loc };
            var undo = fo.undo.do('ShapeReparented', payload);  //

            fo.publish('Reparented', [child.uniqueID, oldParent.uniqueID, newParent.uniqueID])
        });




        //dataURI is used to store a picture
        obj.createAndCaptureNote = function(properties, text, dataUri) {

            var target = space.currentModelTarget();

            var spec = {
                author: this.userNickName,
                userId: this.userId,
                dataUri: dataUri,
            }

            var note = this.stencil.newNote(fo.utils.union(spec, properties), target);

            if (text) {
                if (text.startsWith('http')) {
                    note.noteUri = text;
                    var textarray = text.split('.');
                    note.headerText = textarray.length > 1 ? textarray[1] : '';
                } else {
                    note.noteText = text;
                }
            }

            var uniqueID = note.uniqueID;
            target.capture(note, uniqueID);

            var shape = undefined;
            var view = space.currentViewTarget();
            if (view) {
                shape = this.stencil.newNoteShape({
                    uniqueID: uniqueID,
                    context: note,
                }, view);


                var page = space.rootPage;
                page.introduceShape(shape, function () {
                    shape.setDefaultXY(page.defaultXY());
                    view.capture(shape, uniqueID);
                });
            }
            fo.publish('Added', [uniqueID, note, shape]);

            //do this somewhere else if (!dataUri) ctrl.openEdit(obj);
            return { note: note, shape: shape };
        };


        obj.doCreateNote = function (properties, onComplete) {
            obj.createAndCaptureNote(properties);
            onComplete && onComplete();
        }


        //now subscribe to data from drag and drop
        fo.subscribe('urlDropped', function (url) {
            var note = obj.createAndCaptureNote({}, url).note;
            fo.publish('ModelChanged', [note]);
        });

        fo.subscribe('textDropped', function (txt) {
            var note = obj.createAndCaptureNote({},txt).note;
            fo.publish('ModelChanged', [note]);
        });

        fo.subscribe('imageFileDropped', function (payload, name, ext) {
            var note = obj.createAndCaptureNote({},'', payload).note;
            note.establishManagedProperty('sourceFilename', name);
            fo.publish('ModelChanged', [note]);
        });


        fo.subscribe('textFileDropped', function (payload, name, ext) {

            var model = obj.rootModel;
            var page = obj.rootPage;
            var factory = obj.stencil;

            if (ext && ext.endsWith('.csv')) {
                var json = space.payloadToLocalData(name, payload);

                setTimeout(function () {

                    var table = factory.newNote({ headerText: name });
                    model.capture(table, table.uniqueID);
                    var rootShape = factory.newNoteShape({ context: table, uniqueID: table.uniqueID });
                    //var rootShape = fo.newInstance('tableShape2D', { pinX: 100, pinY: 50, context: table });
                    //rootShape.localDateSource = name;
                    //rootShape.localData = json;
                    rootShape.setDefaultXY(rootPage.defaultXY());

                    var uniqueKeys = fo.filtering.identifyUniqueKeyFields(json);
                    var fields = Object.keys(json[0]);

                    page.doUpdate(function () {
                        page.capture(rootShape);

                        var uniqueRecords = uniqueKeys[fields[0]];
                        fo.utils.forEachValue(uniqueRecords, function (key, value) {
                            if (!key) return;
                            var mixin = {
                                headerText: key,
                            }
                            var item = factory.newNote(mixin);
                            table.capture(item, item.uniqueID);
                            //item.imageUri = item.Picture
                            //item.headerText = key;
                            var row = factory.newNoteShape({ context: item, uniqueID: item.uniqueID });
                            //row.localDateSource = name;
                            //row.localData = item;
                            rootShape.capture(row, item.uniqueID);
                        });

                        //save current changed state
                        space.doSessionSave();
                        //ctrl.doSessionSave;
                        //ctrl.doRepaint;

                    });
                }, 200);
            }

            if (ext && ext.endsWith('.knt')) {
                //look at doing this workflow and a set of promices...

                obj.doClearFileDropAsync(function (action) {
                        //there may be cases where a dropped file want to ADD TO the content
                    if ('save'.matches(action)) {
                        space.saveFilePicker(); //this make sure we are in a known state
                        return;
                    }

                    setTimeout(function () {
                        var clear = space.isDocumentEmpty();
                        if (clear || 'clear'.matches(action)) space.clear();

                        space.payloadToCurrentModel(payload);
                        fo.publish('DocumentChanged', [space])

                    }, 200);
                });
            }
        });


        obj.doClearFileDropAsync = function (onComplete) {
            //do not run if page is empty
            if (space.isDocumentEmpty()) {
                space.clear(); //this make sure we are in a known state
                onComplete && onComplete();
                return;
            }

            obj.dialogService.doPopupDialog({
                headerTemplate: 'ClearFileDropHeader.html',
                bodyTemplate: 'ClearFileDropBody.html',
                footerTemplate: 'ClearFileDropFooter.html'
            },
              {
                  onExit: onComplete,
              },
            {
                ClearExistingNotes: function () {
                    obj.dialogService.doCloseDialog('clear');
                },
                SaveThenClear: function () {
                    obj.dialogService.doCloseDialog('save');
                },
                MergeNotes: function () {
                    obj.dialogService.doCloseDialog('merge');
                },
            });
        };


        obj.doClearAsync = function (onComplete) {
            //do not run if page is empty
            if (space.isDocumentEmpty() || space.isDocumentSaved ) {
                space.clear(); //this make sure we are in a known state
                onComplete && onComplete();
                return;
            }

            obj.dialogService.doPopupDialog({
                //headerTemplate: 'ClearAllHeader.html',
                bodyTemplate: 'ClearAllBody.html',
               // footerTemplate: 'CloseFooter.html',
            },
            {
                onExit: onComplete,
            },
            {
                ClearNotes: function () {
                   space.clear(); //this make sure we are in a known state
                   obj.dialogService.doCloseDialog();
                },
                SaveDocumentFirst: function () {
                    obj.dialogService.doCloseDialog();
                   space.saveFilePicker(); //this make sure we are in a known state
                },
            });
        };

        obj.openEdit = function (context) {
            if (!context || obj.dialogService.isBusy()) return;
            //mush of this is specific to notes so maybe if belongs 
            //defined in the stencil??

            var myUndo = fo.undo.do('Edited', { id: context.uniqueID, spec: context.getSpec() });

            var dialog = obj.dialogService.doPopupDialog({
                context: context,
                //headerTemplate: 'noteHeaderTemplate.html',
                //bodyTemplate: 'noteBodyTemplate.html',
                //footerTemplate: 'dialogFooter.html',
            },
            {
                onInitialize: function ($modalInstance, $scope) {
                    if ((context.noteText && context.isTextDifferent) || context.hasNoteUri) {
                        $scope.doMore();
                    }
                },
                onOK: function ($modalInstance, context) {
                    if (!context.noteUri.startsWith('http') && context.noteText.startsWith('http')) {
                        context.noteUri = context.noteText;
                    }
                    var keep = fo.undo.verifyKeep(myUndo, { id: context.uniqueID, spec: context.getSpec() });
                    if (keep) fo.publish('ModelChanged', [context]);
                    //done elsewhere $modalInstance.close(context);
                },
                onCancel: function ($modalInstance, context) {
                    var keep = fo.undo.verifyKeep(myUndo, { id: context.uniqueID, spec: context.getSpec() });
                    if (keep) {
                        fo.undo.unDo(myUndo);
                        fo.publish('ModelChanged', [context]);
                    }
                    //done elsewhere $modalInstance.dismiss(context);
                },
                onExit: function () {
                   // obj.doModelSmash;
                },
                onReady: function () {
                }
            });
        };

        obj.doDeleteAsync = function (onComplete) {
            //do not run if page is empty
            if (space.isDocumentEmpty()) {
                onComplete && onComplete();
                return;
            }

            obj.dialogService.doPopupDialog({
                headerTemplate: 'ConfirnDeleteHeader.html',
                bodyTemplate: 'ConfirnDeleteBody.html',
                footerTemplate: 'ConfirnDeleteFooter.html',
            },
            {
                onExit: onComplete,
            },
            {
                SaveAttached: function () {
                    obj.doCommand('doDeleteSelectedSaveSubcomponents');
                    obj.dialogService.doCloseDialog();
                },
                DeleteAll: function () {
                    obj.doCommand('doDeleteSelected');
                    obj.dialogService.doCloseDialog();
                },
            });
        }


        return obj;
    };

}(knowtApp, Foundry));

