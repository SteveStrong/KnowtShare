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

        var panAndZoomSpec = {
            percentMargin: -0.02,
            percentSize: .25,
            draggable: true,
            canDoWheelZoom: false,
            drawingGeom: function () {
                var result = new createjs.Shape();
                return result;
            },
            viewWindowGeom: function () {
                var geom = new createjs.Shape();
                geom.alpha = .3;
                return geom;
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
        var pzSelf = new PanAndZoomWindow(properties, {}, parent);
        var pzSelfParent = pzSelf.myParent;

        fo.subscribe('updatePanZoom', function (self, selfParent) {
            if (self && self != pzSelf) return;
            if (selfParent && selfParent != pzSelfParent) return;

            fo.publish('warning', ['updatePanZoom']);
            pzSelf.draw(pzSelfParent, 'green');
        });


        fo.subscribe('ShapeReparented', function (child, oldParent, newParent, loc) {
            fo.publish('info', ['ShapeReparented']);
            pzSelf.draw(pzSelfParent, 'yellow');
        });

        fo.subscribe('ShapeMoved', function (uniqueID, model, shape) {
            fo.publish('info', ['ShapeMoved']);
            pzSelf.draw(pzSelfParent, 'black');
        });

        fo.subscribe('sizePanZoom', function (self, selfParent, width, height, element) {
            if (self && self != pzSelf) return;
            if (selfParent && selfParent != pzSelfParent) return;

            //fo.publish('info', ['sizePanZoom']);
            pzSelf.setCanvasWidth(width * pzSelf.percentSize);
            pzSelf.setCanvasHeight(height * pzSelf.percentSize);
            pzSelf.zoomToFit(function () {
                pzSelf.draw(pzSelfParent);
            });
        });

        //fo.subscribe('positionPanZoom', function (self, selfParent, width, height, element) {
        //    if (self && self != pzSelf) return;
        //    if (selfParent && selfParent != pzSelfParent) return;

        //    fo.publish('info', ['positionPanZoom']);
        //    element.style.left = width - ((width * pzSelf.percentMargin) + pzSelf.canvasWidth) + 'px';
        //    element.style.top = height + 30 - ((height * pzSelf.percentMargin) + pzSelf.canvasHeight) + 'px';
        //});



        fo.subscribe('ShapeMoving', function (page, shape, ev) {
            if (page && page != pzSelfParent) return;

            var viewWindowGeom = pzSelf.viewWindowGeom;

            //adjust the pan on the page
           // fo.publish('info', ['ShapeMoving']);

            var scale = page.scale;
            var panX = viewWindowGeom.x * scale;
            var panY = viewWindowGeom.y * scale;
            page.setPanTo(-panX, -panY);
        });


        return pzSelf;
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

        var pzSelf = this;
        var stage = pzSelf.stage;

        var drawingGeom = pzSelf.drawingGeom;
        pzSelf.establishChild(drawingGeom);

        var g = drawingGeom.graphics;
        g.clear();
        //SRS mod
        if (page.Subcomponents.count) {
            g.beginFill(color ? color : "black");
            renderPageOutline(g, page, 0, 0);
            g.endFill();
        }


        var viewWindowGeom = pzSelf.viewWindowGeom;
        pzSelf.establishChild(viewWindowGeom);

        var psScale = pzSelf.scale;
        var scale = page.scale;
        var pinX = page.panX / scale;
        var pinY = page.panY / scale;
        var width  = page.canvasWidth / scale;
        var height  = page.canvasHeight / scale;
        viewWindowGeom.x = -pinX;
        viewWindowGeom.y = -pinY;


        var g = viewWindowGeom.graphics;
        g.clear();
        g.beginFill("red");
        g.drawRect(0, 0, width, height);
        g.endFill();

        stage.update();
    };



 


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

