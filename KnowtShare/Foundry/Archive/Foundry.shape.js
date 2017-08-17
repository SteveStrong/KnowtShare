/*
    Foundry.shape.js part of the FoundryJS project
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

//stubs to it runs if CreateJs is not present
if (!createjs) {
    Foundry.createjs = {
        createShape: function () { return; },
        createContainer: function () { return; },
        createText: function () { return; },
        createBitmap: function () { return; },
        createStage: function () { return; },
        Tween: undefined,
        Touch: undefined,
        Ticker: undefined,
    }
} else {
    Foundry.createjs = createjs
    Foundry.createjs.createShape = function () {
        return new createjs.Shape();
    },
    Foundry.createjs.createContainer = function () {
        return new createjs.Container();
    };
    Foundry.createjs.createText = function (t, f, c) {
        return new createjs.Text(t, f, c);
    };
    Foundry.createjs.createBitmap = function (u) {
        return new createjs.Bitmap(u);
    };
    Foundry.createjs.createStage = function (e, f) {
        return new createjs.Stage(e, f);
    };

}


(function (ns, cv, cjs, undefined) {


    var tween = cjs.Tween;

    var canonicalizeNewlines = function (str) {
        return str.replace(/(\r\n|\r|\n)/g, '\n');
    };

    // Line Splitter Function
    // copyright Stephen Chapman, 19th April 2006
    // you may copy this code but please keep the copyright notice as well
    //function splitLine(st, n, context) {
    //    var b = '';
    //    var s = canonicalizeNewlines(st);
    //    if (s[0] == '\n') {
    //        s = s.substring(1);
    //    }
    //    while (s.length > n) {
    //        var c = s.substring(0, n);
    //        var d = c.lastIndexOf(' ');
    //        var e = c.lastIndexOf('\n');
    //        if (e != -1) d = e;
    //        if (d == -1) d = n;
    //        b += c.substring(0, d) + '\n';
    //        s = s.substring(d + 1);
    //    }
    //    return b + s;
    //}

    //extensions to text object to format text to fit max width;
    if (cjs && cjs.Text && cjs.Text.prototype) {

        cjs.Text.prototype.splitLine = function (st, n) {
            var b = '';
            var s = canonicalizeNewlines(st);
            while (s[0] == '\n') {
                s = s.substring(1);
            }

            while (s.length > n) {
                var c = s.substring(0, n);
                var d = c.lastIndexOf(' ');
                var e = c.lastIndexOf('\n');
                if (e != -1) d = e;
                if (d == -1) d = n;
                b += c.substring(0, d) + '\n';
                s = s.substring(d + 1);
            }
            return b + s;
        }

        cjs.Text.prototype.flowText = function (text, n, maxLines) {
            var modifiedText = text ? this.splitLine(text, n) : text;
            var lines = modifiedText.split('\n');
            if (!maxLines || lines.length <= maxLines) {
                this.text = modifiedText;
                return modifiedText;
            }
            var total = maxLines - 1;
            var sublist = lines.splice(0, total - 1)
            var result = sublist.join('\n') + " " + lines[total] + ' ...';
            this.text = result;
            return result;
        }
    }



    //if (tween) { //could use 'change' event for tween...
    //    tween.prototype.tickWatcher = function (callback) {
    //        var tw = this;
    //        var baseTick = tw.tick;
    //        this.tick = function (event) {
    //            callback(event);
    //            baseTick.call(tw, event);
    //        }
    //        return tw;
    //    }
    //}

    function cancelBubble(e) {
        if (!e) e = window.event;

        //IE9 & Other Browsers
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        else {  //IE8 and Lower
            e.cancelBubble = true;
        }
    }

    var FoundryShape = function (properties, subcomponents, parent) {
        var shapeSpec = {
            context: function () { //should be overriden by properties.. if not try to find in model
                var model = this.getValueOf('model');
                model = model ? model.getSubcomponent(this.name, true) : model;
                if (model) {
                    alert("Model found");
                }
                return model;
            },
            shapeDepth: function () {
                this.myIndex();
                var depth = this.componentDepth();
                return depth;
            },
            groupDepth: function () {
                this.shapeDepth; //capture dependency
                var depth = this.branchDepth();
                return depth;
            },
        }

        this.base = ns.Component;
        this.base(ns.utils.union(shapeSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'FoundryShape';


        this.debug = true;
        //this._shapeDepth.debug = true;
        //this._groupDepth.debug = true;
        return this;
    };

    FoundryShape.prototype = (function () {
        var anonymous = function () { this.constructor = FoundryShape; };
        anonymous.prototype = ns.Component.prototype;
        return new anonymous();
    })();

    cv.FoundryShape = FoundryShape;
    ns.utils.isaFoundryShape = function (obj) {
        return obj instanceof FoundryShape ? true : false;
    };

    FoundryShape.prototype.isOfType = function (type) {
        var xxx = this.myType;
        var found = this.isType(type);
        if (found) return true;
        return this.context && this.context.isOfType(type);
    };

    FoundryShape.prototype.outlineRef = function () {
        var depth = this.shapeDepth;
        if (depth == 0 || !this.myParent) return '';
        var index = (this.myIndex() + 1).toString();
        if (this.myParent.shapeDepth == 0) return index;
        var result = this.myParent.outlineRef() + "." + index;
        return result;
    };

    FoundryShape.prototype.rootPage = function () {
        if (!this.myParent) return;
        return this.myParent.rootPage && this.myParent.rootPage();
    };

    FoundryShape.prototype.isPage = function () {
        return this == this.rootPage();
    };

    FoundryShape.prototype.removeFromModel = function () {
        var obj = this;
        obj.smashProperty('geom');
        obj.glueRemoveFromModel();

        var result = this.base.prototype.removeFromModel.call(this);
        return result;
    };

    FoundryShape.prototype.glueRemoveFromModel = function () {
        if (!this.Connections) return;

        this.Connections.map(function (item) {
            var shape = item.target;
            shape.removeFromModel();
        });
    }

    FoundryShape.prototype.glueTo = function (target) {
        var list = this.establishCollection("Connections", []); // you need to make this observable and dynamic

        var found = list.firstWhere(function (item) {
            return item.target == target;
        });

        if (!found) {
            found = {
                source: this,
                target: target,
            }
            list.push(found);
            //var str = target.stringify();
            //found.name = "{0} ({1}_{2})".format(list.count, this.name, target.name);
        };

        return found;
    }

    FoundryShape.prototype.unglueTo = function (target, deep) {

        var found;
        if (deep) {
            this.Subcomponents.map(function (shape) {
                found = shape.unglueTo(target, deep);
            });
        }


        var connections = this.Connections;

        if (!connections) return found;

        found = connections.firstWhere(function (item) {
            return item.target == target;
        });
        if (found) {
            connections.remove(found);
        }
        
        return found;
    }

    FoundryShape.prototype.glueShapeMoved = function (target, x, y, w, h, deep) {
        if (this.Connections) {
            this.Connections.map(function (item) {
                var shape = item.target;
                shape.glueShapeMoved(target, x, y, w, h);
            });
        }

        if (!deep) return;

        this.Subcomponents.map(function (shape) {
            shape.glueShapeMoved(shape, x, y + h, shape.width, shape.height, deep);
        });

    }



    //http://blog.toggl.com/2013/05/6-performance-tips-for-html-canvas-and-createjs/

    FoundryShape.prototype.isShapeHit = function (gX, gY, w, h, skipSelected) {
        var geom = this.geom;
        if (!geom) return geom;

        var pt1 = geom.localToGlobal(0, 0);
        if (gX < pt1.x) return false;

        var pt2 = geom.localToGlobal(w, h);
        if (gX > pt2.x) return false;

        if (gY >= pt1.y && gY <= pt2.y) {
            return this;
        }

        //keep looking through children..
        //this could be faster if we skipped over the items known to be outside of gX & gY
        var elements = this.Subcomponents.elements;
        for (var i = 0; i < elements.length; i++) {
            var subShape = elements[i];
            if (skipSelected && subShape.isSelected) continue;

            var found = subShape.isShapeHit(gX, gY, subShape.width, subShape.height, skipSelected);
            if (found) return found;
        }
    };

    FoundryShape.prototype.subcomponentHitTest = function (gX, gY, skipSelected ) {
        var elements = this.Subcomponents.elements
        //for(var i=0; i<elements.length; i++ ){

        var start = elements.length - 1;
        for (var i = start; i >= 0; i-- ) {
            var subShape = elements[i];
            if (skipSelected && subShape.isSelected) continue;

            var found = subShape.isShapeHit(gX, gY, subShape.width, subShape.height, skipSelected);
            if (found) return found;
        }

    };



    FoundryShape.prototype.captureSubcomponent = function (subShape, name) {
        var newParent = this;
        var oldParent = subShape.myParent;

        if (name) subShape.name = name;

        if (newParent.canCaptureSubcomponent(subShape)) {
            ns.runWithUIRefreshLock(function () {

                if (oldParent) {
                    //var oldname = oldParent.name;
                    oldParent.removeSubcomponent(subShape);
                    if (oldParent.shapeDepth > 0) {
                        oldParent.smashPropertyTree('shapeDepth');

                        oldParent.smashPropertyTree('minHeight');
                        oldParent.smashPropertyTree('minWidth');
                    }
                }
                
                //var myname = subShape.name;
                subShape.smashProperty("pinX");
                subShape.smashProperty("pinY");

                if (newParent) {
                    //var newname = newParent.name;
                    newParent.addSubcomponent(subShape);
                    if (newParent.shapeDepth > 0) {
                        newParent.smashPropertyBranch('shapeDepth');
                    }
                    else {
                        subShape.smashProperty('minHeight');
                        subShape.smashProperty('minWidth');
                        subShape.smashProperty('shapeDepth');
                    }
                }
            });
            return oldParent;
        }
    }

    FoundryShape.prototype.capture = function (shape, name) {
        return this.captureSubcomponent(shape, name);
        //return shape.updateStage();
    }


    FoundryShape.prototype.captureInsertSubcomponent = function (index, subShape, name) {
        var newParent = this;
        var oldParent = subShape.myParent;

        if (name) subShape.name = name;

        if (newParent.canCaptureSubcomponent(subShape)) {
            ns.runWithUIRefreshLock(function () {

                if (oldParent) {
                    //var oldname = oldParent.name;
                    oldParent.removeSubcomponent(subShape);
                    if (oldParent.shapeDepth > 0) {
                        oldParent.smashPropertyTree('shapeDepth');

                        oldParent.smashPropertyTree('minHeight');
                        oldParent.smashPropertyTree('minWidth');
                    }
                }

                //var myname = subShape.name;
                subShape.smashProperty("pinX");
                subShape.smashProperty("pinY");

                if (newParent) {
                    //var newname = newParent.name;
                    newParent.insertSubcomponent(index,subShape);
                    if (newParent.shapeDepth > 0) {
                        newParent.smashPropertyBranch('shapeDepth');
                    }
                    else {
                        subShape.smashProperty('minHeight');
                        subShape.smashProperty('minWidth');
                        subShape.smashProperty('shapeDepth');
                    }
                }
            });
            return oldParent;
        }
    }

    var Page2DCanvas = function (properties, subcomponents, parent) {

        var canvasElement = (properties && properties.canvasElement) || document.getElementById('myCanvas') || document.createElement('canvas');

        var page2DSpec = {
            canvas: function () {
                return canvasElement;
            },
            stage: function() {
                var stage = cjs.createStage(this.canvas, true);
                //stage.enableMouseOver(10);
                //stage.enableDOMEvents(true);
                createjs.Touch.enable(stage);

                stage.mouseMoveOutside = false;
                return stage;
            },
            draggable: true,
            isVisible: true,
            geom: function () {
                this.Subcomponents.count;  //auto smash of the count of subcomponents changes
                return this.stage;
            },
            title: function(){
                var model = this.rootComponent('model');
                return model ? model.title : '';
            },

            scale: 1.0,
            panX: 0.0,
            panY: 0.0,
            rotation: 0,

            context: function () { return this.canvas ? this.canvas.getContext('2d') : undefined; },
            canvasWidth: function () {
                return this.canvas ? this.canvas.width : 0;
            },
            canvasHeight: function () {
                return this.canvas ? this.canvas.height : 0;
            },
            selectionSet: function () { return ns.makeCollection(); },
            dropTargetSet: function () { return ns.makeCollection(); },
            pixelsPerInch: 150,
            drawingWidth: function () { return 16 * this.pixelsPerInch; },  //16 inches wide
            drawingHeight: function () { return 9 * this.pixelsPerInch; },  //9 inches wide
            drawingMargin: function () { return .25 * this.pixelsPerInch; },  //.25 inch margin all around
            surfaceWidth: function () {
                return this.drawingWidth + 2 * this.drawingMargin;
            },
            surfaceHeight: function () {
                return this.drawingHeight + 2 * this.drawingMargin;
            },

            showBackground: true,
            background: function () {
                var result = cjs.createShape();
                this.backgroundGeom(this.drawingWidth, this.drawingHeight, this.drawingMargin, result, true);
                return result;
            },
            showGrid: false,
            gridX: function () { return 1 * this.pixelsPerInch; },   //1 inch
            gridY: function () { return .5 * this.pixelsPerInch; },  //.5 inch
            grid: function () {
                var result = cjs.createShape();
                this.gridGeom(this.drawingWidth, this.drawingHeight, this.drawingMargin, this.gridX, this.gridY, result, true);
                return result;
            },
            showCross: false,
            cross: function () {
                var result = cjs.createShape();
                this.crossGeom(this.drawingWidth, this.drawingHeight, this.drawingMargin, result, true);
                return result;
            },

        };

        this.base = FoundryShape;
        this.base(ns.utils.union(page2DSpec, properties), subcomponents, parent);
        this.name = this.name ? this.name : "PAGE";
        this.doAnimations = true;
        this.PIP = undefined; //picture in picture Page2DCanvas

        var page = this;
        this._defaultPinX = 100;
        this._defaultPinY = 100;
        this._defaultPinXDelta = 0;
        this._defaultPinYDelta = 0;
        this.pageRenderComplete = function () { };

        page.resetDropDelta();

        this._pasteAreaPinX = 0;
        this._pasteAreaPinY = 0;
        this._pasteAreaGap = 10;

        page.resetPasteArea();


        page.addBinding("scale", function (prop, obj) {
            var scale = prop.getValue();
            ns.runWithUIRefreshLock(function () {
                var stage = page.stage;
                stage.scaleX = stage.scaleY = scale;
            });
        });

        page.addBinding("panX", function (prop, obj) {
            var value = prop.getValue();
            ns.runWithUIRefreshLock(function () {
                page.resetDropDelta();
                var stage = page.stage;
                stage.x = value;
            });
        });

        page.addBinding("panY", function (prop, obj) {
            var value = prop.getValue();
            ns.runWithUIRefreshLock(function () {
                page.resetDropDelta();
                var stage = page.stage;
                stage.y = value;
            });
        });

        if (this.canvas && this.stage && this.draggable) {
            this.setupDragAndDrop(true);
        }
        this.myType = (properties && properties.myType) || 'Page';

        page.addBinding("geom", function (prop, obj) {
            prop.canTrace() && ns.trace.error(obj.gcsIndent("Binding TRIGGERED a page render"));
            page.render();
        });

        //var _geom = this.getProperty('geom');
        //_geom.onValueDetermined = function (value, formula, owner) {
        //    ns.trace && ns.trace.error(owner.gcsIndent("CREATE STAGE onValueDetermined " + owner.name));
        //}
        ////track things that make the geom change (if it does) maybe reset the stage...
        //_geom.onValueSmash = function (value, formula, owner) {
        //    ns.trace && ns.trace.error(owner.gcsIndent("DELETE STAGE onValueSmash " + owner.name));
        //};
        return page;
    };

    Page2DCanvas.prototype = (function () {
        var anonymous = function () { this.constructor = Page2DCanvas; };
        anonymous.prototype = FoundryShape.prototype;
        return new anonymous();
    })();

    cv.Page2DCanvas = Page2DCanvas;

    ns.utils.isa2DCanvas = function (obj) {
        return obj instanceof Page2DCanvas ? true : false;
    };

    //define as noop first then replace
    Page2DCanvas.prototype.updatePIP = function () { };
    Page2DCanvas.prototype.setPIP = function (pip) {
        this.PIP = pip;
        var page = this;
        Page2DCanvas.prototype.updatePIP = function () {
            if (page.PIP) {
                ns.publish('refreshPanZoom', [page.PIP, page]);
            }
        }
        page.updatePIP();
    }

    Page2DCanvas.prototype.setPIPSize = function (width, height, element) {
        var page = this;
        if (this.canvas && page.PIP) {
            ns.publish('sizePanZoom', [page.PIP, page, width, height, element]);
        }
    }

    Page2DCanvas.prototype.setPIPPosition = function (width, height, element) {
        var page = this;
        if (this.canvas && page.PIP) {
            ns.publish('positionPanZoom', [page.PIP, page, width, height, element]);
        }
    }

    Page2DCanvas.prototype.setCanvasWidth = function (width) {
        if (this.canvas && this.canvas.width != width) {
            this.canvas.width = width;
            this.smashProperty('canvasWidth');
        }
    }

    Page2DCanvas.prototype.setCanvasHeight = function (height) {
        if (this.canvas && this.canvas.height != height) {
            this.canvas.height = height;
            this.smashProperty('canvasHeight');
        }
    }



    Page2DCanvas.prototype.autoLayout = function () {
        this.Subcomponents.forEach(function (subshape) {
            //this set of subshapes are positioned correctly 
            subshape.Subcomponents.forEach(function (item) {
                item.smashPropertyBranch('shapeDepth');
                item.smashPropertyBranch('pinX');
                item.smashPropertyBranch('pinY');
            });
        });
    }

    Page2DCanvas.prototype.componentDepth = function()
    {
        return 0;
    }

    var CTRLKEY = false;
    var ALTKEY = false;
    var SHIFTKEY = false;

    function doKeyDown(evt) {
        CTRLKEY = evt.ctrlKey;
        ALTKEY = evt.altKey;
        SHIFTKEY = evt.shiftKey;
    }

    function doKeyUp(evt) {
        CTRLKEY = false;
        ALTKEY = false;
        SHIFTKEY = false;
    }

    //http://jsfiddle.net/SVArR/
    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('keyup', doKeyUp, true);

    Page2DCanvas.prototype.selectShapeHitTest = function (gX, gY) {
        var elements = this.selectionSet.elements
        for (var i = 0; i < elements.length; i++) {
            var subShape = elements[i];
            if (subShape.myParent != this) continue;

            var found = subShape.isShapeHit(gX, gY, subShape.width, subShape.height);
            if (found == subShape) return subShape;

            //testing the geom will include the subshapes so you will get a hit if any geom
            //is found for now this is not what we want
            //var subGeom = subShape.geom;
            //var subPt = subGeom.globalToLocal(gX, gY);
            //if (subGeom.hitTest(subPt.x, subPt.y)) {
            //    return subShape;
            //}
        }
    };

    Page2DCanvas.prototype.selectShape = function (shape, clear) {
        var selections = this.selectionSet;

        if (shape && shape.isSelected) return;


        if (!shape && selections.count == 0) {
            ns.publish('ShapeSelected', [this, shape, selections]);
            return;
        }

        if (clear) {
            selections.forEach(function (item) {
                item.isSelected = false;
                item.setVisualState('isSelected');
            });
            selections.clear();
            this.selectDropTarget(undefined, true);
        }

        if (shape) {
            shape.isSelected = true;
            if ( selections.count == 0 ) selections.push(shape);
            shape.setVisualState('isSelected');

            //force selection to top
            var stage = this.geom;
            var index = stage.children.length-1;
            stage.setChildIndex(shape.geom, index);
        }

        ns.publish('ShapeSelected', [this, shape, selections]);
    }

    Page2DCanvas.prototype.gotoCurrentShape = function () {
        if (this.Subcomponents.isEmpty()) return;
        var selections = this.selectionSet;
        var current = selections.first();

        var shape = current ? current : this.Subcomponents.first();
        this.selectShape(shape, true)
        return shape;
    }


    Page2DCanvas.prototype.gotoParentShape = function () {
        if (this.Subcomponents.isEmpty()) return;
        var selections = this.selectionSet;
        var current = selections.first();

        var shape = current ? current.myParent : this.Subcomponents.first();
        if (shape == this) shape = undefined;

        this.selectShape(shape, true)
        return shape;
    }

    Page2DCanvas.prototype.gotoChildShape = function () {
        if (this.Subcomponents.isEmpty()) return;
        var selections = this.selectionSet;
        var current = selections.first();

        var shape = current ? current.Subcomponents.first() : this.Subcomponents.first();

        this.selectShape(shape, true)
        return shape;
    }

    Page2DCanvas.prototype.gotoNextShape = function (cycle) {
        if (this.Subcomponents.isEmpty()) return;
        var selections = this.selectionSet;
        var current = selections.first();

        var shape = current ? current.mySiblingNext() : this.Subcomponents.first();

        if (!shape && current && cycle) shape = current.myParent.Subcomponents.first();
        this.selectShape(shape, true)
        return shape;
    }

    Page2DCanvas.prototype.gotoPreviousShape = function (cycle) {
        if (this.Subcomponents.isEmpty()) return;
        var selections = this.selectionSet;
        var current = selections.first();

        var shape = current ? current.mySiblingPrevious() : this.Subcomponents.last();

        if (!shape && current && cycle) shape = current.myParent.Subcomponents.last();
        this.selectShape(shape, true)
        return shape;
    }

    Page2DCanvas.prototype.selectDropTarget = function (shape, clear) {
        var dropTargets = this.dropTargetSet

        if (shape && shape.isActiveTarget) return;


        if (clear) {
            dropTargets.forEach(function (item) {
                item.isActiveTarget = false;
                item.setVisualState('isActiveTarget');
            });
            dropTargets.clear();
        }

        if (shape) {
            shape.isActiveTarget = true;
            shape.setVisualState('isActiveTarget');
            if (dropTargets.count == 0) dropTargets.push(shape);
        }

        //ns.publish('DropTargetSelected', [this, shape, dropTargets]);
    }

    Page2DCanvas.prototype.selectedDropTarget = function () {
        var dropTargets = this.dropTargetSet;
        var shape = dropTargets.count > 0 ? dropTargets.last() : undefined;
        return shape;
    }

    Page2DCanvas.prototype.resetPasteArea = function (gap) {
        this._pasteAreaPinX = this.drawingMargin
        this._pasteAreaPinY = this.drawingMargin
        this._pasteAreaGap = (gap ? gap : 10);
        return this._pasteAreaGap;
    }

    Page2DCanvas.prototype.showPasteArea = function (onComplete) {
        var page = this;
        var x1 = 0;
        var y1 = 0;
        var x2 = page.surfaceWidth;
        var y2 = page.surfaceHeight;

        var scale = Math.min(page.canvasWidth / x2, page.canvasHeight / y2);
        var panX = (page.canvasWidth - scale * x2) / 2.0;
        var panY = (page.canvasHeight - scale * y2) / 2.0;

        page.transformTo(scale, panX + 100, panY, 200, function () {
            onComplete && onComplete();
        });
        return this;
    }

    Page2DCanvas.prototype.moveToPasteArea = function (shape) {
        var page = this;

        var pinX = page._pasteAreaPinX - shape.width / 2 - page._pasteAreaGap;
        var pinY = page._pasteAreaPinY + page._pasteAreaGap;
        shape.setXY(pinX, pinY);

        var depth = 1;  //shape.mySiblingsMaxValue('groupDepth', 1);
        page._pasteAreaPinY = pinY + shape.height * depth;

        fo.publish('ShapeMoved', [shape.name, undefined, shape])
        setTimeout(function () { page.introduceShape(shape); }, 300);
    }

    Page2DCanvas.prototype.resetDropDelta = function () {
        this._defaultPinXDelta = this._defaultPinYDelta = 0;
        this._defaultPinX = 1.5 * this.drawingMargin - this.panX / this.scale;
        this._defaultPinY = 1.5 * this.drawingMargin - this.panY / this.scale;

        this.resetPasteArea();
    }

    Page2DCanvas.prototype.overrideDefaultPinXPinY = function (pinX, pinY) {
        this._defaultPinX = pinX;
        this._defaultPinY = pinY;
        this._defaultPinXDelta = this._defaultPinYDelta = 0;
    }


    Page2DCanvas.prototype.selectedShape = function () {
        var selections = this.selectionSet;
        var shape = selections.count > 0 ? selections.last() : undefined;
        return shape;
    }

    Page2DCanvas.prototype.selectedContext = function () {
        var shape = this.selectedShape();
        return shape ? shape.context : undefined;
    }

    Page2DCanvas.prototype.shapeDropped = function (shape, offset, ev) {
        var x = ev.stageX;
        var y = ev.stageY;

        //var pinX = (x - this.panX) / this.scale - offset.x;
        //var pinY = (y - this.panY) / this.scale - offset.y;

        var page = this;
        var loc = { pinX: shape.pinX, pinY: shape.pinY, index: shape.myIndex() }

        var found = page.subcomponentHitTest(x, y, true);
        if (found) {
            //found.isActiveTarget = true; //.setVisualState('canDropOnGroup');
            //capturing should be enough to trigger recompute
            //of properties that depend on shapeDepth
            var oldParent = found.captureSubcomponent(shape);

            ns.publish('ShapeReparented', [shape, oldParent, shape.myParent, loc]);
        }
    }

    Page2DCanvas.prototype.shapePulled = function (shape, group, offset, ev) {
        var x = ev ? ev.stageX : 0;
        var y = ev? ev.stageY : 0;

        var page = this;
        var loc = { pinX: shape.pinX, pinY: shape.pinY, index: shape.myIndex() }

        var oldParent = page.captureSubcomponent(shape);

        ns.publish('ShapeReparented', [shape, oldParent, shape.myParent, loc])

        var pinX = (x - page.panX) / page.scale - offset.x;
        var pinY = (y - page.panY) / page.scale - offset.y;

        shape.setXY(pinX, pinY);
        ns.publish('ShapeMoved', [shape.name, undefined, shape])
    }

    Page2DCanvas.prototype.setupDragAndDrop = function (state) {
        var page = this;
        var stage = page.geom;  //makes sure the stage / geom property exist

        var canvas = page.canvas;
        var selections = page.selectionSet;
        var offset = { x: 0, y: 0 };
        var isMoving = false;
        var ignoreMoving = false;

        var isMouseDown = false;
        var isBoxing = false;
        var boxingStart = { x: 0, y: 0 };
        var boxingFinish = { x: 0, y: 0 };

        var pullingOffset = { x: 0, y: 0 };
        var pullingOnShape = undefined;
        var pullingOnParent = undefined;
        var isPullingCount = 0;
        var isPullingStart = 10;
        var isPullingMAX = 18;

        page.allowSingleTouchPan = false;
        page.publishTouchBoxingEvents = false;
        var panOffset = { x: 0, y: 0 };

        function makeBox(s, f) {
            var box = {
                x1: Math.min(s.x, f.x),
                x2: Math.max(s.x, f.x),
                y1: Math.min(s.y, f.y),
                y2: Math.max(s.y, f.y),
            };
            box.width = box.x2 - box.x1;
            box.height = box.y2 - box.y1;
            box.area = box.width * box.height;
            return box;
        }

        var boxingRect = cjs.createShape();
        boxingRect.alpha = .1;

        function renderBox(box) {
            var g = boxingRect.graphics;
            g.clear();
            if (box) {
                g.beginFill("#ff0000").drawRect(box.x1, box.y1, box.width, box.height);
                stage.addChild(boxingRect);
            }
            stage.update();
        }

        function panStage(ev) {
            var x = ev.stageX;
            var y = ev.stageY;

            var panX = (x - panOffset.x); 
            var panY = (y - panOffset.y);

            ns.runWithUIRefreshLock(function () {
                page.setPanTo(panX, panY);
                page.updatePIP();
            });

        }

        function zoomStageToCenter(gX, gY, zoom, ev) {
            //page.DrawDot(0, 0, 'yellow', 50);

            //page.DrawDot(ev.x, ev.y, 'blue', 18);
            //page.DrawDot(ev.clientX, ev.clientY, 'red', 15);
            //page.DrawDot(ev.pageX, ev.pageY, 'yellow', 12);
            //page.DrawDot(ev.layerX, ev.layerY, 'black', 9);
            //page.DrawDot(ev.offsetX, ev.offsetY, 'green', 6);
            //page.DrawDot(ev.screenX, ev.screenY, 'white', 3);
            //Layer, offest, Page, Screen
            //page.DrawDot(ev.x, ev.y, 'blue', 7);
            //page.DrawDot(ev.x, ev.y, 'blue', 7);

 
            //you need to track this position in global space
            //so you can return it to the same location on the screen
            var pt1 = page.geom.globalToLocal(gX, gY);
            ns.runWithUIRefreshLock(function () {
                page.zoomBy(zoom);
                page.updatePIP();
            });

            //once the zoom is applied, measure where the global point has moved to
            //then pan back so it is in the center...
            var pt2 = page.geom.localToGlobal(pt1.x, pt1.y);
            ns.runWithUIRefreshLock(function () {
                page.panBy(gX - pt2.x, gY - pt2.y);
                page.updatePIP();
            });
        }

        function touchZoomStageToCenter(gX, gY, newZoom, ev) {
            //page.DrawDot(0, 0, 'yellow', 50);

            //page.DrawDot(ev.x, ev.y, 'blue', 18);
            //page.DrawDot(ev.clientX, ev.clientY, 'red', 15);
            //page.DrawDot(ev.pageX, ev.pageY, 'yellow', 12);
            //page.DrawDot(ev.layerX, ev.layerY, 'black', 9);
            //page.DrawDot(ev.offsetX, ev.offsetY, 'green', 6);
            //page.DrawDot(ev.screenX, ev.screenY, 'white', 3);
            //Layer, offest, Page, Screen
            //page.DrawDot(ev.x, ev.y, 'blue', 7);
            //page.DrawDot(ev.x, ev.y, 'blue', 7);


            //you need to track this position in global space
            //so you can return it to the same location on the screen
            var pt1 = page.geom.globalToLocal(gX, gY);
            ns.runWithUIRefreshLock(function () {
                page.setZoomTo(newZoom);
                page.updatePIP();
            });

            //once the zoom is applied, measure where the global point has moved to
            //then pan back so it is in the center...
            var pt2 = page.geom.localToGlobal(pt1.x, pt1.y);
            ns.runWithUIRefreshLock(function () {
                page.panBy(gX - pt2.x, gY - pt2.y);
                page.updatePIP();
            });
        }

        ns.subscribe('touchZoomStageToCenter', function (gX, gY, zoom, ev) {
            touchZoomStageToCenter(gx, gy, zoom, ev);
        })


        function onMouseDownState(ev) {
            cancelBubble(ev);
            var x = ev.stageX;
            var y = ev.stageY;

            //if (stage.mouseInBounds)
            //    ns.publish("mouse down", [ev, stage]);

            if (CTRLKEY) {
                panOffset = { x: x - stage.x, y: y - stage.y };
                stage.addEventListener("stagemousemove", panStage);
                stage.addEventListener("stagemouseup", function (evt) {
                    stage.removeEventListener("stagemousemove", panStage);
                });
                return;
            }


            offset = { x: 0, y: 0 };
            pullingOnShape = pullingOnParent = undefined;

            var shape = page.selectShapeHitTest(x, y);
            if (shape) {
                var pt = shape.geom.globalToLocal(x, y);
                offset = { x: pt.x, y: pt.y };
            }

            var newShape = shape ? undefined : page.subcomponentHitTest(x, y);
            if (newShape && !shape) {
                shape = newShape;
                var pt = shape.geom.globalToLocal(x, y);
                offset = { x: pt.x, y: pt.y };
                if (shape.myParent != page) {
                    shape.setVisualState('canPullFromGroup');
                    pullingOnShape = shape;
                    pullingOnParent = shape.myParent; //item
                    isPullingCount = isPullingMAX;

                    var geom = pullingOnParent.geom;
                    var pt = geom.globalToLocal(x, y);

                    pullingOffset = { x: pt.x, y: pt.y };
                }
            }

            ns.runWithUIRefreshLock(function () {
                page.selectShape(shape, true);
                page.selectDropTarget(undefined, true);
            });

            isMouseDown = true;
            isMoving = shape !== undefined;

            isBoxing = !isMoving && page.publishTouchBoxingEvents;
            if (isBoxing) {
                //start and finish are in drawing coords
                boxingStart = page.geom.globalToLocal(x, y);
                renderBox();
                var box = makeBox(boxingStart, boxingStart);
                ns.publish('BoxingStarted', [page, box, ev]);
            }



            //start panning the screen is nothing selected
            if (!shape && page.allowSingleTouchPan) {
                panOffset = { x: x - stage.x, y: y - stage.y };
                stage.addEventListener("stagemousemove", panStage);
                stage.addEventListener("stagemouseup", function (evt) {
                    stage.removeEventListener("stagemousemove", panStage);
                });
            }
        }


        function onMouseMoveState(ev) {
            if (!isMouseDown || ignoreMoving) return;
            cancelBubble(ev);

            var x = ev.stageX;
            var y = ev.stageY;

            //if (stage.mouseInBounds)
            //    ns.publish("mouse move", [ev, stage]);


            if (pullingOnShape && isPullingCount >= 0) {
                
                var geom = pullingOnShape.geom;
                var parentGeom = pullingOnParent.geom;

                isPullingCount -= 1;
                if (pullingOnParent && isPullingCount > isPullingStart) {
                    return;
                }
                if (pullingOnParent && isPullingCount > 0) {
                    var delta = (isPullingStart - isPullingCount - 3);

                    var skew = 2 * delta;
                    pullingOnShape.setVisualState('canBePullFromGroup', { skewY: skew, skewX: skew }, 200, function () { geom && (geom.skewX = geom.skewY = skew); });

                    var scale = 1.01 + delta / 10;
                    pullingOnParent.setVisualState('canHaveItemPulled', { scaleX: scale }, 200, function () { parentGeom && (parentGeom.scaleX = scale); });
                    return;
                }

                //this will snap it back to normal
                if (isPullingCount == 0) {
                    isPullingCount = -1;
                    parentGeom.removeChild(geom);

                    //ignoreMoving = true;
                    var pt = page.geom.globalToLocal(x, y);
                    geom.x = pt.x - offset.x;
                    geom.y = pt.y - offset.y;

                    stage.addChild(geom);

                    page.selectShape(pullingOnShape, true);
                    page.selectDropTarget(undefined, true);


                    //maybe too aggressize for this version
                    //wait until drop,  but it does heal up nice
                    //page.captureSubcomponent(pullingOnShape, undefined, true);


                    pullingOnShape.setVisualState('wasPulledFromGroup', { skewY: 0, skewX: 0 }, 200, function () {  //backInOut
                        geom.skewY = 0;
                        geom.skewX = 0;
                        //ignoreMoving = false;

                        //var scale = 1;
                        if (pullingOnParent) {
                            pullingOnParent.setVisualState('canHaveItemPulled', { scaleX: 1 }, 300, function () {
                                parentGeom && (parentGeom.scaleX = 1);                            
                            });
                        }
                    });                   
                }

                return;
            }

            var shape = page.selectedShape();
            //not needed... if (shape) page.resetDropDelta();

            if (shape && isMoving) {
                var geom = shape.geom;
                var pt = page.geom.globalToLocal(x, y);
                geom.x = pt.x - offset.x;
                geom.y = pt.y - offset.y;
                geom.skewX = geom.skewY = 0;
                shape.glueShapeMoved(shape, geom.x, geom.y, shape.width, shape.height, true);

                //used to redraw the current drawing on pan/zoom window
                //not necessary until shape reached final position
                ns.publish('ShapeMoving', [page, shape, ev]);
                page.updatePIP();
            }

            if (isBoxing && isMouseDown) {
                //start and finish are in drawing coords
                boxingFinish = page.geom.globalToLocal(x, y);
                var box = makeBox(boxingStart, boxingFinish);
                renderBox(box);
                ns.publish('BoxingSizing', [page, box, ev]);
            }

            if (!isMoving || !shape || pullingOnShape) return;
            if (shape && !shape.canBeGrouped) return; 

            //var dropTarget = page.selectedDropTarget();

            //ns.trace && ns.trace.clr();
            //this section find targets for dropping the shape into groups
            var found = page.subcomponentHitTest(x, y, true);
            found = found && found.canGroupItems ? found : undefined;
            //if (dropTarget == found) return;
            if (found) {
                page.selectDropTarget(found, true);
                return;
            }
            page.selectDropTarget(found,true);
        }


        function onMouseUpState(ev) {
            cancelBubble(ev);
            var x = ev.stageX;
            var y = ev.stageY;

            isMouseDown = false;
            //if (stage.mouseInBounds)
            //    ns.publish("mouse up", [ev, stage]);


            if (isBoxing) {
                boxingFinish = page.geom.globalToLocal(x, y);
                var box = makeBox(boxingStart, boxingFinish);
                //locate shapes based on Start and Finished range...
                var group = undefined;
                page.Subcomponents.forEach(function (item) {
                    var geom = item.geom;
                    if (geom.x < box.x1) return;
                    if (geom.x > box.x2) return;
                    if (geom.y < box.y1) return;
                    if (geom.y > box.y2) return;

                    group = group ? group : [];
                    group.push(item);
                });
                renderBox();
                ns.publish('BoxingFinished', [page, box, group, ev]);
            }


            //user decided to not complete removing this subshape so clean up geometry
            if (pullingOnShape && isPullingCount > 0) {

                var geom = pullingOnShape.geom;
                var parentGeom = pullingOnParent.geom;

                var skew = 0;
                pullingOnShape.setVisualState('canBePullFromGroup', { skewY: skew, skewX: skew }, 300, function () { geom && (geom.skewX = geom.skewY = skew); });

                var scale = 1;
                pullingOnParent.setVisualState('canHaveItemPulled', { scaleX: scale }, 300, function () { parentGeom && (parentGeom.scaleX = scale); });
                isMoving = false;
            }

            var shape = page.selectedShape();
            if (shape && isMoving) {
                isMoving = false;
                var geom = shape.geom;
                var pt = page.geom.globalToLocal(x, y);
                geom.x = pt.x - offset.x;
                geom.y = pt.y - offset.y;

                ns.publish('ShapeMoving', [page, shape, ev]);

                //did we land on something?
                var target = page.subcomponentHitTest(x, y, true);
                page.selectDropTarget(target, true);

                if (pullingOnShape && isPullingCount == -1) {                    
                    ns.runWithUIRefreshLock(function () {
                        page.shapePulled(pullingOnShape, pullingOnParent, offset, ev);
                    });

                }
                else if (pullingOnParent && isPullingCount >= 0) {
                    pullingOnParent.setVisualState('canNotDropOnGroup');            
                }
                else if (target && target.canGroupItems) { //did we 
                    ns.runWithUIRefreshLock(function () {                    
                        page.shapeDropped(shape, offset, ev);
                    });

                }
                else {
                    ns.runWithUIRefreshLock(function () {
                        shape.pinX = geom.x;
                        shape.pinY = geom.y;
                        shape.angle = 0;
                    });
                    

                    if (!shape.isInGroup()) {
                        var context = shape.context;
                        ns.publish('ShapeMoved', [shape.name, context, shape]);
                    }
                }
            }

            page.selectDropTarget(undefined, true);

            //clean up any shapes that are still targets
            page.applyToSubcomponent(function (item) {
                if (item.isActiveTarget) {
                    item.isActiveTarget = false;                   
                }
                item.setVisualState && item.setVisualState('isActiveTarget');
            }, true);

            pullingOnShape = undefined;
            pullingOnParent = undefined;

        }

        stage.addEventListener("stagemousedown", onMouseDownState, false);
        stage.addEventListener("stagemousemove", onMouseMoveState, false);
        stage.addEventListener("stagemouseup", onMouseUpState, false);

        function onStageDoubleClick(ev) {
            cancelBubble(ev);

            var shape = page.selectedShape();
            if (shape) {
                shape.setVisualState('SelectedForEdit');  //one day if you can edit the shape directly
                var action = CTRLKEY ? 'OpenNav' : 'OpenEdit';
                ns.publish('doubleClick', [shape, shape.context, action]);
            }
            else
            {
                var x = ev.stageX;
                var y = ev.stageY;
            }
        }

        stage.addEventListener("dblclick", onStageDoubleClick, false);


        if (canvas) {
            canvas.addEventListener("mousewheel", mouseWheelHandler, false);
            canvas.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
        }

        //http://stackoverflow.com/questions/5189968/zoom-canvas-to-mouse-cursor

 

        function mouseWheelHandler(ev) {
            cancelBubble(ev);

            var scale = 1.1;
            var zoom = Math.max(-1, Math.min(1, (ev.wheelDelta || -ev.detail))) > 0 ? scale : 1 / scale;

            var x = ev.offsetX; 
            var y = ev.offsetY; 

            zoomStageToCenter(x, y, zoom, ev)
        }

//....................................................................
        //code for touch pinch zoom and pan..
        var pinchCenter;
        var baseDistance = 1;
        var baseZoom = 1;
        var pinchZoom = {};
        var pinchZoomMove = undefined;
        var touchPan = {};
        var touchPanMove = undefined;

        function distanceBetweenPoints(obj) {
            var list = ns.utils.forEachValue(obj, function (key, val) {
                return { x: val.clientX, y: val.clientX };
            });

            var x = Math.pow((list[1].x - list[0].x), 2);
            var y = Math.pow((list[1].y - list[0].y), 2);
            var result = Math.ceil(Math.sqrt(x + y));
            return result;
        }

        function averageBetweenPoints(obj) {
            var list = ns.utils.forEachValue(obj, function (key, val) {
                return { x: val.clientX, y: val.clientX };
            });

            return { x: (list[1].x + list[0].x) / 2, y: (list[1].y + list[0].y) / 2 };
        }



        var currentScale = 1;

        var onPointerMove = function (ev) {
            //cancelBubble(ev);

            var id = ev.pointerId;
            if (ev.pointerType == 'touch') {
                if (pinchZoomMove == undefined) {
                    pinchZoom[id] = ev;  //keep track of current location..
                }
                else {
                    pinchZoomMove[id] = ev;  //keep track of current location..
                }
                touchPanMove = {};
                if (touchPan[id]) {
                    touchPanMove[id] = ev;
                }
            }

            if (pinchZoomMove) { //if this exist it only has 2 keys..
                var distance = distanceBetweenPoints(pinchZoomMove); //make the scale less senstive
                var newScale = (distance / baseDistance);

                var delta = Math.abs(newScale - currentScale);
                if (delta < .1 || delta > .8) return;
                currentScale = newScale;

                //if ( ns.trace ) {
                //    ns.trace.clr();
                //    ns.trace.info('baseDistance');
                //    ns.trace.dir(baseDistance);
                //    ns.trace.info('distance');
                //    ns.trace.dir(distance);
                //    ns.trace.info('new scale');
                //    ns.trace.dir(newScale);
                //    ns.trace.info('pinchCenter');
                //    ns.trace.dir(pinchCenter);
                //}

                var gX = pinchCenter.x;
                var gY = pinchCenter.y;
                touchZoomStageToCenter(gX, gY, currentScale, ev)
            }

            if (touchPanMove && touchPanMove[id]) {
                var panX = (touchPanMove[id].clientX - panOffset.x);
                var panY = (touchPanMove[id].clientY - panOffset.y);
                ns.runWithUIRefreshLock(function () {
                    page.setPanTo(panX, panY);
                    page.updatePIP();
                });
            }
        };

        var onPointerUp = function (ev) {
            //cancelBubble(ev);
            var id = ev.pointerId;
            if (ev.pointerType == 'touch') {
                pinchZoomMove = undefined;
                touchPanMove = undefined;

                if (pinchZoom[id]) {
                    delete pinchZoom[id];
                }
                if (touchPan[id]) {
                    delete touchPan[id];
                }
            }
        };

        var onPointerDown = function (ev) {
            //cancelBubble(ev);
            var id = ev.pointerId;
            if (ev.pointerType == 'touch') {
                touchPan = {};  //only track the last touch
                if (page.selectedShape() == undefined) {
                    touchPan[id] = ev;
                    panOffset = { x: ev.clientX - stage.x, y: ev.clientY - stage.y };
                }

                pinchZoom[id] = ev;
                var len = Object.keys(pinchZoom).length;
                if (len == 2) { //capture current state to do zoom math
                    pinchZoomMove = {};
                    for (var attr in pinchZoom) {
                        pinchZoomMove[attr] = pinchZoom[attr];
                    }
                    //now compute the distance between used to scale...
                    pinchCenter = averageBetweenPoints(pinchZoomMove);
                    baseDistance = distanceBetweenPoints(pinchZoomMove);
                    baseZoom = page.scale;
                }
            }
        };

        if (canvas) {
            canvas.addEventListener("pointerdown", onPointerDown, false);
            canvas.addEventListener("pointermove", onPointerMove, false);
            canvas.addEventListener("pointerup", onPointerUp, false);
        }

//....................................................................

    };

    Page2DCanvas.prototype.backgroundGeom = function (width, height, margin, shape, clear) {
        var g = shape.graphics;

        if (clear) g.clear();

        g.beginFill('gray');
        g.drawRect(margin, margin, width, height);
        g.endFill();

        //g.beginStroke("black").setStrokeStyle(4);
        //g.drawRect(0, 0, width + 2 * margin, height + 2 * margin);
        //g.endStroke();

        //g.beginStroke("gray").setStrokeStyle(1);
        //var boundry = margin / 2;
        //g.drawRect(boundry, boundry, width + 2 * boundry, height + 2 * boundry);
        //g.endStroke();
        return g;
    };


    Page2DCanvas.prototype.gridGeom = function (width, height, margin, deltaX, deltaY, shape, clear) {
        var g = shape.graphics;

        //draw the body of the grid.
        if (clear) g.clear();
        g.beginStroke("#000");


        //first draw Verticle lines
        var left = margin;
        var top = margin;
        var right = margin + width;
        var bottom = margin + height;
        g.drawRect(left, top, width, height);

        var x = left;
        while (x < right) {
            g.moveTo(x, top);
            g.lineTo(x, bottom);
            x += deltaX;
        }
        var y = top;
        while (y < bottom) {
            g.moveTo(left, y);
            g.lineTo(right, y);
            y += deltaY; 
        }

        return g;
    };


    Page2DCanvas.prototype.crossGeom = function (width, height, margin, shape, clear) {
        var g = shape.graphics;

        //draw the body of the grid.
        if (clear) g.clear();
        g.beginStroke("yellow").setStrokeStyle(5);


        //first draw Verticle lines
        var left = margin;
        var top = margin;
        var right = margin + width;
        var bottom = margin + height;

        var x = left + width /2;
        g.moveTo(x, top);
        g.lineTo(x, bottom);

        var y = top + height / 2;
        g.moveTo(left, y);
        g.lineTo(right, y);


        return g;
    };


    Page2DCanvas.prototype.rootPage = function () {
        return this;
    };

    Page2DCanvas.prototype.defaultPinX = function () {
        var result = this._defaultPinX + this.defaultPinXDelta();
        return result;
    }

    Page2DCanvas.prototype.defaultPinY = function () {
        var result = this._defaultPinY + this.defaultPinYDelta();
        return result;
    }

    Page2DCanvas.prototype.defaultPinXDelta = function () {
        if (this._defaultPinXDelta > 200) this._defaultPinXDelta = 0;
        this._defaultPinXDelta = this._defaultPinXDelta + 20;
        return this._defaultPinXDelta;
    }

    Page2DCanvas.prototype.defaultPinYDelta = function () {
        if (this._defaultPinYDelta > 200) this._defaultPinYDelta = 0;
        this._defaultPinYDelta = this._defaultPinYDelta + 20;
        return this._defaultPinYDelta;
    }

    Page2DCanvas.prototype.zoomBy = function (value) {
        var page = this;
        page.scale *= value;
        return this;
    }

    Page2DCanvas.prototype.setZoomTo = function (targetValue) {
        var page = this;
        var newFactor = targetValue / page.scale;
        page.zoomBy(newFactor);
        return this;
    };

    Page2DCanvas.prototype.setPanTo = function (xTargetValue, yTargetValue) {
        var page = this;
        page.panX = xTargetValue;
        page.panY = yTargetValue;
        return this;
    };

    Page2DCanvas.prototype.panBy = function (deltaX, deltaY) {
        var page = this;
        page.panX += deltaX;
        page.panY += deltaY;
        return this;
    };

    Page2DCanvas.prototype.transformTo = function (scale, panX, panY, delay, onComplete) {
        var page = this;
        var stage = page.stage;

        var time = delay ? delay : 0;
        var tw = tween.get(stage).to({ x: panX, y: panY, scaleX: scale, scaleY: scale }, time, createjs.Ease.linear);


        tw.call(function () {
            ns.runWithUIRefreshLock(function () {
                page.setPanTo(panX, panY);
                page.setZoomTo(scale);

                if (onComplete) onComplete();
            });
        });

        return this;
    };


    Page2DCanvas.prototype.zoomToFit = function (onComplete) {
        var page = this;
        var x1 = 0;
        var y1 = 0;
        var x2 = page.surfaceWidth;
        var y2 = page.surfaceHeight;
        //determine the full size of the content
        page.Subcomponents.forEach(function (item) {
            x1 = Math.min(x1, item.pinX);
            y1 = Math.min(y1, item.pinY);
            var w = item.width ? item.width : 0;
            x2 = Math.max(x2, item.pinX + w);
            var h = item.height ? item.height : 0;
            y2 = Math.max(y2, item.pinY + h);
        });

        var scale = Math.min(page.canvasWidth / x2, page.canvasHeight / y2);
        var panX = (page.canvasWidth - scale * x2) / 2.0;
        var panY = (page.canvasHeight - scale * y2) / 2.0;

        page.transformTo(scale, panX, panY, 500, function () {
            onComplete && onComplete();
        });
        return this;
    };


    Page2DCanvas.prototype.zoom1To1 = function (onComplete) {
        var page = this;
        page.transformTo(1, 0, 0, 500, function () {
            onComplete && onComplete();
        });
        return this;
    };

    Page2DCanvas.prototype.establishChild = function (child,index) {
        var page = this;
        var stage = page.stage;
        if (stage.getChildIndex(child) == -1) {
            stage.addChild(child);
            if (index != undefined) stage.setChildIndex(child, index);
        }
        return child;
    }

    Page2DCanvas.prototype.render = function (clearStage) {
        var page = this;
        
        var context = page.context;
        var stage = page.geom; //same as stage but forces compute

        createjs.Ticker.removeEventListener("tick", stage);
        if (clearStage) {
            stage.removeAllChildren();
        }

        //turn on page brackground
        if (page.showBackground) {
            page.establishChild(page.background, 0);
        }

        //turn on the grid
        if (page.showGrid) {
            this.establishChild(page.grid, 1);
        }

        if (page.showCross) {
            this.establishChild(page.cross);
            //stage.setChildIndex(page.cross, 2);
        }

        //this.canTrace() && ns.trace.info("rendering stage ")

        //force all updates to include stage
        ns.updateStage = function () {
            //page.updatePIP();
            stage.update();
            page.pageRenderComplete && page.pageRenderComplete();
        }

        ns.runWithUIRefreshLock(function () {
            if (page.renderContent) {
                page.renderContent.call(page, context, stage);
            }
            else if (page.Subcomponents) {
                page.Subcomponents.forEach(function (subshape) {
                    subshape.render(context, stage);
                });
            }
        }, ns.updateStage);

        var total = stage.children.length;
        //stage.setChildIndex(panZoomWindow.window, total);
        //this.canTrace() && ns.trace.info("rendering stage complete " + total)

        createjs.Ticker.useRAF = true;
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", stage);

        return this;
    }

    Page2DCanvas.prototype.introduceShape = function (shape, onComplete) {
        var page = this;
        var stage = page.stage;
        var geom = shape.geom;

        geom.scaleX = geom.scaleY = 0;
        geom.rotation = -30;
        stage.addChild(geom);
        stage.update();
        shape.MorphTo(geom, { scaleY: 1.0, scaleX: 1.0, rotation: 0 }, 200, createjs.Ease.linear, function () {  //backInOut
            geom.scaleY = 1.0;
            geom.scaleX = 1.0;
            geom.rotation = 0;
            //stage.update();
            if (onComplete) onComplete();
        });
    }

    Page2DCanvas.prototype.farewellShape = function (shape, onComplete) {
        var page = this;
        var geom = shape.geom;

        shape.MorphTo(geom, { scaleY: 0, scaleX: 0, rotation: 30 }, 200, createjs.Ease.linear, function () {  //backInOut
            if (onComplete) onComplete();
        });
    }

    Page2DCanvas.prototype.MorphTo = function (geom, rule, time, ease, onComplete) {

        var stage = this.stage;

        if (this.doAnimations) {
            var tw = tween.get(geom).to(rule, time, ease);
            tw.call(function () {
                ns.runWithUIRefreshLock(onComplete);
                stage.update();
            });
        }
        else {
            ns.runWithUIRefreshLock(onComplete);
            stage.update();
        }
    };

    Page2DCanvas.prototype.DrawDot = function (x, y, f, r) {
        var shape = cjs.createShape();
        var fill = f ? f : "#F00";
        var radius = r ? r : 6;

        shape.graphics.beginFill(fill).drawCircle(0, 0, radius).endFill();
        shape.x = x;
        shape.y = y;

        this.stage.addChild(shape);
    }

    var Shape = function (properties, subcomponents, parent) {
        var shapeSpec = {
            pinX: 0.0,
            pinY: 0.0,
            angle: 0.0,
            isSelected: false,
            isActiveTarget: false,
            canGroupItems: function () { return true; },
            canBeGrouped: function () { return true; },
            showSubcomponents: true,
        }

        this.base = FoundryShape;
        this.base(ns.utils.union(shapeSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'Shape';

        //this.getProperty('isActiveTarget').onValueSet = function (value, formula, owner) {
        //    var p = this;
        //    owner.setVisualState('isActiveTarget')
        //    if (!value) owner.dropTarget.alpha = 0;
        //}
        return this;
    };

    Shape.prototype = (function () {
        var anonymous = function () { this.constructor = Shape; };
        anonymous.prototype = FoundryShape.prototype;
        return new anonymous();
    })();

    cv.Shape = Shape;
    ns.utils.isaShape = function (obj) {
        return obj instanceof Shape ? true : false;
    };


    Shape.prototype.rootPage = function () {
        if (!this.myParent) return;
        return  this.myParent.rootPage && this.myParent.rootPage();
    };

    Shape.prototype.isInGroup = function () {
        return this.myParent !== this.rootPage();
    };

    Shape.prototype.hasGroupMembers = function () {
        return this.Subcomponents.isNotEmpty();
    };

    Shape.prototype.toggleShowSubcomponents = function () {
        ns.runWithUIRefreshLock(function () {
            this.showSubcomponents = !this.showSubcomponents;
        });
        return this.showSubcomponents;
    };



    Shape.prototype.render = function (context, stage) {
        var property = this.getProperty('geom');
        if (property) {
            var geom = property.getValue();
            stage.addChild(geom);

            //if (property.valueDependsOnCount() > 0) {
            //    geom = this.geom;
            //}
            //if (property.informsTheseValuesCount() > 0) {
            //    geom = this.geom;
            //}

            this.Subcomponents.forEach(function (subshape) {
                subshape.render(context, geom || stage);
            });
        }
    };



    Shape.prototype.setVisualState = function (state) {
    }

    Shape.prototype.upcaseHeading = function () {
    }


    Shape.prototype.angleInRads = function () {
        return (Math.PI / 180) * this.angle;
    }

    ns.utils.isaShape = function (obj) {
        return obj instanceof Shape ? true : false;
    };

    Shape.prototype.defaultPinX = function () {
        var page = this.rootPage();
        return page.defaultPinX();
    }

    Shape.prototype.defaultPinY = function () {
        var page = this.rootPage();
        return page.defaultPinY();
    }

    Shape.prototype.setDefaultDropLocation = function () {
        if ( this.isInGroup() == false ) {
            this.pinX = this.defaultPinX();
            this.pinY = this.defaultPinY();
        }
    }

    //500, createjs.Ease.sineInOut);
    Shape.prototype.MorphGeomTo = function (rule, time, ease, onComplete) {
        var geom = this.geom;
        return this.MorphTo(geom, rule, time, ease, onComplete);
    };

    //500, createjs.Ease.sineInOut);
    Shape.prototype.MorphTo = function (geom, rule, time, ease, onComplete) {
        var page = this.rootPage();
        page.MorphTo(geom, rule, time, ease, onComplete);
    }

    Shape.prototype.repositionTo = function (pinX, pinY, angle, onComplete) {
        var self = this;
        //this.canTrace() && ns.trace.writeLog("repositioning", self.name, pinX, pinY, angle);
        this.MorphGeomTo({ x: pinX, y: pinY }, 500, createjs.Ease.sineInOut, function () {
            self.pinX = pinX;
            self.pinY = pinY;
            self.angle = angle ? angle : 0.0;
            self.glueShapeMoved(self, pinX, pinY, self.width, self.height, true);

            if ( onComplete ) onComplete();
            //ns.trace.writeLog("reposition Complete", self.name, self.pinX, self.pinY, self.angle);
        });
    }


    var colorsFill = ['#FFFFFF', '#FFFF99', '#FFFF33', '#FFCC66', '#FFCC00', '#CC9900', '#996600', '#663300'];


    var standardNoteOffset = 10;
    var standardNoteSize = 150;
    var minNoteSize = 50;

    var Shape2D = function (properties, subcomponents, parent) {
        var shape2DSpec = {
            locX: function () { return 0.0 * this.width; },
            locY: function () { return 0.0 * this.height; },
            minWidth: function () { return standardNoteSize; },
            width: function () {
                return Math.max(this.widthTotal, this.minWidth);
            }, // so you can revert to defaults
            minHeight: function () {
                return standardNoteSize;
            },
            height: function () {
                var inGroup = this.isInGroup();
                var result = this.groupDepth > 0 || inGroup ? minNoteSize : (this.minHeight ? this.minHeight : standardNoteSize);
                // fo && ns.trace.info ( "computed height {0} group depth {1}  inGroup {2}".format(result,this.groupDepth,inGroup)  )
                //if (!result) {
                //    result = 24;
                //}
                return result;
            },
            widthTotal: function () {
                var depth = this.groupDepth; //
                if (depth <= 0) return standardNoteSize;
                if (depth <= 1) return this.minWidth + depth * 10;

                //var minWidth = this.Subcomponents.filter(function (x) { return x.groupDepth == 0 }).maxAll('width',0);
                var list = this.Subcomponents; //.filter(function (x) { return x.groupDepth > 0 });
                var total = list.sumAll('width', standardNoteOffset);
                return total;
            },
            strokeColor: function () {
                var depth = this.groupDepth + 1; //
                if (depth > 7) depth = 7;
                var color = colorsFill[depth];
                return color;
            },
            fillColor: function () {
                var depth = this.groupDepth; //
                if (depth > 6) depth = 6;
                var color = colorsFill[depth];
                return color;
            },
            textColor: function () {
                var depth = this.groupDepth; //
                var color = depth >= 5 ? 'white' : 'black';
                return color;
            },
            fxMod: function () {
                return this.width * this.height; // * this.pinX * this.pinY;
            },
            pinX: function () {
                var offset = standardNoteOffset;
                var depth = this.mySiblingsMaxValue('groupDepth', 0);
                if (this.groupDepth == 0 && depth == 0) return offset;

                //horizontal location is based on position in subcomponents collection
                var list = this.mySiblingsBefore();
                var total = list.sumAll('width', offset);
                return total;

            },
            pinY: function () {
                var offset = minNoteSize;
                //var count = this.myParent && this.myParent.Subcomponents.count;
                if (this.groupDepth > 0) return offset;
                var depth = this.mySiblingsMaxValue('groupDepth', 0);
                if (this.groupDepth == 0 && depth > 0) return offset;

                //vertical location is based on position in subcomponents collection
                var list = this.mySiblingsBefore();
                var total = list.sumAll('height', offset);
                return total;
            },
            geom: function () {
                var shape = this;
                var _stage = shape.getProperty("stage", true);
                if (!_stage) {
                    if (!myParent) alert('this shape is not attaced to model ' + text);
                    return;
                };

                var shapeDepth = shape.shapeDepth;
                var context = this.context;
                if (!_stage) {
                    var text = JSON.stringify( context.getSpec(), undefined, 3);
                    alert('cannot create geometry for shape2D, the stage is missing ' + text);
                    return;
                }

                var stage = _stage.getValue();

                var background = cjs.createShape();

                var selected = cjs.createShape();
                var dropTarget = cjs.createShape();

                var note = context ? context.noteText : '';
                var noteText = cjs.createText(note, "10px Arial", "#000000");
                noteText.x = 5;
                noteText.textAlign = "left";
                noteText.textBaseline = "top";

                var header = context ? context.headerText : '';
                var headerText = cjs.createText(header, "bold 12px Arial", "#000000");
                headerText.textAlign = "center";
                headerText.textBaseline = "top";

                var bitmap;
                if (context && context.dataUri) {
                    bitmap = cjs.createBitmap(context.dataUri);
                    var ratio = bitmap.image.width / bitmap.image.height;

                    var maxWidth = 400;
                    if (bitmap.image.width > maxWidth) {
                        var scale = maxWidth / bitmap.image.width;
                        bitmap.scaleX = scale
                        bitmap.scaleY = scale;
                    }
                }


                //http://stackoverflow.com/questions/13494746/canvas-cross-domain-pixel-error
                if (context && context.imageUri) {
                    var imageWidth = this.minWidth;
                    bitmap = cjs.createBitmap(context.imageUri);
                    var image = bitmap.image;
                    image.onload = function () {
                        bitmap.loaded = true;
                        var ratio = bitmap.image.width / bitmap.image.height;
                        if (bitmap.image.width > imageWidth) {
                            var scale = imageWidth / bitmap.image.width;
                            bitmap.scaleX = scale
                            bitmap.scaleY = scale;
                        }                      
                    }
                }


                var createGraphics = function (obj, width, height, note, header) {
                    var fill = obj.fillColor;
                    var stroke = obj.strokeColor;
                    var leaf = obj.groupDepth == 0;
                    var root = obj.shapeDepth == 0;


                    shape.canTrace() && ns.trace.log("createGraphics " + header + ": " + obj.name);

                    //var g = background.graphics; //.beginStroke("#F00").setStrokeStyle(stroke);
                    //g.clear();

                    noteText.color = headerText.color = obj.textColor;                   
                    noteText.lineWidth = headerText.lineWidth = width - 10;

                    //https://github.com/CreateJS/EaselJS/blob/master/examples/Text_multiline.html
                    // use getBounds to dynamically draw a background for our text:
                    //var bounds = txt.getBounds();
                    //var pad = 10;
                    //var bg = cjs.createShape();
                    //bg.graphics.beginFill("#114").drawRect(txt.x - pad + bounds.x, txt.y - pad + bounds.y, bounds.width + pad * 2, bounds.height + pad * 2);
                    var headline = header;
                    var details = note.matches(header) ? '' : note;


                    noteText.flowText(details, 25, 15); //char not size //width);
                    var lnWidth = noteText.lineWidth;
                    var lnHeight = noteText.getMeasuredHeight();

                    var shapeWidth = Math.max(width, lnWidth);

                    //you may need to split header so it fits
                    headerText.flowText(headline, 21, 3); //char not size //width);
                    hdHeight = headerText.getMeasuredHeight();

                    var shapeHeight = obj.isInGroup() ? height : Math.max(height, hdHeight + lnHeight);
                    headerText.x = shapeWidth / 2;

                    var hasMembers = obj.hasGroupMembers();
                    if (!hasMembers) {
                        noteText.y = headerText.y = 5;
                        noteText.y += hdHeight + 5;
                        if (!note) shapeHeight = minNoteSize;
                        shapeHeight = obj.isInGroup() ? height : Math.max(shapeHeight, noteText.y + lnHeight);
                        noteText.visible = !obj.isInGroup();
                        if (!noteText.visible) headerText.y = shapeHeight / 4;
                        //SRS problematic  obj.minHeight = shapeHeight; //just in case something large is pasted  needed for hit test
                        //obj.minWidth = shapeWidth; //just in case something large is pasted  needed for hit test
                    } else {
                        shapeHeight = height;  //force this height
                        headerText.y = shapeHeight / 4;
                        noteText.visible = false;
                    }


                    var g = background.graphics;
                    g.clear();

                    if (isNaN(shapeHeight)) {
                        shapeHeight = 25;
                    }
                    if (isNaN(shapeWidth)) {
                        shapeWidth = 25;
                    }

                    g.beginFill(fill);
                    g.beginStroke(stroke).setStrokeStyle(1);
                    g.drawRect(0, 0, shapeWidth, shapeHeight);
                    g.endStroke();
                    g.endFill();

                    g = selected.graphics;
                    g.clear();
                    g.beginStroke("blue").setStrokeStyle(5);
                    g.drawRect(3, 3, shapeWidth-6, shapeHeight-6);
                    g.endStroke();
                    selected.alpha = obj.isSelected ? .5 : 0;

                    g = dropTarget.graphics;
                    g.clear();
                    g.beginStroke("green").setStrokeStyle(5);
                    g.drawRect(2, 2, shapeWidth-4, shapeHeight-4);
                    g.endStroke();
                    dropTarget.alpha = obj.isActiveTarget ? .5 : 0;

                    if (context && context.imageUri) {
                        var ratio = bitmap.image.width / bitmap.image.height;

                        var maxWidth = shapeWidth;
                        if (bitmap.image.width > maxWidth) {
                            var scale = maxWidth / bitmap.image.width;
                            bitmap.scaleX = scale
                            bitmap.scaleY = scale;
                        }
                    }
                };

                var container = cjs.createContainer();
                container.addChild(background, bitmap, dropTarget, selected, noteText, headerText);



                shape.setVisualState = function (state, rule, duration, onComplete) {

                    if (rule && duration && onComplete) {
                        shape.MorphTo(container, rule, duration, createjs.Ease.linear, onComplete);
                        return;
                    }

                    if (state.matches('isActiveTarget')) {
                        var alpha = shape.isActiveTarget ? .5 : 0;
                        if (dropTarget.alpha == alpha) return;

                        shape.MorphTo(dropTarget, { alpha: alpha }, 10, createjs.Ease.linear, function () {
                            dropTarget.alpha = alpha;
                           // ns.trace && ns.trace.info("dropTarget: " + shape.name + '  alpha = ' + alpha);
                        });
                        return;
                    }

                    if (state.matches('isSelected')) {
                        var alpha = shape.isSelected ? .5 : 0;
                        if (selected.alpha == alpha) return;

                        shape.MorphTo(selected, { alpha: alpha }, 10, createjs.Ease.linear, function () {
                            selected.alpha = alpha;
                            //ns.trace && ns.trace.info("Selected: " + shape.name + '  alpha = ' + alpha);
                        });
                        return;
                    }

                    if (state.matches('canPullFromGroup')) {
                        //shape.MorphTo(container, { skewY: 10, skewX: 10 }, 100, createjs.Ease.linear, function () {  //backInOut
                        //    container.skewY = 0;
                        //    container.skewX = 0;
                        //});
                        shape.MorphTo(container, { skewY: 2 }, 100, createjs.Ease.linear, function () {  //backInOut
                            container.skewY = 0;
                        });
                        return;
                    }


                }

                shape.getProperty('fxMod').onValueSmash = function (newValue, f, obj) {
                    ns.trace && ns.trace.log("smash " + this.name + "  " + obj.name);
                    var found = newValue
                };

                shape.addOnRefresh("fxMod", function (prop, obj) {
                    ns.trace && ns.trace.log("binding " + prop.name + "  " + obj.name);
                    var height = obj.height;
                    var width = obj.width;
                    if (context) {
                        var headline = obj.context.headerText;
                        var details = obj.context.noteText;
                        createGraphics(obj, width, height, details || '', headline || '');
                    }
                    else {
                        createGraphics(obj, width, height, '', '');
                    }
                });



                if (context) {
                    context.addOnRefresh("noteText", function (prop, obj) {
                        ns.trace && ns.trace.log("binding " + prop.name + "  " + obj.name);
                        var text = prop.getValue();
                        if (!text) return;

                        if (noteText.text.matches(text)) return;
                        //prop.canTrace() && ns.trace.log("binding " + prop.name);

                        createGraphics(shape, shape.width, shape.height, text, obj.headerText || '');
                    });

                    context.addOnRefresh("headerText", function (prop, obj) {
                        ns.trace && ns.trace.log("binding " + prop.name + "  " + obj.name);
                        var text = prop.getValue();
                        if (!text) return;

                        if (headerText.text.matches(text)) return;
                        //prop.canTrace() && ns.trace.log("binding " + prop.name);

                        createGraphics(shape, shape.width, shape.height, obj.noteText || '', text);
                    });
                };

                shape.addOnRefresh("pinX", function (prop, obj) {
                    var loc = prop.getValue();
                    container.x = isNaN(loc) ? 0 : loc;
                });

                shape.addOnRefresh("locX", function (prop, obj) {
                    container.regX = prop.getValue();
                });

                shape.addOnRefresh("pinY", function (prop, obj) {
                    var loc = prop.getValue();
                    container.y = isNaN(loc) ? 0 : loc;
                });

                shape.addOnRefresh("locY", function (prop, obj) {
                    container.regY = prop.getValue();
                });

                shape.addOnRefresh("isSelected", function (prop, obj) {
                    shape.setVisualState('isSelected')
                });

                shape.addOnRefresh("isActiveTarget", function (prop, obj) {
                    shape.setVisualState('isActiveTarget')
                });

                return container;
            }
        };

        this.base = Shape;
        this.base(ns.utils.union(shape2DSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'Shape2D';
        //this.getProperty('pinX').debug = true;
        //this.getProperty('pinY').debug = true;
        //this.getProperty('geom').debug = true;

        //this keeps changing values in the context from destroying the geometry
        this.getProperty('geom').onValueDetermined = function (value, formula, owner) {
            var p = this;
            var context = owner.context;
            var dependsOn = p.thisValueDependsOn.duplicate();
            dependsOn.forEach(function (prop) {
                if (prop.owner == context) {
                    p.removeDependency(prop);
                }
            });
            p.canTrace() && ns.trace.info(owner.gcsIndent("CREATE GEOM " + owner.name));
        }

        //this simplifies the rendering when something makes the geometry invalid
        this.getProperty('geom').onValueSmash = function (value, formula, owner) {
            var p = this;
            p.canTrace() && ns.trace.error(owner.gcsIndent("REMOVE GEOM " + owner.name));
            var parent = value.parent;
            if (parent) {
                parent.removeChild(value);
                p.canTrace() && ns.trace.error(owner.gcsIndent("DELETED FROM PARENT " + owner.context.headerText));
            }
        }

        return this;
    };

    Shape2D.prototype = (function () {
        var anonymous = function () { this.constructor = Shape2D; };
        anonymous.prototype = Shape.prototype;
        return new anonymous();
    })();

    cv.Shape2D = Shape2D;
    ns.utils.isaShape2D = function (obj) {
        return obj instanceof Shape2D ? true : false;
    };

    Shape2D.prototype.resetDefaults = function (spec) {
        //assumes no rotation this will take time to do right
        this.smashProperties('locX,locY,width,height')
        ns.utils.mixin(this, spec)
        return this;
    }

    Shape2D.prototype.setXY = function (x,y) {
        //assumes no rotation this will take time to do right
        this.pinX = this.locX + x;
        this.pinY = this.locY + y;
        return this;
    }

    Shape2D.prototype.refreshRectangle = function() {
        //assumes no rotation this will take time to do right
        this.x1 = this.pinX - this.locX;
        this.y1 = this.pinY - this.locY;
        this.x2 = this.x1 + this.width;
        this.y2 = this.y1 + this.height;
        return this;
    }


 

    var Shape1D = function (properties, subcomponents, parent) {

       
        var shape1DSpec = {
            sourceID: '',
            targetID: '',
            source: function () {
                var page = this.rootPage();
                var result = page.getSubcomponent(this.sourceID, true);
                result && result.glueTo(this);  //this makes glue saveable
                return result;
            },
            target: function () {
                var page = this.rootPage();
                var result = page.getSubcomponent(this.targetID, true);
                result && result.glueTo(this);  //this makes glue saveable
                return result;
            },
            beginX: function () { return this.source ? this.source.pinX + 0.5 * this.source.width : 0; },
            beginY: function () { return this.source ? this.source.pinY + 0.5 * this.source.height : 0; },
            endX: function () { return this.target ? this.target.pinX + 0.5 * this.target.width : 0; },
            endY: function () { return this.target ? this.target.pinY + 0.5 * this.target.height : 0; },
            fxMod: function () { return this.source && this.target ? this.source.fxMod * this.target.fxMod : 0; },
            canGroupItems: function () { return false; },
            canBeGrouped: function () { return false; },

            //locX: function () { return 0.5 * (this.beginX + this.endX); },
            //locY: function () { return 0.5 * (this.beginY + this.endY); },
            geom: function () {
                var shape = this;
                var context = this.context;
                var _stage = shape.getProperty("stage", true);
                if (!_stage) {
                    alert('cannot create geometry for Shape1D')
                    return;
                }

                var stage = _stage.getValue();

                var background = cjs.createShape();

                var createGraphics = function (obj) {
                    //var fill = obj.fillColor;
                    //var stroke = obj.strokeColor;
                    shape.canTrace() && ns.trace.log("createGraphics: " + this.sourceID + " >-< " + this.targetID);

                    var g = background.graphics;
                    g.clear();

                    g.beginStroke("black").setStrokeStyle(1);
                    g.moveTo(obj.beginX, obj.beginY);
                    g.lineTo(obj.endX, obj.endY);
                    g.endStroke();
                };

                var container = cjs.createContainer();
                container.addChild(background);

                shape.setVisualState = function (state, rule, duration, onComplete) {
                    if (rule && duration && onComplete) {
                        shape.MorphTo(container, rule, duration, createjs.Ease.linear, onComplete);
                        return;
                    }
                }

                shape.connectionMoved = function () {
                    createGraphics(shape);
                };

                //shape.getProperty('fxMod').onValueSmash = function (newValue) {
                //    var found = newValue
                //};shape

                shape.addOnRefresh("fxMod", function (prop, obj) {
                    //ns.trace.log("binding " + prop.name + "  " + obj.name);
                    createGraphics(obj);
                });


                return container;
            }

        };

        this.base = Shape;
        this.base(ns.utils.union(shape1DSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'Shape1D';

        //this simplifies the rendering when something makes the geometry invalid
        this.getProperty('geom').onValueSmash = function (value, formula, owner) {
            var p = this;
            p.canTrace() && ns.trace.error(owner.gcsIndent("REMOVE GEOM " + owner.name));
            var parent = value.parent;
            if (parent) {
                parent.removeChild(value);
                p.canTrace() && ns.trace.error(owner.gcsIndent("DELETED FROM PARENT " + owner.context.headerText));
            }
        }
        return this;
    }

    Shape1D.prototype = (function () {
        var anonymous = function () { this.constructor = Shape1D; };
        anonymous.prototype = Shape.prototype;
        return new anonymous();
    })();

    //Shape1D.prototype.onModelLoadComplete = function (modelDict, drawingDict) {
    //    //alert('force the glue to run do not wait until render');

    //    var source = drawingDict[this.sourceID];
    //    source && source.glueTo(this);  //this makes glue saveable

    //    var target = drawingDict[this.targetID];
    //    target && target.glueTo(this);  //this makes glue saveable
    //}

    Shape1D.prototype.glueShapeMoved = function (obj, x, y, w, h, deep) {
        //this overide prevents a circular loop
        if (this.source == obj) {
            this.beginX = x + 0.5 * w;
            this.beginY = y + 0.5 * h;
        }
        else if (this.target == obj) {
            this.endX = x + 0.5 * w;
            this.endY = y + 0.5 * h;
        }
        this.connectionMoved();
    }

    Shape1D.prototype.otherSide = function (obj) {
        if (this.source == obj) {
            return this.target;
        }
        if (this.target == obj) {
            return this.source;
        }
    }

    Shape1D.prototype.hasGlueTo = function (obj) {
        if (!obj) return undefined;
        return this.source == obj || this.target == obj;
    }

    Shape1D.prototype.subcomponentHitTest = function (gX, gY, skipSelected) {
        //this overide is a noop
    };

    Shape1D.prototype.isShapeHit = function (gX, gY, w, h, skipSelected) {
        //this overide is a noop
    };

    Shape1D.prototype.removeFromModel = function () {
        //unglue source and target...
        var obj = this;
        obj.smashProperty('geom');

        var source = obj.source;
        source && source.unglueTo(obj);  //this makes glue saveable

        var target = obj.target;
        target && target.unglueTo(obj);  //this makes glue saveable

        var result = this.base.prototype.removeFromModel.call(this);

        return result;
    };

    Shape1D.prototype.render = function (context, stage) {
        var property = this.getProperty('geom');
        if (property) {
            var geom = property.getValue();
            stage.addChild(geom);
            stage.setChildIndex(geom, 1);  //pushes 1d shapes to the bottom
        }
    };

 

    cv.Shape1D = Shape1D;
    ns.utils.isaShape1D = function (obj) {
        return obj instanceof Shape1D ? true : false;
    };


    cv.makePage = function (properties, subcomponents, parent) {
        var page = new Page2DCanvas(properties, subcomponents, parent);
        return page;
    };

    cv.makePage2D = function (id, spec) {
        var canvasElement = fo.utils.isString(id) ? document.getElementById(id) : id;
        var properties = spec || {};
        properties.canvasElement = canvasElement;
        var page = fo.construct('Page', properties);
        return page;
    };

    cv.makeShape = function (properties, subcomponents, parent) {
        var shape = new Shape(properties, subcomponents, parent);
        return shape;
    };

    cv.makeShape2D = function (properties, subcomponents, parent) {
        var shape = new Shape2D(properties, subcomponents, parent);
        return shape;
    };


    cv.makeShape1D = function (properties, subcomponents, parent) {
        var shape = new Shape1D(properties, subcomponents, parent);
        return shape;
    };



}(Foundry, Foundry.canvas, Foundry.createjs));

(function (ns, cv, undefined) {
    if (!ns.defineType) return;

    ns.defineType('Page', {}, cv.makePage);
    ns.defineType('Shape', {}, cv.makeShape);
    ns.defineType('Shape2D', {}, cv.makeShape2D);
    ns.defineType('Shape1D', {}, cv.makeShape1D);

}(Foundry, Foundry.canvas));