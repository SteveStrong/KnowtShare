
//http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#what-is

(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('mobileServices'), {
        dialogService: fo.fromParent,

        oAuthProvider: '',
        mobileClient: function () {
            var client = new WindowsAzure.MobileServiceClient(
                "https://knowtshare.azure-mobile.net/",
                "TgqajRoTjJGUXtBpkjedHyCSJmPyev37"
            );
            return client;
        },

        canDoLoginDialog: function () {
            return this.mobileClient != undefined;
        },

        doLoginDialog: function () {
            var self = this;
            self.createLoginDialog(function () {
                self.hasLoginId = true;
            });
        },

        hasLoginId: false,
        noop: function() {

        },


        doLoginTwitter: function () {
            this.oAuthProvider = "twitter";
            this.doLogin;
        },
        doLoginFacebook: function () {
            this.oAuthProvider = "facebook";
            this.doLogin;
        },
        doLoginGoogle: function () {
            this.oAuthProvider = "google";
            this.doLogin;
        },
        doLoginMicrosoft: function () {
            this.oAuthProvider = "MicrosoftAccount";
            this.doLogin;
        },
        doLogin: function () {
            var self = this;
            var account = this.oAuthProvider;
            if (account.matches('')) {
                alert("oAuth Provider is not selected");
                return;
            }

            var client = this.mobileClient;
            client.login(account).then(function () {
                var isLoggedIn = client.currentUser !== null;

                if (isLoggedIn) {
                    var usersTable = client.getTable('Users');
                    usersTable.insert({
                        userId: client.currentUser.userId,
                        nickName: 'eteve'
                    });

                    usersTable.where({
                        userId: client.currentUser.userId
                    }).read().done(function (results) {
                        var user = results[0];
                        if (user && user.nickName) {
                            self.loginComplete(user.userId, user.nickName);
                        } else {
                            popupDialog({
                                templateId: 'nickNameTemplate',
                                caption: 'Please supply a nick name',
                                nickName: '',
                                onOK: function () {
                                    usersTable.insert({
                                        userId: client.currentUser.userId,
                                        nickName: model.nickName
                                    }).done(function (item) {
                                        self.loginComplete(item.userId, item.nickName);
                                    });
                                }
                            });
                        }
                    });
                }
            }, function (error) {
                alert(error);
            });
        },


    },
    function (properties, subcomponents, parent) {

        var space = parent;

        var result = fo.makeComponent(properties, subcomponents, parent);
        //subscribe to any do* of goto* messages...
        result.subscribeToCommands();

        result.loginComplete = function (userId, nickName) {
            if (!space.hasSessionKey) {
                space.sessionKey = fo.utils.generateUUID();
            }

            //fo.runWithUIRefreshLock(function () {
            //    ctrl.userId = userId;
            //    ctrl.userNickName = nickName;
            //});

            fo.publish('UserLoginComplete', [userId, nickName]);

            //selectComponents will travel the complete tree
            var rootModel = space.rootModel;
            var result = rootModel.selectComponents(function (item) { return item.author.matches('Anonymous') });
            result.forEach(function (item) {
                item.author = nickName;
                item.userId = userId;
            });

            if (space.hasUserId) {
                //it is player because the call back is to whom ever is currently the last login
                var syncPayload = space.currentModelToPayload();
                hub.invoke("playerInviteSelf", ctrl.userId, syncPayload);
            }

            if (result.mobileClient.mock) return;

            result.processNewFriends(function (friendList) {
                friendList.forEach(function (link) {
                    toastr.success('is your new friend', link.friendNickName);
                });
                toastr.info('Thanks for joining us', ctrl.userNickName);
            });
        }

        result.logoutComplete = function (userId, nickName) {
            //fo.runWithUIRefreshLock(function () {
            //    ctrl.userId = '';
            //    ctrl.userNickName = '';
            //});
            fo.publish('UserLogoutComplete', [userId, nickName]);
        }

        result.createCollaborationList = function (onComplete) {
            if (this.hasUserId) {
                var client = this.mobileClient;
                var userId = client.currentUser.userId;
                var friendLinkTable = client.getTable('FriendLinks');

                friendLinkTable.where({
                    userId: userId
                }).read().done(function (friendLinks) {
                    onComplete && onComplete(friendLinks);
                });
            }
        };

        result.processNewFriends = function (onComplete) {
            if (this.hasUserId) {
                var client = this.mobileClient;
                var userId = client.currentUser.userId;
                var author = this.userNickName;
                var acceptancesTable = client.getTable('FriendAcceptances');
                var friendLinkTable = client.getTable('FriendLinks');
                acceptancesTable.where({
                    userId: userId
                }).read().done(function (newAcceptances) {
                    friendLinkTable.where({
                        userId: userId
                    }).read().done(function (friendLinks) {
                        var friendList = [];
                        newAcceptances.forEach(function (newAcceptance) {
                            var acceptanceId = newAcceptance.acceptance;
                            var link = friendLinks.firstWhere(function (item) {
                                return item.acceptance && item.acceptance.matches(acceptanceId);
                            });
                            if (!link && userId != newAcceptance.friendUserId) {
                                link = {
                                    userId: userId,
                                    friendUserId: newAcceptance.friendUserId,
                                    friendNickName: newAcceptance.friendNickName,
                                    acceptance: acceptanceId
                                };
                                friendLinkTable.insert(link).done(function (result) {
                                    var other = {
                                        userId: result.friendUserId,
                                        friendUserId: userId,
                                        friendNickName: author,
                                        acceptance: acceptanceId
                                    };
                                    friendLinkTable.insert(other);
                                });
                                friendList.push(link);
                            } else {
                                acceptancesTable.del({
                                    id: newAcceptance.id
                                });
                            }
                        });
                        onComplete && onComplete(friendList);
                    });
                });
            }
        };

        result.createFriendInvitation = function () {
            if (this.hasUserId) {
                var client = this.mobileClient;
                var invitationTable = client.getTable('FriendInvitations');
                var item = {
                    userId: client.currentUser.userId,
                    nickName: this.userNickName,
                    invitation: fo.utils.generateUUID(),
                    invitationDate: new Date(),
                    invitationUrl: function () {
                        return "http://shapesignal.azurewebsites.net/Invitations/{0}".format(this.invitation);
                    }
                };
                invitationTable.insert(item).done(function (result) {

                    popupDialog({
                        buttons: ['OK'],
                        templateId: 'invitationTemplate',
                        caption: 'Request a friend to collaborate with you',
                        target: fo.makeComponent(item),
                        height: 350,
                        onOK: function () {
                        }
                    });
                });
            }
        };

        result.acceptFriendInvitation = function () {
            if (this.hasUserId) {
                var client = this.mobileClient;
                var invitationTable = client.getTable('FriendInvitations');
                var acceptancesTable = client.getTable('FriendAcceptances');
                invitationTable.where({
                    invitation: obj.id
                }).read().done(function (invitations) {
                    var invitation = invitations[0];
                    if (invitation === undefined) {
                        toastr.error('problem', 'invitation has been used');
                    } else {
                        var del = {
                            id: invitation.id
                        };
                        invitationTable.del(del).done(function () {
                            var item = {
                                userId: invitation.userId,
                                nickName: invitation.nickName,
                                acceptance: fo.utils.generateUUID(),
                                acceptanceDate: new Date(),
                                friendUserId: client.currentUser.userId,
                                friendNickName: ctrl.userNickName
                            };
                            acceptancesTable.insert(item).done(function (result) {
                                toastr.info('Confirmed', result.nickname + ' will be notified');
                            });
                        });
                    }
                });
            }
        };


        result.createLoginDialog = function (onComplete) {

            var contextSpec = {
                username: '',
                password: '',
            }

            result.dialogService.doPopupDialog({
                context: fo.makeComponent(contextSpec),
                headerTemplate: 'loginHeader.html',
                bodyTemplate: 'loginBody.html',
                footerTemplate: 'loginlFooter.html',
            },
            {
                onExit: onComplete,
                onOK: function ($modalInstance, context) {

                    //obj.proxy.doCreateSession(context.sessionKey, { presenter: context.presenter });
                    $modalInstance.close(context);
                },
            });
        };


        return result;
    });


}(knowtApp, Foundry));
