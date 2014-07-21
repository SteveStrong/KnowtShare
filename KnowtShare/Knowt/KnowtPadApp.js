
var knowtApp = angular.module('knowtPadApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);
knowtApp.header = { title: 'Knowt Pad', help: 'knowtshareHelp.html' };

//initial document and run implemented...
(function (app, fo, undefined) {
    app.defaultNS = function (name) {
        var id = fo.getNamespaceKey(this.name, name);
        return id;
    }

    app.stencilNS = function (name) {
        var id = fo.getNamespaceKey("KnowtShare", name);
        return id;
    }

}(knowtApp, Foundry));


(function (app, fo, undefined) {

    app.run(function ($log, $exceptionHandler, dialogService, workspaceService) {


        //http://codeseven.github.io/toastr/demo.html
        toastr.options = {
            positionClass: "toast-bottom-left",
        }

        fo.subscribe('info', function (a, b) {
            toastr.info(a, b);
        });

        fo.subscribe('warning', function (a, b) {
            toastr.warning(a, b);
        });

        fo.subscribe('error', function (a, b) {
            toastr.error(a, b);
        });

        fo.subscribe('success', function (a, b) {
            toastr.success(a, b);
        });

        //load templares for tialogs and shapes...
        fo.utils.loadTemplate('KnowtView.Dialogs.html');
        fo.utils.loadTemplate('KnowtView.NoteTemplate.html');



    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

    //http://odetocode.com/blogs/scott/archive/2013/06/06/decorating-angularjs-services.aspx
    //http://www.bennadel.com/blog/2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm


    app.service('workspaceService', ['$log', function ($log) {

        var space;

        this.workSpace = function (properties, modelTemplate) {
            if (space) return space;

            var spec = {
                canvasId: 'drawingCanvas',
                panZoomCanvasId: 'panZoomCanvas',
                pipId: 'PIP',
                title: "Knowt Pad",
                subTitle: "take notes visually",
                userId: "123456780",
                userNickName: 'sedona',
                //documentTitle: function () {
                //    var result = this.documentName + this.documentExt;
                //    if (result && !this.isDocumentSaved) result += "*";
                //    return result;
                //},
            }
            space = fo.ws.makeNoteWorkspace("KnowtPad", fo.utils.union(spec, properties), modelTemplate);

            space.isDocumentEmpty = function () {
                //var total = (this.rootPage.Subcomponents.count * this.rootModel.Subcomponents.count) / 2;
                var isEmpty = this.rootPage.Subcomponents.isEmpty() && this.rootModel.Subcomponents.isEmpty();
                return isEmpty;
            };





            return space;
        };

        this.activeWorkSpace = function () {
            if (!space) throw new Error('Workspace is not initialized');
            return space;
        }

        this.activeDrawing = function () {
            if (!space) throw new Error('Workspace is not initialized');
            return space.drawing;
        }

    }]);

}(knowtApp, Foundry));

//now create the main controller
(function (app, fo, undefined) {

    app.controller('workSpace', function ($scope, $log, workspaceService, dialogService) {


        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        var space = workspaceService.workSpace({
            factory: fo.knowtPadApp,
            stencil: fo.KnowtShare,
            dialogService: dialogService,
        });

        space.inspect = function () {
            dialogService.doPopupDialog({
                context: space,
                headerTemplate: 'WorkspaceHeader.html',
                bodyTemplate: 'WorkspaceInspect.html',
                footerTemplate: 'CloseFooter.html',
            });
        }

        //listen for key events...
        space.keyPressedState = space.factory.newKeyPressedEvents({}, space);
        space.updateAllViews = function () {
            space.rootPage.forceLayout();
            $scope.safeApply();
        }

        //this code is in  fo.defineType(app.defaultNS('menuFile')

        //space.saveFilePicker = function (documentSpec, onComplete) {
        //    var doc = documentSpec ? documentSpec : space.copyDocumentSpecTo({});
        //    space.userSaveFileDialog(function (payload, name, ext) {
        //        if (ext && ext.endsWith('.knt')) {
        //            space.isDocumentSaved = true;
        //            space.documentName = name;
        //            space.documentExt = ext;
        //            space.payloadSaveAs(payload, name, ext);
        //            fo.publish('DocumentChanged', [space])
        //        }
        //        onComplete && onComplete();
        //    }, '.knt', doc.documentName);
        //};

        //space.openFilePicker = function (documentSpec, onComplete) {
        //    var doc = documentSpec ? documentSpec : space.copyDocumentSpecTo({});
        //    space.userOpenFileDialog(function (payload, name, ext) {
        //        if (ext && ext.endsWith('.knt')) {
        //            space.payloadToCurrentModel(payload);
        //            space.isDocumentSaved = true;
        //            space.documentName = name;
        //            space.documentExt = ext;
        //            fo.publish('DocumentChanged', [space])
        //        }
        //        onComplete && onComplete();
        //    }, '.knt', doc.documentName);
        //}


        fo.enableFileDragAndDrop('appContent');

        //this method is called from KnowtViewMenuContext...  on file drop
        fo.subscribeComplete('DocumentChanged', function (workspace) {
            workspace.copyDocumentSpecTo(workspace.activeDocument);
            workspace.rootPage.forceLayout();
            workspace.doSessionSave();

            $scope.safeApply();
        });

        fo.subscribeComplete('WorkspaceClear', function (workspace) {
            $scope.safeApply();
        });


        fo.subscribeComplete('ShapeSelected', function (view, shape, selections) {
            $scope.safeApply();
        });


        //fo.subscribeComplete('ShapeReparented', function (shape, oldParent, newParent, loc) {
        //    $scope.safeApply();
        //});

        fo.subscribeComplete('Reparented', function (shape, oldParent, newParent, loc) {
            space.isDocumentSaved = false;
            $scope.safeApply();
        });

        fo.subscribeComplete('ModelChanged', function (note) {
            space.isDocumentSaved = false;
            $scope.safeApply();
        });

        fo.subscribeComplete('Deleted', function (name, note, shape) {
            space.isDocumentSaved = false;
            //$scope.safeApply();
        });

        fo.subscribeComplete('Added', function (name, note, shape) {
            space.isDocumentSaved = false;
            //$scope.safeApply();
        });

        fo.subscribeComplete('doToggleView', function () {
            $scope.safeApply();
        });

        fo.subscribeComplete('undoAdded', function (name, note, shape) {
            $scope.safeApply();
        });

        fo.subscribeComplete('undoRemoved', function (name, note, shape) {
            $scope.safeApply();
        });

        return space;
    });



    app.controller('contentMenu', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        if (!space.contentMenu) {
            var menu = space.contentMenu = space.factory.newMenuContent({}, space);

            menu.animals = space.factory.newStencilAnimalNotes({}, menu);

            fo.subscribe('doubleClick', function (shape, context, action) {
                if (context.hasNoteUri && space.keyPressedState && space.keyPressedState.CTRLKEY) {
                    window.open(context.noteUri, "_blank");
                }
                else {
                    space.contentMenu.openEdit(context);
                }
                shape.doUpdate();
            });

        }
        return space.contentMenu;
    });

    app.controller('fileMenu', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        //the defaults for the current document being worked on
        //this may not be what the workspace is saving or what the user has selected

        if (!space.fileMenu) {
            space.fileMenu = space.factory.newMenuFile({
                documentSpec: {
                    documentName: 'knowtPad',
                    documentExt: '.knt',
                },
            }, space);
        }
        return space.fileMenu;
    });

    app.controller('noteTreeView', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        if (!space.noteTreeView) {
            space.noteTreeView = space.factory.newNoteTreeView({
                space: space,
            }, space);
        }
        return space.noteTreeView;
    })

    app.controller('noteCanvasView', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        if (!space.noteCanvasView) {
            space.noteCanvasView = space.factory.newNoteCanvasView({
                space: space,
            }, space);
        }
        return space.noteCanvasView;
    })

}(knowtApp, Foundry));