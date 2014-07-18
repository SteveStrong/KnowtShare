
var knowtApp = angular.module('knowtChirpApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);


//initial document and run implemented...

(function (app, fo, undefined) {

    app.defaultNS = function (name) {
        var id = fo.getNamespaceKey(this.name, name);
        return id;
    }

    app.run(function ($log, dialogService) {


        // Reference the auto-generated proxy for the hub.
        var shapeHub = $.connection.shapeHub;
        var hub = $.connection.hub;

        //http://codeseven.github.io/toastr/demo.html
        toastr.options = {
            positionClass: "toast-bottom-left",
        }

        //load templares for tialogs and shapes...
        fo.utils.xmlHttpGet('KnowtView.Dialogs.html', function (text, xhr) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement('div');

            script.innerHTML = text;
            head.appendChild(script);
        });

        //imspect the arguments passed into collect the session key 
        var args = fo.utils.queryStringToObject(window.location.toString(), '?');
        var sessionKey = args && args.session;


        if (shapeHub) {
            hub.start().done(function () {
                //pop some toast to
                toastr.info('connected to service', 'ready to chirp');

                sessionKey = sessionKey || 'chirp';
                shapeHub.started = true;
                fo.publish('hubReady', [shapeHub, sessionKey]);
            });
        }
        else {
            toastr.warning('but everything loaded', 'did not connected to service');
        }


    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

    //http://odetocode.com/blogs/scott/archive/2013/06/06/decorating-angularjs-services.aspx
    //http://www.bennadel.com/blog/2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm


    app.service('workspaceService', ['$log', function ($log) {

        var workSpace = fo.ws.makeModelWorkspace("KnowtShare", {
            title: "KnowtChirp",
            subTitle: "the simplest knowt app"
        });

        this.workSpace = workSpace;
        this.drawing = workSpace.drawing;


        fo.subscribe('hubReady', function (shapeHub, sessionKey) {

        });

        var viewModelSpec = {
        }

        this.rootSpec = fo.defineType('workspaceService::mainViewModel', viewModelSpec);


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


        var workSpace = workspaceService.workSpace;
        workSpace.rootModel = fo.makeComponent({ myName: 'testing' })
        var rootSpec = workspaceService.rootSpec;



        //workSpace.ex

        var menus = [rootSpec, app.defaultNS('traffic')];


        var viewModel = fo.createNewType('appViewModel', menus)({}, workSpace);

        $scope.vm = viewModel;

        fo.subscribe('hubReady', function (hub, sessionKey) {
            workSpace.sessionKey = sessionKey;
            workSpace.hasSessionKey = true;

            var shapeHub = fo.knowtChirpApp.newShapeHub({
                hub: hub,
                space: workSpace,
            }, workSpace);

           

            $scope.doPing = function () {
                shapeHub.doSendPing;
            }

            $scope.doSendMessage = function () {
                shapeHub.doSendMessage('hello steve' + new Date().toString());;
            }

            fo.subscribe('info', function(a,b){
                toastr.info(a,b);
            });


            $scope.safeApply();
        });

        $scope.chirp = fo.makeComponent();


        $scope.doChirp = function () {
            //alert('you need: the note creation, note send,  modules,');

            //lest make a shape
            var note = fo.knowtChirpApp.newNote({
                author: workSpace.userNickName,
                userId: workSpace.userId,
                headerText: function () {
                    var date = new Date();
                    return  date.toString()
                },
                noteText: function () {
                    return 'the time is: ' + this.headerText;
                }
            }, workSpace.rootModel);

            $scope.chirp = note;
            $scope.safeApply();
        };

        return workSpace;
    });

}(knowtApp, Foundry));