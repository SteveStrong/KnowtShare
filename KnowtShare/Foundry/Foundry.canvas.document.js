/*
    Foundry.canvas.document.js part of the FoundryJS project
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
    //now define the page...

    var documentSpec = {
        screenWidth: 800, // so you can revert to defaults
        screenHeight: 600,
        leftMargin: 0,
        rightMargin: 0,
        viewWidth: function () {
            return this.screenWidth - this.leftMargin - this.rightMargin;
        },
        topMargin: 0,
        bottomMargin: 0,
        viewHeight: function () {
            return this.screenHeight - this.topMargin - this.bottomMargin;
        },
        pageId: 'drawingCanvas',
        pageElement: function () {
            var result = document.getElementById(this.pageId);
            if ( result ) result.style.position = 'absolute';
            return result;
        },

        pipId: 'PIP',
        pipElement: function () {
            var result = document.getElementById(this.pipId);
            if ( result ) result.style.position = 'absolute';
            return result;
        },
        panZoomId: 'zoomCanvas',
        panZoomElement: function () {
            var result = document.getElementById(this.panZoomId); 
            return result;
        },


        //code to manage the scale of the drawing
        doUpdatePIP: function() {
            var page = this.page;
            page && page.updatePIP();
        },
        doZoom1To1: function () {
            var page = this.page;
            page && page.zoom1To1(page.updatePIP);
        },
        doZoomToFit: function () {
            var page = this.page;
            page && page.zoomToFit(page.updatePIP);
        },
        zoomDelta: 1.1,
        doZoomOut: function () {
            var page = this.page;
            page && page.zoomBy(1 / this.zoomDelta);
        },
        doZoomIn: function () {
            var page = this.page;
            page && page.zoomBy(this.zoomDelta);
        },
        doTogglePanZoomWindow: function () {
            var zoom = this.panZoom;
            if (zoom) {
                zoom.isVisible = !zoom.isVisible;
                this.pipElement.style.display = zoom.isVisible ? "block" : "none";
                if (zoom.isVisible) {
                    zoom.zoomToFit();
                }
            }
            this.smashProperty('isPanZoomWindowOpen');
        },
        isPanZoomWindowOpen: function () {
            var zoom = this.panZoom;
            return zoom ? zoom.isVisible : false;
        }
    }

    var Drawing = function (pageId, panZoomId, pipId, properties, subcomponents, parent) {
        var spec = utils.union(documentSpec, properties);
        spec.pageId = pageId;
        spec.pipId = pipId;
        spec.panZoomId = panZoomId;

        this.base = fo.Component;
        this.base(spec, subcomponents, parent);
        this.myType = 'Drawing';

        //once created this value shoul dnot be smashed!!!
        this.page = ns.makePage2D(this.pageId, {}, this);
        if (!this.page.pictureInPicture && this.panZoomId) {
            this.panZoom = ns.makePanZoomWindow2D(this.panZoomId, {}, this.page);
            this.page.setPIP(this.panZoom);
        };

        this.setScreenSize(this.screenWidth, this.screenHeight);

        //this.tracePropertyLifecycle('page');

        return this;
    }


    Drawing.prototype = (function () {
        var anonymous = function () { this.constructor = Drawing; };
        anonymous.prototype = fo.Component.prototype;
        return new anonymous();
    })();

    ns.Drawing = Drawing;

    ns.makeDrawing = function (pageId, panZoomId, pipId, properties) {
        var result = new Drawing(pageId, panZoomId, pipId, properties);

        fo.subscribe('canvasResize', function (element, width, height) {
            if (result.pageElement == element) {
                result.setScreenSize(width, height);
            }
        });

        fo.subscribe('WorkspaceClear', function (space) {
            result.doUpdatePIP;
        });

        fo.subscribe('WorkspaceOpenMerge', function (space) {
            result.doUpdatePIP;
        });

        fo.subscribe('WorkspaceExportSave', function (space) {
            result.doUpdatePIP;
        });

        return result;
    }

    utils.isaDrawing = function (obj) {
        return obj instanceof Drawing ? true : false;
    };

    Drawing.prototype.setScreenSize = function (w, h) {
        var drawing = this;
        var page = this.page;
        fo.runWithUIRefreshLock(function () {
            drawing.screenWidth = w,
            drawing.screenHeight = h,
            page.setCanvasWidth(w);
            page.setCanvasHeight(h);

            drawing.panZoom && page.setPIPSize(drawing.viewWidth, drawing.viewHeight, drawing.panZoomElement);
            drawing.pipElement && page.setPIPPosition(drawing.screenWidth, drawing.screenHeight, drawing.pipElement);
        });
    };


}(Foundry.canvas, Foundry, Foundry.createjs));
