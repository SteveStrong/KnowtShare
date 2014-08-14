/// <reference path="../../FoundryJS/Apprentice/FileSaver.min.js" />

(function (app, fo, ws, undefined) {
 
    ws.Workspace.prototype.specToKnowtShareModelSync = function (spec) {

        function modifyModelType(item) {
            var type = item.myType || '';
            var result = type.contains('note') ? 'KnowtShare::note' : type;
            return result;
        }

        function modifyShapeType(item) {
            var type = item.myType || '';
            var result = type.contains('note') ? 'KnowtShare::noteShape' : 'KnowtShare::noteShape';
            return result;
        }
        return this.specToModelSync(spec, modifyModelType, modifyShapeType);
    }

    ws.Workspace.prototype.payloadToCurrentModel = function (payload) {
        if (!payload) return;

        var spec = fo.parsePayload(payload);
        return this.specToKnowtShareModelSync(spec);
    };

 

    var utils = fo.utils;

    var noteSpec = {
        author: '',
        userId: '',
        noteUri: '',
        hasNoteUri: function () {
            return this.noteUri && this.noteUri.startsWith('http');
        },
        hasImageUri: function () {
            if (!this.hasNoteUri) return false;
            return this.noteUri.endsWith('jpg') || this.noteUri.endsWith('png');
        },
        imageUri: function() {
            return this.hasImageUri && this.noteUri;
        },
        noteText: '',
        headerText:'',
        isTextDifferent: function () {
            if (this.headerText == this.noteText) return false;
            if (!this.headerText || !this.noteText) return false;
            return !this.headerText.matches(this.noteText);
        },
    };

    fo.defineType(app.stencilNS('note'), noteSpec, function (properties, subcomponents, parent) {

        var customSpec = fo.utils.union(properties, {
            lastModified: properties.lastModified ? properties.lastModified : new Date(),
            uniqueID: properties.uniqueID ? properties.uniqueID : utils.generateUUID(),
        });

        var obj = fo.makeComponent(customSpec, subcomponents, parent);
        obj.myName = obj.uniqueID;

        obj.makePartOfSpec('headerText');
        obj.makePartOfSpec('noteText');

        if (obj.noteText && !obj.headerText) {
            obj.headerText = obj.noteText;
            obj.noteText = '';
        }

        return obj;
    });


    fo.defineType(app.stencilNS('noteShape'), {}, function (properties, subcomponents, parent) {
        var customSpec = fo.utils.union(properties, {
            lastModified: properties.lastModified ? properties.lastModified : new Date(),
            uniqueID: properties.uniqueID ? properties.uniqueID : utils.generateUUID(),
        });

        var space = fo.myWorkspace(parent);

        if (!customSpec.context && space) {
            customSpec.context = space.modelDictionary[customSpec.uniqueID];
        }



        var obj = fo.newSuper('noteShape2D', customSpec, subcomponents, parent);

        if (obj.context) {
            obj.context.addOnRefresh("headerText", function (prop, owner) {
                obj.headerText;
                obj.doRepaint();
            });
            obj.context.addOnRefresh("noteText", function (prop, owner) {
                obj.noteText;
                obj._height.smash();
                obj.doRepaint();
            });
        }


        //var type2 = obj.myType;

        //for now lets assume that just note do this,  but we should just listen to
        //On Glue events if possable
        //var spec = {
        //    annotations: function () {
        //        var results = this.map(function (item) {
        //            var found = item.target.otherSide(item.source);
        //            return found;
        //        });
        //        return results;
        //    }
        //}
        //obj.establishCollection("Connections", [], spec); //we know that we need a connection for glue

        //if (parent && parent.componentDepth() == 0) {
        //    utils.extend(obj, loc);
        //}
        return obj;
    });

    fo.defineType(app.stencilNS('annotation'), noteSpec, function (properties, subcomponents, parent) {
        var customSpec = fo.utils.union(properties, {
            lastModified: new Date(),
            uniqueID: properties.uniqueID ? properties.uniqueID : utils.generateUUID(),
        });


        var obj = fo.construct('Component', customSpec, subcomponents, parent);
        obj.makePartOfSpec('headerText');

        return obj;
    });

    fo.defineType(app.stencilNS('annotationShape'), {}, function (properties, subcomponents, parent) {
        var spec = fo.utils.union(properties,
            {
                fillColor: '#C1FCA9',
                textColor: '#000000',
                canGroupItems: function () { return false; },
                canBeGrouped: function () { return false; },
            });

        //you need to use default values of pinX and PinY for the latest layout
        var loc = { pinX: spec.pinX, pinY: spec.pinY }
        delete spec.pinX;
        delete spec.pinY;

        var obj = fo.construct('Shape2D', spec, subcomponents, parent);
        var name = obj.uniqueID ? obj.uniqueID : obj.myName;

        //if (parent && parent.componentDepth() == 0) {
        //    utils.extend(obj, loc);
        //}
        return obj;
    });

    fo.defineType(app.stencilNS('linkShape'), {}, function (properties, subcomponents, parent) {
        var obj = fo.construct('Shape1D', properties, subcomponents, parent);
        return obj;
    });


}(knowtApp, Foundry, Foundry.workspace));
