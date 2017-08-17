/// <reference path="C:\Users\Steve\documents\visual studio 2013\Projects\SignalRChat\SignalRChat\Scripts/angular.js" />

var knowtApp = angular.module('chatApp', []);
(function (app, fo, undefined) {
    app.defaultNS = function (name) {
        var id = fo.getNamespaceKey(this.name, name);
        return id;
    }

    app.stencilNS = app.defaultNS;

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

}(knowtApp, Foundry));

(function (app, fo) {


        // Declare a proxy to reference the hub.
    var chat = $.connection.shapeHub;

    var author;
    $.connection.hub.start().done(function () {
       toastr.info('the hub is connected')
    });

    app.controller('chatController', function ($scope) {

        $scope.author;
        $scope.messageList = [];

        $scope.doSendMessage = function () {
            chat.server.send($scope.author, $scope.message);
            $scope.message = '';
        }

        // Create a function that the hub can call to broadcast messages.
        chat.client.broadcastMessage = function (name, message) {
            $scope.messageList.push({
                encodedName: name,
                encodedMessage: message,
            });
            $scope.$apply();
        };


        $scope.doNewPage = function () {
            var url = window.location;
            window.open(url, "_blank");
        }

        var space = fo.ws.makeModelWorkspace("NoteTester");
        var model = space.rootModel;

        $scope.rootModel = model;


        $scope.session = '';
        $scope.doJoinSession = function () {
            if (space.hasSessionKey || !$scope.session) {
                toastr.error('cannot create a new session')
                return
            }
            space.sessionKey = $scope.session;

            var payload = space.currentModelToPayload();
            chat.server.playerJoinSession(space.sessionKey, $scope.author, payload);
        }

        chat.client.confirmJoinSession = function (sessionKey, userId) {
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

        $scope.doExitSession = function () {
            if (!space.hasSessionKey) {
                toastr.error('cannot quit')
                return
            }
            chat.server.playerExitSession(space.sessionKey, $scope.author, '');
        }

        chat.client.confirmExitSession = function (sessionKey, userId) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }
            if (space.matchesUser(userId)) {
                fo.publish('error', ['user cannot join their own session']);
                return
            }

            space.smashProperty('sessionKey');
            fo.publish('success', ['doExitSession']);
            $scope.$apply();
        }


        chat.client.authorReceiveJoinSessionFromPlayer = function (sessionKey, userId, payload) {
            if (!space.matchesSession(sessionKey)) {
                toastr.error('this session does not match key')
                return
            }
            if (space.matchesUser(userId)) {
                toastr.error('user cannot join their own session')
                return
            }

            toastr.info('authorReceiveJoinSessionFromPlayer');

            space.payloadToCurrentModel(payload);
            $scope.$apply();
            var newPayload = space.currentModelToPayload();

            toastr.success('authorSendJoinSessionModelToPlayers');
            chat.server.authorSendJoinSessionModelToPlayers(space.sessionKey, $scope.author, newPayload);

        }

        chat.client.playerReceiveJoinSessionModel = function (sessionKey, userId, payload) {
            toastr.info('playerReceiveJoinSessionModel');

            space.payloadToCurrentModel(payload);
            $scope.$apply();
            var newPayload = space.currentModelToPayload();

            toastr.success('playerSendModelToAuthor');
            chat.server.playerSendModelToAuthor(space.sessionKey, $scope.author, '', newPayload);
        }

        chat.client.authorReceiveModelFromPlayer = function (sessionKey, userId, playerId, payload) {
            toastr.info('playerReceiveJoinSessionModel');

            space.payloadToCurrentModel(payload);
            $scope.$apply();
            var newPayload = space.currentModelToPayload();

            toastr.success('authorSendModelToPlayers');
            chat.server.authorSendModelToPlayers(space.sessionKey, $scope.author, '', newPayload);
        }

        chat.client.playersReceiveSynchronizedModelFromAuthor = function (sessionKey, userId, playerId, payload) {
            toastr.info('playersReceiveSynchronizedModelFromAuthor');

            space.payloadToCurrentModel(payload);
            $scope.$apply();
        }

        $scope.toggleSelect = function (note) {
            note.isSelected = !note.isSelected;
        }

        $scope.doAddNote = function () {
            toastr.warning('doAddNote');
            var note = fo.chatApp.newNote({
                author: $scope.author,
                headerText: 'aaaa',
            }, model);
            model.capture(note);

            note.isSelected = false;

            if (space.hasSessionKey) {

                var spec = {
                    uniqueID: note.myName,
                    model: note ? [note.dehydrate(false)] : note,
                };
                var newPayload = fo.stringifyPayload(spec);

                chat.server.authorPayloadAdded(space.sessionKey, $scope.author, newPayload);
            }

            $scope.$apply();
        }

        chat.client.payloadAdded = function (sessionKey, userId, payload) {
            toastr.info('payloadAdded');

            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                space.payloadToCurrentModel(payload);
                $scope.$apply();
            } catch (e) {
                toastr.error('payloadAdded ' + e.message);
            }
        }

        $scope.doEditNote = function () {
            toastr.warning('doEditNote');
        }

        function selectedNotes() {
            return model.Subcomponents.selectComponents(function (item) { return item.isSelected; })
        }

        $scope.doDeleteNote = function () {
          
            toastr.warning('doDeleteNote');

            selectedNotes().forEach(function (item) {
                if (space.hasSessionKey) {
                    var spec = {
                        uniqueID: item.myName,
                        model: item ? [item.dehydrate(false)] : item,
                    };
                    var newPayload = fo.stringifyPayload(spec);
                    chat.server.authorPayloadDeleted(space.sessionKey, $scope.author, newPayload);
                }
                item.removeFromModel();
            });
            $scope.$apply();
        }



        chat.client.payloadDeleted = function (sessionKey, userId, payload) {
            toastr.info('payloadDeleted');

            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                var spec = fo.parsePayload(payload);
                var uniqueID = spec.uniqueID;
                var context = model.getSubcomponent(uniqueID, true);
                if (context) {
                    context.removeFromModel();
                    $scope.$apply();
                }
            } catch (e) {
                toastr.error('payloadDeleted ' + e.message);
            }
        }



        $scope.doClearNotes = function () {
            toastr.warning('doClearNotes');
            space.clear();
            $scope.$apply();
        }

        $scope.doSendNoteChanges = function (note) {
            toastr.warning('doSendNoteChanges');

            if (space.hasSessionKey) {

                var spec = note.dehydrate(false);
                var newPayload = fo.stringifyPayload(spec);

                chat.server.authorChangedModel(space.sessionKey, $scope.author, newPayload);
            }
        }

        chat.client.updateModel = function (sessionKey, userId, payload) {
            toastr.info('updateModel');
            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                var spec = fo.parsePayload(payload);
                var uniqueID = spec.uniqueID;
                var context = model.getSubcomponent(uniqueID, true);
                if (context) {
                    fo.utils.extend(context, spec);
                    $scope.$apply();
                }
            } catch (e) {
                toastr.error('updateModel ' + e.message);
            }
        }




        fo.subscribe('Reparented', function (childID, oldParentID, newParentID) {
            if (space.hasSessionKey) {
                chat.server.authorReparentModelTo(space.sessionKey, childID, oldParentID, newParentID);
            };
        });

        chat.client.parentModelTo = function (sessionKey, uniqueID, oldParentID, newParentID) {
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
                    $scope.$apply();
                    //fo.publish('Reparented', [model.myName, oldParent.myName, parent.myName])
                }
            } catch (e) {
                toastr.info('parentModelTo' + e.message);
            }
        };


        fo.subscribeComplete('Reparented', function (shape, oldParent, newParent, loc) {
           // space.doSessionSave();
            $scope.$apply();
        });



        $scope.doMoveRight = function () {
            toastr.info('doMoveRight');

            selectedNotes().forEach(function (item) {
                var parent = item.myParent;
                var newParent = item.mySiblingPrevious();
                if (newParent) {
                    newParent.capture(item);
                    fo.publish('Reparented', [item.myName, parent.myName, newParent.myName])
                }
            });

            $scope.doMoveLeft = function () {
                toastr.info('doMoveLeft');

                selectedNotes().forEach(function (item) {
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

        }
    });

}(knowtApp, Foundry));
