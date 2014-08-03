
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
            if (!space.hasSessionKey) return false;

            fo.publish('sessionTraffic', [bytesOut, bytesIn]);
            return true;
        };

        shapeHub.client.clientCountChanged = function (total, status, groupTotal) {
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
            //if (space.matchesUser(userId)) {
            //    //fo.publish('error', ['user cannot join their own session']);
            //    return
            //}

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

        var waitingForResync = false;
        shapeHub.client.confirmJoinSession = function (sessionKey, userId) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }
            //if (space.matchesUser(userId)) {
            //    //fo.publish('error', ['user cannot join their own session']);
            //    return
            //}

            var msg = waitingForResync ? 'confirmResyncSession' : 'confirmJoinSession'

            waitingForResync = false;
            fo.publish('success', [msg]);
            fo.publish('client', ['confirmJoinSession', sessionKey, userId]);
        }

        obj.doResyncSession = function () {
            if (!space.hasSessionKey) {
                fo.publish('error', ['cannot doResyncSession']);
                return
            }

            waitingForResync = true;
            shapeHub.server.authorResyncSession(space.sessionKey, space.userId);
        }

        shapeHub.client.confirmResyncSession = function (sessionKey, userId, total) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }

            //if (total <= 1) {
            //    //you are the only one resynce will not help
            //    fo.publish('warning', ['there is noone on line. your session can be resynced']);
            //    return;
            //}

            //delete my current model and then ask someone to send me one
            space.clear();
            var payload = space.currentModelToPayload();
            obj.updateSessionTraffic(payload.length, 0);

            shapeHub.server.playerJoinSession(space.sessionKey, space.userId, payload);
            fo.publish('client', ['confirmResyncSession', sessionKey, userId, total]);
        }

        obj.doExitSession = function () {
            if (!space.hasSessionKey) {
                fo.publish('error', ['cannot doExitSession']);
                return
            }

            var payload = space.currentModelToPayload();
            shapeHub.server.playerExitSession(space.sessionKey, space.userId, payload);
        }

        shapeHub.client.confirmExitSession = function (sessionKey, userId) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }

            //call to exit on server 
            space.smashProperty('sessionKey');
            fo.publish('success', ['confirmExitSession']);
            fo.publish('client', ['confirmExitSession', sessionKey, userId]);
        }

        shapeHub.client.receiveExitSessionFromPlayer = function (sessionKey, userId, payload) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }

            //should I consume their last payload?


            fo.publish('info', ['Player is exiting Session', userId]);
            fo.publish('client', ['receiveExitSessionFromPlayer', sessionKey, userId]);
        }

        obj.doCollaborate = function () {
            var sessionKey = fo.utils.generateUUID();
            if (this.hasUserId) {
                this.sessionKey = sessionKey;
            }
            this.createCollaborationList(function (links) {
                links.forEach(function (link) {
                    hub.invoke("authorInvite", sessionKey, ctrl.userNickName, ctrl.userid, link.friendNickName, link.friendUserId);
                });
            });
        }



        shapeHub.client.authorReceiveJoinSessionFromPlayer = function (sessionKey, userId, payload) {
            if (!space.matchesSession(sessionKey)) {
                fo.publish('error', ['this session does not match key']);
                return
            }
            //if (space.matchesUser(userId)) {
            //    //fo.publish('error', ['user cannot join their own session']);
            //    return
            //}

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
            if (!space.hasSessionKey) return false;

                var spec = {
                    uniqueID: note.myName,
                    model: note ? [note.dehydrate(false)] : note,
                };
                var newPayload = fo.stringifyPayload(spec);
                obj.updateSessionTraffic(newPayload.length,0);

                shapeHub.server.authorPayloadAdded(space.sessionKey, space.userId, newPayload);
                return true;
        }

        obj.doAddPayload = function (model, uniqueID, shape) {
            if (!space.hasSessionKey) return false;

            var spec = {
                uniqueID: uniqueID || model.myName,
                model: fo.utils.isManaged(model) ? [model.dehydrate(false)] : model,
                drawing: shape ? [shape.dehydrate(false, { isSelected: false, isActiveTarget: false, })] : [],
            };
            var newPayload = fo.stringifyPayload(spec);
            obj.updateSessionTraffic(newPayload.length,0);

            shapeHub.server.authorPayloadAdded(space.sessionKey, space.userId, newPayload);
            return true;
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
            if (!space.hasSessionKey) return false;

           fo.publish('warning', ['doDeleteNote']);

           list.forEach(function (item) {
                var spec = {
                    uniqueID: item.myName,
                    model: item ? [item.dehydrate(false)] : item,
                };
                var newPayload = fo.stringifyPayload(spec);
                obj.updateSessionTraffic(newPayload.length,0);

                shapeHub.server.authorPayloadDeleted(space.sessionKey, space.userId, newPayload);
                //item.removeFromModel();
           });
           return true;
        }

       obj.doDeletePayload = function (model, uniqueID, shape) {
           if (!space.hasSessionKey) return false;

            var spec = {
                uniqueID: uniqueID || model.myName,
                model: fo.utils.isManaged(model) ? [model.dehydrate(false)] : model,
                drawing: shape ? [shape.dehydrate(false, { isSelected: false, isActiveTarget: false, })] : [],
            };
            var newPayload = fo.stringifyPayload(spec);
            obj.updateSessionTraffic(newPayload.length,0);

            shapeHub.server.authorPayloadDeleted(space.sessionKey, space.userId, newPayload);
            return true;
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
           if (!space.hasSessionKey) return false;

            fo.publish('warning', ['doClearNotes']);
            space.clear();
            return true;
       }

       obj.doSendNoteChanges = function (note) {
           if (!space.hasSessionKey) return false;

            fo.publish('warning', ['doSendNoteChanges']);

            var spec = note.dehydrate(false);
            var newPayload = fo.stringifyPayload(spec);
            obj.updateSessionTraffic(newPayload.length,0);

            shapeHub.server.authorChangedModel(space.sessionKey, space.userId, newPayload);
            return true;
        }

        obj.doUpdatePayload = function (model, uniqueID) {
            if (!space.hasSessionKey) return false;

            //send a single model object
            var spec = {
                uniqueID: uniqueID || model.myName,
                model: fo.utils.isManaged(model) ? model.dehydrate(false) : model,
            };
            var newPayload = fo.stringifyPayload(spec);
            obj.updateSessionTraffic(newPayload.length,0);

            shapeHub.server.authorChangedModel(space.sessionKey, space.userId, newPayload);
            return true;
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
                var model = spec.model;
                if (context && model ) {
                    fo.utils.extend(context, model);
                    fo.publish('client', ['updateModel', sessionKey, userId, payload]);
                }
            } catch (e) {
                fo.publish('error', ['updateModel', e.message]);
            }
        }


        obj.doReparentModelTo = function (childID, oldParentID, newParentID, loc) {
            if (!space.hasSessionKey) return false;
 
            obj.updateSessionTraffic(0, 10);

            var location = JSON.stringify(loc);
            shapeHub.server.authorReparentModelTo(space.sessionKey, childID, oldParentID, newParentID, location);
            return true;
        }

        shapeHub.client.parentModelTo = function (sessionKey, uniqueID, oldParentID, newParentID, location) {
            //fo.trace && fo.trace.funcTrace(arguments, "parentModelTo");
            try {
                if (!space.matchesSession(sessionKey)) {
                    return;
                }
                obj.updateSessionTraffic(0, 10);
                //parent id's can be null so you must assume root model or page
                var rootModel = space.rootModel;
                var loc = JSON.parse(location);

                var item = rootModel.getSubcomponent(uniqueID, true);
                var newParent = newParentID ? rootModel.getSubcomponent(newParentID, true) : rootModel;
                if (item && newParent) {
                    var index = loc.index ? loc.index : newParent.Subcomponents.count - 1;

                    var oldParent = newParent.captureInsertSubcomponent(index, item);

                    //now do the page
                    var rootPage = space.rootPage;
                    if (rootPage) {
                        var shape = rootPage.getSubcomponent(uniqueID, true);
                        var group = newParentID ? rootPage.getSubcomponent(newParentID, true) : rootPage;

                        group.captureInsertSubcomponent(index, shape);
                        if (group == rootPage) {
                            shape.pinX = loc.pinX;
                            shape.pinY = loc.pinY;
                        }
                    }

                    fo.publish('client', ['parentModelTo', sessionKey, uniqueID, oldParentID, newParentID]);
                }
            } catch (e) {
                fo.publish('info', ['parentModelTo', e.message]);
            }
        };

        obj.doMovedShapeTo = function (shape, uniqueID) {
            if (!space.hasSessionKey) return false;

            try {

                obj.updateSessionTraffic(0, 10);

                var pinX = shape.pinX;
                var pinY = shape.pinY;
                var angle = shape.angle ? shape.angle : 0.0;

                shapeHub.server.authorMovedShapeTo(space.sessionKey, uniqueID || shape.myName, pinX, pinY, angle);

            } catch (e) {
                fo.publish('error', ['doMovedShapeTo', e.message]);
            }
            return true;
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
