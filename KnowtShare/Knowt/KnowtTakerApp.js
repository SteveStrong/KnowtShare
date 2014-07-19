
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

        //load templares for dialogs and shapes...
        fo.utils.xmlHttpGet('http://localhost:50085/KnowtView.Dialogs.html', function (text, xhr) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement('div');

            script.innerHTML = text;
            head.appendChild(script);
        });

    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

    //http://odetocode.com/blogs/scott/archive/2013/06/06/decorating-angularjs-services.aspx
    //http://www.bennadel.com/blog/2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm


    app.service('workspaceService', ['$log', function ($log) {

        var space;

        this.workSpace = function (template) {
            if (space) return space;

            var spec = fo.utils.union({ }, template);
            space = fo.ws.makeModelWorkspace("KnowtShare", {
                title: "KnowtTaker",
                subTitle: "take and save notes",
                userId: "123456780",
                userNickName: 'sedona',
            }, spec);

            return space;
        };

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
            hasSelection: function () { return false; },
            currentNote: function () { },
        });




        var rootModel = space.rootModel;
        rootModel.doTest = function () {
            dialogService.doPopupDialog({
                //headerTemplate: 'ClearAllHeader.html',
                bodyTemplate: 'ClearAllBody.html',
                //footerTemplate: 'ClearAllFooter.html',
            });
        }

        rootModel.deleteNote = function (note) {
            note.isSelected = false;
            note.removeFromModel();
            rootModel.smashProperty('hasSelection');
            rootModel.smashProperty('currentNote');
        }

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


        $scope.vm = fo.knowtTakerApp.newMenuNotes({}, rootModel);

        fo.subscribe('info', function(a,b){
            toastr.info(a,b);
        });

        //fo.subscribeComplete('noteAdded', function (note) {
        //    //$scope.safeApply();
        //});

        return space;
    });

}(knowtApp, Foundry));