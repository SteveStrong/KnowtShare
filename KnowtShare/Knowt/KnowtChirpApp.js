
var knowtApp = angular.module('knowtChirpApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);
knowtApp.header = { title: 'Knowt Chirp', help: 'knowtshareHelp.html' };

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

    //http://www.asp.net/signalr/overview/signalr-20/hubs-api/hubs-api-guide-javascript-client#logging
    // Reference the auto-generated proxy for the hub.

    app.run(function ($log, workspaceService) {

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
    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

    //http://odetocode.com/blogs/scott/archive/2013/06/06/decorating-angularjs-services.aspx
    //http://www.bennadel.com/blog/2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm

    //inspect the arguments passed into collect the session key 
    var args = fo.utils.queryStringToObject(window.location.toString(), '?');
    var sessionKey = args && args.session;

    app.service('workspaceService', ['$log', function ($log) {

        var space;

        this.workSpace = function (properties, modelTemplate) {
            if (space) return space;

            var spec = {
                title: "Knowt Chirp",
                subTitle: "the simplest knowt sharing app",
                userId: "123456780",
                userNickName: 'sedona',

            }
            space = fo.ws.makeModelWorkspace("KnowtChirp", fo.utils.union(spec, properties), modelTemplate);

            space.isDocumentEmpty = function () {
                //var total = (this.rootPage.Subcomponents.count * this.rootModel.Subcomponents.count) / 2;
                var isEmpty = this.rootPage.Subcomponents.isEmpty() && this.rootModel.Subcomponents.isEmpty();
                return isEmpty;
            };

            //http://www.asp.net/signalr/overview/signalr-20/hubs-api/hubs-api-guide-javascript-client#logging
            // Reference the auto-generated proxy for the hub.
            var connection = $.hubConnection();
            connection.logging = true;

            var shapeHub = $.connection.shapeHub;
            if (shapeHub) {
                var proxy = app.newShapeHub(shapeHub, space);

                var hub = $.connection.hub;
                hub.start().done(function () {
                    //pop some toast to
                    fo.publish('info', ['connected to service', 'ready to chirp']);
                    proxy.doJoinSession(sessionKey || 'chirp');

                    fo.publish('proxyStarted', [proxy, shapeHub])

                });
            }
            else {
                fo.publish('warning', ['but everything loaded', 'did not connected to service']);
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

    app.controller('workSpace', function ($scope, $log, dialogService, workspaceService) {


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
            factory: fo.knowtChirpApp,
            stencil: fo.KnowtShare,
            dialogService: dialogService,
        });


     
        $scope.chirp = fo.makeComponent();
        $scope.rootModel = space.rootModel;

        fo.subscribe('proxyStarted', function (proxy, hub) {

            proxy.doPing('my ping')

            $scope.doNewPage = function () {
                proxy.doOpenSessionPage();
            }

            $scope.doPing = function () {
                proxy.doPing('');
            }

            $scope.doSendNoteChanges = function (note) {
                proxy.doSendNoteChanges(note);
            }

            $scope.doSendMessage = function () {
                proxy.doSendMessage(workSpace.userid, 'hello steve' + new Date().toString());
            }

            $scope.doChirp = function () {
                //alert('you need: the note creation, note send,  modules,');

                var date = new Date();

                //lest make a shape
                var note = fo.KnowtShare.newNote({
                    author: space.userNickName,
                    userId: space.userId,
                    headerText: date.toString(),
                    noteText: function () {
                        return 'the time is: ' + this.headerText;
                    }
                }, space.rootModel);

                note.makePartOfSpec('headerText');
                note.makePartOfSpec('noteText');

                space.rootModel.capture(note);
                proxy.doAddNote(note);

                $scope.chirp = note;
                $scope.safeApply();
            };

            $scope.safeApply();
        })


        fo.subscribeComplete('client', function () {
            $scope.safeApply();
        })

        return space;
    });

}(knowtApp, Foundry));