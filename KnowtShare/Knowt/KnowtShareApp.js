﻿
var knowtApp = angular.module('knowtShareApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);
knowtApp.header = { title: 'Knowt Share', help: 'knowtshareHelp.html' };

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

//initial document and run implemented...

(function (app, fo, undefined) {


    app.run(function ($log, workspaceService) {

        //http://www.asp.net/signalr/overview/signalr-20/getting-started-with-signalr-20/introduction-to-signalr
        // Reference the auto-generated proxy for the hub.
        $.connection.hub.logging = true;

        var shapeHub = $.connection.shapeHub;

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



        if (shapeHub) {
            $.connection.hub.start().done(function () {
                //pop some toast to
                fo.publish('info', [ 'connected to service', 'ready']);
                // workspaceService.serverLogin(shapeHub);



            });
        }
        else {
            fo.publish('warning', [ 'but everything loaded', 'did not connected to service']);
        }


    });

}(knowtApp, Foundry));


(function (app, fo, undefined) {

    //http://odetocode.com/blogs/scott/archive/2013/06/06/decorating-angularjs-services.aspx
    //http://www.bennadel.com/blog/2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm

    //inspect the arguments passed into collect the session key 
    var args = fo.utils.queryStringToObject(window.location.toString(), '?');

    app.service('workspaceService', ['$log', 'dialogService', function ($log, dialogService) {

        var space;
        var defaultSession = args && args.session;

        this.workSpace = function (properties, modelTemplate) {
            if (space) return space;

            var spec = {
                canvasId: 'drawingCanvas',
                panZoomCanvasId: 'panZoomCanvas',
                pipId: 'PIP',
                title: "Knowt Share",
                subTitle: "take notes create KnowtFacts",
                userId: "123456780",
                userNickName: 'sedona',
            }

            space = fo.ws.makeNoteWorkspace("KnowtShare", fo.utils.union(spec, properties), modelTemplate);

            space.isDocumentEmpty = function () {
                //var total = (this.rootPage.Subcomponents.count * this.rootModel.Subcomponents.count) / 2;
                var isEmpty = this.rootPage.Subcomponents.isEmpty() && this.rootModel.Subcomponents.isEmpty();
                return isEmpty;
            };


            //space.activeDocument = fo.makeComponent(documentSpec, {}, space);

            //space.refreshModelFromPayload = function (payload, clear) {
            //    //ctrl.updateSessionTraffic(0, payload.length);
            //    space.payloadToCurrentModel(payload);
            //    space.copyDocumentSpecTo(space.activeDocument);
            //    //ctrl.doModelSmash;
            //    space.doSessionSave();

            //    //if clear and others are listening we need to add that command to the payload
            //    var syncPayload = space.currentModelToPayload({ clearBeforeSync: clear });
            //    //ctrl.updateSessionTraffic(syncPayload.length, 0);
            //    if (!space.hasSessionKey) return;

            //   // hub.invoke("authorSendModelToPlayers", ctrl.sessionKey, ctrl.userNickName, ctrl.userId, syncPayload);
            //}


 
            if (!defaultSession) {
                setTimeout(function () {
                    space.doSessionRestore();
                }, 100);
            }

            return space;
        };

        //function manageCollaberation() {
        //    space.createSession = function (sessionKey, sessionSpec) {
        //        this.sessionKey = sessionKey;
        //        this.userId = this.isLoggedIn ? this.userId : "Session";

        //        if (sessionSpec.presenter) {
        //            this.isPresenterSession = true;
        //        }
        //        var syncPayload = this.currentModelToPayload(sessionSpec);
        //        shapeHub.server.playerCreateSession(this.sessionKey, this.userId, syncPayload);
        //    }

        //    space.joinSession = function (sessionKey) {
        //        this.sessionKey = sessionKey;
        //        this.userId = this.isLoggedIn ? this.userId : "Session";

        //        var syncPayload = this.currentModelToPayload();
        //        shapeHub.server.playerJoinSession(this.sessionKey, this.userId, syncPayload);
        //    }

        //    shapeHub.client.authorReceiveJoinSessionFromPlayer = function (sessionKey, userId, payload) {
        //        if (!space.matchesSession(sessionKey)) {
        //            return;
        //        }

        //        var shareSpec = {};
        //        //if (!space.isPresenterSession) {
        //        //    space.updateSessionTraffic(0, payload.length);
        //        //    space.payloadToCurrentModel(payload);
        //        //    space.doRepaint;
        //        //    toastr.success('is being sent the synchronized drawing', ctrl.userNickName);
        //        //}
        //        //else {
        //        //    shareSpec = { isViewOnlySession: true }
        //        //}

        //        var syncPayload = workspace.currentModelToPayload(shareSpec);
        //        //space.updateSessionTraffic(syncPayload.length, 0);
        //        shapeHub.invoke("authorSendJoinSessionModelToPlayers", sessionKey, userId, syncPayload);

        //    };

        //    shapeHub.client.playerReceiveJoinSessionModel = function (sessionKey, userId, payload) {
        //        if (!space.matchesSession(sessionKey)) {
        //            return;
        //        }

        //        //ctrl.updateSessionTraffic(0, payload.length);
        //        var spec = space.payloadToCurrentModel(payload);
        //        var command = spec.command;

        //        //ctrl.doRepaint;

        //        //this should be toast
        //        if (command && command.isViewOnlySession) {
        //            space.isViewOnlySession = true;
        //            toastr.success('Has synchronized with presentation', space.userNickName);
        //        }
        //        else {
        //            toastr.success('Has synchronized with your notes', space.userNickName);
        //        }
        //    };
        //}


        //this.serverLogin = function (hub) {
        //    shapeHub = hub;

        //    shapeHub.client.clientCountChanged = function (count) {
        //        space.clientCount = count;
        //    };

        //    manageCollaberation();
        //    if (defaultSession && space) {
        //        space.joinSession(defaultSession);
        //    }
        //}

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

    app.controller('workSpace', function ($scope, $log, dialogService, workspaceService) {

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
            factory: fo.knowtShareApp,
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



        fo.enableFileDragAndDrop('mainContent');
        //this method is called from KnowtViewMenuContext...  on file drop
        fo.subscribeComplete('DocumentChanged', function (workspace) {
            workspace.copyDocumentSpecTo(workspace.activeDocument);
            workspace.rootPage.forceLayout();
            workspace.doSessionSave();

            $scope.safeApply();
        });

        fo.subscribeComplete('WorkspaceClear', function (workspace) {
            workspace.doSessionSave();

            $scope.safeApply();
        });

        var rootModel = space.rootModel;
        var rootPage = space.rootPage;

        //listen for key events...
        var keyPressedState = space.factory.newKeyPressedEvents({}, space);
        space.updateAllViews = function () {
            rootPage.forceLayout();
            $scope.safeApply();
        }

        var layout = fo.knowtShareApp.newMainLayout({
            drawing: function () { return space.drawing; },
        }, space, function (obj) {
            obj.autoResize(true);
        });

 



        //root model should be designed to manage what item is selected
        $scope.toggleSelection = function (note) {
            $scope.safeApply();
        }



        fo.subscribeComplete('ShapeSelected', function (view, shape, selections) {
            $scope.safeApply();
        });


        fo.subscribeComplete('Reparented', function (shape, oldParent, newParent, loc) {
            space.doSessionSave();
            space.isDocumentSaved = false;
            $scope.safeApply();
        });

        fo.subscribeComplete('ModelChanged', function (note) {
            space.doSessionSave();
            space.isDocumentSaved = false;
            $scope.safeApply();
        });

        fo.subscribeComplete('Deleted', function (name, note, shape) {
            space.doSessionSave();
            space.isDocumentSaved = false;
            $scope.safeApply();
        });

        fo.subscribeComplete('Added', function (name, note, shape) {
            space.doSessionSave();
            space.isDocumentSaved = false;
            $scope.safeApply();
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

}(knowtApp, Foundry));

//now create the noteMenu controller
(function (app, fo, undefined) {

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

}(knowtApp, Foundry));

//now create the fileMenu controller
(function (app, fo, undefined) {

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

}(knowtApp, Foundry));

//now create the viewMenu controller
(function (app, fo, undefined) {

    app.controller('viewMenu', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        if (!space.viewMenu) {
            space.viewMenu = space.factory.newMenuView({ space: space, }, space);
        }
        return space.viewMenu;
    });

}(knowtApp, Foundry));

//now create the panZoomMenu controller
(function (app, fo, undefined) {

    app.controller('panZoomMenu', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        if (!space.panZoomMenu) {
            space.panZoomMenu = space.factory.newMenuPanZoom({
                space: space,
                drawing: workspaceService.activeDrawing(),
                rootPage: space.rootPage,
            }, space);
        }
        return space.panZoomMenu;
    });

}(knowtApp, Foundry));



//now create the sessionMenu controller
(function (app, fo, undefined) {

    app.controller('sessionMenu', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        if (!space.sessionMenu) {
            space.sessionMenu = space.factory.newMenuSession({
                space: space,
                //drawing: workspaceService.activeDrawing(),
            }, space);
         }

        return space.sessionMenu;
    })
}(knowtApp, Foundry));

//now create the noteTreeView controller
(function (app, fo, undefined) {

    app.controller('noteTreeView', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        if (!space.noteTreeView) {
            space.noteTreeView = space.factory.newNoteTreeView({
                space: space,
            }, space);
        }
        return space.noteTreeView;
    })

}(knowtApp, Foundry));

//now create the noteCanvasView controller
(function (app, fo, undefined) {

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