/*
    Foundry.modelManager.core.js part of the FoundryJS project
    Copyright (C) 2012 Steve Strong  http://foundryjs.azurewebsites.net/

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


var Foundry = Foundry || {};
Foundry.canvas = Foundry.canvas || {};
Foundry.workspace = Foundry.workspace || {};
Foundry.ws = Foundry.workspace;

//the goal of this module is to manage the API for the resources
//that an app might use like saving and recovering models from 
//local storage and the cloud


(function (ns, fo, cv, undefined) {

    var utils = fo.utils;


    var workspaceSpec = {
        isVisible: true,
        rootModel: function () {
        },
        rootPage: function () {
        },

        localStorageKey: 'FoundryLocal',
        userNickName: function () {
            return 'Anonymous';
        },
        userId: function () {
            return 'unknown';
        },
        hasUserId: function () {
            return !this.userId.matches('unknown');
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
        sessionUrl: '',
        sessionTitle: '',
        documentName: '',
        documentExt:'',
        isDocumentSaved: false,
        documentTitle: function () {
            var result = this.documentName + this.documentExt;
            if (result && !this.isDocumentSaved) {
                result += "*";
            }
            return result;
        },
        title: function () { return this.rootModel ? this.rootModel.title : undefined },
        subTitle: function () { return this.rootModel ? this.rootModel.subTitle : undefined },

        clientCount: '#',
        traffic: '0',

        //knowtshareSessionUrl: function () {
        //    var loc = window.location;
        //    var url = "{0}//{1}/Home/KnowtShare/{2}".format(loc.protocol, loc.host, this.sessionKey);
        //    return url; // "http://knowtsignal.azurewebsites.net/KnowtShare/{0}".format(this.sessionKey);
        //},

    }

    var Workspace = function (properties, subcomponents, parent) {
        fo.exportTypes();

        this.base = fo.Component;
        this.base(utils.union(workspaceSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'Workspace';
        return this;
    };

    Workspace.prototype = (function () {
        var anonymous = function () { this.constructor = Workspace; };
        anonymous.prototype = fo.Component.prototype;
        return new anonymous();
    })();

    ns.Workspace = Workspace;
    utils.isaWorkspace = function (obj) {
        return obj instanceof Workspace ? true : false;
    };

    fo.myWorkspace = function (obj) {
        var type = obj && obj.myType;
        if (utils.isaWorkspace(obj)) return obj;
        if (obj && obj.myParent) return fo.myWorkspace(obj.myParent);
    }

    //thiis is used to move document data between contoler and workspace
    var copyDocumentMask = {
        documentName: true,
        documentExt: true,
        isDocumentSaved: true,
    }


    var copySessionMask = {
        sessionKey: true,
        sessionUrl: true,
        userNickName: true,
        userId: true,
    }

    function copyUsingMask(from, to, mask) {
        if (!from || !to) return;
        for (var key in mask) {
            if (mask[key]) {
                to[key] = from[key];
            }
        }
        return to;
    };

    
    Workspace.prototype.currentSessionSpec = function () {
        var spec = {};
        copyUsingMask(this, spec, copySessionMask);
        return spec;
    }
    Workspace.prototype.currentDocumentSpec = function () {
        var spec = {};
        copyUsingMask(this, spec, copyDocumentMask);
        return spec;
    }

    Workspace.prototype.attachDocumentDetails = function (details) {

        var document = fo.utils.union({
            version: fo.version,
            title: this.title,
            subTitle: this.subTitle,
            lastModified: new Date(),
        }, details);

        this.copyDocumentSpecTo(document);

        return document;
    };

    Workspace.prototype.defaultNS = function (name) {
        var id = fo.getNamespaceKey(this.myName, name);
        return id;
    }

    Workspace.prototype.stencilNS = function (name) {
        var id = fo.getNamespaceKey(this.myName, name);
        return id;
    }

    Workspace.prototype.copyDocumentSpecTo = function (target){
        return copyUsingMask(this, target, copyDocumentMask);
    }
    Workspace.prototype.copyDocumentSpecFrom = function (source) {
        return copyUsingMask(source, this, copyDocumentMask);
    }

    Workspace.prototype.clearDocumentSpec = function () {
        for (var key in copyDocumentMask) {
            if (copyDocumentMask[key]) {
                    this[key] = '';
                }
            }
            return this;
    }

    Workspace.prototype.copySessionSpecTo = function (target) {
        return copyUsingMask(this, target, copySessionMask);
    }
    Workspace.prototype.copySessionSpecFrom = function (source) {
        return copyUsingMask(source, this, copySessionMask);
    }

    Workspace.prototype.clearSessionSpec = function () {
        for (var key in copySessionMask) {
            if (copySessionMask[key]) {
                this[key] = '';
            }
        }
        return this;
    }


    Workspace.prototype.clear = function () {
        var self = this;
        self.rootModel.removeAllSubcomponents();
        if (self.rootPage) {
            self.rootPage.selectShape(undefined, true);
            self.rootPage.removeAllSubcomponents();
            self.rootPage.updateStage(true);
        }
        delete self.localData;
        fo.publish('WorkspaceClear', [self])

        //fo.digestLock && fo.digestLock(self.rootPage, function () {
        //    self.rootPage.clear();
        //    self.rootPage.updateStage(true);
        //});
    }

    Workspace.prototype.payloadSaveAs = function (payload, name, ext, onComplete) {
        //this depends on the function saveAs exisitng
        if (!saveAs && payload) return false;
        var data = utils.isString(payload) ? payload : fo.stringifyPayload(payload);
        fo.writeTextFileAsync(data, name, ext, onComplete);
        return true;
    }

    //this assumes the use just want to save the current file maybe with an new extension name
    Workspace.prototype.userSaveFileDialog = function (onComplete, defaultExt, defaultValue) {
        fo.publish('info', ['Workspace.userSaveFileDialog', 'method missing']);
    }

    Workspace.prototype.userOpenImageDialog = function (onComplete) {
        return this.userOpenFileDialog(onComplete, 'image/*');
    }

    Workspace.prototype.userOpenFileDialog = function (onComplete, defaultExt, defaultValue) {

        //http://stackoverflow.com/questions/181214/file-input-accept-attribute-is-it-useful
        //accept='image/*|audio/*|video/*'
        var accept = defaultExt || '.knt,.csv';

        var fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('accept', accept);
        fileSelector.setAttribute('value', defaultValue);
        fileSelector.setAttribute('style', 'visibility: hidden; width: 0px; height: 0px');
        //fileSelector.setAttribute('multiple', 'multiple');
        document.body.appendChild(fileSelector);
        fileSelector.click();
        var extensionExtract = /\.[0-9a-z]+$/i;

        var files = fileSelector.files;
        var count = files.length;
        var file = count > 0 && files[0];
        var ext = file ? file.name.match(extensionExtract) : [''];
        ext = ext[0];
        document.body.removeChild(fileSelector);

        if (file && file.type.startsWith('image')) {
            fo.readImageFileAsync(file, ext, onComplete);
        }
        else if (file && (ext.matches('.knt') || ext.matches('.csv') || ext.matches('.json') || ext.matches('.txt'))) {
            fo.readTextFileAsync(file, ext, onComplete);
        }
    }

    Workspace.prototype.matchesSession = function (sessionKey) {
        var result = this.hasSessionKey && this.sessionKey.matches(sessionKey);
        return result;
    }

    Workspace.prototype.matchesUser = function (userID) {
        var result = this.hasUserId && this.userId.matches(userID);
        return result;
    }

    Workspace.prototype.digestLock = function (callback, onComplete) {
        var page = this.rootPage;
        fo.digestLock(page, callback, onComplete);
    }

    Workspace.prototype.specToModelSync = function (spec, modifyModelTypeFn, modifyShapeTypeFn) {
        if (!spec) return;

        this.localData = fo.utils.mixin(this.localData, spec.localData);
        var rootModel = this.rootModel;
        var rootPage = this.rootPage;

        var space = this;
        space.modelDictionary = space.modelDictionary || {};
        space.pageDictionary = space.pageDictionary || {};


        //temp for this version;
        fo.modelDictionary = space.modelDictionary;
        fo.pageDictionary = space.pageDictionary;


        try {
            fo.runWithUIRefreshLock(function () {
                if (spec.document) {
                    space.copyDocumentSpecFrom(spec.document);
                }

                rootModel.rehydrate(rootModel, spec.model, space.modelDictionary, modifyModelTypeFn);

                if (rootPage) {
                    rootPage.rehydrate(rootPage, spec.drawing, space.pageDictionary, modifyShapeTypeFn);
                }

            });
        } catch (e) {
            throw new Error('specToModelSync: ' + e.message)
        }

        return {
            command: spec.command,
            document: spec.document,
        }
    }


    Workspace.prototype.saveSession = function (syncPayload, sessionName, onComplete) {
        var self = this;
        self.sessionStorageDate = Date.now();
        var key = self.documentName || sessionName || this.localStorageKey;
        //var syncPayload = self.currentModelAsPayload({}, true, true);
        if (localStorage) {
            localStorage.setItem('currentSession', key);
            localStorage.setItem(key, key ? syncPayload : '');
        }
        if (localStorage) {
            localStorage.setItem(sessionName || this.localStorageKey, syncPayload);
        }
        onComplete && onComplete();
        fo.publish('workspaceSessionSaved', [self])
    }

    Workspace.prototype.restoreSession = function (sessionName, syncToModelFn) {
        var self = this;
        var syncPayload;
        if (sessionStorage) {
            if (localStorage) {
                var key = localStorage.getItem('currentSession');
                syncPayload = key ? localStorage.getItem(key) : undefined;

                //uncomment this code to flush the local store
                //localStorage.setItem(key, '');
                //localStorage.setItem('currentSession', '');
                //localStorage.setItem(this.localStorageKey, syncPayload);
            }
            if (localStorage && !syncPayload) {
                syncPayload = localStorage.getItem(sessionName || this.localStorageKey);
            }

            try {
                var spec = syncToModelFn && syncToModelFn(syncPayload);

                //SRS write code to also update the titles from the last state,
                //olny using the session storage if local storage is not found
                if (spec && spec.document) {
                    space.copyDocumentSpecFrom(spec.document);

                    self.sessionStorageDate = spec.document.sessionStorageDate;
                }
            }
            catch (ex) {
                localStorage.setItem('currentSession', '');
            };
            fo.publish('workspaceSessionRestored', [self])
        }
        return syncPayload;
    }


    Workspace.prototype.payloadToCurrentModel = function (payload) {
        if (!payload) return;

        var spec = fo.parsePayload(payload);
        return this.specToModelSync(spec);
    };

    Workspace.prototype.currentModelToPayload = function (command, persist, keepSelection) {
        var spec = this.modelToSpec(command, persist, keepSelection);
        //now add the localData
        spec.localData = this.localData || {};

        return fo.stringifyPayload(spec);
    };

    Workspace.prototype.currentModelTarget = function(type) {
        var found = this.rootPage && this.rootPage.selectedContext();
        //found = !found ? found : found.findParentWhere(function (item) {
        //    return item.isOfType(type || 'note')
        //});
        return found ? found : this.rootModel;
    }

    Workspace.prototype.currentViewTarget = function (type) {
        var found = this.rootPage && this.rootPage.selectedShape();
        //found = !found ? found : found.findParentWhere(function (item) {
        //    return item.isOfType(type || 'note')
        //});

        return found ? found : this.rootPage;
    }


    ns.makeWorkspace = function (properties, subcomponents, parent) {
        var space = new Workspace(properties, subcomponents, parent);
        return space;
    };

    ns.makeModelWorkspace = function (name, properties, modelSpec) {

        //setup root model
        var defaultTemplate = {
            myName: name,
            spec: modelSpec,
            Subcomponents: {},
        };


        var space = new Workspace(properties);
        space.myName = name + 'Session';

        if (!space.rootModel) {
            space.rootModel = fo.makeModel(defaultTemplate, space);
        }


        space.modelToSpec = function (command, persist) {

            var model = !this.rootModel ? [] : this.rootModel.Subcomponents.map(function (item) {
                var result = item.dehydrate(true);
                return result;
            });

            var spec = {
                command: command,
                model: model,
                localData: this.localData,
            };

            if (persist) {
                spec.document = space.attachDocumentDetails();
            }

            return spec;
        };

        return space;
    };

    ns.makeNoteWorkspace = function (name, properties, modelSpec, enableDragDrop) {

        var spaceSpec = {
            localStorageKey:  name + 'Session',         
        }
        var canvasId = properties && properties.canvasId;
        var panZoomCanvasId = properties && properties.panZoomCanvasId;
        var pipId = properties && properties.pipId;

        var space = ns.makeModelWorkspace(name, utils.union(spaceSpec, properties), modelSpec);

        if (enableDragDrop) {
            fo.enableFileDragAndDrop(canvasId);
        }

        //create drawing;
        space.drawing = cv.makeDrawing(canvasId, panZoomCanvasId, pipId, properties);
        space.drawing.myParent = space;


        //setup root page
        space.rootPage = space.drawing.page;
        space.rootPage.setAnimationsOn(true);
        space.rootPage.updateStage();

        space.saveCanvasAsBlob = function (name, ext) {
            var canvas = space.rootPage.canvas;
            //var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            //var blob = new Blob([image]);
            //fo.writeBlobFile(blob, name, ext);
            ////Canvas2Image.saveAsPNG(canvas);
            canvas.toBlob(function (blob) {
                fo.writeBlobFile(blob, name, ext);
            });

        }


        space.doSessionSave = function () {
            var self = this;
            var payload = self.currentModelToPayload({}, true, true);
            self.saveSession(payload, self.localStorageKey, function () {
            });
        };

        space.doSessionRestore = function () {
            var self = this;
            self.restoreSession(self.localStorageKey, function (payload) {
                self.clear();
                self.digestLock(function () {
                    self.payloadToCurrentModel(payload);
                });
            });
        };

        space.payloadToLocalData = function (name, payloadCSV) {
            if (!payloadCSV) return;

            var self = this;
            self.localData = self.localData || {};

            var payload = fo.convert.csvToJson(payloadCSV);
            var json = fo.parsePayload(payload);
            self.localData[name] = json;
            return json;
        };



        space.modelToSpec = function (command, persist, keepSelection) {

            if (this.rootPage && !keepSelection) {
                this.rootPage.selectShape(undefined, true);
                this.rootPage.selectDropTarget(undefined, true);
            }

            var model = !this.rootModel ? [] : this.rootModel.Subcomponents.map(function (item) {
                var result = item.dehydrate(true);
                return result;
            });

            var page = !this.rootPage ? [] : this.rootPage.Subcomponents.map(function (item) {
                var result = item.dehydrate(true, { isSelected: false, isActiveTarget: false, });
                return result;
            });

            var spec = {
                command: command,
                model: model,
                drawing: page,
                localData: this.localData,
            };

            if (persist) {
                spec.document = space.attachDocumentDetails();
            }

            return spec;
        };


        return space;
    };





//        doToDoApp: function () {
//            fo.hub.openWindow('ToDo.html');
//            var self = this;
//            fo.hub.setCrossDomain(false);
//            fo.hub.registerCommandResponse({
//                syncModelRequest: function (payload) {
//                    var syncPayload = self.currentModelAsPayload();
//                    fo.hub.sendCommand('syncModelResponse', syncPayload);
//                },
//                createNote: function (obj) {
//                    var text = obj.text;

//                    var note = self.createNote(text).note;
//                    fo.publish('ModelChanged', [note]);

//                }
//            });
//        },
//        doRecommendationApp: function () {
//            fo.hub.openWindow('Recommendation.html');
//            var self = this;
//            fo.hub.setCrossDomain(false);
//            fo.hub.registerCommandResponse({
//                syncModelRequest: function (payload) {
//                    var syncPayload = self.currentModelAsPayload();
//                    fo.hub.sendCommand('syncModelResponse', syncPayload);
//                },
//            });
//        },



	
}(Foundry.workspace, Foundry, Foundry.canvas));