

(function (app, fo, undefined) {


    fo.defineType(app.defaultNS('keyPressedEvents'), {
        KEYCODE: 0,
        CTRLKEY: false,
        ALTKEY: false,
        SHIFTKEY: false,
    }, function (properties, subcomponents, parent) {
        var result = fo.makeAdaptor(properties);

        function doKeyDown(evt) {
            result.KEYCODE = evt.keyCode;
            result.CTRLKEY = evt.ctrlKey;
            result.ALTKEY = evt.altKey;
            result.SHIFTKEY = evt.shiftKey;
        }

       window.addEventListener('keyup', doKeyUp, true);
       function doKeyUp(evt) {
            result.KEYCODE = evt.keyCode;
            result.CTRLKEY = false;
            result.ALTKEY = false;
            result.SHIFTKEY = false;
        }

        //http://jsfiddle.net/SVArR/


        window.addEventListener('keydown', doCommandKey, true);
        function doCommandKey(evt) {

            doKeyDown(evt);

            if (result.CTRLKEY) {
                switch (result.KEYCODE) {
                    case 16: // shift
                        evt.cancelBubble = true;
                        fo.publish('doToggleView', []);
                        return;
                    case 69: // e
                        evt.cancelBubble = true;
                        fo.publish('doOpenSelected', []);
                        return;
                    case 86: // v  paste
                        evt.cancelBubble = true;
                        fo.publish('doPasteNote', []);
                        return;
                    case 67: // c  copy
                        evt.cancelBubble = true;
                        return;
                    case 88: // x  cut
                        evt.cancelBubble = true;
                        return;
                    case 90: // z  undo
                        evt.cancelBubble = true;
                        fo.publish('doUnDo', []);
                        return;
                    case 86: // V
                        evt.cancelBubble = true;
                        var dt = window.clipboardData;
                        if (dt) {
                            var text = dt.getData('Text');
                            fo.publish('pasteText', [text, dt]);
                        }
                        return;
                    case 46: // del
                        evt.cancelBubble = true;
                        fo.publish('doDeleteSelected', []);
                        return;
                    case 32: // space bar
                    case 45: // insert
                        evt.cancelBubble = true;
                        fo.publish('doAddNote', []);
                        return;
                    case 37: // left arrow
                        fo.publish('panLeft', []);
                        return;
                    case 38: // up arrow
                        fo.publish('panUp', []);
                        return;
                    case 39: // right arrow
                        fo.publish('panRight', []);
                        return;
                    case 40: // down arrow
                        fo.publish('panDown', []);
                        return;
                }
            }


            // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            //http://www.javascriptkeycode.com/

            switch (result.KEYCODE) {
                //case 27: // escape
                //    break;
                //case 9:  // tab
                //case 13: // enter
                //case 16: // shift
                //case 17: // ctrl
                //case 18: // alt
                //    break;
                case 35: // home
                    evt.cancelBubble = true;
                    fo.publish('doZoom1To1', []);
                    break;
                case 36: // end
                    evt.cancelBubble = true;
                    fo.publish('doZoomToFit', []);
                    break;
                case 37: // left arrow
                    fo.publish('gotoParentShape',[]);
                    break;
                case 38: // up arrow
                    fo.publish('gotoPreviousShape', [true]);
                    break;
                case 39: // right arrow
                    fo.publish('gotoChildShape', []);
                    break;
                case 40: // down arrow
                    fo.publish('gotoNextShape', [true]);
                    break;
            }

        }

        return result;
    });




}(knowtApp, Foundry));
