
var knowtApp = angular.module('knowtChirpApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);
knowtApp.header = { title: 'Knowt Chirp', help: 'knowtshareHelp.html' };

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

(function (fo, undefined) {


    fo.newShapeHub = function (shapeHub, space) {

        var obj = {}

        obj.doOpenSessionPage = function () {
            var url = window.location;
            window.open(url, "_blank");
        }

        //fo.subscribe('ShapeSelected', function (view, shape, selections) {
        //    obj.smashProperty('hasSelection');
        //});

        obj.doSayHello = function () {
            shapeHub.server.sayHello();
        }
        shapeHub.client.hello = function () {
            fo.publish('success', ['hello']);
        }

        obj.doSend = function (message) {
            shapeHub.server.send(space.userNickName, message);
        }

        shapeHub.client.receive = function (name, message) {
            fo.publish('success', [name, message]);
        }

        obj.doPing = function (senderId) {
            shapeHub.server.sendPing(space.sessionKey, space.userId, senderId);
        }

        shapeHub.client.receivePing = function (sessionKey, sender, senderId) {
            fo.publish('success', [sender, senderId]);
        }

        obj.doSendMessage = function (senderId, textMessage) {
            shapeHub.server.sendMessage(space.sessionKey, space.userId, senderId, textMessage);
        }

        shapeHub.client.receiveMessage = function (sessionKey, sender, senderId, textMessage) {
            fo.publish('info', [senderId, textMessage]);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        /// session management //
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        obj.doJoinSession = function (session) {
            if (space.hasSessionKey || !session) {
                fo.publish('error', ['cannot create a new session']);
                return
            }
            space.sessionKey = session;

            var payload = space.currentModelToPayload();
            shapeHub.server.playerJoinSession(space.sessionKey, space.userId, payload);
        }

        shapeHub.client.confirmJoinSession = function (sessionKey, userId) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }
            if (space.matchesUser(userId)) {
                fo.publish('error', ['user cannot join their own session']);
                return
            }

            fo.publish('success', ['confirmJoinSession']);
        }

        obj.doExitSession = function () {
            if (!space.hasSessionKey) {
                fo.publish('error', ['cannot quit']);
                return
            }

            space.smashProperty('sessionKey');
            fo.publish('success', ['doExitSession']);
        }


        shapeHub.client.authorReceiveJoinSessionFromPlayer = function (sessionKey, userId, payload) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }
            if (space.matchesUser(userId)) {
                fo.publish('error', ['user cannot join their own session']);
                return
            }

            fo.publish('info', ['authorReceiveJoinSessionFromPlayer']);

            space.payloadToCurrentModel(payload);
            //$scope.$apply();
            var newPayload = space.currentModelToPayload();

            fo.publish('success', ['authorSendJoinSessionModelToPlayers']);
            shapeHub.server.authorSendJoinSessionModelToPlayers(space.sessionKey, space.userId, newPayload);
        }

        shapeHub.client.playerReceiveJoinSessionModel = function (sessionKey, userId, payload) {
            fo.publish('info', ['playerReceiveJoinSessionModel']);

            space.payloadToCurrentModel(payload);
            //$scope.$apply();
            var newPayload = space.currentModelToPayload();

            fo.publish('success', ['playerSendModelToAuthor']);
            shapeHub.server.playerSendModelToAuthor(space.sessionKey, space.userId, '', newPayload);
        }

        shapeHub.client.authorReceiveModelFromPlayer = function (sessionKey, userId, playerId, payload) {
            fo.publish('info', ['authorReceiveModelFromPlayer']);

            space.payloadToCurrentModel(payload);
            //$scope.$apply();
            var newPayload = space.currentModelToPayload();

            fo.publish('success', ['authorSendModelToPlayers']);
            shapeHub.server.authorSendModelToPlayers(space.sessionKey, space.userId, '', newPayload);
        }

        shapeHub.client.playersReceiveSynchronizedModelFromAuthor = function (sessionKey, userId, playerId, payload) {
            fo.publish('info', ['playersReceiveSynchronizedModelFromAuthor']);

            space.payloadToCurrentModel(payload);
            //$scope.$apply();
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        /// shape management //
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        obj.doAddNote = function (note) {
            if (space.hasSessionKey) {

                var spec = {
                    uniqueID: note.myName,
                    model: note ? [note.dehydrate(false)] : note,
                };
                var newPayload = fo.stringifyPayload(spec);

                shapeHub.server.authorPayloadAdded(space.sessionKey, space.userId, newPayload);
            }

            //$scope.$apply();
        }

        shapeHub.client.payloadAdded = function (sessionKey, userId, payload) {
            fo.publish('info', ['payloadAdded']);

            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                space.payloadToCurrentModel(payload);
                //$scope.$apply();
            } catch (e) {
                fo.publish('error', ['payloadAdded', e.message]);
            }
        }

        obj.doDeleteNote = function (list) {
            fo.publish('warning', ['doDeleteNote']);

            list.forEach(function (item) {
                if (space.hasSessionKey) {
                    var spec = {
                        uniqueID: item.myName,
                        model: item ? [item.dehydrate(false)] : item,
                    };
                    var newPayload = fo.stringifyPayload(spec);
                    shapeHub.server.authorPayloadDeleted(space.sessionKey, space.userId, newPayload);
                }
                //item.removeFromModel();
            });
            //$scope.$apply();
        }



        shapeHub.client.payloadDeleted = function (sessionKey, userId, payload) {
            fo.publish('info', ['payloadDeleted']);

            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                var spec = fo.parsePayload(payload);
                var uniqueID = spec.uniqueID;
                var context = model.getSubcomponent(uniqueID, true);
                if (context) {
                    context.removeFromModel();
                    //$scope.$apply();
                }
            } catch (e) {
                fo.publish('error', ['payloadDeleted', e.message]);
            }
        }



        obj.doClearNotes = function () {
            fo.publish('warning', ['doClearNotes']);
            space.clear();
            //$scope.$apply();
        }

        obj.doSendNoteChanges = function (note) {
            fo.publish('warning', ['doSendNoteChanges']);

            if (space.hasSessionKey) {

                var spec = note.dehydrate(false);
                var newPayload = fo.stringifyPayload(spec);

                shapeHub.server.authorChangedModel(space.sessionKey, space.userId, newPayload);
            }
        }

        shapeHub.client.updateModel = function (sessionKey, userId, payload) {
            fo.publish('info', ['updateModel']);

            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                var spec = fo.parsePayload(payload);
                var uniqueID = spec.uniqueID;
                var context = model.getSubcomponent(uniqueID, true);
                if (context) {
                    fo.utils.extend(context, spec);
                    //$scope.$apply();
                }
            } catch (e) {
                fo.publish('error', ['updateModel', e.message]);
            }
        }




        fo.subscribe('Reparented', function (childID, oldParentID, newParentID) {
            if (space.hasSessionKey) {
                shapeHub.server.authorReparentModelTo(space.sessionKey, childID, oldParentID, newParentID);
            };
        });

        shapeHub.client.parentModelTo = function (sessionKey, uniqueID, oldParentID, newParentID) {
            //fo.trace && fo.trace.funcTrace(arguments, "parentModelTo");
            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }

                //parent id's can be null so you must assume root model or page
                var rootModel = space.rootModel;

                var item = rootModel.getSubcomponent(uniqueID, true);
                var newParent = newParentID ? rootModel.getSubcomponent(newParentID, true) : rootModel;
                if (item && newParent) {

                    var oldParent = newParent.capture(item);
                    //$scope.$apply();
                    //too much fo.publish('Reparented', [model.myName, oldParent.myName, parent.myName])
                }
            } catch (e) {
                fo.publish('info', ['parentModelTo', e.message]);
            }
        };


        //fo.subscribeComplete('Reparented', function (shape, oldParent, newParent, loc) {
        //    // space.doSessionSave();
        //    $scope.$apply();
        //});

        obj.doMoveRight = function (list) {
            fo.publish('info', ['doMoveRight']);

            list.forEach(function (item) {
                var parent = item.myParent;
                var newParent = item.mySiblingPrevious();
                if (newParent) {
                    newParent.capture(item);
                    fo.publish('Reparented', [item.myName, parent.myName, newParent.myName])
                }
            });
        }

        obj.doMoveLeft = function (list) {
            fo.publish('info', ['doMoveLeft']);

            list.forEach(function (item) {
                var parent = item.myParent;
                var newParent = parent && parent.myParent;
                if (!newParent || fo.utils.isaWorkspace(newParent)) {
                    newParent = space.rootModel;
                }

                if (newParent) {
                    newParent.capture(item);
                    fo.publish('Reparented', [item.myName, parent.myName, newParent.myName])
                }
            });
        }

        return obj;
    };


}(Foundry));
//initial document and run implemented...

(function (app, fo, undefined) {

    //http://www.asp.net/signalr/overview/signalr-20/hubs-api/hubs-api-guide-javascript-client#logging
    // Reference the auto-generated proxy for the hub.
    var connection = $.hubConnection();
    connection.logging = true;

    var shapeHub = $.connection.shapeHub;
    var hub = $.connection.hub;

    if (shapeHub) {
        //shapeHub.client.confirmJoinSession = function (sessionKey, userId) {
        //    fo.publish('info', ['confirmJoinSession', sessionKey + ' ' + userId]);
        //}
        //shapeHub.client.receivePing = function (sessionKey, sender, senderId) {
        //    fo.publish('success', [sender, senderId]);
        //}

        hub.start().done(function () {
            //pop some toast to
            //fo.publish('info', ['connected to service', 'ready to chirp']);

            var spec = {
                title: "Knowt Chirp",
                subTitle: "the simplest knowt sharing app",
                userId: "123456780",
                userNickName: 'sedona',

            }

            var space = fo.ws.makeModelWorkspace("KnowtChirp", spec);
            var xxx = fo.newShapeHub(shapeHub, space);

            xxx.doJoinSession('chirp');
            xxx.doPing('my ping')

        });
    }
    else {
        fo.publish('warning', ['but everything loaded', 'did not connected to service']);
    }


    app.run(function ($log, workspaceService) {



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

        //imspect the arguments passed into collect the session key 
        var args = fo.utils.queryStringToObject(window.location.toString(), '?');
        var sessionKey = args && args.session;



        //var space = workspaceService.workSpace({
        //    factory: fo.knowtChirpApp,
        //    stencil: fo.KnowtShare,
        //});


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
                title: "Knowt Chirp",
                subTitle: "the simplest knowt sharing app",
                userId: "123456780",
                userNickName: 'sedona',

            }
            space = fo.ws.makeModelWorkspace("KnowtChirp", fo.utils.union(spec, properties), modelTemplate);

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
            factory: fo.knowtChirpApp,
            stencil: fo.KnowtShare,
            dialogService: dialogService,
        });


        //var shapeHub = fo.knowtChirpApp.newShapeHub({}, space);

        //fo.subscribe('hubReady', function (hub, sessionKey) {
        //    var activeHub = hub;
        //    activeHub.server.sendPing(space.sessionKey, space.userId, '');

        //    var xxx = fo.knowtChirpApp.newShapeHub({
        //        hub: function () { return activeHub; },
        //    }, space);

        //    xxx.doJoinSession(sessionKey);
        //    xxx.doPing('my ping')

        //    //$scope.safeApply();
        //});



        $scope.chirp = fo.makeComponent();
        $scope.rootModel = space.rootModel;




        $scope.doNewPage = function () {
            shapeHub.doOpenSessionPage();
        }

        $scope.doPing = function () {
            shapeHub.doPing('');
        }

        $scope.doSendMessage = function () {
            shapeHub.doSendMessage(workSpace.userid, 'hello steve' + new Date().toString());
        }

        $scope.doChirp = function () {
            //alert('you need: the note creation, note send,  modules,');

            //lest make a shape
            var note = fo.KnowtShare.newNote({
                author: workSpace.userNickName,
                userId: workSpace.userId,
                headerText: function () {
                    var date = new Date();
                    return  date.toString()
                },
                noteText: function () {
                    return 'the time is: ' + this.headerText;
                }
            }, space.rootModel);

            space.rootModel.capture(note);

            $scope.chirp = note;
            $scope.safeApply();
        };

        return space;
    });

}(knowtApp, Foundry));