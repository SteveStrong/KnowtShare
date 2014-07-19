
(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('shapeHub'), {
        shapeHub: fo.fromParent,

        rootModel: fo.fromParent,
        rootPage: fo.fromParent,
    },
    function (properties, subcomponents, parent) {

        var obj = fo.makeComponent(properties, subcomponents, parent);

        var space = parent;
        var shapeHub = obj.shapeHub

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

        shapeHub.client.recieve = function (name, message) {
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
            fo.publish('success', ['playerJoinSession']);

            var payload = space.currentModelToPayload();
            shapeHub.server.playerJoinSession(space.sessionKey, space.userId, payload);
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
    });


}(knowtApp, Foundry));
