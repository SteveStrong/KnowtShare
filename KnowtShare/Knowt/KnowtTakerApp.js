
var knowtApp = angular.module('knowtTakerApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);
knowtApp.header = { title: 'Knowt Taker', help: 'knowtshareHelp.html' };

//initial document and run implemented...
(function (app, fo, undefined) {
    app.defaultNS = function (name) {
        var id = fo.getNamespaceKey(this.name, name);
        return id;
    }

    app.stencilNS = function (name) {
        var id = fo.getNamespaceKey("KnowtShare", name);
        return id;
    }



}(knowtApp, Foundry));


(function (app, fo, undefined) {

    app.defaultNS = function (name) {
        var id = fo.getNamespaceKey(this.name, name);
        return id;
    }

    app.run(function ($log, dialogService) {


        //http://codeseven.github.io/toastr/demo.html
        toastr.options = {
            positionClass: "toast-bottom-left",
        }

        fo.subscribe('info', function (a, b) {
            toastr.info(a, b);
        });

        fo.subscribe('warning', function (a, b) {
            toastr.warning(a, b);
        });

        fo.subscribe('error', function (a, b) {
            toastr.error(a, b);
        });

        fo.subscribe('success', function (a, b) {
            toastr.success(a, b);
        });

        //load templares for tialogs and shapes...
        fo.utils.loadTemplate('KnowtView.Dialogs.html');
        fo.utils.loadTemplate('KnowtView.NoteTemplate.html');

        fo.exportTypes();

    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

    //http://odetocode.com/blogs/scott/archive/2013/06/06/decorating-angularjs-services.aspx
    //http://www.bennadel.com/blog/2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm

    //inspect the arguments passed into collect the session key 
    var args = fo.utils.queryStringToObject(window.location.toString(), '?');

    app.service('workspaceService', ['$log', function ($log) {

        var space;
        var defaultSession = args && args.session;


        this.workSpace = function (properties, modelTemplate) {
            if (space) return space;

            var spec = {
                title: "KnowtTaker",
                subTitle: "take and save notes",
                userId: "123456780",
                userNickName: 'sedona',
            }

            space = fo.ws.makeNoteWorkspace("KnowtShare", fo.utils.union(spec, properties), modelTemplate);

            space.isDocumentEmpty = function () {
                //var total = (this.rootPage.Subcomponents.count * this.rootModel.Subcomponents.count) / 2;
                var isEmpty = this.rootPage.Subcomponents.isEmpty() && this.rootModel.Subcomponents.isEmpty();
                return isEmpty;
            };



            if (!defaultSession) {
                setTimeout(function () {
                    space.doSessionRestore();
                }, 100);
            }

            return space;
        };

        this.activeWorkSpace = function () {
            if (!space) throw new Error('Workspace is not initialized');
            return space;
        }

    }]);

}(knowtApp, Foundry));

//now create the main controller
(function (app, fo, undefined) {

    app.controller('workSpace', function ($scope, $log, workspaceService, dialogService) {


        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };


        var space = workspaceService.workSpace({
            factory: fo.knowtTakerApp,
            dialogService: dialogService,
            stencil: fo.KnowtShare,
        });


        fo.subscribeComplete('workspaceSessionRestored', function () {
            $scope.safeApply();
        });

        var rootModel = space.rootModel;
 

        //root model should be designed to manage what item is selected
        $scope.toggleSelection = function (note) {
            var state = note.isSelected;
            rootModel.Subcomponents.forEach(function (item) {
                item.isSelected = false;
            });
            note.isSelected = !state;

            rootModel.hasSelection = note.isSelected;
            rootModel.currentNote = note.isSelected && note;
            $scope.safeApply();
        }

        $scope.markSelected = function (note) {
            rootModel.Subcomponents.forEach(function (item) {
                item.isSelected = false;
            });
            note.isSelected = true;

            rootModel.hasSelection = note.isSelected;
            rootModel.currentNote = note.isSelected && note;
            $scope.safeApply();
        }

        $scope.notes = rootModel.Subcomponents.elements;



        //fo.subscribeComplete('noteAdded', function (note) {
        //    //$scope.safeApply();
        //});

        return space;
    });

}(knowtApp, Foundry));

//now create the noteMenu controller
(function (app, fo, undefined) {

    app.controller('contentMenu', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        if (!space.contentMenu) {
            var menu = space.contentMenu = space.factory.newMenuContent({}, space);

            menu.animals = space.factory.newStencilAnimalNotes({}, menu);

            fo.subscribe('doubleClick', function (shape, context, action) {
                if (context.hasNoteUri && space.keyPressedState && space.keyPressedState.CTRLKEY) {
                    window.open(context.noteUri, "_blank");
                }
                else {
                    space.contentMenu.openEdit(context);
                }
                shape.doUpdate();
            });

        }
        return space.contentMenu;
    });

}(knowtApp, Foundry));