
(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('menuNotes'), {

        rootModel: fo.fromParent,
        factory: fo.fromParent,
        userNickName: fo.fromParent,
        userId: fo.fromParent,
        dialogService: fo.fromParent,

        hasSelection: fo.fromParent,
        currentNote: fo.fromParent,

        doAddNote: function () {
            var self = this;
            var note = this.factory.newNote({
                author: function () { return self.userNickName },
                userId: this.userId,
                //headerText: function () {
                //    var date = new Date();
                //    return date.toString()
                //},
                //noteText: function () {
                //    return this.author +  ' the time is: ' + this.headerText;
                //}
            });

            this.rootModel.captureInsertSubcomponent(0, note);
            fo.publish('noteAdded', [note]);
        },
        canOpenSelected: function () {
            return this.hasSelection;
        },
        doOpenSelected: function () {
            fo.publish('info', ['doOpenSelected']);
            this.openEdit(this.currentNote);
        },
        doDuplicateSelected: function () {
            fo.publish('info', ['doDuplicateSelected']);
        },
        canDoDelete: function() {
            return this.hasSelection;
        },
        doConfirmDelete: function () {
            this.doDeleteSelected;
            fo.publish('info', ['doConfirmDelete']);
        },
        doDeleteSelected: function () {
            if (this.currentNote) {
                //first move this shape to page before we delete
                //if (shape.myParent != page) {
                //    this.doReparentSelected;
                //}
                this.rootModel.deleteNote(this.currentNote);

            }
        },
        doConfirmClear: function () {
            fo.publish('info', ['doConfirmClear']);
            this.doClearAsync();
        },
        doUnDo: function () {
            fo.publish('info', ['doUnDo']);
        },
        canDoUnDo: function () {
            return true;
        },
    }, create);

    function create(properties, subcomponents, parent) {

        var obj = fo.makeComponent(properties, subcomponents, parent);

        obj.doClearAsync = function (onComplete) {
            //do not run if page is empty
            if (obj.isDocumentEmpty) {
                obj.doClear; //this make sure we are in a known state
                onComplete && onComplete();
                return;
            }

            obj.dialogService.doPopupDialog({
                headerTemplate: 'ClearAllHeader.html',
                bodyTemplate: 'ClearAllBody.html',
                footerTemplate: 'ClearAllFooter.html',
            },
            {
                onExit: onComplete,
            },
            {
                ClearNotes: function () {
                    obj.doCommand('doClear');
                    obj.dialogService.doCloseDialog();
                },
                SaveDocumentFirst: function () {
                    obj.doCommand('doSaveFilePicker');
                    obj.dialogService.doCloseDialog();
                },
            });
        };

        obj.openEdit = function (context) {
            if (!context) return;
            //mush of this is specific to notes so maybe if belongs 
            //defined in the stencil??

            var myUndo = fo.undo.do('Edited', { id: context.uniqueID, spec: context.getSpec() });

            var dialog = obj.dialogService.createDialog({
                context: context,
                //headerTemplate: 'noteHeaderTemplate.html',
                //bodyTemplate: 'noteBodyTemplate.html',
                //footerTemplate: 'dialogFooter.html',
            },
            {
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
                    obj.doModelSmash;
                },
                onReady: function () {
                }
            });

            dialog.display();
        };

    //    obj.doDeleteAsync = function (onComplete) {
    //        //do not run if page is empty
    //        if (obj.isDocumentEmpty) {
    //            onComplete && onComplete();
    //            return;
    //        }

    //        obj.dialogService.doPopupDialog({
    //            headerTemplate: 'ConfirnDeleteHeader.html',
    //            bodyTemplate: 'ConfirnDeleteBody.html',
    //            footerTemplate: 'ConfirnDeleteFooter.html',
    //        },
    //        {
    //            onExit: onComplete,
    //        },
    //        {
    //            SaveAttached: function () {
    //                obj.doCommand('doDeleteSelectedSaveSubcomponents');
    //                obj.dialogService.doCloseDialog();
    //            },
    //            DeleteAll: function () {
    //                obj.doCommand('doDeleteSelected');
    //                obj.dialogService.doCloseDialog();
    //            },
        //        });   
        return obj;
    };

}(knowtApp, Foundry));


////define menuNotes controller and inject the workspace, dialog and logger
(function (app, fo, undefined) {

    app.controller('menuNotes', function ($scope, $log, dialogService, workspaceService) {
        var vm = fo[app.name].newMenuNotes();
        return vm;
    });

}(knowtApp, Foundry));