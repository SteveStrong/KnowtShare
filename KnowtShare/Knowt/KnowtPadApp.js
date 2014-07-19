
var knowtApp = angular.module('knowtPadApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);
knowtApp.header = { title: 'Knowt Pad', help: 'knowtshareHelp.html' };

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

    app.run(function ($log, dialogService, workspaceService) {


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

            var spec = fo.utils.union({}, template);

            space = fo.ws.makeNoteWorkspace("KnowtPad", {
                canvasId: 'drawingCanvas',
                panZoomCanvasId: 'panZoomCanvas',
                pipId: 'PIP',
                title: "Knowt Pad",
                subTitle: "take notes visually",
                userId: "123456780",
                userNickName: 'sedona',
            }, spec);

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


    app.controller('noteMenu', function ($log, workspaceService, dialogService) {
        var space = workspaceService.activeWorkSpace();

        var rootModel = space.rootModel;
        var testObj = {
            tryme: function () {
                alert('tryme worked');
            },
            theTitle: 'this is the title',
        }
        var noteMenu = rootModel.factory.newMenuNoteAndShape(testObj, rootModel);
        return noteMenu;
    })

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
            factory: fo.knowtPadApp,
            dialogService: dialogService,
            hasSelection: function () { return false; },
            currentNote: function () { },
            currentShape: function () { },
            pinAsRootShape: function () {
                return space.rootPage;
            },
            selectionPath: function () {
                var path = [];
                var self = space.drawing;
                var parent = space.pinAsRootShape;
                while (parent && parent != self) {
                    path.push(parent);
                    parent = parent.myParent;
                }
                return path.reverse();
            },
            modelElements: function () {
                var context = this.pinAsRootShape.context;
                context = context || this.model;
                return context.Subcomponents.elements;
            },
            shapeElements: function () {
                return this.pinAsRootShape.Subcomponents.elements;
            }
        });


        space.inspect = function () {
            dialogService.doPopupDialog({
                context: space,
                headerTemplate: 'WorkspaceHeader.html',
                bodyTemplate: 'WorkspaceInspect.html',
                footerTemplate: 'CloseFooter.html',
            });
        }


        var rootModel = space.rootModel;
        var rootPage = space.rootPage;


        rootModel.deleteNote = function (note) {
            note.isSelected = false;
            note.removeFromModel();
            rootModel.smashProperty('hasSelection');
            rootModel.smashProperty('currentNote');
        }

        //root model should be designed to manage what item is selected
        $scope.toggleSelection = function (note) {
            $scope.safeApply();
        }


        $scope.notes = rootModel.Subcomponents.elements;
        $scope.shapes = rootPage.Subcomponents.elements;

        $scope.selectShape = function (shape) {
            rootPage.selectShape(shape, true);
        };
        $scope.unselectShape = function () {
            rootPage.selectShape(undefined, true);
        };

        $scope.pinAsRoot = function (shape) {
            vm.pinAsRootShape = shape;
            vm.smashProperty('modelElements');
            vm.smashProperty('shapeElements');
            $scope.modelElements = vm.modelElements;
            $scope.shapeElements = vm.shapeElements;

            $scope.safeApply();
        }

        $scope.toggleShowSubcomponents = function (shape) {
            shape.toggleShowSubcomponents();
            $scope.safeApply();
        }

        $scope.toggleShowDetails = function (shape) {
            shape.toggleShowDetails();
            $scope.safeApply();
        }



        rootModel.factory.newMenuAnimalNotes({}, rootModel, function (obj) {
            space.animals = obj;
        });

        rootModel.factory.newMenuFile({ space: space }, space, function (obj) {
            space.file = obj;
        });

        fo.subscribe('info', function(a,b){
            toastr.info(a,b);
        });

        fo.subscribe('doubleClick', function (shape, context, action) {
            if (context.hasNoteUri && CTRLKEY) {
                window.open(context.noteUri, "_blank");
            }
            else {
                space.notes.openEdit(context);
            }
            shape.doUpdate();
        });

        fo.subscribe('doubleClick', function (shape, context, action) {
            if (context.noteUri) {
                window.open(context.noteUri, "_blank");
            }
            else {
                fo.doCommand('editorDialog', context);
            }
        });



        fo.subscribeComplete('noteAdded', function (note) {
            $scope.safeApply();
        });

        fo.subscribe('ShapeSelected', function (view, shape, selections) {
            rootModel.currentShape = shape;
            rootModel.hasSelection = shape && shape.isSelected ? true : false;
            rootModel.currentNote = shape && shape.context;
        });

        fo.subscribeComplete('ShapeSelected', function (view, shape, selections) {
            $scope.safeApply();
        });


        fo.subscribeComplete('ShapeReparented', function (shape, oldParent, newParent, loc) {
            $scope.safeApply();
        });

        fo.subscribeComplete('Reparented', function (shape, oldParent, newParent, loc) {
            $scope.safeApply();
        });

        fo.subscribeComplete('ModelChanged', function (note) {
            $scope.safeApply();
        });

        fo.subscribeComplete('Deleted', function (name, note, shape) {
            $scope.safeApply();
        });

        fo.subscribeComplete('Added', function (name, note, shape) {
            $scope.safeApply();
        });

        return space;
    });

}(knowtApp, Foundry));