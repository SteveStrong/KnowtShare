

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
        proxy: undefined,

        knowtshareSessionUrl: function () {
            var loc = window.location;
            var url = "{0}//{1}/Home/KnowtShare/{2}".format(loc.protocol, loc.host, this.sessionKey);
            return url; // "http://knowtsignal.azurewebsites.net/KnowtShare/{0}".format(this.sessionKey);
        },
        //knowtifySessionUrl: function () {
        //    var loc = window.location;
        //    var url = "{0}//{1}/Home/Knowtify/{2}".format(loc.protocol, loc.host, this.sessionKey);
        //    return url; // "http://knowtsignal.azurewebsites.net/Knowtify/{0}".format(this.sessionKey);
        //},

        canDoResyncSession: function () {
            return this.proxy != undefined && this.hasSessionKey;
        },
        doResyncSession: function () {
            this.proxy.doResyncSession();
        },
        canDoShareSession: function () {
            return this.proxy != undefined && this.hasSessionKey;
        },
        doShareSession: function () {
            this.space.sessionUrl = this.knowtshareSessionUrl;
            window.open(this.knowtshareSessionUrl, '_blank');
        },
        canDoStopSharing: function () {
            return this.proxy != undefined && this.hasSessionKey;
        },

        doStopSharing: function () {
            this.proxy.doExitSession();
        },

        canDoJoinSession: function () {
            return this.proxy != undefined && !this.hasSessionKey;
        },
        doJoinSession: function () {
            this.joinSessionDialog();
        },

        canDoCreateSession: function () {
            return this.proxy != undefined && !this.hasSessionKey;
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
            return this.proxy &&  this.hasUserId;
        },

        doCollaborate: function () {
            this.proxy.doCollaborate();
        },

    },
    function (properties, subcomponents, parent) {

        var space = parent;
        var obj = fo.makeComponent(properties, subcomponents, parent);
        //subscribe to any do* of goto* messages...
        obj.subscribeToCommands();


        fo.subscribe('proxyStarted', function (proxy, hub) {
            obj.proxy = proxy;
        });

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

                    obj.proxy.doCreateSession(context.sessionKey, { presenter: context.presenter });
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
                    obj.proxy.doJoinSession(context.sessionKey);
                    $modalInstance.close(context);
                },
            });
        };


        return obj;
    });

}(knowtApp, Foundry));
