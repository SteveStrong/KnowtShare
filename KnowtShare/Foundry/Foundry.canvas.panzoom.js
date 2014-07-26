/*
    Foundry.canvas.panzoom.js part of the FoundryJS project
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
Foundry.createjs = this.createjs || {};


(function (ns, fo, createjs, undefined) {
    var utils = fo.utils;



    var PanAndZoomWindow = function (properties, subcomponents, parent) {
        var windowSpec = {
            pageToRender: parent,
            geom: function () {
                var geom = new createjs.Shape();
                geom.alpha = .3;
                return geom;
            },
        }

        var panAndZoomSpec = {
            percentMargin: -0.02,
            percentSize: .25,
            draggable: true,
            canDoWheelZoom: false,
            drawingGeom: function () {
                var result = new createjs.Shape();
                return result;
            },
            viewWindow: function () {
                var result = ns.makeShape(windowSpec, {}, this);
                this.addSubcomponent(result);
                return result;
            },
        };

        this.base = ns.Page2DCanvas;
        this.base(utils.union(panAndZoomSpec, properties), subcomponents, parent);
        this.myType = 'PanAndZoomWindow';
        return this;
    }


    PanAndZoomWindow.prototype = (function () {
        var anonymous = function () { this.constructor = PanAndZoomWindow; };
        anonymous.prototype = ns.Page2DCanvas.prototype;
        return new anonymous();
    })();

    ns.PanAndZoomWindow = PanAndZoomWindow;

    ns.makePanZoomWindow2D = function (id, spec, parent) {
        var canvasElement = (spec && spec.canvasElement) || document.getElementById(id) || document.createElement('canvas');

        var properties = spec || {};
        properties.canvasElement = canvasElement;
        var pz = new PanAndZoomWindow(properties, {}, parent);


        return pz;
    };

    utils.isaPanAndZoomWindow = function (obj) {
        return obj instanceof PanAndZoomWindow ? true : false;
    };


    PanAndZoomWindow.prototype.draw = function (page, color) {

        function renderPageOutline(g, obj, x, y) {
            obj.Subcomponents.forEach(function (item) {
                var geom = item.geom;
                var locX = x + geom.x;
                var locY = y + geom.y;
                g.drawRect(locX, locY, item.width, item.height);

                if (item.Subcomponents.count) {
                    renderPageOutline(g, item, locX, locY);
                }
            });
        }

        var zoom = this;
        var stage = zoom.stage;

        fo.publish('error', ['try to draw']);
        var pageToRender = page ? page : zoom.myParent;
        if (!pageToRender) return;

        var drawing = zoom.drawingGeom;
        zoom.establishChild(drawing);

        var g = drawing.graphics;
        g.clear();
        //SRS mod
        if (pageToRender.Subcomponents.count) {
            g.beginFill(color ? color : "black");
            renderPageOutline(g, pageToRender, 0, 0);
            g.endFill();
        }


        fo.publish('error', ['draw complete']);

        var viewWindow = zoom.viewWindow;
        viewWindow.pageToRender = pageToRender;

        var scale = pageToRender.scale;
        var pinX = pageToRender.panX / scale;
        var pinY = pageToRender.panY / scale;
        var width = viewWindow.width =  pageToRender.canvasWidth / scale;
        var height = viewWindow.height = pageToRender.canvasHeight / scale;
        viewWindow.geom.x = -pinX;
        viewWindow.geom.y = -pinY;

        var view = zoom.viewWindow.geom;
        stage.addChild(view);

        var g = view.graphics;
        g.clear();
        g.beginFill("red");
        g.drawRect(0, 0, width, height);
        g.endFill();

        stage.update();
    };

    var defaultPage;
    var defaultWindow;

    fo.subscribe('updatePanZoom', function (self, selfParent) {
        defaultWindow = zoom ? zoom : defaultWindow;
        defaultPage = page ? page : defaultPage;
        fo.publish('warning', ['updatePanZoom']);
        defaultWindow && defaultWindow.draw(defaultPage, 'green');
    });

    fo.subscribe('refreshPanZoom', function (zoom, page) {
        defaultWindow = zoom ? zoom : defaultWindow;
        defaultPage = page ? page : defaultPage;
        fo.publish('success', ['refreshPanZoom']);
        defaultWindow && defaultWindow.draw(defaultPage, 'green');
    });

    fo.subscribe('ShapeReparented', function (child, oldParent, newParent, loc) {
        fo.publish('info', ['ShapeReparented']);
        defaultWindow && defaultWindow.draw(defaultPage, 'yellow');
    });

    fo.subscribe('ShapeMoved', function (uniqueID, model, shape) {
        fo.publish('info', ['ShapeMoved']);
        defaultWindow && defaultWindow.draw(defaultPage, 'black');
    });

    fo.subscribe('sizePanZoom', function (zoom, page, width, height, element) {
        fo.publish('info', ['sizePanZoom']);
        zoom.setCanvasWidth(width * zoom.percentSize);
        zoom.setCanvasHeight(height * zoom.percentSize);
        zoom.zoomToFit(function () {
            zoom.draw(page);
        });
    });

    fo.subscribe('positionPanZoom', function (zoom, page, width, height, element) {
        fo.publish('info', ['positionPanZoom']);
        element.style.left = width - ((width * zoom.percentMargin) + zoom.canvasWidth) + 'px';
        element.style.top = height + 30 - ((height * zoom.percentMargin) + zoom.canvasHeight) + 'px';
    });



    fo.subscribe('ShapeMoving', function (page, shape, ev) {
        var viewWindow = page.viewWindow;
        if (viewWindow && viewWindow.pageToRender) {
            //adjust the pan on the page
            fo.publish('info', ['ShapeMoving']);
            var pageToRender = viewWindow.pageToRender;
            var scale = pageToRender.scale;
            var panX = viewWindow.geom.x * scale;
            var panY = viewWindow.geom.y * scale;
            pageToRender.setPanTo(-panX, -panY);
        }
    });



    PanAndZoomWindow.prototype.computeViewPortOffset = function (x, y) {
        var viewPort = this.selected;
        var offset = viewPort.globalToLocal(x, y);
        return offset;
    }

    PanAndZoomWindow.prototype.adjustPanUsingView = function (x, y, offset) {
        var viewPort = this.selected;
        var scale = -1.0 * this.scale / this.sizeFactor;

        var pt = viewPort.globalToLocal(x, y);

        viewPort.x += pt.x - offset.x;
        viewPort.y += pt.y - offset.y;
        return viewPort;
    }

    PanAndZoomWindow.prototype.computePanUsingView = function () {
        var viewPort = this.selected;
        var scale = -1.0 * this.scale / this.sizeFactor;

        return { x: (viewPort.x * scale), y: (viewPort.y * scale) };
    }

    PanAndZoomWindow.prototype.isViewPortHit = function (gX, gY) {
        var viewPort = this.selected;

        var obj = this;
        var parent = obj.myParent;
        var sizeFactor = obj.sizeFactor;
        var scale = obj.scale;

        var viewPortLeft = obj.panX * sizeFactor / scale;
        var viewPortTop = obj.panY * sizeFactor / scale;
        var viewPortWidth = parent.canvasWidth * sizeFactor / scale;
        var viewPortHeight = parent.canvasHeight * sizeFactor / scale;

        var pt1 = viewPort.localToGlobal(0, 0);
        if (gX < pt1.x) return false;
        if (gY < pt1.y) return false;

        var pt2 = viewPort.localToGlobal(viewPortWidth, viewPortHeight);
        if (gX > pt2.x) return false;
        if (gY > pt2.y) return false;

        if (gY >= pt1.y && gY <= pt2.y) {
            return true;
        }
    }

}(Foundry.canvas, Foundry, Foundry.createjs));

