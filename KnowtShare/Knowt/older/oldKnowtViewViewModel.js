(function (app, fo, undefined) {

    var showPanZoomWhenDrawingView = false;

    fo.defineType(app.defaultNS('notePage'), {
        workspace: {},
        drawing: function () {
            return this.workspace.drawing;
        },
        page: function () {
            return this.workspace.rootPage;
        },
        model: function () {
            return this.workspace.rootModel;
        },
        pinAsRootShape: function () {
            return this.workspace.rootPage;
        },
        selectionPath: function () {
            var path = [];
            var self = this.drawing;
            var parent = this.pinAsRootShape;
            while (parent && parent != self) {
                path.push(parent);
                parent = parent.myParent;
            }
            return path.reverse();
        },
        hasSelection: false,

        modelElements: function () {
            var context = this.pinAsRootShape.context;
            context = context || this.model;
            return context.Subcomponents.elements;
        },
        shapeElements: function () {
            return this.pinAsRootShape.Subcomponents.elements;
        },
        clientCount: '#',
        //code to manage the state of the UI

        viewMode: 'drawing', //text, drawing
        doToggleView: function () {
            if (this.isDrawingView) {
                this.gotoTextView;
            } else {
                this.gotoDrawingView;
            }
        },
        gotoDrawingView: function () {
            this.viewMode = 'drawing';
            fo.publish("viewMode", [this, this.viewMode]);
            if (showPanZoomWhenDrawingView) {
                showPanZoomWhenDrawingView = false;
                var drawing = this.drawing;
                drawing.doTogglePanZoomWindow;
            }
        },
        isDrawingView: function () {
            return 'drawing'.matches(this.viewMode);
        },
        gotoTextView: function () {
            this.viewMode = 'text';
            fo.publish("viewMode", [this, this.viewMode]);

            var drawing = this.drawing;
            if (drawing.isPanZoomWindowOpen) {
                drawing.doTogglePanZoomWindow;
                showPanZoomWhenDrawingView = true;
            }
        },
        isTextView: function () {
            return 'text'.matches(this.viewMode);
        },
    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {


    fo.extendType(app.defaultNS('notePage'), {
        interactionMode: 'navigation', //navigation, construction, presentation
        gotoNavigationInteraction: function () {
            this.interactionMode = 'navigation';
            fo.publish("interactionMode", [this, this.interactionMode]);
        },
        isNavigationInteraction: function () {
            return this.interactionMode.matches('navigation');
        },
        gotoConstructionInteraction: function () {
            this.interactionMode = 'construction';
            fo.publish("interactionMode", [this, this.interactionMode]);
        },
        isConstructionInteraction: function () {
            return this.interactionMode.matches('construction');
        },
        gotoPresentationInteraction: function () {
            this.interactionMode = 'presentation';
            fo.publish("interactionMode", [this, this.interactionMode]);
        },
        isPresentationInteraction: function () {
            return this.interactionMode.matches('presentation');
        },

        identityMode: 'Anonymous', //Anonymous, trusted
        gotoAnonymousMode: function () {
            this.identityMode = 'Anonymous';
            fo.publish("identityMode", [this, this.identityMode]);
        },
        isAnonymousMode: function () {
            return this.identityMode.matches('Anonymous');
        },
        gotoTrustedMode: function () {
            this.identityMode = 'trusted';
            fo.publish("identityMode", [this, this.identityMode]);
        },
        isTrustedMode: function () {
            return this.identityMode.matches('trusted');
        },


        collaborationMode: 'singleUser', //multiUser, singleUser
        gotoSingleUserMode: function () {
            this.collaborationMode = 'singleUser';
            fo.publish("collaborationMode", [this, this.collaborationMode]);
        },
        isSingleUserMode: function () {
            return this.collaborationMode.matches('singleUser');
        },
        gotoMultiUserMode: function () {
            this.collaborationMode = 'multiUser';
            fo.publish("collaborationMode", [this, this.collaborationMode]);
        },
        isMultiUserMode: function () {
            return this.collaborationMode.matches('multiUser');
        },


    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

    fo.extendType(app.defaultNS('notePage'), {
        doOpenSelected: function () {
            var page = this.page;
            if (page) {
                var shape = page.selectedShape();
                var context = page.selectedContext();
                this.openEdit(context);
                var shape = page.selectedShape();
                if (shape) shape.doUpdate();
            }
        },

        doNavSelected: function () {
            var page = this.page;
            if (page) {
                var context = page.selectedContext();
                this.openNav(context);
            }
        },

        doUnselectAll: function () {
            var page = this.page;
            if (page) {
                page.selectShape(undefined, true);
            }
        },

        doReparentSelected: function () {
            var page = this.page;
            if (page) {
                var shape = page.selectedShape();
                if (shape) {
                    var loc = { pinX: shape.pinX, pinY: shape.pinY, index: shape.myIndex() }
                    var oldParent = page.captureSubcomponent(shape);
                    fo.publish('ShapeReparented', [shape, oldParent, shape.myParent, loc]);


                    page.moveToPasteArea(shape);
                    //var pinX = (oldParent.pinX - page.panX) / page.scale - 20;
                    //var pinY = (oldParent.pinY - page.panY) / page.scale - 20;

                    //shape.setXY(pinX, pinY);
                    //fo.publish('ShapeMoved', [shape.myName, undefined, shape])
                }
            }
        },

        doDeleteSelected: function () {
            var page = this.page;
            if (page) {
                var shape = page.selectedShape();
                if (shape) {
                    //first move this shape to page before we delete
                    if (shape.myParent != page) {
                        this.doReparentSelected;
                    }

                    page.selectShape(undefined, true);

                    var uniqueID = shape.uniqueID;
                    var model = this.model.getSubcomponent(uniqueID, true);
                    page.farewellShape(shape, function () {
                        fo.publish('Deleted', [uniqueID, model, shape]);

                        fo.undo.do('Deleted', { model: model, shape: shape })
                    });
                }
            }
        },

        doDeleteSelectedParentOnly: function () {
            var page = this.page;
            if (page) {
                var shapeParent = page.selectedShape();
                if (shapeParent) {
                    var list = shapeParent.Subcomponents.duplicate();
                    list.forEach(function (shape) {
                        var loc = { pinX: shape.pinX, pinY: shape.pinY, index: shape.myIndex() }
                        var oldParent = page.captureSubcomponent(shape);
                        fo.publish('ShapeReparented', [shape, oldParent, shape.myParent, loc]);

                        page.moveToPasteArea(shape);
                    });

                    this.doDeleteSelected;
                }
            }
        },

        doDeleteSelectedSaveSubcomponents: function () {
            var page = this.page;
            var self = this;
            if (page && page.selectedShape()) {
                page.resetPasteArea();
                page.showPasteArea(function () {
                    self.doDeleteSelectedParentOnly;
                });
            }
        },

        doDuplicateSelected: function () {
            var page = this.page;
            if (page) {
                var shape = page.selectedShape();
                if (shape) {
                    var uniqueID = shape.uniqueID;
                    page.selectShape(undefined, true);
                    var model = shape.context;
                    fo.publish('Duplicate', [uniqueID, model, shape]);
                }
                this.doSessionSave;
            }
        },


    });

}(knowtApp, Foundry));


(function (app, fo, undefined) {

    fo.extendType(app.defaultNS('notePage'), {
        //code to manage the scale of the drawing

        doZoom1To1: function () {
            var drawing = this.drawing;
            if (drawing) drawing.doZoom1To1;
        },
        doZoomToFit: function () {
            var drawing = this.drawing;
            if (drawing) drawing.doZoomToFit;
        },
        doZoomOut: function () {
            var drawing = this.drawing;
            if (drawing) drawing.doZoomOut;
        },
        doZoomIn: function () {
            var drawing = this.drawing;
            if (drawing) drawing.doZoomIn;
        },
        doTogglePanZoomWindow: function () {
            this.doRepaint;
            var drawing = this.drawing;
            if (drawing) drawing.doTogglePanZoomWindow;
            this.smashProperty('isPanZoomWindowOpen');
        },
        isPanZoomWindowOpen: function () {
            var drawing = this.drawing;
            return drawing ? drawing.isPanZoomWindowOpen : false;
        },
        zoomText: function () {
            var open = this.isPanZoomWindowOpen;
            return 'Zoom ' + (open ? 'off' : 'on');

            //return 'Zoom ' + (open ? 'close' : 'open');
        },

    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

    fo.extendType(app.defaultNS('notePage'), {
        //code to manage the identiy of a user

        userNickName: function () {
            return 'Anonymous';
        },
        isLoggedIn: function () {
            return !this.userNickName.matches('Anonymous');
        },
        userId: function () {
            return 'unknown';
        },
        hasUserId: function () {
            return !this.userId.matches('unknown');
        },
        canDoSendPing: function () {
            return hub && hub.started;
        },
        doSendPing: function () {
            if (this.canDoSendPing) {
                hub.invoke("sendPing", ctrl.sessionKey, ctrl.userNickName, ctrl.userId);
            }
        },
        canDoSearchTweets: function () {
            return hub && hub.started;
        },
        doSearchTweets: function () {
            if (this.canDoSearchTweets) {
                hub.invoke("searchTweets", ctrl.sessionKey, ctrl.userId);
            }
        },
        mobileClient: function () {
            var client = new WindowsAzure.MobileServiceClient("https://shapesignal.azure-mobile.net/", "QRTkKUbBGYxxoCKFWpCWCtVLefZcJe92");
            return client;
        },
        sessionUrl: function () {
            return this.knowtshareSessionUrl;
        },
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
            workspace.copyDocumentFrom(this);
            workspace.sessionUrl = this.knowtshareSessionUrl;
            fo.hub.doCommand('shareSessionLink');
        },
        doStopSharing: function () {
            this.smashProperty('sessionKey');
        },
        doJoinSession: function () {
            var joinSpec = {
                sessionKey: this.hasSessionKey ? this.sessionKey : '',
                doGenerateSessionKey: function () {
                    this.sessionKey = this.sessionKey ? this.sessionKey : fo.utils.generateUUID();
                },
                canDoGenerateSessionKey: function () {
                    return this.sessionKey ? false : true;
                },
                ctrl: this,
            }

            dialogService.doPopupDialog({
                context: fo.makeComponent(joinSpec),
                headerTemplate: 'sessionJoinHeaderTemplate.html',
                bodyTemplate: 'sessionJoinTemplate.html',
                footerTemplate: 'OkCancelFooter.html',
            },
            {
                onReady: function () {
                    //!function (d, s, id) {
                    //    var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
                    //    if (!d.getElementById(id)) {
                    //        js = d.createElement(s);
                    //        js.id = id;
                    //        js.src = p + '://platform.twitter.com/widgets.js';
                    //        fjs.parentNode.insertBefore(js, fjs);
                    //    }
                    //}(document, 'script', 'twitter-wjs');

                    var input = document.getElementById('IDSessionKey');
                    if (input) {
                        input.focus();
                        return;
                    }
                },
                onOK: function () {
                    var ctrl = this.context.ctrl;
                    ctrl.joinSession(this.context.sessionKey);
                    ctrl.userId = "Session";
                },
            });
        },

        doCreateSession: function () {

            var createSpec = {
                presenter: false,
                sessionKey: this.hasSessionKey ? this.sessionKey : '',
                doGenerateSessionKey: function () {
                    this.sessionKey = this.sessionKey ? this.sessionKey : fo.utils.generateUUID();
                },
                canDoGenerateSessionKey: function () {
                    return this.sessionKey ? false : true;
                },
                ctrl: this,
            }

            var context = fo.makeComponent(createSpec);
            dialogService.doPopupDialog({
                context: context,
                headerTemplate: 'sessionCreateHeaderTemplate.html',
                bodyTemplate: 'sessionCreateTemplate.html',
                footerTemplate: 'OkCancelFooter.html',
            },
            {
                onReady: function () {
                    var input = document.getElementById('IDSessionKey');
                    if (input) {
                        input.focus();
                        return;
                    }
                },
                onOK: function () {
                    var ctrl = this.context.ctrl;
                    ctrl.createSession(this.context.sessionKey, { presenter: this.context.presenter });
                    ctrl.userId = "Session";
                },
                onCancel: function () { },
            });
        },
        oAuthProvider: '',

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
            var ctrl = this;
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
                    usersTable.where({
                        userId: client.currentUser.userId
                    }).read().done(function (results) {
                        var user = results[0];
                        if (user && user.nickName) {
                            ctrl.loginComplete(user.userId, user.nickName);
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
                                        ctrl.loginComplete(item.userId, item.nickName);
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
        sessionKey: function () {
            return 'NO_SESSION';
        },
        hasSessionKey: function () {
            var key = this.sessionKey;
            if (!key || key.length == 0) {
                this._sessionKey.smash();
                return false;
            }
            var result = !key.matches('NO_SESSION');
            return result;
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
        bytesOutTraffic: 0,
        bytesInTraffic: 0,
        traffic: function () {
            var kbIn = parseInt(this.bytesInTraffic / 1000);
            var kbOut = parseInt(this.bytesOutTraffic / 1000);
            if (kbIn < 1000 && kbOut < 1000) {
                return 'I: {0}kb  O: {1}kb'.format(kbIn, kbOut);
            }
            mbIn = parseInt(100 * kbIn / 1000) / 100;
            mbOut = parseInt(100 * kbOut / 1000) / 100;
            return 'I: {0}mb  O: {1}mb'.format(mbIn, mbOut);
        }
    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

    fo.extendType(app.defaultNS('notePage'), {
        doSmartFileOperation: function () {
            if (ctrl.isDocumentEmpty) {
                this.doOpenFilePicker;
            }
            else if (!this.isDocumentSaved) {
                this.doSaveFilePicker;
            }
        },

        doOpenFilePicker: function () { alert('open file picker does not exist'); },
        doSaveFilePicker: function () { alert('save file picker does not exist'); },
        doSaveAsHTMLFilePicker: function () { alert('save as HTML file picker does not exist'); },
        doSaveAsPNGFilePicker: function () { alert('save as PNG file picker does not exist'); },
        documentName: '',
        isDocumentSaved: true,
        pageTitle: function () {
            var result = 'KnowtShare';
            if (this.documentTitle) {
                result += ":" + this.documentTitle;
            }
            return result;
        },
        clientMode: function () {
            var result = '';
            if (this.isPresenterSession) {
                result += " presenter";
            }
            if (this.isViewOnlySession) {
                result += " view only";
            }
            return result;
        },
        documentTitle: function () {
            var result = this.documentName;
            if (result && !this.isDocumentSaved) {
                result += "*";
            }
            return result;
        },
        sessionTitle: function () {
            var result = '';
            if (this.hasSessionKey) {
                if (this.isLoggedIn) result = this.userNickName + ", ";
                result += this.userId + ": " + this.sessionKey;
            }
            return result;
        },
        modelTitle: function () {
            var result = this.model ? this.model.title : '';
            return result;
        },
        isDocumentEmpty: function () {
            var total = (this.page.Subcomponents.count * this.model.Subcomponents.count) / 2;
            var isEmpty = this.page.Subcomponents.isEmpty() && this.model.Subcomponents.isEmpty()
            return isEmpty;
        },
        doRepaint: function () {
            this.doModelSmash;
            this.page && this.page.forceLayout();
        },
        doClear: function () {
            var self = this;
            workspace.clear();
            workspace.clearDocument();
            workspace.copyDocumentTo(self);
            this.doSessionSave;
            this.doRepaint;
        },
        doModelSmash: function () {
            var self = this;
            self.smashProperty('isDocumentEmpty');
            self.smashProperty('pinAsRootShape');
            self.smashProperty('breadCrumHTML');
            self.smashProperty('textViewHTML');
        },
        doConfirmClear: function () { }, //this is a noop and will be overwridden
        doConfirmClearFileDropAsync: function () { }, //this is a noop and will be overwridden

        doSessionSave: function () {
            workspace.doSessionSave();
        },

        doSessionRestore: function () {
            workspace.doSessionRestore();
            this.doModelSmash;
        },

    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

    fo.extendType(app.defaultNS('notePage'), {
        doViewModelJSON: function () {
            fo.hub.doCommand('viewModelJSON');
        },

        doToDoApp: function () {
            fo.hub.openWindow('ToDo.html');
            var self = this;
            fo.hub.setCrossDomain(false);
            fo.hub.registerCommandResponse({
                syncModelRequest: function (payload) {
                    //workspace.copyDocumentFrom(this);
                    //workspace.sessionUrl = this.knowtshareSessionUrl;
                    var syncPayload = workspace.currentModelToPayload();
                    fo.hub.sendCommand('syncModelResponse', syncPayload);
                },
                createNote: function (obj) {
                    var text = obj.text;

                    var note = self.createNote(text).note;
                    fo.publish('ModelChanged', [note]);

                }
            });
        },
        doRecommendationApp: function () {
            fo.hub.openWindow('Recommendation.html');
            var self = this;
            fo.hub.setCrossDomain(false);
            fo.hub.registerCommandResponse({
                syncModelRequest: function (payload) {
                    var syncPayload = workspace.currentModelToPayload();
                    fo.hub.sendCommand('syncModelResponse', syncPayload);
                },
            });
        },



        doToggleJoinSession: function () {
            if (!this.hasSessionKey) {
                this.doJoinSession;
            }
            else {
                this.doStopSharing;
            }
        },
        isMenuAppOpen: false,
        doMenuAppToggle: function () {
            this.isMenuAppOpen = !this.isMenuAppOpen;
        },
        isPresenterSession: false,
        isViewOnlySession: false,
        doTogglePresenterSession: function () {
            this.isPresenterSession = !this.isPresenterSession;
        },
        doToggleViewOnlySession: function () {
            this.isViewOnlySession = !this.isViewOnlySession;
        },

    });

}(knowtApp, Foundry));


(function (app, fo, undefined) {

    fo.extendType(app.defaultNS('notePage'), {
    });

}(knowtApp, Foundry));

//this is the tester version
(function (app, fo, undefined) {


    //var test = fo.knowtShareApp.newNotePage();

}(knowtApp, Foundry));




var KnowtViewVM = function (workspace, fo, hub, toastr, $log, dialogService, undefined) {
    "use strict";
  

    var ctrl = fo.knowtShareApp.newNotePage();



    ctrl.name = ctrl.uniqueID = "KnowtShare";
    ctrl.sessionStorageAge = function () {
        var now = Date.now();
        var delta = now - this.sessionStorageDate;
        return delta;
    }

    ctrl.updateSessionTraffic = function (bytesOut, bytesIn) {
        if (!ctrl.hasSessionKey) return;
        fo.runWithUIRefreshLock(function () {
            ctrl.bytesOutTraffic = ctrl.bytesOutTraffic + bytesOut;
            ctrl.bytesInTraffic = ctrl.bytesInTraffic + bytesIn;
        })
    }


    fo.subscribe('ShapeSelected', function (page, shape, selections) {
        ctrl.hasSelection = shape && shape.isSelected ? true : false;
    });

    fo.subscribe('PinAsRoot', function (page, shape) {
        ctrl.pinAsRootShape = shape ? shape : page;
        ctrl.applyScope();
    });

    fo.hub.registerCommandResponse({
        syncModelRequest: function (payload) {
            var syncPayload = workspace.currentModelToPayload({}, true);
            fo.hub.sendCommand('syncModelResponse', syncPayload);
        },
    });

    fo.hub.registerCommand({
        viewModelJSON: function (payload) {
            fo.hub.setCrossDomain(false);
            fo.hub.openWindow('viewModelJSON.html');
        },
        shareSessionLink: function (payload) {
            fo.hub.setCrossDomain(false);
            fo.hub.openWindow('ShareSessionLink.html');
            //fo.hub.openWindow('FrameTest.html');
            //fo.hub.openIFrameWindow('dummyPage.html', 'http://foundryjs.azurewebsites.net/ShareSessionLink.html');
        },
    });


    function doWindowKeyNavigation(evt) {
        if (Knowt.isDialogOpen) {
            evt.cancelBubble = true;
            return false;
        }

        var page = ctrl.page;
        if (!page) return;

        //evt.preventDefault();
        var key = evt.keyCode;
        var shift = evt.shiftKey;
        var control = evt.ctrlKey;
        var drawingMode = ctrl.isDrawingView;
        var textMode = ctrl.isTextView;

        var selected = ctrl.hasSelection;

        // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        //http://www.javascriptkeycode.com/

        fo.runWithUIRefreshLock(function () {
            if (control) {
                switch (key) {
                    case 16: // shift
                        evt.cancelBubble = true;
                        ctrl.doToggleView;
                        return;
                    case 32: // space bar
                        evt.cancelBubble = true;
                        ctrl.doAddNote; // doPopupInspect(ctrl);
                        return;
                    case 69: // e
                        evt.cancelBubble = true;
                        ctrl.doOpenSelected;
                        return;
                    case 86: // v  paste
                        evt.cancelBubble = true;
                        ctrl.doPasteNote;
                        return;
                    case 67: // c  copy
                        evt.cancelBubble = true;
                        return;
                    case 88: // x  cut
                        evt.cancelBubble = true;
                        return;
                    case 90: // z  undo
                        evt.cancelBubble = true;
                        ctrl.doUnDo;
                        return;
                    //case 46: // del
                    //    evt.cancelBubble = true;
                    //    ctrl.doDeleteSelected;
                    //    return;
                    //case 45: // insert
                    //    evt.cancelBubble = true;
                    //    ctrl.doAddNote; // doPopupInspect(ctrl);
                    //    return;
                    //case 20: // CAPS LOCK
                    //    evt.cancelBubble = true;
                    //    if (selected) {
                    //        var shape = page.gotoCurrentShape();
                    //        if (shape) shape.upcaseHeading();
                    //        return;
                    //    }
                    //    return;
                    case 86: // V
                        evt.cancelBubble = true;
                        var dt = window.clipboardData;
                        if (dt) {
                            var text = dt.getData('Text');
                            ctrl.pasteTextToNote(text);
                        }
                        return;
                }
            }
            switch (key) {
                case 46: // del
                    evt.cancelBubble = true;
                    ctrl.doConfirmDelete;
                    return;
                case 45: // insert
                    evt.cancelBubble = true;
                    ctrl.doAddNote; // doPopupInspect(ctrl);
                    return;
            }

            if (drawingMode) {
                switch (key) {
                    case 32: // space bar
                        if (selected) {
                            ctrl.doOpenSelected;
                            return;
                        }
                        break;

                    case 27: // escape
                        break;
                    case 9:  // tab
                    case 13: // enter
                    case 16: // shift
                    case 17: // ctrl
                    case 18: // alt
                        break;
                    case 35: // home
                        if (control) {
                            ctrl.doZoom1To1;
                        } 
                        break;
                    case 36: // home
                        if (control) {
                            ctrl.doZoomToFit;
                        }
                        break;
                    case 37: // left arrow
                        if (control) {
                            page.panX += 100;
                        } else {
                            page.gotoPreviousShape(true);
                        }
                        break;
                    case 38: // up arrow
                        if (control) {
                            page.panY += 100;
                        } else {
                            page.gotoParentShape();
                        }
                        break;
                    case 39: // right arrow
                       if (control) {
                         page.panX -= 100;
                       } else {
                           page.gotoNextShape(true);
                       }
                       break;
                    case 40: // down arrow
                        if (control) {
                            page.panY -= 100;
                        } else {
                            var shape = page.gotoCurrentShape();
                            if (!shape) break;
                            shape.branchDepth() > 0 ? page.gotoChildShape() : page.gotoNextShape();
                        }
                        break;
                }
                return;
            }
            else if (textMode) {
                switch (key) {
                    case 9:  // tab
                    case 13: // enter
                    case 16: // shift
                    case 17: // ctrl
                    case 18: // alt
                    case 32: // space bar
                        break;
                    case 27: // escape
                        break;
                    case 37: // left arrow
                        page.gotoParentShape();
                        break;
                    case 38: // up arrow
                        page.gotoPreviousShape(true);
                        break;
                    case 39: // right arrow
                        page.gotoChildShape();
                        break;
                    case 40: // down arrow
                        page.gotoNextShape(true);
                        break;
                }
            };



        });
    }

    window.addEventListener('keydown', doWindowKeyNavigation, true);


    ctrl.pasteTextToNote = function (text) {
        var note = ctrl.createNote(text).note;
        fo.publish('ModelChanged', [note]);
    }

    ctrl.start = function (sessionKey) {
 
        toastr.info('connected to service', 'ready');
        //fo.bindTo(ctrl);

        fo.runWithUIRefreshLock(function () {
            hub.started = true;
            ctrl.initForDrawing();
            if (sessionKey && !ctrl.hasSessionKey) {
                ctrl.sessionKey = sessionKey;
                ctrl.userId = "Session";
                ctrl.joinSession(sessionKey);
            }
        });
    }

    ctrl.loadAppDoc = function (doc) {
        if (!doc) return;

        var source = "AppDocs/" + doc;
        fo.utils.xmlHttpGet(source, function (text, xhr) {
            ctrl.refreshModelFromPayload(text);
            toastr.info('app doc:' + source, 'loading');
        });

    }

    ctrl.joinSession = function (sessionKey) {
        ctrl.sessionKey = sessionKey;
        ctrl.userId = ctrl.isLoggedIn ? ctrl.userId : "Session";

        var syncPayload = workspace.currentModelToPayload();
        hub.invoke("playerJoinSession", ctrl.sessionKey, ctrl.userId, syncPayload);

        if (ctrl.sessionKey.startsWith('#')) {
            hub.invoke("searchTweets", ctrl.sessionKey, ctrl.userId);
        }
    }

    ctrl.createSession = function (sessionKey, sessionSpec) {
        ctrl.sessionKey = sessionKey;
        ctrl.userId = ctrl.isLoggedIn ? ctrl.userId : "Session";

        if (sessionSpec.presenter) {
            ctrl.isPresenterSession = true;
        }
        var syncPayload = workspace.currentModelToPayload(sessionSpec);
        hub.invoke("playerCreateSession", ctrl.sessionKey, ctrl.userId, syncPayload);
    }

    ctrl.loginComplete = function (userId, nickName) {
        if ( !ctrl.hasSessionKey) {
            ctrl.sessionKey = fo.utils.generateUUID();
        }

        fo.runWithUIRefreshLock(function () {
            ctrl.userId = userId;
            ctrl.userNickName = nickName;
        });

        fo.publish('UserLoginComplete', [userId, nickName]);

        //selectComponents will travel the complete tree
        var result = ctrl.model.selectComponents(function (item) { return item.author.matches('Anonymous') });
        result.forEach(function (item) {
            item.author = nickName;
            item.userId = userId;
        });

        if (ctrl.hasUserId) {
            //it is player because the call back is to whom ever is currently the last login
            var syncPayload = workspace.currentModelToPayload();
            hub.invoke("playerInviteSelf", ctrl.userId, syncPayload);
        }

        if (ctrl.mobileClient.mock) return;

        ctrl.processNewFriends(function (friendList) {
            friendList.forEach(function (link) {
                toastr.success('is your new friend', link.friendNickName);
            });
            toastr.info('Thanks for joining us', ctrl.userNickName);
        });
    }

    ctrl.logoutComplete = function (userId, nickName) {
        fo.runWithUIRefreshLock(function () {
            ctrl.userId = '';
            ctrl.userNickName = '';
        });
        fo.publish('UserLogoutComplete', [userId, nickName]);
    }

    ctrl.initForDrawing = function () {
        var page = this.page;
        if (!page) return false;
        page.showGrid = false;
        page.setAnimationsOn(true);
        page.updateStage();
        return true;
    };

    ctrl.refreshModelFromPayload = function (payload, clear) {
        ctrl.updateSessionTraffic(0, payload.length);
        workspace.payloadToCurrentModel(payload);
        workspace.copyDocumentTo(ctrl);
        ctrl.doModelSmash;
        ctrl.doSessionSave;

        //if clear and others are listening we need to add that command to the payload
        var syncPayload = workspace.currentModelToPayload({ clearBeforeSync: clear });
        ctrl.updateSessionTraffic(syncPayload.length, 0);
        if (!ctrl.hasSessionKey) return;
        hub.invoke("authorSendModelToPlayers", ctrl.sessionKey, ctrl.userNickName, ctrl.userId, syncPayload);
    }

    ctrl.tracePropertyLifecycle = function (name, search) {
        var prop = this.getProperty(name, search);
        var self = this;

        prop.onValueDetermined = function (value, formula, owner) {
            var note = self.gcsIndent(prop.asLocalReference() + ' onValueDetermined:' + owner.myName + '  value=' + value)
            fo.trace.info(note);
        }

        prop.onValueSmash = function (value, formula, owner) {
            var note = self.gcsIndent(prop.asLocalReference() + ' onValueSmash:' + owner.myName)
            fo.trace.error(note);
        }
        prop.onValueSet = function (value, formula, owner) {
            var note = self.gcsIndent(prop.asLocalReference() + ' onValueSet:' + owner.myName + '  value=' + value)
            fo.trace.warn(note);
        }
    }

     
    //dataURI is used to store a picture
    ctrl.createNote = function (text, dataUri) {

        var target = this.currentModelTarget();

        var obj = fo.KnowtShare.newNote({
            author: ctrl.userNickName,
            userId: ctrl.userId,
            dataUri: dataUri,
        }, target);

        var shape = undefined;
        var uniqueID = obj.uniqueID;

        if (text) {
            if (text.startsWith('http')) {
                obj.noteUri = text;
            } else {
                obj.noteText = text;
            }
        }

        target.capture(obj, uniqueID);

        var view = this.currentViewTarget();
        if (view) {
            shape = fo.KnowtShare.newNoteShape({
                uniqueID: uniqueID,
                context: obj,
            }, view);

            var page = this.page;
            page.introduceShape(shape, function () {
                shape.setDefaultXY(page.defaultXY());
                view.capture(shape, uniqueID);
            });
        }
        fo.publish('Added', [uniqueID, obj, shape]);

        //do this somewhere else if (!dataUri) ctrl.openEdit(obj);
        return { note: obj, shape: shape };
    };

   
    ctrl.createCollaborationList = function (onComplete) {
        if (this.hasUserId) {
            var client = ctrl.mobileClient;
            var userId = client.currentUser.userId;
            var friendLinkTable = client.getTable('FriendLinks');

            friendLinkTable.where({
                userId: userId
            }).read().done(function (friendLinks) {
                onComplete && onComplete(friendLinks);
            });
        }
    };

    ctrl.processNewFriends = function (onComplete) {
        if (this.hasUserId) {
            var client = ctrl.mobileClient;
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

    ctrl.createFriendInvitation = function () {
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

    ctrl.acceptFriendInvitation = function () {
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

    ctrl.openEdit = function (context) {
        if (!context) return;
        // fo.doCommand('editorDialog', context);
        //mush of this is specific to notes so maybe if belongs 
        //defined in the stencil??

        var myUndo = fo.undo.do('Edited', { id: context.uniqueID, spec: context.getSpec() });

        var dialog = dialogService.createDialog({
            context: context,
            headerTemplate: 'noteHeaderTemplate.html',
            bodyTemplate: 'noteBodyTemplate.html',
            footerTemplate: 'dialogFooter.html',
        }, {
            onInitialize: function ($modalInstance, $scope) {
                if ((context.noteText && context.isTextDifferent) || context.hasNoteUri) {
                    $scope.doMore();
                }
            },
            onOK: function ($modalInstance, context) {
                if (!context.noteUri.startsWith('http') && context.noteText.startsWith('http')) {
                    context.noteUri = context.noteText;
                }
                var keep = fo.undo.verifyKeep(myUndo, { id: context.uniqueID, spec: context.getSpec() });
                if (keep) fo.publish('ModelChanged', [context]);
                $modalInstance.close(context);
            },
            onCancel: function ($modalInstance, context) {
                var keep = fo.undo.verifyKeep(myUndo, { id: context.uniqueID, spec: context.getSpec() });
                if (keep) {
                    fo.undo.unDo(myUndo);
                    fo.publish('ModelChanged', [context]);
                }
                $modalInstance.dismiss(context);
            },
            onExit: function () {
                ctrl.doModelSmash;
            },
            onReady: function () {
            }
        });

        dialog.display();
    };

    ctrl.openNav = function (context) {
        if (!context) return;
        fo.doCommand('navigationDialog', context);
    };

    ctrl.matchesSession = function (sessionKey) {
        return ctrl.hasSessionKey && ctrl.sessionKey.matches(sessionKey);
    };

    ctrl.matchesUser = function (userID) {
        return ctrl.hasUserId && ctrl.userId.matches(userID);
    };

    ctrl.log = function (m, e) {
        var msg = "{0}: {1}".format(m, e)
        if (fo && fo.trace) {
            fo.trace.log(msg);
        }
        else {
            alert(msg);
        }
    };




    //now subscribe to data from drag and drop
    fo.subscribe('urlDropped', function (url) {
        var note = ctrl.createNote(url).note;
        fo.publish('ModelChanged', [note]);
    });

    fo.subscribe('textDropped', function (txt) {
        var note = ctrl.createNote(txt).note;
        fo.publish('ModelChanged', [note]);
    });

    fo.subscribe('textFileDropped', function (payload, name, ext) {
        if (ext && ext.endsWith('.csv')) {
            var json = workspace.payloadToLocalData(name, payload);

            setTimeout(function () {

                var rootPage = ctrl.page;
                var table = fo.KnowtShare.newNote({ headerText: name });
                ctrl.model.capture(table);
                var rootShape = fo.newInstance('tableShape2D', { pinX: 100, pinY: 50, context: table });
                rootShape.localDateSource = name;
                rootShape.localData = json;
                rootShape.setDefaultXY(rootPage.defaultXY());

                var uniqueKeys = fo.filtering.identifyUniqueKeyFields(json);

                rootPage.doUpdate(function () {
                    rootPage.capture(rootShape);

                    var towns = uniqueKeys.Town;
                    fo.utils.forEachValue(towns, function (key, value) {
                        if (!key) return;
                        var item = fo.KnowtShare.newNote(value[0]);
                        table.capture(item);
                        item.imageUri = item.Picture
                        item.headerText = key;
                        var row = fo.KnowtShare.newNoteShape({ context: item });
                        row.localDateSource = name;
                        row.localData = item;
                        rootShape.capture(row);
                    });

                    ctrl.doSessionSave;
                    ctrl.doRepaint;

                });
            }, 200);
        }

        if (ext && ext.endsWith('.knt')) {
            ctrl.doClearFileDropAsync(function () {

                fo.runWithUIRefreshLock(function () {
                    var clear = ctrl.isDocumentEmpty;
                    if (clear) ctrl.doClear;

                    ctrl.refreshModelFromPayload(payload, clear);
                });
                ctrl.doSessionSave;
                ctrl.doRepaint;
            });
        }
    });

    fo.subscribe('imageFileDropped', function (payload, name, ext) {
        var note = ctrl.createNote('', payload).note;
        note.establishManagedProperty('sourceFilename', name);
        fo.publish('ModelChanged', [note]);
    });




    hub && hub.on("clientCountChanged", function (count) {
        fo.runWithUIRefreshLock(function () {
            ctrl.clientCount = count;
        });
    });

    hub && hub.on("receivePing", function (sessionKey, author, authorid) {
        var msg = "{0}{1}{2}".format(sessionKey, author, authorid);
        toastr.info('PING', author);
    });

    hub && hub.on("receiveTweets", function (sessionKey, userid, payload) {

        //now let make some shapes
        var twitter = JSON.parse(payload);
        var tweets = twitter.tweets;
        if (!tweets.length) return;

        var msg = "{0} {1}".format(sessionKey, userid);
        var title = "total:{0} {1}/{2} hour".format(tweets.length, twitter.remainingHits, twitter.hourlyLimit);

        toastr.info(msg, title);

        function findLink(text,user) {
            var links = text ? text.split(' ') : [];
            var results = links.filter(function (link) {
                link = link.trim()
                return link.startsWith('http');
            });
            results.push('http://www.twitter.com/' + user);
            return results[0];
        }

        tweets.map(function (item) {
            var note = ctrl.createNote(item.text).note;
            note.headerText = item.user;
            note.noteUri = findLink(item.text, item.user);
        });


    });

    hub && hub.on("receiveMessage", function (sessionKey, author, authorid, textMessage) {
        if (!ctrl.matchesSession(sessionKey)) {
            return;
        }
        if (ctrl.isPresenterSession) return;

        var title = "{0}{1}".format(author, authorid);
        toastr.info(title, textMessage);
    });

    hub && hub.on("payloadKnowtify", function (sessionKey, userid, payload) {
        try {
            if (!ctrl.matchesSession(sessionKey)) {
                return;
            }
            if (ctrl.isPresenterSession) return;

            if (!payload) return;
            var spec = fo.parsePayload(payload);
            var model = spec.modelSpec;
            var obj = ctrl.createNote().note;
            //obj.headerText = model.headerText;
            //obj.noteText = model.noteText;
            obj.extendWith(model);
            obj.smashProperty('isTextDifferent')

            fo.hub.doCommand('syncModelRequest');
            ctrl.doSessionSave;
        } catch (e) {
            ctrl.log('payloadKnowtify', e);
        }
    });

    hub && hub.on("payloadAdded", function (sessionKey, userid, payload) {
        try {
            if (!ctrl.matchesSession(sessionKey)) {
                return;
            }
            if (ctrl.isPresenterSession) return;
            ctrl.updateSessionTraffic(0, payload.length);
            workspace.payloadToCurrentModel(payload);
            ctrl.doSessionSave;
        } catch (e) {
            ctrl.log('payloadAdded', e);
        }
    });

    hub && hub.on("payloadDeleted", function (sessionKey, userid, payload) {
        try  {
            if (!ctrl.matchesSession(sessionKey)) {
                return;
            }
            if (ctrl.isPresenterSession) return;

            workspace.payloadToCurrentModel(payload);
            ctrl.doSessionSave;
        } catch (e) {
            ctrl.log('payloadDeleted', e);
        }
    });

    hub && hub.on("updateModel", function (sessionKey, userId, payload) {
        //fo.trace && fo.trace.funcTrace(arguments, "updateModel");
        try {
            if (!ctrl.matchesSession(sessionKey)) {
                return;
            }
            if (ctrl.isPresenterSession) return;

            var spec = fo.parsePayload(payload);
            var uniqueID = spec.uniqueID;
            var context = ctrl.model.getSubcomponent(uniqueID,true);
            if(context) {
                fo.runWithUIRefreshLock(function () {
                    fo.utils.extend(context, spec);
                });
                ctrl.doSessionSave;
            }
        } catch (e) {
            ctrl.log('updateModel', e);
        }
    });

    hub && hub.on("repositionShapeTo", function (sessionKey, uniqueID, pinX, pinY, angle) {
        //fo.trace && fo.trace.funcTrace(arguments, "repositionShapeTo");
        try {
            if (!ctrl.matchesSession(sessionKey)) {
                return;
            }
            if (ctrl.isPresenterSession) return;
            //fo.trace && fo.trace.writeLog("received: Acting On repositionShapeTo", uniqueID, pinX, pinY, angle);

            var page = ctrl.page;
            var shape = page.getSubcomponent(uniqueID);
            if (shape) {
                shape.repositionTo(pinX, pinY, angle, function () {
                    if (shape.myParent == page) {
                        page.Subcomponents.sortOn('pinX'); //try to make is so outline reads from left to right
                    }
                });
                ctrl.doSessionSave;
            }

        } catch (e) {
            ctrl.log('repositionShapeTo', e);
        }
    });

    hub && hub.on("parentModelTo", function (sessionKey, uniqueID, oldParentID, newParentID) {
        //fo.trace && fo.trace.funcTrace(arguments, "parentModelTo");
        try {
            if (!ctrl.matchesSession(sessionKey)) {
                return;
            }
            if (ctrl.isPresenterSession) return;
            //fo.trace && fo.trace.writeLog("received: Acting On parentModelTo", uniqueID, oldParentID, newParentID);

            //parent id's can be null so you must assume root model or page
            var rootModel = ctrl.model;

            var model = rootModel.getSubcomponent(uniqueID, true);
            var parent = newParentID ? rootModel.getSubcomponent(newParentID, true) : rootModel;
            if (model && parent) {

                var oldParent = parent.capture(model);

                var page = ctrl.page;
                var shape = page.getSubcomponent(uniqueID, true);
                var group = newParentID ? page.getSubcomponent(newParentID, true) : page;

                group.capture(shape);
                ctrl.doRepaint;

                ctrl.doSessionSave;
            }
        } catch (e) {
            ctrl.log('parentModelTo', e);
        }
    });

    hub && hub.on("receiveInvitation", function (sessionKey, player, playerid, author, authorid) {
        if (ctrl.hasUserId && ctrl.userId.matches(playerid)) {

            popupDialog({
                templateId: 'contentMessageBox',
                caption: 'Collaboration Invite',
                content: function () {
                    return '<p>{0}, has invited you {1} to work together on a drawing.<br/>Do you accept?</p>'.format(author, player);
                },
                onOK: function () {
                    ctrl.sessionKey = sessionKey;
                    hub.invoke("playerRSVP", sessionKey, ctrl.userNickName, ctrl.userId, author, authorid, '');
                },
            });

        }
    });

    hub && hub.on("receiveRSVP", function (sessionKey, player, playerId, author, authorId, payload) {
        if (ctrl.hasUserId && ctrl.userId.matches(authorId)) {

            popupDialog({
                templateId: 'contentMessageBox',
                caption: 'Collaboration RSVP',
                content: function () {
                    return '<p>{0}, has accepted your invitation, {1}.<br/>Press OK to sync workspace</p>'.format(player, author);
                },
                onOK: function () {
                    var sessionKey = ctrl.sessionKey;
                    hub.invoke("authorRequestModelFromPlayer", sessionKey, ctrl.userNickName, ctrl.userId);
                },
            });

        }
    });

    hub && hub.on("sendModelToAuthor", function (sessionKey, author, authorid) {
        if (!ctrl.matchesSession(sessionKey)) {
            return;
        }
        if (ctrl.hasUserId && !ctrl.userId.matches(authorid)) {
            toastr.info('Is being sent your drawing', author);

            var syncPayload = workspace.currentModelToPayload();
            ctrl.updateSessionTraffic(syncPayload.length, 0);
            hub.invoke("playerSendModelToAuthor", sessionKey, ctrl.userNickName, ctrl.hasUserId, syncPayload);
        }
    });

    hub && hub.on("authorReceiveModelFromPlayer", function (sessionKey, player, playerId, payload) {
        if (!ctrl.matchesSession(sessionKey)) {
            return;
        }
        //this should be toast
        toastr.info('Has contributed to your drawing', player);
        ctrl.updateSessionTraffic(0, payload.length);
        workspace.payloadToCurrentModel(payload);
        ctrl.doRepaint;
        toastr.success('is being sent the synchronized drawing', player);

        var syncPayload = workspace.currentModelToPayload();
        ctrl.updateSessionTraffic(syncPayload.length, 0);
        hub.invoke("authorSendModelToPlayers", sessionKey, ctrl.userNickName, ctrl.userId, syncPayload);
    });

    fo.subscribe("SendModel", function (sessionKey, author, authorid, payload) {
        hub && hub.invoke("authorSendModelToPlayers", sessionKey, author, authorid, payload);
    });

    hub && hub.on("playersReceiveSynchronizedModelFromAuthor", function (sessionKey, author, authorid, payload) {
        if (!ctrl.matchesSession(sessionKey)) {
            return;
        }


        function processPayload(data) {
            ctrl.updateSessionTraffic(0, payload.length);
            workspace.specToKnowtShareModelSync(data);
            ctrl.doRepaint;
            //this should be toast
            toastr.success('Has synchronized with your drawing', author);
        }

        var spec = fo.parsePayload(payload);
        var cmd = spec.command;
        if (cmd && cmd.clearBeforeSync) {
            ctrl.doAuthorRequestClearAsync(function () {
                processPayload(spec);
            },
            function () { toastr.warning('Is NOT synchronized with your drawing', author); }
            );           
        } else {
            processPayload(spec);
        }
    });

    hub && hub.on("selfReceiveInviteFromPlayer", function (userId, payload) {
        if (!ctrl.matchesUser(userId) || !ctrl.hasSessionKey) {
            return;
        }

        ctrl.updateSessionTraffic(0, payload.length);
        workspace.payloadToCurrentModel(payload);
        ctrl.doRepaint;
        toastr.success('is being sent the synchronized drawing', ctrl.userNickName);

        var syncPayload = workspace.currentModelToPayload();
        ctrl.updateSessionTraffic(syncPayload.length, 0);
        hub.invoke("selfSendModelToPlayers", ctrl.sessionKey, userId, syncPayload);

    });

    hub && hub.on("playerReceiveSynchronizedModelSelf", function (sessionKey, userId, payload) {
        if (!ctrl.matchesUser(userId) ) {
            return;
        }

        //probably have a session as a result of getting a user iD so...
        //if I a loged in somewhere else, then use the session send to me.
        ctrl.sessionKey = sessionKey;
        ctrl.updateSessionTraffic(0, payload.length);
        workspace.payloadToCurrentModel(payload);
        ctrl.doRepaint;

        //this should be toast
        toastr.success('Has synchronized with your drawing', ctrl.userNickName);

    });

    hub && hub.on("authorReceiveJoinSessionFromPlayer", function (sessionKey, userId, payload) {
        if (!ctrl.matchesSession(sessionKey)) {
            return;
        }

        var shareSpec = {};
        if (!ctrl.isPresenterSession) {
            ctrl.updateSessionTraffic(0, payload.length);
            workspace.payloadToCurrentModel(payload);
            ctrl.doRepaint;
            toastr.success('is being sent the synchronized drawing', ctrl.userNickName);
        }
        else {
            shareSpec = {isViewOnlySession: true}
        }

        var syncPayload = workspace.currentModelToPayload(shareSpec);
        ctrl.updateSessionTraffic(syncPayload.length, 0);
        hub.invoke("authorSendJoinSessionModelToPlayers", ctrl.sessionKey, userId, syncPayload);

    });

    hub && hub.on("playerReceiveJoinSessionModel", function (sessionKey, userId, payload) {
        if (!ctrl.matchesSession(sessionKey)) {
            return;
        }

        ctrl.updateSessionTraffic(0, payload.length);
        var spec = workspace.payloadToCurrentModel(payload);
        var command = spec.command;

        ctrl.doRepaint;

        //this should be toast
        if (command && command.isViewOnlySession) {
            ctrl.isViewOnlySession = true;
            toastr.success('Has synchronized with presentation', ctrl.userNickName);
        }
        else {
            toastr.success('Has synchronized with your notes', ctrl.userNickName);
        }
    });

    fo.subscribe('Knowtify', function (uniqueID, model, geo) {
        ctrl.isDocumentSaved = false;
        ctrl.doSessionSave;
        if (ctrl.hasSessionKey) {
            var test = JSON.stringify(geo);
            var spec = {
                uniqueID: uniqueID,
                modelSpec: model && model.getSpec(),
                geo: geo,
            };
            var payload = fo.stringifyPayload(spec);

            hub && hub.invoke("authorPayloadKnowtify", ctrl.sessionKey, ctrl.userId, payload);
        }
    });



    fo.subscribe('Added', function (uniqueID, model, shape) {
        ctrl.doModelSmash;
        ctrl.isDocumentSaved = false;
        ctrl.doSessionSave;
        if (ctrl.hasSessionKey) {
            var spec = {
                uniqueID: uniqueID,
                model: model ? [model.dehydrate(false)] : model,
                drawing: shape ? [shape.dehydrate(false, {isSelected: false, isActiveTarget: false,})] : [],
            };
            var payload = fo.stringifyPayload(spec);
            ctrl.updateSessionTraffic(payload.length, 0);
            hub && hub.invoke("authorPayloadAdded", ctrl.sessionKey, ctrl.userId, payload);
        }
    });


 
    fo.undo.registerActions('Deleted',
        function (payload) { //do before payload is stored
            ctrl.smashProperty('canDoUnDo');
            //this would be where the object is deleted
            var model = payload.model;
            var shape = payload.shape;

            if (model && model.myParent) {
                payload.modelParent = model.myParent.myName;
                model && model.removeFromModel();
            }

            if (shape && shape.myParent) {
                payload.shapeParent = shape.myParent.myName;
                payload.pinX = shape.pinX;
                payload.pinY = shape.pinY;
                payload.index = shape.myIndex();
                shape && shape.removeFromModel();
            }
            return payload;
        },
        function (payload) { //process undo because noone else will
            //if stringifed it should be parsed
            var modelParent = payload.modelParent;
            var shapeParent = payload.shapeParent;

            var rootModel = ctrl.model;
            var rootPage = ctrl.page;

            var model = payload.model;
            if (modelParent) {
                var parent = rootModel.getSubcomponent(modelParent, true);
                parent.captureSubcomponent(model);
            }

            var shape = payload.shape;
            if (shapeParent) {
                var parent = rootPage.getSubcomponent(shapeParent, true);
                parent.captureSubcomponent(shape);
                if (parent == rootPage) {
                    shape.pinX = payload.pinX;
                    shape.pinY = payload.pinY;
                }

                rootPage.introduceShape(shape, function () { rootPage.render(); });
            }

            //tell others that the note is back
            fo.publish('Added', [model.uniqueID, model, shape]);
            return payload;
        }
    );


    fo.subscribe('Deleted', function (uniqueID, model, shape) {
        ctrl.doModelSmash;
        ctrl.isDocumentSaved = false;
        ctrl.doSessionSave;
        if (ctrl.hasSessionKey) {
            var spec = {
                uniqueID: uniqueID,
                model: model ? [model.dehydrate(false)] : model,
                drawing: shape ? [shape.dehydrate(false, {isSelected: false, isActiveTarget: false,})] : [],
            };
            var payload = fo.stringifyPayload(spec);
            ctrl.updateSessionTraffic(payload.length, 0);
            hub.invoke("authorPayloadDeleted", ctrl.sessionKey, ctrl.userId, payload);
        }
    });


    var CTRLKEY = false;
    var ALTKEY = false;
    var SHIFTKEY = false;

    function doKeyDown(evt) {
        CTRLKEY = evt.ctrlKey;
        ALTKEY = evt.altKey;
        SHIFTKEY = evt.shiftKey;
    }

    function doKeyUp(evt) {
        CTRLKEY = false;
        ALTKEY = false;
        SHIFTKEY = false;
    }

    //http://jsfiddle.net/SVArR/
    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('keyup', doKeyUp, true);

    fo.subscribe('doubleClick', function (shape, context, action) {
        if (context.hasNoteUri && CTRLKEY) {
            window.open(context.noteUri, "_blank");
        }
        else {
            ctrl.openEdit(context);
        }
        shape.doUpdate();
    });

    fo.subscribe('OpenEdit', function (shape, context) {
        ctrl.openEdit(context);
        ctrl.doModelSmash;
    });

    fo.subscribe('OpenNav', function (shape, context) {
        if (context.hasNoteUri) {
            window.open(context.noteUri, "_blank");
        }
    });
 
    fo.subscribe('ShapeMoved', function (uniqueID, model, shape) {
        if (shape.myParent == ctrl.page) {
            ctrl.page.Subcomponents.sortOn('pinX'); //try to make is so outline reads from left to right
        }

        //fo.trace && fo.trace.writeLog("shapeMoved: ", uniqueID, shape.pinX, shape.pinY, shape.angle);
        ctrl.doSessionSave;
        if (ctrl.hasSessionKey) {
            var pinX = shape.pinX;
            var pinY = shape.pinY;
            var angle = shape.angle ? shape.angle : 0.0;
            //fo.trace && fo.trace.writeLog("broadcast: authorMovedShapeTo", uniqueID, pinX, pinY, angle);
            hub && hub.invoke("authorMovedShapeTo", ctrl.sessionKey, uniqueID, pinX, pinY, angle);
        }
    });

    //fo.undo.do('Edited', { id: context.uniqueID, spec: context.getSpec() })

    fo.undo.registerActions('Edited',
        function (payload) { //do before payload is stored
            ctrl.smashProperty('canDoUnDo');
            //this would be where you stringify it;
            //but for now just hang on to the objects, they should not be
            //connected to their parents at this point
            var id = payload.id;
            var spec = payload.spec;

            return payload;
        },
        function (payload) { //process undo because noone else will

            var id = payload.id;
            var spec = payload.spec;

            var model = ctrl.model;

            var note = model.getSubcomponent(id, true);
            for (var key in spec) {
                if (spec[key] != note[key]) {
                    note[key] = spec[key];
                }
            }
            ctrl.page.render();

            //tell other users the note has changed
            fo.publish('ModelChanged', [note]);

            return payload;
        },
        function (newPayload, oldPayload) {
            //used to verify this undo should be kept.
            if (newPayload.id != oldPayload.id) return true;

            for (var key in newPayload.spec) {
                if (newPayload.spec[key] != oldPayload.spec[key]) return true;
            }

            return false;
        }
    );


    fo.subscribe('ModelChanged', function (model) {
        ctrl.doModelSmash;
        ctrl.isDocumentSaved = false;
        ctrl.doSessionSave;
        if (ctrl.hasSessionKey && model) {
            var spec = model.dehydrate(false);
            var payload = fo.stringifyPayload(spec);
            ctrl.updateSessionTraffic(payload.length, 0);
            hub && hub.invoke("authorChangedModel", ctrl.sessionKey, ctrl.userid, payload);
        };
    });

    //add code to undo reparenting here...
    fo.undo.registerActions('ShapeReparented',
        function (payload) {
            ctrl.smashProperty('canDoUnDo');
            //remember the shape is reparented, now you must do the model
            // var model = rootModel.getSubcomponent(payload.shape.myName, true);
            var child = payload.child;
            var newParent = payload.newParent;
            var loc = payload.loc;

            var index = loc.index;

            var model = workspace.rootModel;
            var modelParent = model.getSubcomponent(newParent.myName, true); //var parentId = found.myName;
            modelParent = modelParent ? modelParent : model;

            var modelChild = model.getSubcomponent(child.myName, true);  //var childId = shape.myName;
            modelParent.captureSubcomponent(modelChild);


            return payload;
        },
        function (payload) {
            //ok now you need to undo the data model and well as the shapes...
            var child = payload.child;
            var oldParent = payload.oldParent;
            var newParent = payload.newParent;


            var model = workspace.rootModel;
            var modelParent = model.getSubcomponent(oldParent.myName, true); //var parentId = found.myName;
            modelParent = modelParent ? modelParent : model;

            var loc = payload.loc;
            var index = loc.index ? loc.index : modelParent.Subcomponents.count - 1;

            var modelChild = model.getSubcomponent(child.myName, true);  //var childId = shape.myName;
            modelParent.captureInsertSubcomponent(index, modelChild);
            //modelParent.captureSubcomponent(modelChild);


            //now fix the presentation 
            var page = workspace.rootPage;
            var parent = page.getSubcomponent(oldParent.myName, true);
            parent.captureInsertSubcomponent(index,child);
            //parent.captureSubcomponent(child);

            if (parent == page) {
                child.pinX = loc.pinX;
                child.pinY = loc.pinY;
            }
            page.forceLayout();

            //tell other users the note has changed (changed back that is)
            fo.publish('Reparented', [child.uniqueID, newParent.uniqueID, oldParent.uniqueID]);

            return payload;
        }
    );

    fo.subscribe('ShapeReparented', function (child, oldParent, newParent, loc) {

        //remember the shape is reparented, now you must do the model
        var payload = { child: child, oldParent: oldParent, newParent: newParent, loc: loc };
        var undo = fo.undo.do('ShapeReparented', payload);  //

        fo.publish('Reparented', [child.uniqueID, oldParent.uniqueID, newParent.uniqueID])
    });

    fo.subscribe('Reparented', function (childID, oldParentID, newParentID) {
        ctrl.doModelSmash;
        ctrl.isDocumentSaved = false;
        ctrl.doSessionSave;
        if (ctrl.hasSessionKey) {
            hub && hub.invoke("authorReparentModelTo", ctrl.sessionKey, childID, oldParentID, newParentID);
        };
    });

    return ctrl;
};
