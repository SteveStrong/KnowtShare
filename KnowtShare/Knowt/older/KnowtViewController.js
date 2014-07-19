

(function (app, fo, undefined) {
    var ctrl;

    app.run(function ($log, dialogService) {
            // Reference the auto-generated proxy for the hub.
            var shapeHub = $.connection.shapeHub;

            //http://codeseven.github.io/toastr/demo.html
            toastr.options = {
                positionClass: "toast-bottom-left",
            }

        //load templares for tialogs and shapes...
            fo.utils.loadTemplate('KnowtView.Dialogs.html');
            fo.utils.loadTemplate('KnowtView.NoteTemplate.html');


            ctrl = KnowtViewApp(Foundry, shapeHub, toastr, $log, dialogService);

            var myText = document.getElementById("textContainer");
            myText.addEventListener('click', function (evt) {
                var sourceElement = fo.utils.getEventSource(evt);
                ctrl.elementSelected(sourceElement);
            }, true);


            fo.enableFileDragAndDrop('mainContent');

            var $appHeader = $('#appHeader');
            var $appFooter = $('#appFooter');
            var $verticalMenu = $('#verticalMenu');
            var $horizontalMenu = $('#horizontalMenu');
            var $pictureContainer = $('#pictureContainer');
            var $textContainer = $('#textContainer');
            var $textCanvas = $('#textCanvas');

            var layoutSpec = {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                margin: 5,
                aspectRatio: function () {
                    return this.innerWidth / this.innerHeight;
                },
                headerHeight: function () {
                    return $appHeader.height();
                },
                footerHeight: function () {
                    return $appFooter.height();
                },
                canvasTop: function () {
                    return this.headerHeight + this.horizontalMenuHeight;
                },
                canvasLeft: function () {
                    return this.verticalMenuWidth + this.margin;
                },
                canvasWidth: function () {
                    return this.innerWidth - this.verticalMenuWidth - 2 * this.margin;
                },
                canvasHeight: function () {
                    return this.innerHeight - this.canvasTop - this.footerHeight - 2 * this.margin;
                },
                verticalMenuWidth: function () {
                    var result = $verticalMenu.width();
                    if (this.aspectRatio < 1 || ctrl.isViewOnlySession) result = 0;
                    return result;
                },
                horizontalMenuHeight: function () {
                    var result = $horizontalMenu.height();
                    if (this.aspectRatio > 1 || ctrl.isViewOnlySession) result = 0;
                    return result;
                },

                doResize: function () {
                    var top = 0;
                    var left = 0;
                    $appHeader.css("top", top + 'px');
                    $appHeader.css("left", left + 'px');


                    if (this.aspectRatio > 1) {
                        $verticalMenu.css("display", 'block');
                        $horizontalMenu.css("display", 'none');
                    }
                    else {
                        $verticalMenu.css("display", 'none');
                        $horizontalMenu.css("display", 'block');
                    }

                    if (ctrl.isViewOnlySession) {
                        $verticalMenu.css("display", 'none');
                        $horizontalMenu.css("display", 'none');
                    }

                    $verticalMenu.css("top", this.canvasTop + 'px');
                    $verticalMenu.css("left", left + 'px');

                    $horizontalMenu.css("top", this.headerHeight + 'px');
                    $horizontalMenu.css("left", left + 'px');

                    $pictureContainer.css("top", this.canvasTop + 'px');
                    $pictureContainer.css("left", this.canvasLeft + 'px');

                    $textContainer.css("top", this.canvasTop + 'px');
                    $textContainer.css("left", this.canvasLeft + 'px');
                    $textContainer.css("width", this.canvasWidth + 'px');


                    $textCanvas.css("height", this.canvasHeight + 'px');

                    $appFooter.css("top", this.canvasTop + this.canvasHeight + 'px');
                    $appFooter.css("left", left + 'px');
                }
            }

            var vm = fo.makeAdaptor(layoutSpec);
            vm.doResize;

            ctrl.doResize = function (evt) {

                fo.runWithUIRefreshLock(function () {

                    vm.innerWidth = window.innerWidth;
                    vm.innerHeight = window.innerHeight;

                    ctrl.drawing.setScreenSize(vm.canvasWidth, vm.canvasHeight);

                    vm.doResize;
                });
            }

            ctrl.onPropertyRefresh('isViewOnlySession', function (prop, obj) {
                ctrl.doResize();
            });

            window.addEventListener('resize', function (e) { ctrl.doResize(e); }, false);


            var args = fo.utils.queryStringToObject(window.location.toString(), '?');
            var sessionKey = args && args.session;

            if (!sessionKey) {
                try {
                    ctrl.doSessionRestore;
                    ctrl.doRepaint;
                }
                catch (ex) { }
            }

            $.connection.hub.start().done(function () {
                ctrl.start(sessionKey);

                var doc = args && args.doc ? args.doc : undefined;
                doc && ctrl.loadAppDoc(doc)
            }); 
        })

    app.controller('knowtViewController', function ($scope, $log, dialogService) {

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

        fo.traceEnabled = true;

        $scope.vm = ctrl;

        ctrl.applyScope = function (fn) {
            $scope.safeApply(fn);
        }


        $scope.pinAsRoot = function (shape) {
            ctrl.pinAsRootShape = shape;
            ctrl.smashProperty('modelElements');
            ctrl.smashProperty('shapeElements');

            $scope.safeApply();
        }

        ctrl.doResize();

        fo.subscribe('textFileDropped', function (payload, name, ext) {
            if (ext.endsWith('.knt')) {
                space.digestLock(function () {
                    space.payloadToCurrentModel(payload);
                });
                $scope.$safeApply();
                return;
            }

            if (ext.endsWith('.csv')) {
                var json = space.payloadToLocalData(name, payload);
                var uniqueKeys = fo.filtering.identifyUniqueKeyFields(json);

                var rootPage = space.rootPage;
                var rootShape = fo.canvas.makeTableShape2D({ pinX: 100, pinY: 50, name: name });
                rootShape.localDateSource = name;
                rootShape.setDefaultXY(rootPage.defaultXY());


                space.digestLock(function () {
                    rootPage.capture(rootShape);

                    var towns = uniqueKeys.Town;
                    fo.utils.forEachValue(towns, function (key, value) {
                        if (!key) return;
                        var row = fo.canvas.makeShape2D({ name: key });
                        row.localDateSource = name;
                        row.localDataKey = key;
                        rootShape.capture(row);
                    });
                });
            }
        });

 

        $scope.selectShape = function (shape) {
            space.rootPage.selectShape(shape, true);
        }

        fo.subscribeComplete('ShapeSelected', function (view, shape, selections) {
            var selected = ctrl.hasSelection;
            $scope.safeApply();
        });

        $scope.pinAsRoot = function (shape) {
            vm.pinAsRootShape = shape;
            vm.smashProperty('modelElements');
            vm.smashProperty('shapeElements');

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

    });
    
}(knowtApp, Foundry));