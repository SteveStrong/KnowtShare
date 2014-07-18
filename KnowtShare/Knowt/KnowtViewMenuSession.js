

(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('menuSession'), {
        dialogService: fo.fromParent,

        userNickName: fo.fromParent,
        userId: fo.fromParent,
        hasUserId: fo.fromParent,

        isLoggedIn: fo.fromParent,
        sessionUrl: fo.fromParent,

        sessionKey: fo.fromParent,
        hasSessionKey: fo.fromParent,

        knowtshareSessionUrl: function () {
            var loc = window.location;
            var url = "{0}//{1}/Home/KnowtShare/{2}".format(loc.protocol, loc.host, this.sessionKey);
            return url; // "http://knowtsignal.azurewebsites.net/KnowtShare/{0}".format(this.sessionKey);
        },
        knowtifySessionUrl: function () {
            var loc = window.location;
            var url = "{0}//{1}/Home/Knowtify/{2}".format(loc.protocol, loc.host, this.sessionKey);
            return url; // "http://knowtsignal.azurewebsites.net/Knowtify/{0}".format(this.sessionKey);
        },

        doResyncSession: function () {
            //delete my current model and then ask someone to send me one
            if (this.doClearAsync && this.hasUserId) {
                var self = this;
                this.doClearAsync(function () {
                    var syncPayload = workspace.currentModelToPayload();
                    hub.invoke("playerJoinSession", self.sessionKey, self.userId, syncPayload);
                });
            }
        },
        doShareSession: function () {
            //workspace.copyDocumentFrom(this);
            this.space.sessionUrl = this.knowtshareSessionUrl;
            window.open(this.knowtshareSessionUrl, '_blank');
            //fo.hub.doCommand('shareSessionLink');
        },
        doStopSharing: function () {
            this.smashProperty('sessionKey');
        },
        doJoinSession: function () {
            this.joinSessionDialog();
        },

        doCreateSession: function () {
            this.createSessionDialog();
        },

        canDoInviteFriend: function () {
            return this.hasUserId;
        },
        doInviteFriend: function () {
            this.createFriendInvitation();
        },
        canDoCollaborate: function () {
            return this.hasUserId;
        },

        doCollaborate: function () {
            var ctrl = this;
            var sessionKey = fo.utils.generateUUID();
            if (ctrl.hasUserId) {
                ctrl.sessionKey = sessionKey;
            }
            this.createCollaborationList(function (links) {
                links.forEach(function (link) {
                    hub.invoke("authorInvite", sessionKey, ctrl.userNickName, ctrl.userid, link.friendNickName, link.friendUserId);
                });
            });
        },

    },
    function (properties, subcomponents, parent) {

        var space = parent;
        var obj = fo.makeComponent(properties, subcomponents, parent);
        //subscribe to any do* of goto* messages...
        obj.subscribeToCommands();

        obj.createSessionDialog = function (onComplete) {

            var contextSpec = {
                presenter: false,
                sessionKey: obj.hasSessionKey ? obj.sessionKey : '',
                doGenerateSessionKey: function () {
                    this.sessionKey = this.sessionKey ? this.sessionKey : fo.utils.generateUUID();
                },
                canDoGenerateSessionKey: function () {
                    return this.sessionKey ? false : true;
                },
            }

            obj.dialogService.doPopupDialog({
                context: fo.makeComponent(contextSpec),
                headerTemplate: 'sessionCreateHeader.html',
                bodyTemplate: 'sessionCreateBody.html',
                footerTemplate: 'OkCancelFooter.html',
            },
            {
                onExit: onComplete,
                onOK: function ($modalInstance, context) {
                    space.createSession(context.sessionKey, { presenter: context.presenter });
                    $modalInstance.close(context);
                },
            });
        };


        obj.joinSessionDialog = function (onComplete) {

            var contextSpec = {
                sessionKey: obj.hasSessionKey ? obj.sessionKey : '',
            }

            obj.dialogService.doPopupDialog({
                context: fo.makeComponent(contextSpec),
                headerTemplate: 'sessionJoinHeader.html',
                bodyTemplate: 'sessionJoinBody.html',
                footerTemplate: 'OkCancelFooter.html',
            },
            {
                onExit: onComplete,
                onOK: function ($modalInstance, context) {
                    space.joinSession(context.sessionKey);
                    $modalInstance.close(context);
                },
            });
        };


        return obj;
    });

}(knowtApp, Foundry));
