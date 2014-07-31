
(function (app, fo, undefined) {


    app.newShapeHub = function (shapeHub, space) {

        var obj = {}

        obj.doOpenSessionPage = function () {
            var url = window.location;
            window.open(url, "_blank");
        }



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
            fo.publish('client', ['receive', name, message]);
        }

        obj.doPing = function (senderId) {
            shapeHub.server.sendPing(space.sessionKey, space.userId, senderId);
        }

        shapeHub.client.receivePing = function (sessionKey, sender, senderId) {
            fo.publish('success', [sender, senderId]);
            fo.publish('client', ['receivePing', sessionKey, sender, senderId]);
        }

        obj.doSendMessage = function (senderId, textMessage) {
            shapeHub.server.sendMessage(space.sessionKey, space.userId, senderId, textMessage);
        }

        shapeHub.client.receiveMessage = function (sessionKey, sender, senderId, textMessage) {
            fo.publish('info', [senderId, textMessage]);
            fo.publish('client', ['receiveMessage', sessionKey, sender, senderId, textMessage]);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        /// session management //
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        obj.updateSessionTraffic = function (bytesOut, bytesIn) {
            if (space.hasSessionKey) {
                fo.publish('sessionTraffic', [bytesOut, bytesIn]);
            }       
        };

        shapeHub.client.clientCountChanged = function (total, status) {
            fo.publish('sessionClientCount', [total, status]);
            fo.publish('client', ['clientCountChanged', status]);
        }

        obj.doCreateSession = function (session) {
            if (space.hasSessionKey || !session) {
                fo.publish('error', ['cannot create a new session']);
                return
            }
            space.sessionKey = session;

            var payload = space.currentModelToPayload();
            shapeHub.server.playerCreateSession(space.sessionKey, space.userId, payload);
        }

        shapeHub.client.confirmCreateSession = function (sessionKey, userId) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }
            if (space.matchesUser(userId)) {
                //fo.publish('error', ['user cannot join their own session']);
                return
            }

            fo.publish('success', ['confirmCreateSession']);
            fo.publish('client', ['confirmCreateSession', sessionKey, userId]);
        }

        obj.doJoinSession = function (session) {
            if (space.hasSessionKey || !session) {
                fo.publish('error', ['cannot create a new session']);
                return
            }
            space.sessionKey = session;

            var payload = space.currentModelToPayload();
            obj.updateSessionTraffic(payload.length,0);

            shapeHub.server.playerJoinSession(space.sessionKey, space.userId, payload);
        }

        shapeHub.client.confirmJoinSession = function (sessionKey, userId) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }
            if (space.matchesUser(userId)) {
                //fo.publish('error', ['user cannot join their own session']);
                return
            }

            fo.publish('success', ['confirmJoinSession']);
            fo.publish('client', ['confirmJoinSession', sessionKey, userId]);
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
                //fo.publish('error', ['user cannot join their own session']);
                return
            }

            fo.publish('info', ['authorReceiveJoinSessionFromPlayer']);
            obj.updateSessionTraffic(0, payload ? payload.length: 0);

            space.payloadToCurrentModel(payload);
            fo.publish('client', ['authorReceiveJoinSessionFromPlayer', sessionKey, userId, payload]);

            var newPayload = space.currentModelToPayload();
            obj.updateSessionTraffic(newPayload.length,0);

            fo.publish('success', ['authorSendJoinSessionModelToPlayers']);
            shapeHub.server.authorSendJoinSessionModelToPlayers(space.sessionKey, space.userId, newPayload);
        }

        shapeHub.client.playerReceiveJoinSessionModel = function (sessionKey, userId, payload) {
            fo.publish('info', ['playerReceiveJoinSessionModel']);
            obj.updateSessionTraffic(0, payload ? payload.length: 0);

            space.payloadToCurrentModel(payload);
            fo.publish('success', ['playerSendModelToAuthor']);
            fo.publish('client', ['playerSendModelToAuthor', sessionKey, userId, payload]);

            var newPayload = space.currentModelToPayload();
            obj.updateSessionTraffic(newPayload.length,0);

            shapeHub.server.playerSendModelToAuthor(space.sessionKey, space.userId, '', newPayload);
        }

        shapeHub.client.authorReceiveModelFromPlayer = function (sessionKey, userId, playerId, payload) {
            fo.publish('info', ['authorReceiveModelFromPlayer']);
            obj.updateSessionTraffic(0, payload ? payload.length: 0);

            space.payloadToCurrentModel(payload);
            fo.publish('success', ['authorSendModelToPlayers']);
            fo.publish('client', ['authorSendModelToPlayers', sessionKey, userId, playerId, payload]);

            var newPayload = space.currentModelToPayload();
            obj.updateSessionTraffic(newPayload.length,0);

            shapeHub.server.authorSendModelToPlayers(space.sessionKey, space.userId, '', newPayload);
        }

        shapeHub.client.playersReceiveSynchronizedModelFromAuthor = function (sessionKey, userId, playerId, payload) {
            fo.publish('info', ['playersReceiveSynchronizedModelFromAuthor']);
            obj.updateSessionTraffic(0, payload ? payload.length: 0);

            space.payloadToCurrentModel(payload);
            fo.publish('success', ['playersReceiveSynchronizedModelFromAuthor']);
            fo.publish('client', ['playersReceiveSynchronizedModelFromAuthor', sessionKey, userId, playerId, payload]);
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
                obj.updateSessionTraffic(newPayload.length,0);

                shapeHub.server.authorPayloadAdded(space.sessionKey, space.userId, newPayload);
            }

        }

        obj.doAddPayload = function (model, uniqueID, shape) {
            if (space.hasSessionKey) {

                var spec = {
                    uniqueID: uniqueID || model.myName,
                    model: fo.utils.isManaged(model) ? [model.dehydrate(false)] : model,
                    drawing: shape ? [shape.dehydrate(false, { isSelected: false, isActiveTarget: false, })] : [],
                };
                var newPayload = fo.stringifyPayload(spec);
                obj.updateSessionTraffic(newPayload.length,0);

                shapeHub.server.authorPayloadAdded(space.sessionKey, space.userId, newPayload);
            }
        }




        shapeHub.client.payloadAdded = function (sessionKey, userId, payload) {
            fo.publish('info', ['payloadAdded']);

            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                obj.updateSessionTraffic(0, payload ? payload.length: 0);

                space.payloadToCurrentModel(payload);
                fo.publish('client', ['payloadAdded', sessionKey, userId, payload]);
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
                    obj.updateSessionTraffic(newPayload.length,0);

                    shapeHub.server.authorPayloadDeleted(space.sessionKey, space.userId, newPayload);
                }
                //item.removeFromModel();
            });
        }

       obj.doDeletePayload = function (model, uniqueID, shape) {
           if (space.hasSessionKey) {

               var spec = {
                   uniqueID: uniqueID || model.myName,
                   model: fo.utils.isManaged(model) ? [model.dehydrate(false)] : model,
                   drawing: shape ? [shape.dehydrate(false, { isSelected: false, isActiveTarget: false, })] : [],
               };
               var newPayload = fo.stringifyPayload(spec);
               obj.updateSessionTraffic(newPayload.length,0);

               shapeHub.server.authorPayloadDeleted(space.sessionKey, space.userId, newPayload);
           }
       }

       shapeHub.client.payloadDeleted = function (sessionKey, userId, payload) {
           fo.publish('info', ['payloadDeleted']);

            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                obj.updateSessionTraffic(0, payload ? payload.length: 0);

                var spec = fo.parsePayload(payload);
                var uniqueID = spec.uniqueID;
                var context = model.getSubcomponent(uniqueID, true);
                if (context) {
                    context.removeFromModel();
                    fo.publish('client', ['payloadDeleted', sessionKey, userId, payload]);
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
                obj.updateSessionTraffic(newPayload.length,0);

                shapeHub.server.authorChangedModel(space.sessionKey, space.userId, newPayload);
            }
        }

        obj.doUpdatePayload = function (model, uniqueID) {
            if (space.hasSessionKey) {

                var spec = {
                    uniqueID: uniqueID || model.myName,
                    model: fo.utils.isManaged(model) ? [model.dehydrate(false)] : model,
                };
                var newPayload = fo.stringifyPayload(spec);
                obj.updateSessionTraffic(newPayload.length,0);

                shapeHub.server.authorChangedModel(space.sessionKey, space.userId, newPayload);
            }
        }

        shapeHub.client.updateModel = function (sessionKey, userId, payload) {
            fo.publish('info', ['updateModel']);

            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                obj.updateSessionTraffic(0, payload ? payload.length: 0);

                var rootModel = space.rootModel;

                var spec = fo.parsePayload(payload);
                var uniqueID = spec.uniqueID;
                var context = rootModel.getSubcomponent(uniqueID, true);
                if (context) {
                    fo.utils.extend(context, spec);
                    fo.publish('client', ['updateModel', sessionKey, userId, payload]);
                }
            } catch (e) {
                fo.publish('error', ['updateModel', e.message]);
            }
        }


        obj.doReparentModelTo = function (childID, oldParentID, newParentID) {
            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                obj.updateSessionTraffic(0, 10);

                shapeHub.server.authorReparentModelTo(space.sessionKey, childID, oldParentID, newParentID);

            } catch (e) {
                fo.publish('error', ['doReparentModelTo', e.message]);
            }
        }

        shapeHub.client.parentModelTo = function (sessionKey, uniqueID, oldParentID, newParentID) {
            //fo.trace && fo.trace.funcTrace(arguments, "parentModelTo");
            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                obj.updateSessionTraffic(0, 10);
                //parent id's can be null so you must assume root model or page
                var rootModel = space.rootModel;

                var item = rootModel.getSubcomponent(uniqueID, true);
                var newParent = newParentID ? rootModel.getSubcomponent(newParentID, true) : rootModel;
                if (item && newParent) {
                    var oldParent = newParent.capture(item);
                    fo.publish('client', ['parentModelTo', sessionKey, uniqueID, oldParentID, newParentID]);
                }
            } catch (e) {
                fo.publish('info', ['parentModelTo', e.message]);
            }
        };

        obj.doMovedShapeTo = function (shape, uniqueID) {
            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                obj.updateSessionTraffic(0, 10);

                var pinX = shape.pinX;
                var pinY = shape.pinY;
                var angle = shape.angle ? shape.angle : 0.0;

                shapeHub.server.authorReparentModelTo(space.sessionKey, uniqueID || shape.myName, pinX, pinY, angle);

            } catch (e) {
                fo.publish('error', ['doMovedShapeTo', e.message]);
            }
        }

        shapeHub.client.repositionShapeTo = function (sessionKey, uniqueID, pinX, pinY, angle) {
            //fo.trace && fo.trace.funcTrace(arguments, "repositionShapeTo");
            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                //if (ctrl.isPresenterSession) return;
                //fo.trace && fo.trace.writeLog("received: Acting On repositionShapeTo", uniqueID, pinX, pinY, angle);

                obj.updateSessionTraffic(10, 0);
                //parent id's can be null so you must assume root model or page
                var rootPage = space.rootPage;

                var shape = rootPage.getSubcomponent(uniqueID);
                if (shape) {
                    shape.repositionTo(pinX, pinY, angle, function () {
                        if (shape.myParent == rootPage) {
                            rootPage.Subcomponents.sortOn('pinX'); //try to make is so outline reads from left to right
                        }
                    });
                    //SRS todo make sure to save the session assuming the 
                    //people 
                    //ctrl.doSessionSave;
                }

            } catch (e) {
                fo.publish('error', ['repositionShapeTo', e.message]);
            }
        };



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


}(knowtApp, Foundry));
