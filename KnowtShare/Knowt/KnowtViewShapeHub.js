
(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('shapeHub'), {
        hub: null,
        space: {},
        sessionKey: function () {
            return this.space.sessionKey;
        },
        userNickName: function () {
            return this.space.userNickName;
        },
        userId: function () {
            return this.space.userId;
        },
        canDoSendPing: function () {
            return this.hub && this.hub.started;
        },
        doSendPing: function () {
            if (this.canDoSendPing) {
                this.hub.invoke("SendPing", this.sessionKey, this.userNickName, this.userId);
            }
        },
        canDoSendMessage: function () {
            return this.hub && this.hub.started;
        },

    },
    function (properties, subcomponents, parent) {

        var obj = fo.makeComponent(properties, subcomponents, parent);

        obj.doSendMessage = function (msg) {
            if (this.canDoSendMessage) {
                this.hub.invoke("SendMessage", this.sessionKey, this.userNickName, this.userId, msg);
            }
        };

        //http://larrywishnick.com/angular-js-and-signalr
        //http://sravi-kiran.blogspot.com/2013/09/ABetterWayOfUsingAspNetSignalRWithAngularJs.html
        //http://henriquat.re/server-integration/signalr/integrateWithSignalRHubs.html


        var hub = obj.hub;
        var space = obj.space;

        //hub && hub.on("clientCountChanged", function (count) {
        //    fo.runWithUIRefreshLock(function () {
        //        obj.clientCount = count;
        //    });
        //});

        //hub && hub.on("receivePing", function (sessionKey, author, authorid) {
        //    var msg = "{0}{1}{2}".format(sessionKey, author, authorid);
        //    fo.publish('info', ['PING', author]);
        //});

        hub.client.receivePing = function (sessionKey, author, authorid) {
            var msg = "{0}{1}{2}".format(sessionKey, author, authorid);
            fo.publish('info', ['PING', author]);
        };


        //hub && hub.on("receiveMessage", function (sessionKey, author, authorid, textMessage) {
        //    //if (!ctrl.matchesSession(sessionKey)) {
        //    //    return;
        //    //}
        //    //if (ctrl.isPresenterSession) return;

        //    var title = "{0}{1}".format(author, authorid);
        //    fo.publish('info', [title, textMessage]);
        //});

        //hub && hub.on("receiveTweets", function (sessionKey, userid, payload) {

        //    //now let make some shapes
        //    var twitter = JSON.parse(payload);
        //    var tweets = twitter.tweets;
        //    if (!tweets.length) return;

        //    var msg = "{0} {1}".format(sessionKey, userid);
        //    var title = "total:{0} {1}/{2} hour".format(tweets.length, twitter.remainingHits, twitter.hourlyLimit);

        //    toastr.info(msg, title);

        //    function findLink(text, user) {
        //        var links = text ? text.split(' ') : [];
        //        var results = links.filter(function (link) {
        //            link = link.trim()
        //            return link.startsWith('http');
        //        });
        //        results.push('http://www.twitter.com/' + user);
        //        return results[0];
        //    }

        //    tweets.map(function (item) {
        //        var note = ctrl.createNote(item.text).note;
        //        note.headerText = item.user;
        //        note.noteUri = findLink(item.text, item.user);
        //    });


        //});


        //hub && hub.on("payloadKnowtify", function (sessionKey, userid, payload) {
        //    try {
        //        if (!ctrl.matchesSession(sessionKey)) {
        //            return;
        //        }
        //        if (ctrl.isPresenterSession) return;

        //        if (!payload) return;
        //        var spec = fo.parsePayload(payload);
        //        var model = spec.modelSpec;
        //        var obj = ctrl.createNote().note;
        //        //obj.headerText = model.headerText;
        //        //obj.noteText = model.noteText;
        //        obj.extendWith(model);
        //        obj.smashProperty('isTextDifferent')

        //        fo.hub.doCommand('syncModelRequest');
        //        ctrl.doSessionSave;
        //    } catch (e) {
        //        ctrl.log('payloadKnowtify', e);
        //    }
        //});

        //hub && hub.on("payloadAdded", function (sessionKey, userid, payload) {
        //    try {
        //        if (!ctrl.matchesSession(sessionKey)) {
        //            return;
        //        }
        //        if (ctrl.isPresenterSession) return;
        //        ctrl.updateSessionTraffic(0, payload.length);
        //        workspace.payloadToCurrentModel(payload);
        //        ctrl.doSessionSave;
        //    } catch (e) {
        //        ctrl.log('payloadAdded', e);
        //    }
        //});

        //hub && hub.on("payloadDeleted", function (sessionKey, userid, payload) {
        //    try {
        //        if (!ctrl.matchesSession(sessionKey)) {
        //            return;
        //        }
        //        if (ctrl.isPresenterSession) return;

        //        workspace.payloadToCurrentModel(payload);
        //        ctrl.doSessionSave;
        //    } catch (e) {
        //        ctrl.log('payloadDeleted', e);
        //    }
        //});

        //hub && hub.on("updateModel", function (sessionKey, userId, payload) {
        //    //fo.trace && fo.trace.funcTrace(arguments, "updateModel");
        //    try {
        //        if (!ctrl.matchesSession(sessionKey)) {
        //            return;
        //        }
        //        if (ctrl.isPresenterSession) return;

        //        var spec = fo.parsePayload(payload);
        //        var uniqueID = spec.uniqueID;
        //        var context = ctrl.model.getSubcomponent(uniqueID, true);
        //        if (context) {
        //            fo.runWithUIRefreshLock(function () {
        //                fo.utils.extend(context, spec);
        //            });
        //            ctrl.doSessionSave;
        //        }
        //    } catch (e) {
        //        ctrl.log('updateModel', e);
        //    }
        //});

        //hub && hub.on("repositionShapeTo", function (sessionKey, uniqueID, pinX, pinY, angle) {
        //    //fo.trace && fo.trace.funcTrace(arguments, "repositionShapeTo");
        //    try {
        //        if (!ctrl.matchesSession(sessionKey)) {
        //            return;
        //        }
        //        if (ctrl.isPresenterSession) return;
        //        //fo.trace && fo.trace.writeLog("received: Acting On repositionShapeTo", uniqueID, pinX, pinY, angle);

        //        var page = ctrl.page;
        //        var shape = page.getSubcomponent(uniqueID);
        //        if (shape) {
        //            shape.repositionTo(pinX, pinY, angle, function () {
        //                if (shape.myParent == page) {
        //                    page.Subcomponents.sortOn('pinX'); //try to make is so outline reads from left to right
        //                }
        //            });
        //            ctrl.doSessionSave;
        //        }

        //    } catch (e) {
        //        ctrl.log('repositionShapeTo', e);
        //    }
        //});

        //hub && hub.on("parentModelTo", function (sessionKey, uniqueID, oldParentID, newParentID) {
        //    //fo.trace && fo.trace.funcTrace(arguments, "parentModelTo");
        //    try {
        //        if (!ctrl.matchesSession(sessionKey)) {
        //            return;
        //        }
        //        if (ctrl.isPresenterSession) return;
        //        //fo.trace && fo.trace.writeLog("received: Acting On parentModelTo", uniqueID, oldParentID, newParentID);

        //        //parent id's can be null so you must assume root model or page
        //        var rootModel = ctrl.model;

        //        var model = rootModel.getSubcomponent(uniqueID, true);
        //        var parent = newParentID ? rootModel.getSubcomponent(newParentID, true) : rootModel;
        //        if (model && parent) {

        //            var oldParent = parent.capture(model);

        //            var page = ctrl.page;
        //            var shape = page.getSubcomponent(uniqueID, true);
        //            var group = newParentID ? page.getSubcomponent(newParentID, true) : page;

        //            group.capture(shape);
        //            ctrl.doRepaint;

        //            ctrl.doSessionSave;
        //        }
        //    } catch (e) {
        //        ctrl.log('parentModelTo', e);
        //    }
        //});

        //hub && hub.on("receiveInvitation", function (sessionKey, player, playerid, author, authorid) {
        //    if (ctrl.hasUserId && ctrl.userId.matches(playerid)) {

        //        popupDialog({
        //            templateId: 'contentMessageBox',
        //            caption: 'Collaboration Invite',
        //            content: function () {
        //                return '<p>{0}, has invited you {1} to work together on a drawing.<br/>Do you accept?</p>'.format(author, player);
        //            },
        //            onOK: function () {
        //                ctrl.sessionKey = sessionKey;
        //                hub.invoke("playerRSVP", sessionKey, ctrl.userNickName, ctrl.userId, author, authorid, '');
        //            },
        //        });

        //    }
        //});

        //hub && hub.on("receiveRSVP", function (sessionKey, player, playerId, author, authorId, payload) {
        //    if (ctrl.hasUserId && ctrl.userId.matches(authorId)) {

        //        popupDialog({
        //            templateId: 'contentMessageBox',
        //            caption: 'Collaboration RSVP',
        //            content: function () {
        //                return '<p>{0}, has accepted your invitation, {1}.<br/>Press OK to sync workspace</p>'.format(player, author);
        //            },
        //            onOK: function () {
        //                var sessionKey = ctrl.sessionKey;
        //                hub.invoke("authorRequestModelFromPlayer", sessionKey, ctrl.userNickName, ctrl.userId);
        //            },
        //        });

        //    }
        //});

        //hub && hub.on("sendModelToAuthor", function (sessionKey, author, authorid) {
        //    if (!ctrl.matchesSession(sessionKey)) {
        //        return;
        //    }
        //    if (ctrl.hasUserId && !ctrl.userId.matches(authorid)) {
        //        toastr.info('Is being sent your drawing', author);

        //        var syncPayload = workspace.currentModelToPayload();
        //        ctrl.updateSessionTraffic(syncPayload.length, 0);
        //        hub.invoke("playerSendModelToAuthor", sessionKey, ctrl.userNickName, ctrl.hasUserId, syncPayload);
        //    }
        //});

        //hub && hub.on("authorReceiveModelFromPlayer", function (sessionKey, player, playerId, payload) {
        //    if (!ctrl.matchesSession(sessionKey)) {
        //        return;
        //    }
        //    //this should be toast
        //    toastr.info('Has contributed to your drawing', player);
        //    ctrl.updateSessionTraffic(0, payload.length);
        //    workspace.payloadToCurrentModel(payload);
        //    ctrl.doRepaint;
        //    toastr.success('is being sent the synchronized drawing', player);

        //    var syncPayload = workspace.currentModelToPayload();
        //    ctrl.updateSessionTraffic(syncPayload.length, 0);
        //    hub.invoke("authorSendModelToPlayers", sessionKey, ctrl.userNickName, ctrl.userId, syncPayload);
        //});

        //fo.subscribe("SendModel", function (sessionKey, author, authorid, payload) {
        //    hub && hub.invoke("authorSendModelToPlayers", sessionKey, author, authorid, payload);
        //});

        //hub && hub.on("playersReceiveSynchronizedModelFromAuthor", function (sessionKey, author, authorid, payload) {
        //    if (!ctrl.matchesSession(sessionKey)) {
        //        return;
        //    }


        //    function processPayload(data) {
        //        ctrl.updateSessionTraffic(0, payload.length);
        //        workspace.specToKnowtShareModelSync(data);
        //        ctrl.doRepaint;
        //        //this should be toast
        //        toastr.success('Has synchronized with your drawing', author);
        //    }

        //    var spec = fo.parsePayload(payload);
        //    var cmd = spec.command;
        //    if (cmd && cmd.clearBeforeSync) {
        //        ctrl.doAuthorRequestClearAsync(function () {
        //            processPayload(spec);
        //        },
        //        function () { toastr.warning('Is NOT synchronized with your drawing', author); }
        //        );
        //    } else {
        //        processPayload(spec);
        //    }
        //});

        //hub && hub.on("selfReceiveInviteFromPlayer", function (userId, payload) {
        //    if (!ctrl.matchesUser(userId) || !ctrl.hasSessionKey) {
        //        return;
        //    }

        //    ctrl.updateSessionTraffic(0, payload.length);
        //    workspace.payloadToCurrentModel(payload);
        //    ctrl.doRepaint;
        //    toastr.success('is being sent the synchronized drawing', ctrl.userNickName);

        //    var syncPayload = workspace.currentModelToPayload();
        //    ctrl.updateSessionTraffic(syncPayload.length, 0);
        //    hub.invoke("selfSendModelToPlayers", ctrl.sessionKey, userId, syncPayload);

        //});

        //hub && hub.on("playerReceiveSynchronizedModelSelf", function (sessionKey, userId, payload) {
        //    if (!ctrl.matchesUser(userId)) {
        //        return;
        //    }

        //    //probably have a session as a result of getting a user iD so...
        //    //if I a loged in somewhere else, then use the session send to me.
        //    ctrl.sessionKey = sessionKey;
        //    ctrl.updateSessionTraffic(0, payload.length);
        //    workspace.payloadToCurrentModel(payload);
        //    ctrl.doRepaint;

        //    //this should be toast
        //    toastr.success('Has synchronized with your drawing', ctrl.userNickName);

        //});

        //hub && hub.on("authorReceiveJoinSessionFromPlayer", function (sessionKey, userId, payload) {
        //    if (!ctrl.matchesSession(sessionKey)) {
        //        return;
        //    }

        //    var shareSpec = {};
        //    if (!ctrl.isPresenterSession) {
        //        ctrl.updateSessionTraffic(0, payload.length);
        //        workspace.payloadToCurrentModel(payload);
        //        ctrl.doRepaint;
        //        toastr.success('is being sent the synchronized drawing', ctrl.userNickName);
        //    }
        //    else {
        //        shareSpec = { isViewOnlySession: true }
        //    }

        //    var syncPayload = workspace.currentModelToPayload(shareSpec);
        //    ctrl.updateSessionTraffic(syncPayload.length, 0);
        //    hub.invoke("authorSendJoinSessionModelToPlayers", ctrl.sessionKey, userId, syncPayload);

        //});

        //hub && hub.on("playerReceiveJoinSessionModel", function (sessionKey, userId, payload) {
        //    if (!ctrl.matchesSession(sessionKey)) {
        //        return;
        //    }

        //    ctrl.updateSessionTraffic(0, payload.length);
        //    var spec = workspace.payloadToCurrentModel(payload);
        //    var command = spec.command;

        //    ctrl.doRepaint;

        //    //this should be toast
        //    if (command && command.isViewOnlySession) {
        //        ctrl.isViewOnlySession = true;
        //        toastr.success('Has synchronized with presentation', ctrl.userNickName);
        //    }
        //    else {
        //        toastr.success('Has synchronized with your notes', ctrl.userNickName);
        //    }
        //});

        return obj;
    });


}(knowtApp, Foundry));
