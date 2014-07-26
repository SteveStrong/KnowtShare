﻿///#source 1 1 /Foundry/Foundry.js
///#source 1 1 /Foundry/Foundry.core.js
///#source 1 1 /Foundry/version.js
/*
    Foundry.version.js part of the FoundryJS project
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


(function (ns,undefined) {

 
/**
 * The version string for this release.
 * @property version
 * @type String
 * @static
 **/
    ns.version = /*version*/"2.1.0"; // injected by build process

/**
 * The build date for this release in UTC format.
 * @property buildDate
 * @type String
 * @static
 **/
    ns.buildDate = /*date*/"01 May 2014 16:05:45 GMT"; // injected by build process

})(Foundry);
///#source 1 1 /Foundry/Foundry.trace.js
/*
    Foundry.trace.js part of the FoundryJS project
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


(function (ns, undefined) {

    ns.dom = {
        ul: function (text, id) {
            return (id == undefined) ? "<ul>" + text + "</ul>" : "<ul id='" + id + "'>" + text + "</ul>"
        },
        li: function (text, id) {
            return (id == undefined) ? "<li>" + text + "</li>" : "<li id='" + id + "'>" + text + "</li>"
        },
        p: function (text, id) {
            return (id == undefined) ? "<p>" + text + "</p>" : "<p id='" + id + "'>" + text + "</p>"
        },
        span: function (text, id) {
            return (id == undefined) ? "<span>" + text + "</span>" : "<span id='" + id + "'>" + text + "</span>"
        },
        div: function (text, id) {
            return (id == undefined) ? "<div>" + text + "</div>" : "<div id='" + id + "'>" + text + "</div>"
        },
        pre: function (text, id) {
            return (id == undefined) ? "<pre>" + text + "</pre>" : "<pre id='" + id + "'>" + text + "</pre>"
        },
        w: function (text, id) {
            return (id == undefined) ? "<div>" + text + "<br/></div>" : "<div id='" + id + "'>" + text + "<br/></div>"
        },
    };

    ns.traceEnabled = false;

    function toText(arg) {
        return arg ? String(arg) : '';
    }

    ns.trace = {
        clr: function () {
            if (window.console && window.console.clear) {
                window.console.clear();
            }
        },
        exception: function (message, e) {
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        },
        log: function (message) {
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        },
        assert: function (falsey, message) {
            if (ns.traceEnabled && window.console && window.console.assert) {
                window.console.assert(falsey, message);
            }
        },
        error: function (message) {
            if (ns.traceEnabled && window.console && window.console.error) {
                window.console.error(message);
            }
        },
        warn: function (message) {
            if (ns.traceEnabled && window.console && window.console.warn) {
                window.console.warn(message);
            }
        },
        info: function (message) {
            if (ns.traceEnabled && window.console && window.console.info) {
                window.console.info(message);
            }
        },
        dir: function (obj) {
            if (ns.traceEnabled && window.console && window.console.dir) {
                try {
                    window.console.dir(obj);
                }
                catch(ex) {
                    window.console.dir(ex);
                }
            }
        },
        //Sends a message if expression evaluates to false
        assert: function (expression, message) {
            if (ns.traceEnabled && window.console && window.console.assert) {
                window.console.assert(expression, message);
            }
        },


        funcTrace: function (callingArgs, name) {
            var fun = name ? name + "()" : callingArgs.callee.caller.toString().split(')')[0] + ")";
            fun += " -> ";

            for (var i = 0; i < callingArgs.length; i++) {
                var item = callingArgs[i];
                if (typeof item === 'function') {
                    fun += ' ' + item.toString().split('(')[0] + ', ';
                }
                else {
                    fun += ' ' + item + ', ';
                }
            }
            ns.trace.log(fun);
        },

        alert: function (text) {
            window.alert && window.alert(text);
        },

        writeLog: function (text) {
            var fun = text + " -> ";
            for (var i = 1; i < arguments.length; i++) {
                var item = arguments[i];
                if (typeof item === 'function') {
                    fun += ' ' + item.toString().split('(')[0] + ', ';
                }
                else {
                    fun += ' ' + item + ', ';
                }
            }

            ns.trace.log(fun);
        },
        p: function (text, target) {
            var oDiv = document.createElement("div");
            oDiv.innerHTML = "<p>" + toText(text) + "</p>";
            oDiv.style.color = '#0000FF';
            oDiv.setAttribute("class", "foundry-trace");
            var debug = document.getElementById("debug");
            var site = target || debug || document.body;
            site.appendChild(oDiv);
            return oDiv;
        },

        br: function (target) {
            var oDiv = document.createElement("div");
            oDiv.innerHTML = "<br/>";
            oDiv.style.color = '#0000FF';
            oDiv.setAttribute("class", "foundry-trace");
            var debug = document.getElementById("debug");
            var site = target || debug || document.body;
            site.appendChild(oDiv);
            return oDiv;
        },

        pre: function (text, target) {
            var oDiv = document.createElement("div");
            oDiv.innerHTML = "<pre>" + toText(text) + "</pre>";
            oDiv.style.color = '#0000FF';
            oDiv.setAttribute("class", "foundry-trace");
            var debug = document.getElementById("debug");
            var site = target || debug || document.body;
            site.appendChild(oDiv);
            return oDiv;
        },

        w: function (text, target) {
            var oDiv = document.createElement("div");
            oDiv.innerHTML = toText(text) + "<br />";
            oDiv.style.color = '#0000FF';
            oDiv.setAttribute("class", "foundry-trace");
            var debug = document.getElementById("debug");
            var site = target || debug || document.body;
            site.appendChild(oDiv);
            return oDiv;
        },

        clear: function (target) {
            var debug = document.getElementById("debug");
            var site = target || debug || document.body;
            site.innerHTML = "";
            this.clr();
            return true;
        },

        timerStart: function (text) {
            var div = this.w("start :" + toText(text)).style;
            div.backgroundColor = '#000000';
            div.color = '#FFFFFF';
            return { time: Date.now(), text: text };
        },

        timerReport: function (timer, text) {
            var dif = (Date.now() - timer.time) / 1000;
            var div = this.w("report:" + timer.text + " (" + dif + " sec) " + ((text == undefined) ? "" : text)).style;
            div.backgroundColor = '#000000';
            div.color = '#FFFFFF';
            return { time: Date.now(), text: text || timer.text };
        },

        reportValueChange: function (prop) {
            var ref = prop.asReference();
            if (prop.initValueComputed) {
                return this.w("change: " + ref + " is changed to formula: " + prop.init.toString());
            }
            else {
                var json = "<pre>" + prop.owner.stringify(prop) + "</pre>";
                return this.w("change: " + ref + " is changed to: " + json);
            }
        },

        reportValueSmash: function (prop) {
            var name = prop.asReference();
            var state = prop.formula === undefined ? "V: " + prop.value : "F: " + prop.formula.toString();
            return this.w("smash: " + name + " status: " + prop.status + " " + state);
        },

        varifyValue: function (oTarget, Name, result, site) {
            if (oTarget[Name] === result) {
                this.w("CORRECT! The value of " + Name + " == " + result, site).style.color = '#00FF00';
            }
            else {
                this.w("ERROR    The value of " + Name + "(" + oTarget[Name] + ") != " + result, site).style.color = '#FF0000';
            }
        },

        reportValue: function (oTarget, Name, site) {
            this.w("The value of Property: " + Name + " is " + oTarget[Name], site);
            if (oTarget[Name] instanceof ns.Collection) {
                var array = oTarget[Name].elements;
                for (var i = 0; i < array.length; i++) {
                    this.w("[" + i + "] is " + array[i], site);
                }
            }
        },

        reportProperties: function (oTarget, site) {
            var sKeys = Object.keys(oTarget);
            for (var i = 0; i < sKeys.length; i++) {
                var key = sKeys[i];
                if ('_' === key[0]) this.reportValue(oTarget, key.substring(1), site);
            }
        },

        reportPropertyState: function (oTarget, privateName, site) {
            var property = oTarget[privateName];
            var name = property.asReference();
            var state = property.formula === undefined ? "V:" + property.value : "F:" + property.formula.toString();
            state = property.status !== undefined ? "Value=|" + property.value + "|" : state;
            this.w("Property: " + name + " status: " + property.status + " " + state, site);
        },

        reportState: function (oTarget, site) {
            var sKeys = Object.keys(oTarget);
            for (var i = 0; i < sKeys.length; i++) {
                var key = sKeys[i];
                if ('_' === key[0]) this.reportPropertyState(oTarget, key, site);
            }
        },

        reportDependencyState: function (oTarget, privateName, site) {
            var that = this;

            function refAndStat(prop) {
                var val = !ns.utils.isArray(prop.value) ? prop.value : "array[" + prop.value.length + "]total";
                return "|{0} s: {1} v: {2}| ".format(prop.asReference(), prop.status, val);
            };

            var property = oTarget[privateName];
            var dependsOn = property.thisValueDependsOn

            if (dependsOn && dependsOn[0]) {
                dependsOn.forEach(function (item) {
                    that.w(refAndStat(property) + " Depends on " + refAndStat(item));
                });
            }
            else {
                that.w(refAndStat(property) + " Depends on NOTHING ");
            };

            var informsThese = property.thisInformsTheseValues
            if (informsThese && informsThese[0]) {
                informsThese.forEach(function (item) {
                    that.w(refAndStat(property) + " Informs " + refAndStat(item));
                });
            }
            else {
                that.w(refAndStat(property) + " Informs NOTHING ");
            };
        },

        reportDependencyNetwork: function (oTarget, site) {
            var sKeys = Object.keys(oTarget);
            for (var i = 0; i < sKeys.length; i++) {
                var key = sKeys[i];
                if ('_' === key[0]) this.reportDependencyState(oTarget, key, site);
            }
        },

        inspectProperty: function (oTarget, privateName, site) {
            var property = oTarget[privateName];
            //if (ns.utils.isaCollection(property.value) && property.value.count == 0) return;

            this.w("Property: " + property.asReference(), site);
            this.pre(property.stringify(), site);
        },

        inspect: function (oTarget, site) {
            var sKeys = Object.keys(oTarget);
            for (var i = 0; i < sKeys.length; i++) {
                var key = sKeys[i];
                if ('_' === key[0]) this.inspectProperty(oTarget, key, site);
            }
            this.dir(oTarget);
        },





        reportStructure: function (obj, displayFn, target) {
            if (displayFn === undefined) {
                displayFn = function (item) {
                    return item.toString();
                }
            }

            function renderNode(node) {

                var display = displayFn(node);
                var html = ns.dom.div(display); //+ ":- <span data-bind='innerText: ScoreText' />");

                var result = ns.dom.li(html, node.getID());

                if (node.Subcomponents.isNotEmpty()) {
                    //using map reduce syntax.... makes recursion way too easy
                    result = node.Subcomponents.mapReduce(
                         //function (x) { return ns.dom.li(ns.dom.ul(renderNode(x))); },
                        function (x) { return ns.dom.ul(renderNode(x)); },
                        function (a, b) { return a += b; },
                        result);
                }

                return result;
            };

            var html = renderNode(obj);

            var debug = document.getElementById("debug");
            var site = target || debug || document.body;
            var rootElement = document.createElement("div");

            site.appendChild(rootElement);

            rootElement.innerHTML = html;

        },
    }


}(Foundry));









///#source 1 1 /Foundry/Foundry.core.extensions.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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
var fo = Foundry;


(function (ns, undefined) {

    if (!Array.prototype.every) {
        Array.prototype.every = function (predicate) {
            var t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                if (i in t && !predicate.call(arguments[1], t[i], i, t)) {
                    return false;
                }
            }
            return true;
        };
    }

    if (!Array.prototype.map) {
        Array.prototype.map = function (selector) {
            var results = [], t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                if (i in t) {
                    results.push(selector.call(arguments[1], t[i], i, t));
                }
            }
            return results;
        };
    }

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (predicate) {
            var results = [], item, t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                item = t[i];
                if (i in t && predicate.call(arguments[1], item, i, t)) {
                    results.push(item);
                }
            }
            return results;
        };
    }

    if (!Array.prototype.firstWhere) {
        Array.prototype.firstWhere = function (whereClause) {
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var ok = (whereClause == undefined) ? true : whereClause(item);
                if (ok) return item;
            }
        }
    }

    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) == '[object Array]';
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function indexOf(item) {
            var self = new Object(this), length = self.length >>> 0;
            if (!length) {
                return -1;
            }
            var i = 0;
            if (arguments.length > 1) {
                i = arguments[1];
            }
            i = i >= 0 ? i : Math.max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    if (!Array.prototype.insert) {
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
    }


    if (!Array.prototype.max) {
        Array.prototype.max = function () {
            if (this.length == 0) return undefined;
            var n = Number(this[0]);
            for (var i = 1; i < this.length; i++) { n = Math.max(n, this[i]) };
            return n;
        }
    }

    if (!Array.prototype.min) {
        Array.prototype.min = function () {
            if (this.length == 0) return undefined;
            var n = Number(this[0]);
            for (var i = 1; i < this.length; i++) { n = Math.min(n, this[i]) };
            return n;
        }
    }

    if (!Array.prototype.sortOn) {
        Array.prototype.sortOn = function (field, dec) {
            var dir = dec ? -1 : 1;
            if (field) {
                return this.sort(function (a, b) {
                    return (a[field] < b[field] ? -1 * dir : (a[field] > b[field] ? 1 * dir : 0))
                });
            }
            return this;
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (applyFunc) {
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                applyFunc(this[i]);
            }
        };
    }

    if (!Array.prototype.indexOfFirst) {
        Array.prototype.indexOfFirst = function (predicate) {
            for (var i = 0, j = this.length; i < j; i++) {
                if (predicate(this[i])) return i;
            }
            return -1;
        }
    }

    if (!Array.prototype.itemByIndex) {
        Array.prototype.itemByIndex = function (index) {
            if (index < 0 || index > this.length) return undefined;
            return this[index];
        }
    }

    if (!Array.prototype.contains) {
        Array.prototype.contains = function (item) {
            for (var i = 0, j = this.length; i < j; i++) {
                if (this[i] == item) return true;
            }
        }
    }


    if (!Array.prototype.distinctItems) {
        Array.prototype.distinctItems = function () {
            var result = [];
            for (var i = 0, j = this.length; i < j; i++) {
                if (result.indexOf(this[i]) < 0)
                    result.push(this[i]);
            }
            return result;
        }
    }

    if (!Array.prototype.addNoDupe) {
        Array.prototype.addNoDupe = function (element) {
            if (this.length === 0) {
                this.push(element);
            }
            else if (this.length === 1 && element !== this[0]) {
                this.push(element);
            }
            else {
                found = this.indexOf(element);
                if (found === -1) {
                    this.push(element);
                }
            }
        };
    };

    if (!Array.prototype.prependNoDupe) {
        Array.prototype.prependNoDupe = function (element) {
            if (this.length === 0) {
                this.push(element);
            }
            else if (this.length === 1 && element !== this[0]) {
                this.splice(0, 0, element);
            }
            else {
                found = this.indexOf(element);
                if (found === -1) {
                    this.splice(0, 0, element);
                }
            }
        };
    };

    if (!Array.prototype.peek) {
        Array.prototype.peek = function () {
            if (this.length > 0) {
                var i = this.length - 1;
                return this[i];
            }
        }
    };

    if (!Array.prototype.isEmpty) {
        Array.prototype.isEmpty = function () {
            return this.length == 0;
        }
    };

    if (!Array.prototype.isNotEmpty) {
        Array.prototype.isNotEmpty = function () {
            return this.length > 0;
        }
    };


    //http://stackoverflow.com/questions/500606/javascript-array-delete-elements
    // Array Remove - By John Resig (MIT Licensed)
    if (!Array.prototype.remove) {
        Array.prototype.remove = function (from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };
    }

    if (!Array.prototype.removeItem) {
        Array.prototype.removeItem = function (item) {
            var index = this.indexOf(item);
            if (index < 0) return this;
            return this.remove(index);
        };
    }

    if (!Array.prototype.duplicate) {
        Array.prototype.duplicate = function () {
            var result = new Array(this.length);
            for (var i = 0; i < this.length; i++) {
                result[i] = this[i];
            }
            return result;
        };
    }

    if (!Array.prototype.uniqueValue) {
        Array.prototype.uniqueValue = function (groupClause, hash) {
            var result = hash ? hash : {};
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var key = groupClause(item);
                result[key] ? result[key] += 1 : result[key] = 1;
            }
            return result;
        }
    }

    if (!Array.prototype.groupBy) {
        Array.prototype.groupBy = function (groupClause, hash) {
            var result = hash ? hash : {};
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var key = groupClause(item);
                result[key] ? result[key].push(item) : result[key] = [item];
            }
            return result;
        }
    }

    function arrayInitialize(count, factory) {
        var a = new Array(count);
        for (var i = 0; i < count; i++) {
            a[i] = factory();
        }
        return a;
    }

    function loopForEachValue(obj, mapFunc) {  //funct has 2 args.. key,value
        var keys = obj ? Object.keys(obj) : [];
        keys.forEach(function (key) {
            var value = obj[key];
            mapFunc(key, value);
        });
    };



    // End of Utilities and Array Ploy fill

    //Start of extensions
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };

    String.prototype.ltrim = function () {
        return this.replace(/^\s+/, '');
    };

    String.prototype.rtrim = function () {
        return this.replace(/\s+$/, '');
    };

    String.prototype.fulltrim = function () {
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };

    String.prototype.removeSpaces = function () {
        return this.replace(/\s+/g, '');
    }

    //'The {0} is dead. Don\'t code {0}. Code {1} that is open source!'.format('ASP', 'PHP');

    String.prototype.format = function () {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };


    if (!String.prototype.matches) {
        String.prototype.matches = function (str) {
            if (str) return this.toLocaleLowerCase() == str.toLocaleLowerCase();

            return str == this;
        };
    }

    String.prototype.startsWith = function (str) {
        return (this.match("^" + str) == str);
    };

    String.prototype.endsWith = function (str) {
        return (this.match(str + "$") == str);
    };

    String.prototype.containsString = function (it) {
        return this.indexOf(it) != -1;
    };

    if (!String.prototype.contains) {
        String.prototype.contains = function (it) {
            return this.toLocaleLowerCase().containsString(it.toLocaleLowerCase());
        };
    }

    String.prototype.begins = function (str) {
        return this[0] === str;
    };

    String.prototype.ends = function (str) {
        return this[this.length - 1] === str;
    };

    //http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
    if (!Function.prototype.debounce) {
        Function.prototype.debounce = function (threshold, execAsap) {
            var func = this, // reference to original function
                timeout; // handle to setTimeout async task (detection period)
            // return the new debounced function which executes the original function only once
            // until the detection period expires
            return function debounced() {
                var obj = this, // reference to original context object
                    args = arguments; // arguments at execution time
                // this is the detection function. it will be executed if/when the threshold expires
                function delayed() {
                    // if we're executing at the end of the detection period
                    if (!execAsap)
                        func.apply(obj, args); // execute now
                    // clear timeout handle
                    timeout = null;
                };
                // stop any current detection period
                if (timeout)
                    clearTimeout(timeout);
                    // otherwise, if we're not already waiting and we're executing at the beginning of the detection period
                else if (execAsap)
                    func.apply(obj, args); // execute now
                // reset the detection period
                timeout = setTimeout(delayed, threshold || 100);
            };
        }
    }

    if (!Function.prototype.wait100) {
        Function.prototype.wait100 = function () {
            var func = this;// this is the function that is extended
            var args = arguments; // arguments to be passed to it
            function delayed() {
                return func.apply(func, args); // execute now
            }
            setTimeout(delayed, 100);
        }
    }
    if (!Function.prototype.wait200) {
        Function.prototype.wait200 = function () {
            var func = this;// this is the function that is extended
            var args = arguments; // arguments to be passed to it
            function delayed() {
                return func.apply(func, args); // execute now
            }
            setTimeout(delayed, 200);
        }
    }
    if (!Function.prototype.wait500) {
        Function.prototype.wait500 = function () {
            var func = this;// this is the function that is extended
            var args = arguments; // arguments to be passed to it
            function delayed() {
                return func.apply(func, args); // execute now
            }
            setTimeout(delayed, 500);
        }
    }
    if (!Function.prototype.wait1000) {
        Function.prototype.wait1000 = function () {
            var func = this;// this is the function that is extended
            var args = arguments; // arguments to be passed to it
            function delayed() {
                return func.apply(func, args); // execute now
            }
            setTimeout(delayed, 1000);
        }
    }

	
}(Foundry));
///#source 1 1 /Foundry/Foundry.core.utils.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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
var fo = Foundry;


(function (ns, undefined) {

    ns.lastGUID = 0;
    ns.newGuid = function () {
        ns.lastGUID += 1;
        return ns.lastGUID;
    }


    //http://jsperf.com/split-and-join-vs-replace2
    //http://mattsnider.com/parsing-javascript-function-argument-names/

    ns.utils = {
        replaceAll: function (x, y) {
            return this.split(x).join(y);
        },
        createID: function (name) {
            var guid = ns.newGuid();
            if (name) {
                guid = new String(name).replace(/ /g, '_') + '_' + guid;
            }
            return guid;
        },
        //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        generateUUID: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        },
        removeCRLF: function (text) {
            return text.replace(/(\r\n|\n|\r)/gm, ' ');
        },
        removeExtraSpaces: function (text) {
            return text.replace(/\s{2,}/g, ' ');
        },
        removeJSComments: function (text) {
            return text.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');//http://james.padolsey.com/javascript/removing-comments-in-javascript/
        },
        cleanFormulaText: function (formula) {
            var text = formula.toString();
            return ns.utils.removeExtraSpaces(ns.utils.removeCRLF(ns.utils.removeJSComments(text)));
        },
        cleanTemplateHtml: function (html) {
            var text = html;
            return ns.utils.removeCRLF(html);
        },
        capitaliseFirstLetter: function (name) {
            var string = ns.utils.asString(name);
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        asString: function (obj) {
            return obj === undefined ? "" : obj.toString();
        },
        asInt: function (value, defaultValue) {
            var otherwise = defaultValue ? defaultValue : 0;
            var result = parseInt(value);
            return isNaN(result) ? otherwise : result;
        },
        isArray: function (obj) {
            if (Array.isArray) return Array.isArray(obj);
            return (Object.prototype.toString.call(obj) === '[object Array]') ? true : false;
        },
        isFunction: function (obj) {
            return typeof obj === 'function';
        },
        isString: function (obj) {
            return typeof obj === 'string';
        },
        isNumber: function (obj) {
            return typeof obj === 'number';
        },
        isObject: function (obj) {
            return obj && typeof obj === 'object'; //prevents typeOf null === 'object'
        },
        asArray: function (obj) {
            if (ns.utils.isaCollection(obj)) return obj.elements;
            return ns.utils.isArray(obj) ? obj : obj === undefined ? [] : [obj];
        },
        objectToArray: function (obj) {
            if (ns.utils.isaCollection(obj)) return obj.elements;
            if (ns.utils.isArray(obj)) return obj;
            if (ns.utils.isObject(obj)) {
                var array = [];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        array.push(obj[key]);
                    }
                }
                return array;
            };
            return obj ? [obj] : undefined;
        },
        removeDuplicates: function (origArray) {
            var newArr = [];
            var origLenth = origArray.length;

            for (var x = 0; x < origLenth; x++) {
                var found = undefined;
                for (var y = 0; y < newArr.length; y++) {
                    if (origArr[x] === newArr[y]) {
                        found = true;
                        break;
                    }
                }
                if (!found) newArr.push(origArr[x]);
            }
            return newArr;
        },
        getParamNames: function (fn) {
            var funStr = fn.toString();
            return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
        },
        hasAspect: function (obj, key) {
            return obj && (obj[key] || obj[key.toLowerCase()]);
        },
        getAspectOrDefault: function (obj, key) {
            if (obj[key]) return obj[key];
            if (obj[key.toLowerCase()]) return obj[key.toLowerCase()];
            return obj;
        },
        extractSlots: function (obj, predicate) {
            var result = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var init = obj[key];
                    if (predicate(init)) {
                        result[key] = init;
                    }
                }
            }
            return result;
        },
        isSelf: function (ref) {
            return ref.matches('@') || ref.matches('this') || ref.matches('self')
        },
        isaCollection: function (obj) {
            return obj instanceof ns.Collection ? true : false;
        },
        asCollection: function (obj, parent) {
            return ns.utils.isaCollection(obj) ? obj : new ns.Collection(ns.utils.asArray(obj), parent);
        },
        isaComponent: function (obj) {
            return obj instanceof ns.Component ? true : false;
        },
        isaRelationship: function (obj) {
            return obj instanceof ns.Relationship ? true : false;
        },
        isaProperty: function (obj) {
            return obj instanceof ns.Property ? true : false;
        },
        isManaged: function (obj) {
            return this.isaComponent(obj) || this.isaCollection(obj) || this.isaProperty(obj);
        },
        isArrayOrCollection: function (obj) {
            return this.isArray(obj) || this.isaCollection(obj);
        },
        isaPromise: function (obj) {
            return obj instanceof ns.Promise ? true : false;
        },
        forEachValue: function (obj, mapFunc) {  //funct has 2 args.. key,value
            var list = [];
            var keys = obj ? Object.keys(obj) : [];
            keys.forEach(function (key) {
                var value = obj[key];
                var result = mapFunc(key, value);
                if (result) list.push(result);
            });
            return list;
        },
        findKeyForValue: function (obj, key) {
            for (var name in obj) {
                if (obj[name].matches(key)) return name;
            }
        },
        // can be used like: persons.filter(propEq("firstName", "John"))
        propEq: function (propertyName, value) {
            return function (obj) {
                return obj[propertyName] === value;
            };
        },
        debounce: function (func, threshold, execAsap) {
            return func.debounce(threshold, execAsap);
        },
        // can be used like persons.map(pluck("firstName"))
        pluck: function (propertyName) {
            return function (obj) {
                return obj[propertyName];
            };
        },
        getNamespace: function(obj){
            var myNamespace = obj.myType.split('::');
            myNamespace = myNamespace[0];
            return myNamespace;
        },
        getType: function (obj) {
            var myType = obj.myType.split('::');
            myType = myType.length == 2 ? myType[1] : myType[0];
            return myType;
        },
        isComment: function (str) {
            return str.startsWith('//');
        },
        comment: function (str) {
            if (ns.utils.isComment(str)) return str;
            return '//' + str;
        },

        unComment: function (str) {
            if (!ns.utils.isComment(str)) return str;
            return str.substring(2);
        },
        bindingStringToObject: function (sQuery) {
            var result = undefined;
            if (sQuery) {
                var array = sQuery.split(',');
                for (var i = 0; i < array.length; i++) {
                    var oItem = array[i];
                    var oKVpair = oItem.split(':');
                    if (oKVpair.length == 1) continue;
                    result = result || {};
                    var key = decodeURI(oKVpair[1].trim());
                    var value = decodeURI(oKVpair[0].trim());
                    result[key] = value;
                }
            }

            return result;
        },

        stylingStringToObject: function (sQuery) {
            var result = undefined;
            if (sQuery) {
                var array = sQuery.split(',');
                for (var i = 0; i < array.length; i++) {
                    var oItem = array[i];
                    var oKVpair = oItem.split(':');
                    if (oKVpair.length == 1) continue;
                    result = result || {};
                    var key = decodeURI(oKVpair[0].trim());
                    var value = decodeURI(oKVpair[1].trim());
                    result[key] = value;
                }
            }
            return result;
        },
        //return a dictionary of args
        queryStringToObject: function (sQuery, splitter) {
            var result = undefined;
            if (sQuery) {
                var splitter = splitter === undefined ? '&' : splitter;
                var array = sQuery.split(splitter);
                for (var i = 0; i < array.length; i++) {
                    var oItem = array[i];
                    if (oItem) {
                        var oKVpair = oItem.split('=');
                        if (oKVpair.length == 1) continue;
                        result = result || {};
                        var key = decodeURI(oKVpair[0].trim());
                        var value = decodeURI(oKVpair[1].trim());
                        result[key] = value;
                    }
                }
            }
            return result;
        },
        //return an array for route matching
        hashStringToArray: function (sQuery, splitter) {
            var result = undefined;
            if (sQuery) {
                var splitter = splitter === undefined ? '#' : splitter;
                var array = sQuery.split(splitter);
                for (var i = 0; i < array.length; i++) {
                    var oItem = array[i];
                    if (oItem) {
                        result = oItem.split('/').map(function (item) {
                            return decodeURI(item.trim());
                        });
                    }
                }
            }

            return result;
        },

        objectToQueryString: function (obj, start) {
            var result = ""
            if (obj) {
                var keys = Object.keys(obj);
                if (keys.length > 0) {
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (obj[key] === undefined) continue;
                        result += "&" + key + "=" + obj[key];
                    }
                    if (start) {
                        result = "?" + result.substring(1);
                    }
                }
            }
            return result;
        },
        clone: function (obj) {
            //http://www.xenoveritas.org/comment/1688#comment-1688
            //nowadays you can clone objects with
            //CLONEDOLLY = JSON.parse(JSON.stringify(DOLLY));
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                var copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }
            // Handle Array
            if (obj instanceof Array) {
                var copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = ns.utils.clone(obj[i]);
                }
                return copy;
            }
            if (obj instanceof Object) {
                var copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = ns.utils.clone(obj[attr]);
                }
                return copy;
            }
            throw new Error("Unable to copy obj! Its type isn't supported.");
        },
        getOwnPropertyValues: function (source) {
            var result = [];
            for (var name in source) {
                if (hasOwnProperty.call(source, name)) {
                    result.push(source[name]);
                }
            }
            return result;
        },
        makeComputedValue: function (obj, key, init) {
            var initValueComputed = ns.utils.isFunction(init);
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    if (!initValueComputed) return init;
                    result = init.call(obj, obj);
                    return result;
                },
            });
            return obj;
        },
        extendWithComputedValues: function (obj, spec) {
            //let make some custom getters...
            if (obj && spec) {
                for (var key in spec) {
                    if (hasOwnProperty.call(spec, key)) {
                        ns.utils.makeComputedValue(obj, key, spec[key]);
                    }
                }
            }
            return obj;
        },
        extend: function (target, source) {
            if (!source) return target;
            for (var name in source) {
                if (hasOwnProperty.call(source, name)) {
                    target[name] = source[name];
                }
            }
            return target;
        },

        mixExtend: function (target, source) {
            if (!source) return target;
            for (var name in source) {
                if (!hasOwnProperty.call(target, name)) {
                    target[name] = source[name];
                }
            }
            return target;
        },


        mixin: function (target, source) {
            if (!source) return target;
            if (!target) return source;
            for (var name in source) {
                target[name] = source[name];
            }
            return target;
        },
        mixout: function (target, source) {
            if (!source) return target;
            if (!target) return source;
            for (var key in source) {
                if (target.hasOwnProperty(key)) {
                    delete target[key];
                }
            }
            return target;
        },
        //return a new object
        union: function (target, source) {
            var result = {};
            if (target) {
                for (var name in target) {
                    result[name] = target[name];
                }
            }
            if (source) {
                for (var name in source) {
                    result[name] = source[name];
                }
            }
            return result;
        },
        getEvent: function (e) {
            var event = e || window.event;
            return event;
        },
        getEventSource: function (e) {
            var event = ns.utils.getEvent(e);
            var elm = event.srcElement || event.originalTarget;
            return elm;
        },
        getParentElement: function (element) {
            if (element && element.parentNode) {
                return element.parentNode;
            }
        },
        getParentElementWithClassName: function (element, className) {
            var result = element;
            if (className) {
                while (result && result.className != className && result.parentNode) {
                    result = result.parentNode;
                }
            }
            else if (result) {
                result = result.parentNode;
            }
            return result;
        },
        getParentElementWithAttribute: function (element, attribute) {
            for (var result = element; result && result.hasAttribute && result.hasAttribute(attribute) == false; result = result.parentNode) {
            }
            var success = result && result.hasAttribute && result.hasAttribute(attribute) ? result : undefined;
            return success;
        },
        urlCasheBuster: function (url) {
            var cachebuster = Math.round(new Date().getTime() / 1000);
            var bust = url.indexOf('?') >= 0 ? '&cb=' : '?cb='

            return url + bust + cachebuster;
        },
        xmlHttpGet: function (url, onComplete, onFailure) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onload = function () {
                var result = xmlHttp.responseText;
                onComplete && onComplete(result, xmlHttp);
            };
            try {
                xmlHttp.open("GET", url, false);
                xmlHttp.send(null);
            }
            catch (ex) {
                onFailure && onFailure(ex, xmlHttp);
            }
        },
        loadTemplate: function(url, onComplete){
            ns.utils.xmlHttpGet(url, function (text, xhr) {
                var head = document.getElementsByTagName("head")[0];
                var script = document.createElement('div');

                script.innerHTML = text;
                head.appendChild(script);
                onComplete && onComplete();
            });
        },
        // discover own file name and line number range for filtering stack traces
        captureLine: function() {

            function getFileNameAndLineNumber(stackLine) {
                // Named functions: "at functionName (filename:lineNumber:columnNumber)"
                // In IE10 function name can have spaces ("Anonymous function") O_o
                var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
                if (attempt1) {
                    return [attempt1[1], Number(attempt1[2])];
                }

                // Anonymous functions: "at filename:lineNumber:columnNumber"
                var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
                if (attempt2) {
                    return [attempt2[1], Number(attempt2[2])];
                }

                // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
                var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
                if (attempt3) {
                    return [attempt3[1], Number(attempt3[2])];
                }
            }

            try {
                throw new Error();
            } catch (e) {
                var lines = e.stack.split("\n");
                var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
                var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
                if (!fileNameAndLineNumber) {
                    return;
                }

                var qFileName = fileNameAndLineNumber[0];
                return fileNameAndLineNumber[1];
            }
        }

    }

	
}(Foundry));
///#source 1 1 /Foundry/Foundry.core.property.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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
var fo = Foundry;


(function (ns, undefined) {

    var suspendDependencyLock = 0;
    globalDependencyLock = function (cnt) {
        suspendDependencyLock = suspendDependencyLock + cnt;
        if (suspendDependencyLock == 0) {
            return suspendDependencyLock;
        }
        return suspendDependencyLock;
    };

    ns.suspendDependencies = function (callback, target) {
        globalDependencyLock(1);
        callback && callback(target);
        globalDependencyLock(-1);
    }


    var Property = function (owner, name, init) {
        //"use strict";
        // Add an accessor property to the object.
        var namePrivate = "_" + name;
        if (init == null) { //very special case that makes smash to unselected very easy
            init = function () { return null; };
        }

        var initValueComputed = ns.utils.isFunction(init);
        if (init === fo.fromParent) {
            init = function () {
                return fo.fromParent.call(owner, name);
            }
        }

        this.myName = name;
        this.owner = owner;


        //if this value is init as undefined, the status is also undefined and normal value
        //resolution should take place...
        this.formula = initValueComputed ? init : undefined;
        this.status = !initValueComputed && init !== undefined ? "init" : undefined;
        this.value = !initValueComputed ? init : undefined;

        this.thisValueDependsOn = undefined;
        this.thisInformsTheseValues = undefined;
        this.uiBindings = undefined;
        this.onRefreshUi = undefined;
        this.onValueSet = undefined;
        this.onValueDetermined = undefined;
        this.onValueSmash = undefined;

        //you may be to create Components from this collection Spec
        if (ns.utils.isaCollectionSpec(this.value)) {
            var collection = this.value.createCollection(owner); //necessary to maintain observablilty
            collection.myName = name;
            this.value = collection;
        }
            //you may be to clone and reattach this collection 
        else if (ns.utils.isaCollection(this.value) && this.value.owner === undefined) {
            var collection = ns.makeCollection(this.value.elements, owner); //necessary to maintain observablilty
            collection.myName = name;
            this.value = collection;
        }


        Object.defineProperty(owner, name, {
            enumerable: true,
            configurable: true,

            set: function (init) {
                var p = owner[namePrivate];
                var oldValue = p.value;

                var initValueComputed = ns.utils.isFunction(init);
                var newValue = !initValueComputed ? init : undefined;
                var noChange = oldValue == newValue;

                //should anything be done?  
                if (p.status && noChange && !initValueComputed) return;

                if (p.guard) {
                    p.smash();
                    return;
                }


                if (owner.withDependencies) {
                    p.smash();
                    p.removeSmashTrigger();
                }
                else if (init === undefined && p.formula !== undefined) {
                    newValue = p.formula.call(p.owner);
                }

                p.value = newValue;
                p.formula = initValueComputed ? init : p.formula;
                p.status = !initValueComputed ? "given" : undefined;


                fo.publishNoLock('setValue', [p, newValue]);

                //when the value is set directly, it can notify the UI right away
                if (!initValueComputed) {
                    ns.markForRefresh(p);  //the should run right away if no lock
                    if (p.onValueSet) {
                        p.onValueSet.call(p, newValue, p.formula, p.owner);
                    }
                    if (p.formula) {
                        if (p.validate) p.validate.call(p, newValue, p.owner);
                    }
                }

            },

            get: function () {
                var p = owner[namePrivate];
                var result;

                var mustCompute = p.status === undefined;

                if (!owner.withDependencies) {
                    if (mustCompute && p.formula !== undefined) {
                        result = p.formula.call(p.owner);
                        fo.publishNoLock('setValueTo', [p, result]);
                        p.value = result;
                    }
                    return p.value;
                }

                var gComputeStack = owner.globalComputeStack();

                var oDependentValue = gComputeStack ? gComputeStack.peek() : undefined;
                if (!mustCompute) {
                    if (oDependentValue === undefined) return p.value;

                    oDependentValue.addDependency(p);
                    fo.publishNoLock('getValue', [p, p.value]);
                    return p.value;
                }
                else if (oDependentValue === p) {
                    fo.publishNoLock('getValue', [p, p.value]);
                    return p.value;
                }

                    //fully implemented formula dependency tracking 
                else if (mustCompute) {
                    fo.publishNoLock('mustCompute', [p]);

                    if (p.formula !== undefined) {
                        gComputeStack && gComputeStack.push(p);
                        result = p.formula.call(p.owner, p);

                        //undefined results implies that this formula will always recompute when asked..
                        //if you require it to cashe the value return the REAL value to be chashed 

                        p.status = result === undefined ? undefined : 'calculated';
                        var top = gComputeStack ? gComputeStack.pop() : p;
                        if (top != p) {
                            ns.trace && ns.trace.alert("during compute: Something is not working");
                        }
                    }
                    else {
                        //should we be looking for a default value other that undefined?
                        result = p.defaultValue;
                        if (result === undefined && ns.utils.isFunction(p.defaultFormula)) {
                            result = p.defaultFormula.call(p.owner, p);
                        }
                        p.status = result === undefined ? undefined : 'default';

                        //ns.trace.alert(p.asReference + " missing formula");
                    }

                    if (oDependentValue) {
                        oDependentValue.addDependency(p);
                    }

                    //we found a new collection set is up so we can observe it...
                    //list a filtered list
                    if (ns.utils.isaCollection(result) && result.owner === undefined) {
                        result.owner = owner; //necessary to maintain observablilty
                        result.myName = name;
                    }
                    fo.publishNoLock('setValueTo', [p, result]);

                    if (p.onValueDetermined) {
                        p.onValueDetermined.call(p, result, p.formula, p.owner);
                    }
                    p.value = result;
                }
                return result;
            },

        });

        owner[namePrivate] = this;
        return this;
    }

    Property.prototype = {

        getID: function () {
            if (this.guid) return this.guid;
            this.guid = ns.utils.createID(this.myName);
            return this.guid;
        },



        redefine: function (init, guard) {
            this.smash();
            var initValueComputed = ns.utils.isFunction(init);
            this.formula = initValueComputed ? init : undefined;
            this.status = !initValueComputed ? "given" : undefined;
            this.value = !initValueComputed ? init : undefined;
            if (guard) this.guard = guard;
        },

        asLocalReference: function () {
            try {
                if (!this.owner._name) {
                    return this.myName + "@" + this.owner.myName;

                }
                else if (this.owner._name && this.owner._name.status) {
                    return this.myName + "@" + this.owner.myName;
                }
                else {
                    return this.myName + "@OWNER_NAME_NOT_COMPUTED";
                }
            }
            catch (ex) {
                return this.myName + "@???";
            }
        },

        asReference: function () {
            return this.myName + "@" + this.owner.asReference();
        },

        asDisplayValue: function () {
            if (fo.utils.isManaged(this.value)) return '=> ' + this.value.myName;
            return this.value;
        },

        resolveReference: function (reference) {
            if (this.myName.match(reference) || ns.utils.isSelf(reference)) return this;
            var result = this.owner.resolveReference(reference);
            return result;
        },

        resolveSuperior: function (reference) {
            if (this.myName.match(reference) || ns.utils.isSelf(reference)) return this;
            var result = this.owner.resolveSuperior(reference);
            return result;
        },

        resolveProperty: function (reference) {
            var result = {};

            result.property = this;
            result.meta = reference && '@'.matches(reference) ? undefined : reference;

            return result;
        },

        getProperty: function (name, search) {
            if (name.matches(this.myName)) return this;
            return search && this.owner ? this.owner.getProperty(name, search) : undefined;
        },

        smashProperty: function (name, search) {
            var property = this.getProperty(name, search);
            if (property && property.status) {
                property.smash();
            }
            return property;
        },

        smashPropertyTree: function (name) {
            var property = this.smashProperties(name);
            var parent = this.myParent;
            return parent ? parent.smashPropertyTree(name) : property;
        },

        smashPropertyBranch: function (name) {
            this.smashProperties(name);
            this.Subcomponents.forEach(function (item) {
                item.smashPropertyBranch(name);
            });
        },

        addDependency: function (prop) {
            //prevent adding a dependency to yourself
            if (this === prop) return this;
            if (suspendDependencyLock) {
                return this;
            }

            if (this.thisValueDependsOn === undefined) {
                this.thisValueDependsOn = [];
            }

            this.thisValueDependsOn.addNoDupe(prop);
            fo.publishNoLock('nowDependsOn', [this, prop]);


            if (prop.thisInformsTheseValues === undefined) {
                prop.thisInformsTheseValues = [];
            }

            prop.thisInformsTheseValues.addNoDupe(this);
            fo.publishNoLock('nowInforms', [prop, this]);

            return this;
        },

        removeDependency: function (prop) {
            if (this.thisValueDependsOn) {
                this.thisValueDependsOn.removeItem(prop);
            }
            else {
                fo.publishNoLock('dependsOnNotRemoved', [this, prop]);
            }


            if (prop.thisInformsTheseValues) {
                prop.thisInformsTheseValues.removeItem(this);
            }
            else {
                fo.publishNoLock('informsNotRemoved', [prop, this]);
            }

            fo.publishNoLock('noLongerDependsOn', [this, prop]);


            return this;
        },

        valueDependsOnCount: function () {
            return this.thisValueDependsOn ? this.thisValueDependsOn.length : 0;
        },

        informsTheseValuesCount: function () {
            return this.thisInformsTheseValues ? this.thisInformsTheseValues.length : 0;
        },

        removeSmashTrigger: function () {
            //this part is new and is needed to set/lock values overriden by user...
            //typically this happens through UI because status and value are not SET through
            //Setter function during the calculation
            //now tell values that I previously dependend on that this value is independent
            var that = this;

            //notify values that depend on me..
            if (this.valueDependsOnCount() > 0) {
                //make a copy so the graps is not changed out during this operation
                if (this.thisValueDependsOn.length == 1) {
                    this.removeDependency(this.thisValueDependsOn[0]);
                }
                else {
                    this.thisValueDependsOn.duplicate().forEach(function (prop) {
                        that.removeDependency(prop)
                    });
                }
            }
        },

        isolateFromSmash: function () {
            if (this.thisValueDependsOn && this.thisValueDependsOn.length > 0) {
                this.removeSmashTrigger();
                this.thisValueDependsOn = [];
            }
            this.status = 'isolated';
            fo.publishNoLock('isolated', [this]);//" is now isolated, it should not smash ever again")
        },

        smash: function () {
            if (this.status) {

                if (this.onValueSmash) {
                    this.onValueSmash.call(this, this.value, this.formula, this.owner);
                }

                if (this.formula) {
                    this.status = undefined;
                }
                else if (this.status != 'init') {
                    this.status = undefined;
                }

                fo.publishNoLock('smash', [this, this.value]);

                var that = this;
                that.smashAndRemove = function (prop) {
                    prop.removeDependency(that);
                    if (prop.status) {
                        fo.publishNoLock('smashed', [that]);
                        if (prop.status) {
                            fo.publishNoLock('thenSmashes', [prop]);
                        }
                    }
                    prop.smash();
                }

                //notify values that depend on me..
                if (this.informsTheseValuesCount() > 0) {
                    //make a copy so the graps is not changed out during this operation
                    if (this.thisInformsTheseValues.length == 1) {
                        that.smashAndRemove(this.thisInformsTheseValues[0]);
                    }
                    else {
                        var list = this.thisInformsTheseValues.duplicate();
                        this.thisInformsTheseValues = [];
                        list.forEach(that.smashAndRemove);
                    }
                }

                //this should push for delay is binding to UI
                //also mark if anyone is interested on Refresh
                if (this.uiBindings || this.onRefreshUi) {
                    ns.markForRefresh(this);
                }

                //if (ns.digestLockCount > 0) {
                //    ns.markForDigest(this);
                //}
            }
            return this;
        },


        addBinding: function (binding, queueForRefresh) {
            this.uiBindings = this.uiBindings === undefined ? [] : this.uiBindings;

            if (ns.utils.isFunction(binding)) {
                this.uiBindings.push(binding);
                //put new bindings on the refresh Queue...
                //maybe we a pub sub in the future
                if (queueForRefresh !== false) {
                    ns.markForRefresh(this);
                }

            }
            else {
                ns.trace.alert("Binding must be a formula");
            }

            //if ((this.debug || this.owner.debug) && ns.trace) {
            //    ns.trace.w(this.asReference() + " binding added " + binding.toString());
            //}
            return this;
        },

        clearBinding: function () {
            if (this.uiBindings === undefined) {
                return;
            }
            this.uiBindings = undefined;
            //if ((this.debug || this.owner.debug) && ns.trace) {
            //    ns.trace.w(this.asReference() + " clear bindings ");
            //}
            return this;
        },

        purgeBindings: function (deep) {
            var result = this.uiBindings !== undefined
            if (this.uiBindings && this.uiBindings.length) {
                this.uiBindings.forEach(function (item) {
                    delete item;
                });
            }
            this.uiBindings = undefined;
            return result;
        },

        updateBindings: function () {
            if (this.uiBindings !== undefined) {
                var list = this.uiBindings.duplicate();
                try {
                    for (i = 0; i < list.length; i++) {
                        var func = list[i];
                        func.call(this, this, this.owner);
                    }
                }
                catch (err) {
                    ns.trace && ns.trace.alert(err);
                }

                //if ((this.owner.debug || this.debug) && ns.trace) {
                //    ns.trace.w("update bindings: " + this.asReference() + " status: " + this.status + " Value =" + this.value);
                //}
            }
            return this;
        },

        stringify: function (that) {
            var target = that || this;
            //http://stackoverflow.com/questions/6754919/json-stringify-function

            function ResolveCircular(key, value) {
                //if (target.hasOwnProperty(key)) {
                //    return undefined;
                //}
                switch (key) {
                    case 'owner':
                        //obsolite case 'dataContext':
                    case 'myParent':
                        return value ? value.asReference() : value;
                    case 'formula':
                        return ns.utils.isFunction(value) ? ns.utils.cleanFormulaText(value) : value;
                    case 'thisValueDependsOn':
                    case 'thisInformsTheseValues':
                    case 'uiBindings':
                    case 'onRefreshUi':
                        return undefined;
                }

                if (ns.utils.isaPromise(value)) return "Promise";
                return value;
            }

            return JSON.stringify(target, ResolveCircular, 3);
        },



        refreshUi: function () {
            this.updateBindings();
            if (this.onRefreshUi) {
                this.getValue();  //force this to be resolved before caling
                this.onRefreshUi.call(this, this, this.owner);
            }
            return this;
        },

        doCommand: function (context, meta, form) {

            if (this.status) return this.value;

            var command = this.formula;

            if (meta !== undefined && ns.utils.isFunction(this[meta])) {
                command = this[meta];  //you might want to call a local function like SMASH or refreshUI
                //maybe should return value of extra here if not a function
                return command.call(this, context);
            }
            else if (command !== undefined) {
                //do not track dependencies only because it conflicts
                //with normal execution
                var result = command.call(this.owner, context, meta, form);
                //you might be able to determine how many arg the function has
                this.status = result === undefined ? undefined : 'calculated';
                this.value = result;

                return result;
            }
            else if (command === undefined) {
                return this.getValue(meta);
            }

        },
        isValueKnown: function () {
            return this.status ? true : false;
        },
        //used in binding an get and set the value from the owner
        getValue: function (meta) {
            if (meta === undefined) {
                return this.owner[this.myName];
            };
            var item = this.getMetaData(meta);
            return item;
        },

        getValueAsync: function (meta) {
            //simulate a promise so you can use the then method to process value consistantly
            var result = this.getValue(meta);
            if (ns.utils.isaPromise(result)) return result;

            var promise = new ns.Promise(this.owner, meta);
            promise.value = result;
            return promise;
        },

        //used in binding an get and set the value from the owner
        setValue: function (init) {
            this.owner[this.myName] = init;
        },

        refreshValue: function (init) {
            var prop = this;
            ns.runWithUIRefreshLock(function () {
                prop.setValue(init)
            });
        },

        //there are additional 'meta' slots that contain Meta or Reference data on property objects
        getMetaData: function (meta, metaDefault) {
            if (meta === undefined || this[meta] === undefined) {
                return metaDefault;
            }

            var result = metaDefault;
            var slot = this[meta];

            if (ns.utils.isFunction(slot)) {
                result = slot.call(this);
            }
            else if (slot !== undefined) {
                result = slot;
            }

            //but you must return in the future to resolve this...
            if (ns.utils.isaPromise(result) && metaDefault !== undefined) {
                return metaDefault;
            }
            return result;
        },

        getMetaDataAsync: function (meta, metaInit) {
            //simulate a promise so you can use the then method to process value consistantly
            var result = this.getMetaData(meta, metaInit);
            if (ns.utils.isaPromise(result)) return result;

            result = result ? result : this.status ? this.value : undefined;
            var promise = new ns.Promise(this.owner, meta);
            promise.value = result;
            return promise;
        },

        setMetaData: function (meta, metaInit) {
            if (meta !== undefined) {
                this[meta] = metaInit;
            }
            return this;
        },

        extendWith: function (list) {
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    this[key] = list[key];
                }
            }
            return this;
        },

        createView: function (view, id) {
            var target = view && this[view] ? this[view] : this;
            var result = target.makeUi ? target.makeUi.call(this, id) : "";
            return result;
        },

        extendUi: function (list, view) {
            var target = this;
            //if (view && this[view] === undefined) {
            //    target = this[view] = { dataContext: this };
            //} else {
            //    this.dataContext = this;
            //}

            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    target[key] = list[key];
                }
            }
            return this;
        },

        reCompute: function () {
            if (this.formula) {
                this.smash();
                return this.compute();
            }
        },

        compute: function () {
            return this.getValue();
        },
    }

    ns.Property = Property;

    var Counter = function (owner) {
        this.base = ns.Property;
        this.base(owner, 'count', function () { return this.elements.length; });
        return this;
    };

    Counter.prototype = (function () {
        var anonymous = function () { this.constructor = Counter; };
        anonymous.prototype = ns.Property.prototype;
        return new anonymous();
    })();

    Counter.prototype.smash = function () {
        var result = this.base.prototype.smash.call(this);
        return result;
    };

    Counter.prototype.addDependency = function (prop) {
        var result = this.base.prototype.smash.addDependency(this, prop);
        return result;
    };

    Counter.prototype.removeDependency = function (prop) {
        var result = this.base.prototype.smash.removeDependency(this, prop);
        return result;
    };

    Counter.prototype.asLocalReference = function () {
        var result = this.myName + "@" + this.owner.myName;
        if (this.owner.owner) result += "." + this.owner.owner.myName;
        return result;
    };

    ns.Counter = Counter;

}(Foundry));
///#source 1 1 /Foundry/Foundry.core.collectionSpec.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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
var fo = Foundry;


(function (ns, undefined) {

 
    var CollectionSpec = function (specs, baseClass, onCreate) {
        this.elements = specs ? specs : [];
        this.baseSpec = baseClass;
        this.uponCreation = onCreate;
    }

    //Prototype defines functions using JSON syntax
    CollectionSpec.prototype = {
        createCollection: function (parent) {
            var base = this.baseSpec;
            var members = this.elements.map(function (init) {
                var component = init;
                var spec = init.spec ? init.spec : ns.utils.isObject(init) ? init : undefined;;
                var name = init.myName ? init.myName : ns.utils.isString(init) ? init : undefined;

                if (!ns.utils.isaComponent(component)) {
                    component = ns.makeComponent(base ? base : spec, undefined, parent);
                    if (base !== undefined) component.extendWith(spec);
                    if (name) component.myName = name;
                }
                component.myParent = component.myParent ? component.myParent : parent;
                return component;
            });
            var collection = ns.makeCollection(members, parent);
            if (this.uponCreation) collection.forEach(this.uponCreation);
            return collection;
        },
        createSubcomponents: function (parent) {
            var base = this.baseSpec;
            var members = this.elements.map(function (init) {
                var component = init;
                var spec = init.spec ? init.spec : ns.utils.isObject(init) ? init : undefined;;
                var name = init.myName ? init.myName : ns.utils.isString(init) ? init : undefined;

                if (!ns.utils.isaComponent(component)) {
                    component = parent.createSubcomponent(base ? base : spec);
                    if (base !== undefined) component.extendWith(spec);
                    if (name) component.myName = name;
                }
                else {
                    parent.addSubcomponent(component);
                }
                return component;
            });
            if (this.uponCreation) {
                members.forEach(this.uponCreation);
            }
            return members;
        },
    }
    ns.CollectionSpec = CollectionSpec;

    ns.utils.isaCollectionSpec = function (obj) {
        return obj instanceof ns.CollectionSpec ? true : false;
    };

}(Foundry));
///#source 1 1 /Foundry/Foundry.core.collection.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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
var fo = Foundry;


(function (ns, undefined) {

    //this is designed to be obserervable
    var Collection = function (init, parent, spec) {

        this.myName = undefined;
        this.owner = parent;
        //obsolite this.dataContext = this;

        this.elements = (init === undefined) ? [] : init;

        this.withDependencies = true

        // var count = new Property(this, 'count', function () { return this.elements.length; }); //could property will change
        var count = new ns.Counter(this); //could property will change
        spec && ns.utils.extendWithComputedValues(this, spec);
        return this;
    }


    //Prototype defines functions using JSON syntax
    Collection.prototype = {

        getID: function () {
            if (this.guid) return this.guid;
            this.guid = ns.utils.createID(this.myName);
            return this.guid;
        },

        globalComputeStack: function () {
            return this.owner ? this.owner.globalComputeStack() : undefined;
        },
        currentComputingProperty: function () {
            var stack = this.globalComputeStack();
            return stack && stack.peek();
        },

        findByName: function (name) {
            return this.firstWhere(function (p) { return p.myName && p.myName.matches(name) });
        },

        stringify: function (that) {
            var target = that || this;
            //if (target.hasOwnProperty(key)) {
            //    return undefined;
            //}
            function ResolveCircular(key, value) {
                switch (key) {
                    case 'owner':
                        //obsolite case 'dataContext':
                    case 'myParent':
                        return value ? value.asReference() : value;
                    case 'thisValueDependsOn':
                    case 'thisInformsTheseValues':
                    case 'uiBindings':
                    case 'onRefreshUi':
                    case 'trace':
                        return undefined;
                }
                return value;
            }

            return JSON.stringify(target, ResolveCircular, 3);
        },

        getSpec: function (deep) {
            if (this.count == 0) return undefined;
            var items = this.elements.map(function (item) {
                return item.getSpec(deep);
            });
            return items;
        },

        asReference: function () {
            if (this.owner === undefined) {
                return this.myName ? this.myName : "collection";
            }
            return this.owner.asReference() + "." + this.myName;
        },

        smash: function () {
            var p = this['_count'];
            if (p.status) {
                fo.publishNoLock('smash', [p]);
                p.smash();
            }
        },

        purgeBindings: function (deep) {
            var result = false;
            this.elements.forEach(function (item) {
                result = item.purgeBindings(deep) || result;
            });
            return result;
        },

        resolveProperty: function (reference) {
            alert('please bind to a data-repeater' + reference);
        },
        resolveSuperior: function (reference) {
            if (this.myName.match(reference) || ns.utils.isSelf(reference)) return this;
            var result = this.owner.resolveSuperior(reference);
            return result;
        },

        resolvePropertyReference: function (reference) {
            var result = {};
            var obj = this;

            if (reference.containsString('#')) {
                var ref = reference.split('#')
                result = this.resolvePropertyReference(ref[0]);
                result.meta = ref[1];
                return result;
            }

            //now it is probably just a property and we may need to peek at the value
            var property = obj.getProperty(reference);
            var found = undefined; //now looking for collection or component

            if (property === undefined) {
                found = obj[reference]; //now looking for collection or component
            }
            else {
                result.property = property;  //peek at value 
                if (property.status) found = property.value;
            }

            if (ns.utils.isaCollection(found)) {
                result.collection = found;
            }
            else if (ns.utils.isaComponent(found)) {
                result.component = found;
            }
            return result;
        },

        getProperty: function (name, search) {
            var sPrivate = "_" + name;
            var p = this[sPrivate];
            return p ? p : search && this.myParent ? this.myParent.getProperty(name, search) : p;
        },

        smashProperty: function (name, search) {
            var property = this.getProperty(name, search);
            if (property && property.status) {
                property.smash();
            }
            return property;
        },

        smashPropertyTree: function (name) {
            var property = this.smashProperties(name);
            var parent = this.myParent;
            return parent ? parent.smashPropertyTree(name) : property;
        },

        smashPropertyBranch: function (name) {
            this.smashProperties(name);

            this.Subcomponents.forEach(function (item) {
                item.smashPropertyBranch(name);
            });
        },

        smashProperties: function (names, search) {
            var obj = this;
            var list = fo.utils.isArray(names) ? names : names.split(',');
            list.forEach(function (name) {
                obj.smashProperty(name, search);
            });

            return obj;
        },

        //there are additional 'meta' slots that contain Meta or Reference data on property objects
        getMetaData: function (meta, metaDefault) {
            if (meta === undefined || this[meta] === undefined) return metaDefault;

            var result = metaDefault;
            var slot = this[meta];

            if (ns.utils.isFunction(slot)) {
                result = slot.call(this);
            }
            else if (slot !== undefined) {
                result = slot;
            }

            //but you must return in the future to resolve this...
            if (ns.utils.isaPromise(result) && metaDefault !== undefined) {
                return metaDefault;
            }
            return result;
        },

        getMetaDataAsync: function (meta, metaInit) {
            //simulate a promise so you can use the then method to process value consistantly
            var result = this.getMetaData(meta, metaInit);
            if (ns.utils.isaPromise(result)) return result;

            var promise = new Promise(this.owner, meta);
            promise.value = this;
            return promise;
        },

        setMetaData: function (meta, metaInit) {
            if (meta !== undefined) {
                this[meta] = metaInit;
            }
            return this;
        },

        //used in binding an get and set the value from the owner
        getValue: function (meta) {
            if (meta !== undefined) {
                return this; //.owner[this.myName];
            }
            return this;
        },

        push: function (element) {
            if (element) {
                this.elements.push(element);
                this.smash();
            }
            return element;
        },

        addList: function (list) {
            if (list) {
                this.elements = this.elements.concat(list);
                this.smash();
            }
            return this;
        },

        addNoDupe: function (element) {
            if (element) {
                this.elements.addNoDupe(element);
                this.smash();
            }
            return element;
        },
        prependNoDupe: function (element) {
            if (element) {
                this.elements.prependNoDupe(element);
                this.smash();
            }
            return element;
        },
        insertNoDupe: function (index, element) {
            if (element && this.elements.indexOf(element) == -1) { //things should not be found
                this.elements.insert(index, element);
                this.smash();
            }
            return element;
        },



        pop: function () {
            var element = this.elements.pop();
            this.smash();
            return element;
        },

        peek: function () {
            if (this.elements && this.elements.length > 0) {
                var i = this.elements.length - 1;
                return this.elements[i];
            }
        },

        item: function (i) {
            return this.elements[i];
        },

        first: function () {
            return this.elements.length > 0 ? this.elements[0] : undefined;
        },

        last: function () {
            var i = this.elements.length - 1;
            return i >= 0 ? this.elements[i] : undefined;
        },

        next: function (item, cycle) {
            var i = this.indexOf(item) + 1;
            if (i >= this.elements.length) return cycle ? this.first() : item;
            return this.elements[i];
        },

        previous: function (item, cycle) {
            var i = this.indexOf(item) - 1;
            if (i < 0) return cycle ? this.last() : item;
            return this.elements[i];
        },

        add: function (element) {
            if (element === undefined) return element;
            if (ns.utils.isArray(element)) {
                for (var i = 0; i < element.length; i++) this.elements.push(element[i]);
            }
            else {
                this.elements.push(element);
            }
            this.smash();
            return element;
        },

        reset: function (element) {
            this.clear();
            return this.add(element);
        },

        remove: function (element) {
            var i = this.elements.length;
            var j = this.elements.removeItem(element).length;
            if (i !== j) {
                this.smash();
            }
            return element;
        },

        removeWhere: function (predicate) {
            var list = this.filter(predicate).elements;
            for (var i = 0; i < list.length; i++) {
                this.remove(list[i]);
            }
            return this;
        },

        sumOver: function (initValue) {
            return this.reduce(function (a, b) {
                return a += b;
            }, initValue ? initValue : 0);
        },

        commaDelimited: function (delimiter) {
            var delim = delimiter ? delimiter : ',';
            return this.reduce(function (a, b) {
                return a += (b + delim);
            }, '');
        },

        slice: function (start, end) {
            return this.elements.slice(start, end)
        },

        members: function (col) {
            // var list = col === undefined ? ns.makeCollection([], this) : col;
            return this.copyTo([]);
        },

        membersWhere: function (whereClause, col) {
            var list = col === undefined ? ns.makeCollection([], this) : col;
            //using Count will set up a dependency 
            if (this.count > 0) {
                this.copyWhere(whereClause, list);
            };
            return list;
        },

        isEmpty: function () {
            //return this.count === 0; // do this to create a dependency
            return this.elements.isEmpty();
        },

        isNotEmpty: function () {
            //return this.count === 0; // do this to create a dependency
            return this.elements.isNotEmpty();
        },

        copyTo: function (list) {
            var result = list ? list : [];
            for (var i = 0; i < this.elements.length; i++) {
                result.push(this.elements[i]);
            }
            return result;
        },

        copyWhere: function (whereClause, list) {
            var result = list ? list : [];
            for (var i = 0; i < this.elements.length; i++) {
                var item = this.elements[i];
                var ok = (whereClause == undefined) ? true : whereClause(item);
                if (ok) result.push(item);
            }
            return result;
        },

        firstWhere: function (whereClause) {
            for (var i = 0; i < this.elements.length; i++) {
                var item = this.elements[i];
                var ok = (whereClause == undefined) ? true : whereClause(item);
                if (ok) return item;
            }
        },

        clear: function () {
            this.elements = [];
            this.smash();
        },

        indexOf: function (item) {
            return this.elements.indexOf(item);
        },

        indexOfFirst: function (predicate) {
            return this.elements.indexOfFirst(predicate);
        },

        itemByIndex: function (index) {
            return this.elements.itemByIndex(index);
        },

        duplicate: function (filterFunction) {
            var list = ns.makeCollection();

            if (this.count === 0) return list; // do this to create a dependency
            this.copyTo(list);
            return list;
        },

        filter: function (filterFunction) {
            var list = ns.makeCollection();

            if (this.count === 0) return list; // do this to create a dependency
            return this.copyWhere(filterFunction, list);
        },

        sortOn: function (field) {
            var changed = false;
            if (field) {
                var newList = this.elements.sort(function (a, b) {
                    var result = (a[field] < b[field] ? -1 : (a[field] > b[field] ? 1 : 0));
                    if (result < 0) changed = true;
                    return result;
                });
            }
            if (changed) {
                this.elements = newList;
                ns.trace && ns.trace.error("SORTING SMASHED THE COLLECTION");
                this.smash();
            }
            return this;
        },

        forEach: function (mapFunction) {
            if (this.count === 0) return undefined; // do this to create a dependency
            return this.elements.forEach(mapFunction);
        },

        map: function (mapFunction) {
            if (this.count === 0) return this.elements; // do this to create a dependency
            return this.elements.map(mapFunction);
        },

        reduce: function (reduceFunction, init) {
            if (this.count === 0) return undefined; // do this to create a dependency
            return this.elements.reduce(reduceFunction, init);
        },

        mapReduce: function (mapFunction, reduceFunction, init) {
            return this.elements.map(mapFunction).reduce(reduceFunction, init);
        },

        sumAll: function (prop, init) {
            var pluck = ns.utils.pluck(prop);
            var sum = function (a, b) { return a += b; };
            return this.elements.map(pluck).reduce(sum, init ? init : 0);
        },

        maxAll: function (prop, init) {
            var pluck = ns.utils.pluck(prop);
            var max = function (a, b) { return Math.max(a, b) };
            return this.elements.map(pluck).reduce(max, init !== undefined ? init : -Infinity);
        },

        minAll: function (prop, init) {
            var pluck = ns.utils.pluck(prop);
            var min = function (a, b) { return Math.min(a, b) };
            return this.elements.map(pluck).reduce(min, init !== undefined ? init : Infinity);
        },

        selectComponents: function (whereClause, col) {
            var list = col === undefined ? ns.makeCollection([], this) : col;

            //using Count will set up a dependency 
            if (this.count > 0) {
                this.copyWhere(whereClause, list);
                for (var i = 0; i < this.elements.length ; i++) {
                    var comp = this.elements[i];
                    comp.selectComponents(whereClause, list);
                };
            };
            return list;
        },
    }


    //this is designed to be obserervable
    //http://www.klauskomenda.com/code/javascript-inheritance-by-example/
    var OrderedCollection = function (init, parent, indexName) {
        this.base = Collection;

        var list = ns.utils.isaCollection(init) ? init.elements : init;
        this.base(list, parent);

        this.indexName = indexName;

        this.sortOn(this.indexName);
        this.synchronizeElements();
        return this;
    }

    //http://trephine.org/t/index.php?title=JavaScript_prototype_inheritance
    OrderedCollection.prototype = (function () {
        var anonymous = function () { this.constructor = OrderedCollection; };
        anonymous.prototype = Collection.prototype;
        return new anonymous();
    })();

    OrderedCollection.prototype.setItemIndex = function (item, index) {
        if (this.indexName === undefined) return item;

        if (item[this.indexName] !== undefined) {
            item[this.indexName] = index;
        }
        else if (ns.utils.isaComponent(item)) {
            item.createProperty(this.indexName, index);
        }
        else {
            item[this.indexName] = index;
        }
        return item;
    }

    OrderedCollection.prototype.synchronizeElements = function () {
        var elements = this.elements;
        for (var i = 0; i < elements.length; i++) {
            var item = elements[i];
            this.setItemIndex(item, i);
        };
        this.markForRefresh()
    };

    OrderedCollection.prototype.markForRefresh = function () {
        ns.markForRefresh(this.getProperty("count"));
        return this;
    }

    OrderedCollection.prototype.addItem = function (item) {
        var result = this.add(item);
        this.setItemIndex(result, this.elements.length - 1);
        this.markForRefresh();
        return item;
    }

    OrderedCollection.prototype.removeItem = function (item) {
        var result = this.remove(item);
        if (item.getProperty(this.indexName)) {
            item.deleteProperty(this.indexName)
        }
        delete result[this.indexName];
        this.synchronizeElements();
        return result;
    }

    OrderedCollection.prototype.swapItemTo = function (item, index) {
        if (index < 0 || index > this.count - 1 || isNaN(index)) return item;
        var oldItem = this.elements[index];

        var oldIndex = item[this.indexName];
        if (oldIndex !== undefined) {
            this.elements[index] = this.setItemIndex(item, index);
            this.elements[oldIndex] = this.setItemIndex(oldItem, oldIndex);
            this.markForRefresh();
        }
        return item;
    }


    ns.Collection = Collection;
    ns.OrderedCollection = OrderedCollection;


}(Foundry));
///#source 1 1 /Foundry/Foundry.core.component.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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
var fo = Foundry;


(function (ns, undefined) {

    //in prep for prototype pattern...
    var Component = function (properties, subcomponents, parent) {
        //"use strict";

        this.myName = undefined;
        this.myParent = parent;
        this.myType = 'Component';

        this.withDependencies = true;


        var uponCreation = properties && properties.uponCreation;
        if (uponCreation) delete properties.uponCreation;

        this.establishCollection("Properties", this.createParameters(properties));
        this.simpleProperty('myType');
        this.simpleProperty('myName');
        this.establishCollection("Subcomponents", this.createSubparts(subcomponents)); // you need to make this observable and dynamic

        if (uponCreation) {
            properties.uponCreation = uponCreation;
            var creationSpec = ns.utils.isFunction(uponCreation) ? uponCreation.call(this) : uponCreation;

            if (ns.utils.isaCollectionSpec(creationSpec)) {
                creationSpec.createSubcomponents(this); //necessary to maintain observablilty
            }
        }
        return this;
    }


    var _rootComputestack = new Array();

    //Prototype defines functions using JSON syntax
    Component.prototype = {
        toString: function () {
            return this.getID() + ", |" + this.myName + "| type: " + this.myType;
        },

        //code to support dependency tracking
        globalComputeStack: function () {
            return _rootComputestack;
        },

        currentComputingProperty: function () {
            return _rootComputestack && _rootComputestack.peek();
        },

        isType: function (type) {
            if (type === this.myType) return true;
            if (!this.myType) return false;
            //remember a type may be preceeded with a namespace  knowtshare::note
            return type && type.matches(this.myType);
        },

        isOfType: function (type) {
            var found = this.isType(type);
            if (found) return true;
            var myType = this.myType.split('::');
            myType = myType.length == 2 ? myType[1] : myType[0];
            return type && type.matches(myType);
        },



        createProperty: function (name, init) {
            var property = new ns.Property(this, name, init);
            return property;
        },

        createParameters: function (obj) {
            var parameters = [];
            if (obj !== undefined) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var init = obj[key];
                        var property = this.createProperty.call(this, key, init);
                        parameters.push(property);
                    }
                }
            }
            return parameters;
        },

        createSubparts: function (listSpec) {
            var subparts = [];
            if (ns.utils.isArray(listSpec)) {
                var parent = this;
                subparts = listSpec.map(function (childSpec) {
                    var spec = childSpec.spec ? childSpec.spec : undefined;
                    var subcomponentSpec = childSpec.Subcomponents ? childSpec.Subcomponents : undefined;
                    var dependencies = childSpec.dependencies ? childSpec.dependencies : undefined;

                    //if you were clever about evaluation here you could apply exist rules...
                    //but you would need to create as a subpart first before it is expanded and 
                    //reaches Subcomponent status...
                    var component = ns.makeComponent(spec, subcomponentSpec, parent);
                    if (childSpec.myName) component.myName = childSpec.myName;
                    component.withDependencies = dependencies ? dependencies : parent.withDependencies;

                    return component;
                });

            }
            return subparts;
        },

        // you need to make this observable and dynamic, then does that
        establishCollection: function (name, init, spec) {
            var collection = this[name];
            if (!ns.utils.isaCollection(collection)) {
                collection = ns.makeCollection(init, this, spec); //this is observable
                collection.withDependencies = this.withDependencies;
                collection.myName = name;
                this[name] = collection;
            };
            return collection;
        },



        rootComponent: function (name) {
            if (name && this[name]) {
                return this[name];
            }
            var parent = this.myParent;
            return parent === undefined ? this : parent.rootComponent(name);
        },

        getID: function () {
            if (this.guid) return this.guid;
            this.guid = ns.utils.createID(this.myName);
            return this.guid;
        },

        setName: function (name, title) {
            this.myName = name;
            return this;
        },

        componentDepth: function () {
            if (this.myParent) {
                return 1 + this.myParent.componentDepth();
            }
            return 0;
        },

        branchDepth: function () {
            var first = this.Subcomponents.first();
            if (!first) return 0;

            var maxDepth = first.branchDepth();
            this.Subcomponents.forEach(function (item) {
                maxDepth = Math.max(item.branchDepth(), maxDepth);
            });

            return 1 + maxDepth;
        },
        //http://msdn.microsoft.com/en-us/library/ie/dd548687(v=vs.94).aspx

        createSlots: function (owner, list) {
            var slots = [];
            if (list != undefined) {
                for (var key in list) {
                    if (this.getProperty(key)) {
                        //redefine as simple slot?
                    }
                    else { //should I test is function and add that to prototype
                        this[key] = list[key];
                        slots.push(key);
                    }
                }
            }
            return slots;
        },

        getProperty: function (name, search) {
            var sPrivate = "_" + name;
            var p = this[sPrivate];
            return p ? p : search && this.myParent ? this.myParent.getProperty(name, search) : p;
        },

        smashProperty: function (name, search) {
            var property = this.getProperty(name, search);
            if (property && property.status) {
                property.smash();
            }
            return property;
        },

        smashPropertyTree: function (name) {
            var property = this.smashProperties(name);
            var parent = this.myParent;
            return parent ? parent.smashPropertyTree(name) : property;
        },

        smashPropertyBranch: function (name) {
            this.smashProperties(name);

            this.Subcomponents.forEach(function (item) {
                item.smashPropertyBranch(name);
            });
        },

        smashProperties: function (names, search) {
            var obj = this;
            var list = fo.utils.isArray(names) ? names : names.split(',');
            list.forEach(function (name) {
                obj.smashProperty(name, search);
            });

            return obj;
        },

        deleteProperty: function (name) {
            var sPrivate = "_" + name;
            var property = this[sPrivate];
            if (property) {
                property.smash();

                //SRS add code to remove from Properties Collection also
                this.Properties.remove(property);

                delete this[sPrivate];
                delete this[name];
            }
        },

        establishProperty: function (name, init, onSmash) {
            var p = this.getProperty(name);
            if (p === undefined) {
                p = this.createProperty(name, init);
                p.onValueSmash = onSmash;
            }
            return p;
        },

        simpleProperty: function (name, init) {
            var p = this.getProperty(name);
            if (p !== undefined) {
                var newValue = init ? init : p.getValue();
                this.deleteProperty(name);
                this[name] = newValue;
            }
            else if (init) {
                this[name] = init;
            }
        },




        asReference: function () {
            if (this.myParent === undefined) {
                return "root";
            }
            return this.myName + "." + this.myParent.asReference();
        },




        superior: function (name) {
            if (name.matches(this.myName)) return this;
            if (this.myParent) return this.myParent.superior(name);
        },

        findParentWhere: function (func) {
            if (func.call(this, this)) return this;
            if (this.myParent) return this.myParent.findParentWhere(func);
        },

        getValueOf: function (name, defaultValue) {
            var property = this.getProperty(name, true);
            var result = property ? property.getValue() : undefined;
            return result ? result : defaultValue;
        },

        resolveSuperior: function (reference, meta) {
            var obj = this;
            if (ns.utils.isSelf(reference)) return obj;

            var result = this.getProperty(reference);
            if (result) return result.getValue(meta);

            //if no result was found look for a simple unmanaged property
            result = this[reference];

            if (!result && this.myParent) return this.myParent.resolveSuperior(reference, meta);
            //the search for a value has failed
            return result;
        },

        resolveReference: function (reference) {
            var obj = this;
            if (ns.utils.isSelf(reference)) return obj;
            //for now assume you are looking for subcomponents...
            var ref = reference.split('@');
            if (ref.length == 2 && ref[1] != '') return this.resolveReference(ref[1]);

            var path = ref[0].split('.');

            var result = undefined;
            for (var i = 0; i < path.length; i++) {
                var name = path[i];  //or you can look it up in the properties collection...
                result = obj.getSubcomponent(name);

                if (result === undefined) {
                    result = obj.getProperty(name);
                    if (result === undefined) {
                        obj = obj[name];  //now looking for collection or component
                    }
                }
                else {
                    obj = result;
                }
            }
            return result;
        },

        //this is the simple reference BETWEEN the Dots .Prop.
        //pass in trimed string only please
        resolvePropertyReference: function (reference) {
            var result = {};

            if (reference.begins('(') && reference.ends(')')) { //is function
                var refFunc = "return {0}; ".format(reference);
                result.formula = new Function(refFunc);
                return result;
            }

            if (reference.begins('{') && reference.ends('}')) { //is JSON
                result['JSON'] = JSON.parse(reference);
                return result;
            }

            var obj = this;
            if (reference.startsWith('@')) { //upward reference to property
                var found = this.resolveReference(reference);

                if (ns.utils.isaCollection(found)) {
                    result.collection = found;
                }
                else if (ns.utils.isaComponent(found)) {
                    result.component = found;
                }
                else if (ns.utils.isaProperty(found)) {
                    result.property = found;
                }
                else if (found) {
                    result.found = found;
                }
                return result;
            }

            if (reference.endsWith('@')) { //upward reference to property
                var refProp = reference.substring(0, reference.length - 1);
                var parent = obj.myParent;
                var property = obj.getProperty(refProp);
                while (property === undefined && parent) {
                    property = parent.getProperty(refProp);
                    parent = parent.myParent;
                }
                result.property = property;
                return result;
            }


            if (reference.containsString('#')) {
                var ref = reference.split('#')
                result = this.resolvePropertyReference(ref[0]);
                result.meta = ref[1];
                return result;
            }
            if (reference.startsWith('_')) { //peeking a true property
                var found = obj[reference];
                if (found) result.propertyPeek = found;
                return result;
            }


            //now it is probably just a property and we may need to peek at the value
            var property = obj.getProperty(reference);
            var found = undefined; //now looking for collection or component

            if (property === undefined) {
                found = obj[reference]; //now looking for collection or component
            }
            else {
                result.property = property;  //peek at value 
                if (property.status) found = property.value;
            }

            if (ns.utils.isaCollection(found)) {
                result.collection = found;
            }
            else if (ns.utils.isaComponent(found)) {
                result.component = found;
            }
            else if (found) {
                result.slot = found;
            }
            return result;
        },

        resolveProperty: function (reference) {
            if (reference.ends('?')) {  //if not found UI will ignore binding
                return this.resolveProperty(reference.substring(0, reference.length - 1));
            }
            else if (reference.begins('?')) { //if not found UI will hide element
                return this.resolveProperty(reference.substring(1));
            }

            if (reference.begins('(') || reference.begins('{')) {
                return this.resolvePropertyReference(reference);
            }
            else if (!reference.containsString('.')) {
                return this.resolvePropertyReference(reference);
            }

            var result = undefined;
            var refPath = reference.split('.');

            //this is tricker and requires that we walk the tree, and maybe even eval some 
            var obj = this;
            for (var i = 0; i < refPath.length; i++) {
                var ref = refPath[i].trim();
                result = obj.resolvePropertyReference ? obj.resolvePropertyReference(ref) : undefined;
                if (result === undefined) {
                    obj = obj[ref];  //get value of property
                }
                else if (result.component) {
                    obj = result.component;
                }
                else if (result.collection) {
                    obj = result.collection;
                }
                else if (result.property && result.property.status) {
                    obj = result.property.getValue();
                }
                else if (ns.utils.isaComponent(obj)) {
                    result.component = obj.getSubcomponent(ref); //walk the subcomponent tree
                    obj = result.component ? result.component : obj[ref];  //get value of property
                }
                else {
                    obj = obj[ref];  //get value of property
                }
            }
            return result;
        },

        removeFromModel: function () {
            var obj = this;
            obj.myParent && obj.myParent.removeSubcomponent(obj);
            obj.purgeBindings(true);
            return obj;
        },

        deleteAndPurge: function () {
            var obj = this;
            obj.removeFromModel();
            //add extra code to destroy this object and the memory it holds
        },

        purgeBindings: function (deep) {
            var result = false;
            this.Properties.forEach(function (item) {
                result = item.purgeBindings(deep) || result;
            });

            this.Subcomponents.forEach(function (item) {
                result = item.purgeBindings(deep) || result;
            });
            return result;
        },

        stringify: function (obj) {
            var target = obj || this;

            function resolveCircular(key, value) {
                switch (key) {
                    case 'owner':
                    case 'myParent':
                    case 'source':
                    case 'target':
                        return value ? value.asReference() : value;
                    case 'thisValueDependsOn':
                    case 'thisInformsTheseValues':
                    case 'uiBindings':
                    case 'onRefreshUi':
                        return undefined;
                }

                return value;
            }

            return JSON.stringify(target, resolveCircular, 3);
        },

        rehydrate: function (root, specArray, resultDictionary, modifyType) {
            var context = this;

            var localResults = {};
            specArray.forEach(function (item) {
                var uniqueID = item.uniqueID ? item.uniqueID : item.myName;
                item.myType = modifyType ? modifyType(item) : item.myType;

                var parentHydrateId = item.parentHydrateId;
                delete item.parentHydrateId;

                var subparts = item["Subcomponents"];
                if (subparts) delete item["Subcomponents"];


                var parent = context;
                var child = parent.getSubcomponent(uniqueID);
                if (!child && parentHydrateId) {
                    parent = root.getSubcomponent(parentHydrateId, true);
                    if (parent) {
                        child = parent.getSubcomponent(uniqueID);
                    } else {
                        parent = context;
                    }
                }
                if (!child) {
                    child = fo.make(item, parent);
                    if (parent.getSubcomponent(uniqueID)) {
                        alert("rehydrateing: We have a problem");
                    }
                    parent.addSubcomponent(child, uniqueID);
                }

                resultDictionary[uniqueID] = localResults[uniqueID] = child;

                if (!subparts) return;

                try {
                    child.rehydrate(root, subparts, resultDictionary, modifyType);
                } catch (e) {
                    fo.trace && fo.trace.exception('rehydrate', e);
                }
            });

            //if syncSubcomponents subcomponents that remove missing items
            return localResults;
        },

        dehydrate: function (deep, modify) {
            var context = this;

            var spec = context.myType ? { myType: context.myType } : {};
            if (context.myName) spec.myName = context.myName;
            if (context.myParent && context.myParent.myName) {
                spec.parentHydrateId = context.myParent.myName;
            }

            var filter = modify ? Object.keys(modify) : [];

            context.Properties.forEach(function (mp) {
                var name = mp.myName;
                var isFiltered = filter.contains(name);
                if (isFiltered && !modify[name]) return;

                var notExist = 'given'.matches(mp.status) ? false : mp.formula !== undefined;
                if (notExist) return;

                //you do not want to send commands right?
                //and because mp.value contains the last computed value it should be undefined
                var value = mp.value;
                //if (!value || ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) return;
                if (ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) return;

                spec[name] = value;

            });

            if (deep && context.Subcomponents.count > 0) {
                var results = context.Subcomponents.map(function (item) {
                    return item.dehydrate(deep, modify);
                });
                spec["Subcomponents"] = results;
            }
            return spec;
        },

        makePartOfSpec: function (key, init) {
            // Add an accessor property to the object.
            var sPrivate = '_' + key;
            if (this[sPrivate]) {
                this[sPrivate].canExport = init ? init : true;
            }
        },

        exportValues: function () {
            var result = {};
            for (var key in this) {
                if (key.startsWith('_')) continue;
                var obj = this[key];
                if (!fo.utils.isObject(obj)) {
                    result[key] = this[key];
                }
            }
            return result;
        },


        //this spec should be an honst way to recreate the component
        getSpec: function (deep) {
            var spec = this.myType ? { myType: this.myType } : {};
            if (this.myName) spec.myName = this.myName;

            //do I need to code a reference to the parent?
            //if (this.myParent) spec.myParent = this.myName;

            this.Properties.forEach(function (mp) {
                var notExist = 'given'.matches(mp.status) ? false : mp.formula !== undefined;
                if (notExist && !mp.canExport) return;

                spec = spec || {};
                var value = mp.value;
                if (ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) {
                    value = value.getSpec(deep);
                }
                var name = mp.myName;
                if (value !== undefined) {
                    spec[name] = value;
                }
                else if (mp.canExport) { //we must have a value if marked as exporting
                    spec[name] = mp.getValue();
                }
            });


            if (deep && this.Members) {
                this.Members.forEach(function (coll) {
                    if (coll.count == 0) return;

                    spec = spec || {};
                    var value = coll;
                    if (ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) {
                        value = value.getSpec(deep);
                    }
                    if (value) {
                        spec[coll.myName] = value;
                    }
                });
            }
            return spec;
        },



        doCommand: function (callbackOrPropertyName, context) {
            if (ns.utils.isFunction(callbackOrPropertyName)) {
                return ns.runWithUIRefreshLock(callbackOrPropertyName);
            }
            else {
                var property = this.getProperty(callbackOrPropertyName, true);
                var target = context ? context : this;
                return property && property.doCommand(target);
            }
        },

        redefine: function (key, init) {
            // Add an accessor property to the object.
            var sPrivate = '_' + key;
            if (this[sPrivate]) {
                this[sPrivate].redefine(init)
            }
            else {
                property = this.createProperty.call(this, key, init);
                this.Properties.push(property);
            }
        },

        createView: function (view) {
            var result = this.Properties.map(function (prop) {
                return prop.createView(view);
            });
            return result;
        },

        extendUi: function (list, view) {
            var target = this;
            //if (view && this[view] === undefined) {
            //    target = this[view] = { dataContext: this };
            //    this.establishCollection("views").addItem(target);
            //} else {
            //    this.dataContext = this;
            //}

            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    target[key] = list[key];
                }
            }
            return this;
        },

        extendWith: function (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    this.redefine(key, obj[key]);
                }
            }
            return this;
        },

        extendProperties: function (list) {
            var result = [];
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    var prop = this.getProperty(key);
                    if (prop) {
                        var extensions = ns.utils.asArray(list[key]);
                        extensions.forEach(function (item) { prop.extendWith(item); });
                        result.push(prop);
                    }
                }
            }
            return result;
        },

        subscribeToCommands: function (regexPattern) {
            //subscribe to any do* of goto* messages...
            var self = this;
            var keys = Object.keys(self);
            keys.forEach(function (key) {
                if (key.startsWith('do') || key.startsWith('goto')) {
                    fo.subscribe(key, function () {
                        self[key];
                    });
                }
            });
        },

        definePropertyViews: function (list) {
            var result = [];
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    var prop = this.getProperty(key);
                    if (prop) {
                        var extensions = ns.utils.asArray(list[key]);
                        extensions.forEach(function (item) {
                            for (var view in item) {
                                if (item.hasOwnProperty(view)) {
                                    prop.extendUi(item[view], view);
                                }
                            }
                        });
                    }
                }
            }
            return result;
        },



        //do the work of creation//
        establishManagedProperty: function (name, init) {
            var property = this.getProperty(name);
            if (!property) return this.replaceManagedProperty(name, init);
            property.redefine(init);
            return property;
        },

        //do the work of creation//
        replaceManagedProperty: function (name, init) {
            this.deleteProperty(name)
            var property = this.createProperty(name, init);
            this.Properties && this.Properties.push(property);
            return property;
        },

        establishManagedProperties: function (obj) {
            var params = this.createParameters(obj);
            return this.establishCollection("Properties", params);
        },


        //establishUnmanagedProperties: function (obj) {
        //    return this.createSlots(this, obj);
        //},

        doSubcomponentRefresh: function (deep) {
            var prop = this.Subcomponents.getProperty('count');
            prop.updateBindings();
            if (deep) {
                this.Subcomponents.forEach(function (item) {
                    item.doSubcomponentRefresh();
                });
            }
        },

        onPropertyRefresh: function (name, callback) {
            var property = this.getProperty(name);
            if (property) property.onRefreshUi = callback;
            return property;
        },

        onPropertySmash: function (name, callback) {
            var property = this.getProperty(name);
            if (property) property.onValueSmash = callback;
        },

        onPropertyValueSet: function (name, callback) {
            var property = this.getProperty(name);
            if (property) property.onValueSet = callback;
        },

        addOnRefresh: function (name, callback) {
            var property = this.onPropertyRefresh(name, callback);
            if (property) ns.markForRefresh(property);
            return property;
        },

        addPropertyConstraint: function (spec) {
            var constraintSpec = spec;

            function applyMEConstraint(newValue, fun, obj) {
                if (!newValue) return;
                var prop = this;

                for (var key in constraintSpec) {
                    if (!prop.myName.matches(key)) {
                        obj[key] = false;
                    }
                }
            }

            for (var key in constraintSpec) {
                this.onPropertyValueSet(key, applyMEConstraint);
            }
        },

        addBinding: function (name, binding) {
            var property = this.getProperty(name);
            var cnt = property.uiBindings ? property.uiBindings.length : 0;
            return property ? property.addBinding(binding, true) : property;
        },

        applyToSelfAndParents: function (funct) {
            var result = funct.call(this, this);
            var parent = this.myParent;
            parent && parent.applyToSelfAndParents(funct);
            return result;
        },

        applyToSelfAndChildren: function (funct, deep) {
            var result = funct.call(this, this);
            this.applyToChildren(funct, deep);
            return result;
        },

        applyToChildren: function (funct, deep) {
            this.Subcomponents.forEach(function (item) {
                funct.call(item, item)
                deep && item.applyToChildren(funct, deep);
            });
        },

        applyToSiblings: function (funct, deep) {
            var self = this;
            var parent = this.myParent;
            parent.Subcomponents.forEach(function (item) {
                if (self != item) {
                    funct.call(item, item);
                    deep && item.applyToChildren(funct, deep);
                }
            });
            return result;
        },

        applyToSelfAndSiblings: function (funct, deep) {
            var parent = this.myParent;
            parent.Subcomponents.forEach(function (item) {
                funct.call(item, item);
                deep && item.applyToChildren(funct, deep);
            });
        },

        capture: function (component, name, join) {
            var oldParent = this.captureSubcomponent(component, name, join);
            return oldParent;
        },

        canCaptureSubcomponent: function (component) {
            if (!ns.utils.isaComponent(component)) return false;
            return true;
            //var parent = component.myParent;
            //if (!parent) return true;
            ////var index = parent.Subcomponents.indexOf(component);
            ////var result = index == -1 ? true : false;
            //return true;
        },

        captureSubcomponent: function (component, name, join) {
            var newParent = this;
            var oldParent = component.myParent;
            if (newParent.canCaptureSubcomponent(component)) {
                ns.runWithUIRefreshLock(function () {
                    if (name) {
                        component.myName = name;
                        if (join) newParent[name] = component;
                    }
                    if (oldParent) {
                        oldParent.removeSubcomponent(component);
                        if (join) delete oldParent[name];
                    }
                    newParent.addSubcomponent(component);
                });
                return oldParent;
            }
        },

        pushSubcomponent: function (component, name) {
            component.myParent = this;
            if (name) component.myName = name;
            this.Subcomponents.push(component);
            return component;
        },

        addSubcomponent: function (component, name, prepend) {
            if (ns.utils.isaComponent(component)) {
                component.myParent = this;
                if (name) component.myName = name;
                if (prepend)
                    this.Subcomponents.prependNoDupe(component);
                else
                    this.Subcomponents.addNoDupe(component);
                return component;
            }
        },

        insertSubcomponent: function (index, component, name) {
            if (ns.utils.isaComponent(component)) {
                component.myParent = this;
                if (name) component.myName = name;
                this.Subcomponents.insertNoDupe(index, component);
                return component;
            }
        },

        captureInsertSubcomponent: function (index, component, name) {
            var newParent = this;
            var oldParent = component.myParent;
            if (newParent.canCaptureSubcomponent(component)) {
                ns.runWithUIRefreshLock(function () {
                    if (name) component.myName = name;
                    if (oldParent) oldParent.removeSubcomponent(component)
                    newParent.insertSubcomponent(index, component);
                });
                return oldParent;
            }
        },

        removeSubcomponent: function (component) {
            if (ns.utils.isaComponent(component)) {
                if (component.myParent === this) {
                    component.myParent = undefined;
                }
                this.Subcomponents.remove(component);
                return component;
            }
        },

        removeAllSubcomponents: function () {
            if (this.Subcomponents.count == 0) return;
            var list = this.Subcomponents.elements.duplicate();

            list.forEach(function (item) {
                if (item.myParent === this) item.myParent = undefined;
            });

            this.Subcomponents.clear();
            return list;
        },

        createSubcomponent: function (properties, dependencies) {
            var component = ns.makeComponent(properties, undefined, this);
            component.withDependencies = dependencies ? dependencies : this.withDependencies;
            this.addSubcomponent(component);
            return component;
        },

        getSubcomponent: function (name, deep) {
            var result = this.Subcomponents.findByName(name);
            if (result || !deep || !name) return result;

            if (name.matches(this.myName)) return this;

            for (var i = 0; i < this.Subcomponents.count ; i++) {
                var comp = this.Subcomponents.item(i);
                var found = comp.getSubcomponent(name, deep);
                if (found) return found;
            };

        },

        //applyToSubcomponent: function (funct, deep) {
        //    var result = funct.call(this, this);
        //    if (!deep) return result;
        //    for (var i = 0; i < this.Subcomponents.count ; i++) {
        //        var comp = this.Subcomponents.item(i);
        //        result = comp.applyToSubcomponent(funct, deep);
        //    };
        //    return result;
        //},

        establishSubcomponent: function (name, properties) {
            var found = this.getSubcomponent(name);
            if (!found) {
                var component = ns.makeComponent(properties, undefined, this);
                if (!component.myName) component.myName = name;
                component.withDependencies = this.withDependencies;

                found = this.Subcomponents.addNoDupe(component);
            }
            return found;
        },

        forEachSubcomponent: function (func, shallow) {
            this.Subcomponents.forEach(function (item) {
                func.call(item, item);
                if (shallow) return;
                item.forEachSubcomponent(func, shallow);
            });
        },

        selectComponents: function (whereClause, col) {
            var list = col === undefined ? ns.makeCollection([], this) : col;

            //using Count will set up a dependency 
            if (this.Subcomponents.count > 0) {
                this.Subcomponents.copyWhere(whereClause, list);
                for (var i = 0; i < this.Subcomponents.count ; i++) {
                    var comp = this.Subcomponents.item(i);
                    comp.selectComponents(whereClause, list);
                };
            };
            return list;
        },

        membersWhere: function (whereClause, col) {
            return this.Subcomponents.membersWhere(whereClause, col);
        },

        appendTo: function (name, list) {
            var collection = this.establishCollection(name);
            var parent = this;
            var members = ns.utils.asArray(list).map(function (init) {
                var component = init;
                if (!ns.utils.isaComponent(component)) {
                    component = ns.makeComponent(init, undefined, parent);
                }
                else {
                    component.myParent = component.myParent ? component.myParent : parent;
                }
                return component;
            });
            collection.addList(members);
            return collection;
        },

        //this forces every structure to be observable out of properties
        makeMembers: function (name, list) {
            var collection = this.establishCollection(name);
            this.establishCollection('Members').addNoDupe(collection);

            var parent = this;
            var members = ns.utils.asArray(list).map(function (item) {
                var component = item;
                if (!ns.utils.isaComponent(component)) {
                    var init = ns.utils.extractSlots(item, function (val) { return !ns.utils.isArray(val); })
                    component = ns.makeComponent(init, undefined, parent); //build this one property at a time

                    var arrays = ns.utils.extractSlots(item, function (val) { return ns.utils.isArray(val); })
                    for (var key in arrays) {
                        component.makeMembers(key, arrays[key]);
                    }
                }
                component.myParent = component.myParent ? component.myParent : parent;
                return component;
            });
            collection.addList(members);
            return collection;
        },

        //functions to work with siblings
        myIndex: function () {
            if (this.mySiblingTotal() < 0) return -1;
            var index = this.myParent.Subcomponents.indexOf(this);
            return index;
        },
        mySiblingTotal: function () {
            if (!this.myParent) return -1;
            var total = this.myParent.Subcomponents.count;
            return total;
        },
        mySiblingPrevious: function () {
            var index = this.myIndex();
            if (index < 0) return undefined;
            index -= 1;
            var found = this.myParent.Subcomponents.itemByIndex(index);
            return found;
        },
        mySiblingNext: function () {
            var index = this.myIndex();
            if (index < 0) return undefined;
            index += 1;
            if (index > this.mySiblingTotal) return undefined;
            var found = this.myParent.Subcomponents.itemByIndex(index);
            return found;
        },
        mySiblingsBefore: function () {
            var index = this.myIndex();
            var result = ns.makeCollection([], this.myParent);
            if (index < 0) return result;

            var elements = this.myParent.Subcomponents.elements;
            if (index >= 0 && index < elements.length) {
                //splice would destroy the inner values
                for (var i = 0; i < index; i++) {
                    result.push(elements[i]);
                }
            }
            return result;
        },
        mySiblingsAfter: function () {
            var index = this.myIndex();
            var result = ns.makeCollection([], this.myParent);
            if (index < 0) return result;

            var elements = this.myParent.Subcomponents.elements;
            if (index >= 0 && index < elements.length) {
                //splice would destroy the inner values
                for (var i = index + 1; i < elements.length; i++) {
                    result.push(elements[i]);
                }
            }
            return result;
        },

        mySiblings: function () {
            var index = this.myIndex();
            var result = ns.makeCollection([], this.myParent);
            if (index < 0) return result;

            var elements = this.myParent.Subcomponents.elements;
            //splice would destroy the inner values
            for (var i = 0; i < elements.length; i++) {
                if (i != index) result.push(elements[i]);
            }

            return result;
        },

        mySiblingsMaxValue: function (propName, defaultValue, filterFunction) {
            var index = this.myIndex();
            if (index < 0) return defaultValue;

            var list = this.myParent.Subcomponents.filter(filterFunction);
            var max = list.maxAll(propName, defaultValue);
            return max;
        },
    };


    ns.isDialogOpen = false;
    ns.Component = Component;

    ns.fromParent = function (propertyName) {
        //var result = this.resolvePropertyReference(propertyName + '@');
        var parent = this.myParent;
        if (!parent) throw new Error("the property " + propertyName + " does not have a parent");

        var result;
        if (parent && parent.resolveSuperior) {
            result = parent.resolveSuperior(propertyName);
        }
        else if (parent) {
            result = parent[propertyName];
        }

        if (result === undefined) throw new Error("the property " + propertyName + " does not exist on the parent");
        return result;
    }



    ns.makeComponent = function (properties, subcomponents, parent) {
        return new ns.Component(properties, subcomponents, parent);
    };


    ns.makeModel = function (template, parent) {
        var model = ns.makeComponent(template.spec, template.Subcomponents, parent);
        model.myName = template.myName;
        return model;
    };

    ns.makeCollection = function (init, parent, spec) {
        return new ns.Collection(init, parent, spec);
    };

    ns.makeOrderedCollection = function (init, parent, indexName) {
        return new ns.OrderedCollection(init, parent, indexName);
    };

    ns.makeCollectionSpec = function (specs, baseClass, onCreate) {
        return new ns.CollectionSpec(specs, baseClass, onCreate);
    };

    ns.doCommand = function (name, context, onComplete) {
        if (context) {
            ns.runWithUIRefreshLock(function () {
                context.doCommand(name);
                onComplete && onComplete();
            });
            return true;
        }
    };

    ns.stringifyPayload = function (spec) {
        var payload = JSON.stringify(spec);
        //if (ns.trace) {
        //    ns.trace.clr();
        //    var pre = JSON.stringify(spec, undefined, 3);
        //    ns.trace.log(pre);
        //}
        return payload;
    }

    ns.parsePayload = function (payload) {
        var spec = JSON.parse(payload);

        //if (ns.trace) {
        //    ns.trace.clr();
        //    var pre = JSON.stringify(spec, undefined, 3);
        //    ns.trace.log(pre);
        //}
        return spec;
    }

    var pubsubCache = {};
    function publishBegin(topic) {
        return topic + 'Begin';
    }

    function publishComplete(topic) {
        return topic + 'Complete';
    }



    ns.publishNoLock = function (/* String */topic, /* Array? */args) {
        if (pubsubCache[topic] === undefined) return false;

        var noErrors = true;
        pubsubCache[topic].forEach(function (func) {
            try {
                func.apply(topic, args || []);
            }
            catch (err) {
                ns.trace && ns.trace.log(err);
                noErrors = false;
            }
        });
        return noErrors;
    };

    ns.publish = function (/* String */topic, /* Array? */args) {
       // ns.runWithUIRefreshLock(function () {
            ns.publishNoLock(publishBegin(topic), args);
            ns.publishNoLock(topic, args);
            ns.publishNoLock(publishComplete(topic), args);
       // });
    }


    ns.subscribe = function (/* String */topic, /* Function */callback) {
        if (!pubsubCache[topic]) {
            pubsubCache[topic] = [];
        }
        pubsubCache[topic].push(callback);
        return [topic, callback]; // Array
    };


    ns.subscribeBegin = function (/* String */topic, /* Function */callback) {
        ns.subscribe(publishBegin(topic), callback);
    };

    ns.subscribeComplete = function (/* String */topic, /* Function */callback) {
        ns.subscribe(publishComplete(topic), callback);
    };

    ns.unsubscribe = function (/* Array */handle) {
        var topic = handle[0];
        pubsubCache[topic] && pubsubCache[topic].forEach(function (idx) {
            if (this == handle[1]) {
                pubsubCache[topic].splice(idx, 1);
            }
        });
    };

    ns.unsubscribeBegin = function (/* String */topic, /* Function */callback) {
        ns.unsubscribe(publishBegin(topic), callback);
    };

    ns.unsubscribeComplete = function (/* String */topic, /* Function */callback) {
        ns.unsubscribe(publishComplete(topic), callback);
    };

    ns.flushPubSubCache = function (topic) {
        delete pubsubCache[publishBegin(topic)];
        delete pubsubCache[topic];
        delete pubsubCache[publishComplete(topic)];
    };

    ns.uiRefreshLock = 0;
    ns.globalUIRefreshLock = function (cnt) {
        ns.uiRefreshLock = ns.uiRefreshLock + cnt;
        if (ns.uiRefreshLock == 0) {
            return ns.uiRefreshLock;
        }
        return ns.uiRefreshLock;
    };


    var uiRefreshStack = new Array();
    ns.markForRefresh = function (obj) {
        if (ns.uiRefreshLock > 0) {
            uiRefreshStack.addNoDupe(obj);
        }
        else {
            obj.refreshUi();
        }
    }

    ns.globalUIReleaseAndRefresh = function (onComplete) {
        var lock = ns.globalUIRefreshLock(0);
        if (lock == 0 && uiRefreshStack.length > 0) {  //0 is so we make sure complete fires..
            var members = uiRefreshStack; //.duplicate();
            uiRefreshStack = new Array();

            var self = this;
            ns.globalUIRefreshLock(1);

            members.forEach(function (member) {
                member.refreshUi();
            });
            members = undefined;
            ns.globalUIRefreshLock(-1);
        }

        if (uiRefreshStack.length == 0) {
            onComplete && onComplete();
        }
    }


    //make sure things are run in content?
    ns.runWithUIRefreshLock = function (callback, onComplete) {
        var start = ns.globalUIRefreshLock(1);
        var result = callback();
        var end = ns.globalUIRefreshLock(-1);
        if (end == 0) {
            ns.globalUIReleaseAndRefresh(onComplete);
        }
        return result;
    };



    ns.UIRefreshLock = function (obj, prop) {
        return function () {
            ns.runWithUIRefreshLock(function () {
                obj[prop];
            });
            return obj[prop];
        }
    };

    ns.writeBlobFile = function (blob, name, ext) {
        var filenameExt = name + ext;
        saveAs(blob, filenameExt);
    };

    function writeTextAsBlob(payload, name, ext) {
        var blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
        ns.writeBlobFile(blob, name, ext);
    };


    ns.writeTextFileAsync = function (payload, name, ext, onComplete) {
        writeTextAsBlob(payload, name, ext);
        if (onComplete) {
            onComplete(payload, name, ext)
            return;
        }
        fo.publish('textFileSaved', [payload, name, ext]);
    };

    fo.readTextFileAsync = function (file, ext, onComplete) {
        var reader = new FileReader();
        reader.onload = function (ev) {
            var filename = file.name;
            var name = filename.replace(ext, '');
            var payload = ev.target.result;
            if (onComplete) {
                onComplete(payload, name, ext);
                return;
            }
            fo.publish('textFileDropped', [payload, name, ext]);
        }
        reader.readAsText(file);
    };

    fo.readImageFileAsync = function (file, ext, onComplete) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var filename = file.name;
            var name = filename.replace(ext, '');
            var payload = evt.target.result;
            if (onComplete) {
                onComplete(payload, name, ext);
                return;
            }
              fo.publish('imageFileDropped', [payload, name, ext]);
        }
        reader.readAsDataURL(file);
    }

    //http://www.html5rocks.com/en/tutorials/file/filesystem/
    ns.enableFileDragAndDrop = function (elementId) {
        function noopEvent(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        }

        function drop(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var dt = evt.dataTransfer;
            var txt = dt.getData("Text");
            var url = dt.getData("URL");  //user dropped an link

            var extensionExtract = /\.[0-9a-z]+$/i;

            var files = dt.files;
            var count = files.length;
            var file = count > 0 && files[0];
            var ext = file ? file.name.match(extensionExtract) : [''];
            ext = ext[0];
            var name = file && file.name.replace(ext, '');

            // Only call the handler if 1 or more files was dropped.
            if (file && file.type.startsWith('image')) {
                fo.readImageFileAsync(file, ext);
            } else if (file && (ext.matches('.knt') || ext.matches('.csv') || ext.matches('.json') || ext.matches('.txt'))) {
                fo.readTextFileAsync(file, ext)
            } else if (url && url.startsWith('http')) {
                fo.publish('urlDropped', [url]);
            } else if (txt) {
                fo.publish('textDropped', [txt]);
            }
        }

        var content = ns.utils.isString(elementId) ? document.getElementById(elementId) : elementId;

        content.addEventListener("dragenter", noopEvent, false);
        content.addEventListener("dragexit", noopEvent, false);
        content.addEventListener("dragover", noopEvent, false);
        content.addEventListener("drop", drop, false);
        //content.addEventListener("ondrop", drop, false);
        return content;
    }




}(Foundry));
///#source 1 1 /Foundry/Foundry.core.relationship.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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
var fo = Foundry;


(function (ns, undefined) {



    //this is designed to be obserervable
    //http://www.klauskomenda.com/code/javascript-inheritance-by-example/
    var Relationship = function (init, parent, indexName) {
        this.base = ns.Collection;

        var list = ns.utils.isaCollection(init) ? init.elements : init;
        this.base(list, parent);

        return this;
    }

    //http://trephine.org/t/index.php?title=JavaScript_prototype_inheritance
    Relationship.prototype = (function () {
        var anonymous = function () { this.constructor = Relationship; };
        anonymous.prototype = ns.Collection.prototype;
        return new anonymous();
    })();


    ns.Relationship = Relationship;

    ns.makeRelationship = function (init, parent, spec) {
        return new ns.Relationship(init, parent, spec);
    };

    // you need to make this observable and dynamic, then does that
    ns.Component.prototype.establishRelationship = function (name, init, spec) {
        var relationship = this[name];
        if (!ns.utils.isaRelationship(relationship)) {
            relationship = ns.makeRelationship(init, this, spec); //this is observable
            relationship.withDependencies = this.withDependencies;
            relationship.myName = name;
            this[name] = relationship;
        };
        return relationship;
    };

    ns.makeRelation = function (source, target, inverse) {
        if (!source || !target) return;

        var spec = this;
        var relation = source.establishRelationship(spec.myName);
        relation.addNoDupe(target);
        return relation;
    };

    ns.unmakeRelation = function (source, target, inverse) {
        if (!source || !target) return;

        var spec = this;
        if (!source[spec.myName]) return;

        var relation = source.establishRelationship(spec.myName);
        relation.remove(target);
        if (relation.isEmpty()) {
            delete source[spec.myName];
        }
        return relation;
    };




}(Foundry));
///#source 1 1 /Foundry/q.js
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /* jshint strict: false */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        /* jshint loopfunc: true */

        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
// engine that has a deployed base of browsers that support generators.
// However, SM's generators use the Python-inspired semantics of
// outdated ES6 drafts.  We would like to support ES6, but we'd also
// like to make it possible to use generators in deployed browsers, so
// we also support Python-style generators.  At some point we can remove
// this block.
var hasES6Generators;
try {
    /* jshint evil: true, nonew: false */
    new Function("(function* (){ yield 1; })");
    hasES6Generators = true;
} catch (e) {
    hasES6Generators = false;
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become fulfilled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be fulfilled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var unhandledReasonsDisplayed = false;
var trackUnhandledRejections = true;
function displayUnhandledReasons() {
    if (
        !unhandledReasonsDisplayed &&
        typeof window !== "undefined" &&
        window.console
    ) {
        console.warn("[Q] Unhandled rejection reasons (should be empty):",
                     unhandledReasons);
    }

    unhandledReasonsDisplayed = true;
}

function logUnhandledReasons() {
    for (var i = 0; i < unhandledReasons.length; i++) {
        var reason = unhandledReasons[i];
        console.warn("Unhandled rejection reason:", reason);
    }
}

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;
    unhandledReasonsDisplayed = false;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;

        // Show unhandled rejection reasons if Node exits without handling an
        // outstanding rejection.  (Note that Browserify presently produces a
        // `process` global without the `EventEmitter` `on` method.)
        if (typeof process !== "undefined" && process.on) {
            process.on("exit", logUnhandledReasons);
        }
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
    displayUnhandledReasons();
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    if (typeof process !== "undefined" && process.on) {
        process.removeListener("exit", logUnhandledReasons);
    }
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;
            if (hasES6Generators) {
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

///#source 1 1 /Foundry/Foundry.core.promise.js
/*
    Foundry.core.Promise.js part of the FoundryJS project
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
var fo = Foundry;


(function (ns, q, undefined) {



    //this is designed to be obserervable
    var Promise = function (owner, name, onSuccess, onFailure) {
        var gComputeStack = owner.globalComputeStack();

        this.promisedToProperty = gComputeStack ? gComputeStack.peek() : this;
        this.value = undefined;
        this.owner = owner;
        this.myName = name;
        this.onSuccess = onSuccess;
        this.onFailure = onFailure ? onFailure : function () { return ns.trace.alert("missing OnFailure"); };

        this.futures = [];
        this.futureError = function () { return ns.trace.alert("Promise was broken"); };
        return this;
    }

    //http://blogs.msdn.com/b/ie/archive/2011/09/11/asynchronous-programming-in-javascript-with-promises.aspx

    Promise.prototype = {
        isWaiting: function () {
            if (ns.utils.isaProperty(this.promisedToProperty)) return true;
            return ns.utils.isArray(this.futures) && this.futures.length > 0;
        },
        whileWaiting: function (waitingCallback) {
            if (this.isWaiting() && this.value === undefined) {
                if (ns.utils.isFunction(waitingCallback)) waitingCallback();
            }
            return this;
        },
        continueWith: function (continueCallback) {  //execute this function as soon as you have a value
            var newValue = this.value;

            if (!this.isWaiting() && newValue !== undefined) {
                this.runFutures(newValue);
                if (ns.utils.isFunction(continueCallback)) {
                    continueCallback(newValue);
                }
                return this;
            }
            else if (ns.utils.isFunction(continueCallback)) {
                this.futures.push(continueCallback);
            }

            return this;
        },
        errorWith: function (errorCallback) {
            this.futureError = errorCallback;
            return this;
        },
        runFutures: function (newValue) {
            if (ns.utils.isArray(this.futures)) {

                for (var i = 0, len = this.futures.length >>> 0; i < len; i++) {
                    this.futures[i](newValue);
                }
                this.futures = undefined; //one then done,  just one shot...
                this.futureError = undefined;
            }

            //if ((this.promisedTo.owner.debug || this.promisedTo.debug) && ns.trace) {
            //    ns.trace.w("continueWith bindings: " + this.asReference() + " status: " + this.status + " Value =" + this.value);
            //}
        },
        fulfillPromised: function (newValue) {
            if (ns.utils.isaProperty(this.promisedToProperty)) {
                this.value = newValue;
                this.promisedToProperty.setValue(newValue);
                this.promisedToProperty = undefined;
                this.runFutures(newValue);
            }
        },
        breakPromised: function (error) {
            this.promisedToProperty = undefined;
            this.futures = undefined; //one then done,  just one shot...

            if (ns.utils.isFunction(this.onError)) this.onError(error)
            if (ns.utils.isFunction(this.futureError)) this.futureError(error)
        },

        onComplete: function (result) {
            var self = this;
            ns.runWithUIRefreshLock(function () {
                self.onSuccess(result);
            });
            //this.owner.updateUi();
        },
        onError: function () {
            var self = this;
            var args = this.arguments;
            ns.runWithUIRefreshLock(function () {
                self.onFailure(args); //do we need a 
            });
            //this.owner.updateUi();
        },
    }

    ns.Component.prototype.createAsyncToken = function (name, onSucess, onFailure) {
        return new Promise(this, name, onSucess, onFailure);
    },

    ns.Promise = Promise;

}(Foundry, Q));

///#source 1 1 /Foundry/Foundry.rules.factory.js
/*
    Foundry.undo.js part of the FoundryJS project
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
Foundry.factory = Foundry.factory || {};
var fa = Foundry.factory;

(function (ns, fa, utils, undefined) {

    ns.getNamespaceKey = function (namespace, type) {
        if (namespace && type) {
            if (type.contains('::')) return type;
            var id = namespace + '::' + type;
            return id;
        }

        if (namespace.contains('::')) {
            return namespace;
        }
        throw new Error("getNamespaceKey invalid arguments")
    }

    ns.isValidNamespaceKey = function (id) {
        if (!id) throw new Error("valid NamespaceKey is missing")

        return true;
    }

    var _constructors = _constructors || {};
    var registerConstructor = function (id, constructor) {
        if (!ns.isValidNamespaceKey(id)) return;

        _constructors[id] = constructor;
        return constructor;
    }

    ns.construct = function (id, properties, subcomponents, parent, onComplete) {
        if (!ns.isValidNamespaceKey(id)) return;

        var constructor = _constructors[id];
        if (!constructor) {
            throw new Error("constructor does not exist for " + id);
        }

        var result = constructor && constructor.call(parent, properties || {}, subcomponents || {}, parent);
        onComplete && onComplete(result, parent);
        return result;
    }



    var _specs = _specs || {};
    var registerSpec = function (id, spec, constructor) {
        if (!ns.isValidNamespaceKey(id)) return;
        if (_specs[id]) throw new Error("a spec already exist for " + id);
        if (_constructors[id]) throw new Error("a constructor already exist for " + id);

        _specs[id] = spec;
        _constructors[id] = constructor ? constructor : _constructors['Component'];
        return spec;
    }

    ns.registerSpec = function (spec, constructor) {
        var id = spec.myType;
        if (!ns.isValidNamespaceKey(id)) return;
        return registerSpec(id, spec, constructor);
    }

    ns.establishSpec = function (spec, constructor) {
        try{
            return ns.registerSpec(spec, constructor);
        }
        catch (ex) {
            var id = spec.myType;
            var newSpec = utils.mixin(_specs[id], spec);
            _specs[id] = newSpec;
            if (constructor) {
                _constructors[id] = constructor
            }
        }
        return newSpec;
    }


 

    ns.findSpec = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;
        var definedSpec = _specs[id];

        return definedSpec;
    }

    ns.extendSpec = function (id, spec, constructor) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = utils.mixin(_specs[id], spec);
        _specs[id] = newSpec;
        if (constructor) {
            _constructors[id] = constructor
        }
        return newSpec;
    }

    //this spec should be an honst way to recreate the component
    ns.instanceSpec = function (obj) {
        var spec = obj.getSpec();
        //do I need to code a reference to the parent?
        //if (this.myParent) spec.myParent = this.myName;

        obj.Properties.forEach(function (mp) {
            if (mp.formula) {
                spec[mp.myName] = "computed: " + ns.utils.cleanFormulaText(mp.formula)  //mp.formula.toString();
            }
        });
        return spec;
    }

    

    http://www.eslinstructor.net/jsonfn/

        function shortFormula(obj, max) {
            var results = ns.utils.cleanFormulaText(obj)
            return results.length > max ? results.substring(0, max) + '...' : results;
        }


    ns.computedSpec = function (obj) {
        var spec;
        obj.Properties.forEach(function (mp) {
            if (mp.formula) {
                spec = spec || {};
                spec[mp.myName] = "computed: " + shortFormula(mp.formula, 100)  //mp.formula.toString();
            }
        });
        return spec;
    }


    //this code will make dupe of spec and force myType to be type
    ns.defineType = function (id, spec, constructor) {
        if (!ns.isValidNamespaceKey(id)) return;
        var completeSpec = utils.union(spec, { myType: id });
        var result =  registerSpec(id, completeSpec, constructor);
        ns.exportType(id);
        return result;
    }

    ns.establishType = function (id, spec, constructor) {
        if (!ns.isValidNamespaceKey(id)) return;
        try {
            return ns.defineType(id, spec, constructor);
        }
        catch (ex) {
            var completeSpec = utils.union(spec, { myType: id });
            return ns.extendSpec(id, completeSpec, constructor);
        }
    }

    ns.extendSpec = function (id, spec, constructor) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = utils.mixin(_specs[id], spec);
        _specs[id] = newSpec;
        if (constructor) {
            _constructors[id] = constructor
        }
        return newSpec;
    }

    ns.extendType = function (id, spec) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = utils.mixin(_specs[id] || {}, spec);
        _specs[id] = newSpec;
        ns.exportType(id);
        return newSpec;
    }

    ns.createNewType = function (id, specIdList, constructor) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = {};
        specIdList.forEach(function (specId) {
            var base = utils.isString(specId) ? _specs[specId] : specId;
            newSpec = utils.union(newSpec, base);
        })
        ns.establishType(id, newSpec, constructor)
        return exportConstructor(id);
    }

    function createTypeDocs(id, fullSpec) {
        var type = {
            myName: id,
            type: _specs[id],
            constructor: _constructors[id],
        }
        try {
            if (fullSpec) {
                type.instance = ns.newInstance(id);
                type.computedSpec = ns.computedSpec(type.instance);
                type.spec = type.instance.getSpec();
            }
        } catch (ex) {
            type.ex = ex;
        }
        return type;
    }

    ns.getAllTypes = function (fullSpec) {
        //for sure you do not want to give then the array, they might destory it.
        var typelist = [];
        for (var key in _specs) {
            var type = createTypeDocs(key, fullSpec);
            typelist.push(type);
        }
        return typelist;
    }

    ns.newSuper = function (id, mixin, subcomponents, parent, onComplete) {
        if (!ns.isValidNamespaceKey(id)) return;

        var constructor = _constructors[id] || _constructors['Component'];
        var definedSpec = _specs[id];

        var completeSpec = definedSpec ? utils.union(definedSpec, mixin) : mixin;
        var result = constructor.call(parent, completeSpec, subcomponents, parent);
        onComplete && onComplete(result, parent);
        return result;
    }

    ns.new = function (spec, parent, onComplete) {
        var id = spec.myType ? spec.myType : 'Component';
        var constructor = _constructors[id] || _constructors['Component'];
        var result = constructor.call(parent, spec, {}, parent);
        onComplete && onComplete(result, parent);
        return result;
    }

    ns.make = function (spec, parent, onComplete) {
        var id = spec.myType;
        if (!ns.isValidNamespaceKey(id)) return;

        var definedSpec = _specs[id];
        var completeSpec = definedSpec ? utils.union(definedSpec, spec) : spec;
        var result = ns.new(completeSpec, parent, onComplete);
        return result;
    }

    ns.makeInstance = function (spec, mixin, parent, onComplete) {
        var base = utils.isString(spec) ? _specs[spec] : spec;
        var completeSpec = utils.union(base, mixin);
        var result = ns.make(completeSpec, parent, onComplete);
        return result;
    }

    ns.newInstance = function (id, mixin, parent, onComplete) {
        if (!ns.isValidNamespaceKey(id)) return;

        var definedSpec = _specs[id];
        var result = ns.makeInstance(definedSpec, mixin, parent, onComplete);
        return result;
    }

    //create the intersection of these properties
    ns.extractSpec = function (id, data) {
        if (!ns.isValidNamespaceKey(id)) return;

        var definedSpec = _specs[id];
        var result = {};
        if ( data) {
            for (key in definedSpec) {
                if (data[key]) {
                    result[key] = data[key];
                }
            }
            delete result.myType
        }

        return result;
    }

    ns.newInstanceExtract = function (id, mixin, parent, onComplete) {
        if (!ns.isValidNamespaceKey(id)) return;

        var extract = ns.extractSpec(id, mixin);

        var definedSpec = _specs[id];
        var result = ns.makeInstance(definedSpec, extract, parent, onComplete);
        return result;
    }


    //create constructors by namespace for each public type..
    function exportConstructor(specId) {
        var id = specId;
        return function (mixin, parent, onComplete) {
            var definedSpec = _specs[id];
            var result = ns.makeInstance(definedSpec, mixin, parent, onComplete);
            return result;
        }
    }

    //create constructors by namespace for each public type..
    function exportExtractConstructor(specId) {
        var id = specId;
        return function (mixin, parent, onComplete) {
            var definedSpec = _specs[id];
            var extract = ns.extractSpec(id, mixin);
            var result = ns.makeInstance(definedSpec, extract, parent, onComplete);
            return result;
        }
    }



    var _namespaces = {};
    ns.exportType = function (specId, fullSpec) {
        if (!ns.isValidNamespaceKey(specId)) return;

        var typeId = specId.split('::');
        if (typeId.length < 2) return;

        var namespace = typeId[0];
        var type = typeId[1];

        var exported = _namespaces[namespace] = _namespaces[namespace] || {};
        ns[namespace] = exported;

        var name = ns.utils.capitaliseFirstLetter(type);
        exported['new' + name] = exportConstructor(specId);
        exported['new' + name + 'Extract'] = exportExtractConstructor(specId);

        if (fullSpec) {
            exported.docs = exported.docs || {};
            exported.docs[name] = createTypeDocs(specId, fullSpec);
        }

        return _namespaces;
    }


    ns.exportTypes = function (fullSpec) {

        for (var specId in _specs) {
            ns.exportType(specId, fullSpec);
        }
        return _namespaces;
    }

}(Foundry, Foundry.factory, Foundry.utils));

//define relationsjips
(function (ns, fa, utils, undefined) {


    var _relationSpec = _relationSpec || {};
    var _relationBuild = _relationBuild || {};

    var relationshipBuilder = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;

        if (_relationBuild[id]) return _relationBuild[id];

        _relationBuild[id] = function (source, target, applyInverse) {
            var spec = _relationSpec[id];
            var linkerFn = spec.linkerFn ?  spec.linkerFn  : ns.makeRelation;
            var result = linkerFn && linkerFn.call(spec, source, target);
            if (applyInverse && spec.myInverse) {
                _relationBuild[spec.myInverse](target, source)
            }
            return result;
        }
        _relationBuild[id].unDo = function (source, target, applyInverse) {
            var spec = _relationSpec[id];
            var unlinkerFn = spec.unlinkerFn ? spec.unlinkerFn : ns.unmakeRelation;
            var result = unlinkerFn && unlinkerFn.call(spec, source, target);
            if (applyInverse && spec.myInverse) {
                _relationBuild[spec.myInverse].unDo(target, source)
            }
            return result;
        }
        return _relationBuild[id];
    }

    var registerRelation = function (id, spec, linker, unLinker) {
        if (!ns.isValidNamespaceKey(id)) return;
        if (_relationSpec[id]) throw new Error("a relationSpec already exist for " + id);
        if (_relationBuild[id]) throw new Error("a relationBuild already exist for " + id);

        var typeId = id.split('::');
        var namespace = typeId.length == 2 ?  typeId[0] : '';
        var name = typeId.length == 2 ?  typeId[1] : typeId[0];
        
        var extend = {
            myType: id,
            myInverse: spec && spec.inverse,
            myName: name,
            namespace: namespace,
            linkerFn: linker ? linker : _relationSpec['linksTo'].linkerFn,
            unlinkerFn: unLinker ? unLinker : _relationSpec['linksTo'].unlinkerFn,
        }
        var completeSpec = utils.union(extend, spec);
        _relationSpec[id] = completeSpec;
        return relationshipBuilder(id);
    }

    ns.establishRelation = function (id, spec, linker, unLinker) {
        if (!ns.isValidNamespaceKey(id)) return;

        try {
            return registerRelation(id, spec, linker, unLinker);
        }
        catch (ex) {
            return relationshipBuilder(id);
        }
    }

    ns.establishRelationship = function (id1, id2) {
        var relate = id1.split('|');
        if (relate.length == 2 && !id2) {
            id1 = relate[0];
            id2 = relate[1];
        }
        var r1 = ns.establishRelation(id1, { inverse: id2 });
        var r2 = ns.establishRelation(id2, { inverse: id1 });
        return r1;
    }


    function createRelationDocs(id, fullSpec) {
        var type = {
            myName: id,
            relation: _relationSpec[id],
            linker: _relationBuild[id],
        }
        try {
            if (fullSpec) {
                type.instance = type.relation;
                //type.computedSpec = ns.computedSpec(type.instance);
                type.spec = type.instance;
            }
        } catch (ex) {
            type.ex = ex;
        }
        return type;
    }

    ns.getAllRelations = function (fullSpec) {
        //for sure you do not want to give then the array, they might destory it.
        var relationlist = [];
        for (var key in _relationSpec) {
            var relation = createRelationDocs(key, fullSpec);
            relationlist.push(relation);
        }
        return relationlist;
    }

}(Foundry, Foundry.factory, Foundry.utils));


//current set of definitions
(function (ns, undefined) {
    if (!ns.establishType) return;

    ns.establishType('Component', {}, ns.makeComponent);

    if (!ns.establishRelation) return;

    ns.establishRelation('linksTo', {}, ns.makeRelation, ns.unmakeRelation)

}(Foundry));
///#source 1 1 /Foundry/Foundry.adaptor.js

var Foundry = Foundry || {};
var fo = Foundry;

(function (ns,undefined) {
//in prep for prototype pattern...
    var Adaptor = function (properties, subcomponents, parent) {
        //"use strict";

        this.myName = undefined;
        this.myParent = parent;
        this.myType = 'Adaptor';

        this.createParameters(properties);
        return this;
    }

    //Prototype defines functions using JSON syntax
    Adaptor.prototype = {
        makeComputedValue: function (obj, key, init) {
            var initValueComputed = ns.utils.isFunction(init);
            if (initValueComputed) {
                var initValue = init;
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        if (!initValueComputed) return initValue;
                        result = initValue.call(obj, obj);
                        return result;
                    },
                    set: function (newInit) {
                        initValueComputed = ns.utils.isFunction(newInit);
                        initValue = newInit;
                    }
                });
            }
            else {
                obj[key] = init;
            }
            return obj;
        },
        createProperty: function (name, init) {
            var obj = this.makeComputedValue(this, name, init);
            return obj;
        },
        createParameters: function (obj) {
            if (obj !== undefined) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var init = obj[key];
                        this.createProperty.call(this, key, init);
                    }
                }
            }
        },
        subscribeToCommands: function (regexPattern) {
            //subscribe to any do* of goto* messages...
              var self = this;
            var keys = Object.keys(self);
            keys.forEach(function (key) {
                if (key.startsWith('do') || key.startsWith('goto')) {
                    fo.subscribe(key, function () {
                        self[key];
                    });
                }
            });
        },
    }

    ns.Adaptor = Adaptor;

    ns.makeAdaptor = function (properties, subcomponents, parent) {
        return new ns.Adaptor(properties, subcomponents, parent);
    };

    ns.Component.prototype.createAdaptor = function (properties, dependencies) {
        var component = new ns.Adaptor(properties, undefined, this);
        this.Subcomponents.push(component);

        return component;
    };



}(Foundry));

(function (ns, undefined) {

    //a cool way to attach the managed properties from a component
    function attachProperty(obj, key, source) {
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                var result = source[key];
                return result
            },
            set: function (newInit) {
                source[key] = newInit;
            }
        });
    }

    ns.attachComponent = function (self, source) {
        if (source !== undefined) {
            for (var key in source) {
                if (key.startsWith('_')) {
                    var prop = source[key];
                    var name = prop.myName;
                    attachProperty(self, name, source);
                }
            }
        }

        return self;
    };

}(Foundry));
///#source 1 1 /Foundry/Foundry.hub.js
/*
    Foundry.hub.js part of the FoundryJS project
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
Foundry.hub = Foundry.hub || {};

//this module lets you send data and commands between windows
//it extends the normal pub/sub API in foundry core


(function (ns, fo, undefined) {

    function log(message) {
        fo.trace && fo.trace.log(message);
    }

    ns.subscribe = function (topic, callback) {
        fo.subscribe(topic, callback);
    };
    ns.unsubscribe = function (topic, callback) {
        fo.unsubscribe([topic, callback]);
    };
    ns.publish = function (topic, args) {
        fo.publish(topic, args);
    };


    var _commands = {};
    ns.registerCommand = function (cmdJSON) {
        _commands = _commands ? _commands : {};
        return fo.utils.extend(_commands, cmdJSON);
    }




    var _commandResponses = {};
    ns.registerCommandResponse = function (cmdJSON) {
        _commandResponses = _commandResponses ? _commandResponses : {};
        return fo.utils.extend(_commandResponses, cmdJSON);
    }

    ns.sendCommand = function (command, payload, delay) {
        ns.sendMessage(command, payload, delay);
    }



    function processCommand(cmd, payload) {
        var func = _commandResponses[cmd];
        if (func) {
            func(payload);
            return true;
        }
        var func = _commands[cmd];
        if (func) {
            func(payload);
            return true;
        }
    }


    var mainWindow = false;
    var destinationWindow = window.opener;

    ns.isWindowOpen = function () {
        return destinationWindow ? true : false;
    }
    ns.isMainWindow = function () {
        return mainWindow;
    }

    var crossDomain = false;
    ns.isCrossDomain = function () {
        return crossDomain;
    }

    ns.setCrossDomain = function (value) {
        if (value == crossDomain) return;
        toggleCrossDomain(value)
    }


    // Default destination is the opening window (if any)
    function toggleCrossDomain(value) {
        crossDomain = value;
        // Function to receive a CrossDomain message
        ns.receiveCrossDomainMessage = function (event) {
            try {
                log('Received message from ' + event.origin + ': ' + event.data);
                var message = JSON.parse(event.data);
                if (message) {
                    var payload = message.json ? JSON.parse(message.payload) : message.payload;
                    processReceivedMessage(message.command, payload);
                }
            } catch (e) {
                log('Invalid message received');
            }
        }
        if (crossDomain)
            window.addEventListener('message', ns.receiveCrossDomainMessage, false);
        else
            window.removeEventListener('message', ns.receiveCrossDomainMessage);

        // Function to send a CrossDomain message
        ns.sendCrossDomainMessage = function (destination, command, payload) {
            if (!destination || destination.closed) {
                log('No window or window closed');
                return false;
            }

            try {
                var message = JSON.stringify({
                    command: command,
                    payload: payload,
                    json: typeof payload === 'string' ? false : true,
                });
                log('Sending message: ' + message);
                destination.postMessage(message, '*');
            } catch (e) {
                log('Unable to send message');
            }
        }
    }

    toggleCrossDomain(crossDomain);

    ns.sendMessage = function (command, payload, delay) {
        var wait = delay ? delay : 0;
        window.setTimeout(function () {
            if (crossDomain) {
                ns.sendCrossDomainMessage(destinationWindow, command, payload);
            } else {
                if (destinationWindow && destinationWindow.receiveMessage) {
                    //it is the other windows that receives messages
                    destinationWindow.receiveMessage(command, payload);
                }
            }

        }, wait);
    }


    function closeCurrentWindow() {
        var temp = destinationWindow;
        stopMessageProcessing();
        if (temp && temp.receiveMessage) {
            temp.receiveMessage('windowClosed', {isMainWindow: mainWindow})
        }
        destinationWindow = undefined;
    }

    function stopMessageProcessing() {
        destinationWindow = undefined;
        _commandResponses = undefined;
        delete window.receiveMessage;
    }

    function processReceivedMessage(command, payload, silent) {
        var isCmd = fo.utils.isString(command);
        if (isCmd && processCommand(command, payload)) {
            return true;
        }

        if (isCmd && !silent) {
            alert(command + ' WAS NOT PROCESSED ' + window.location.pathname);
            return false;
        }

       //ns.broadcastUICommand(command, payload);
        //ns.broadcastDataQuery(command, payload);
    }


    //SRS test if this is right
    ns.getHttpContext = function () {
        return location.protocol + "//" + location.host + location.pathname.slice(0, location.pathname.indexOf('/', 1));
    }


    ns.doCommand = function (command, payload, delay) {

        var func = _commands[command];
        if (func) {
            func(payload);
            return true;
        }

        var wait = delay ? delay : 0;
        window.setTimeout(function () {
            processReceivedMessage(command, payload, true)
        }, wait);
    }

    if (destinationWindow) {
        //this means the window is the child window and 
        //destinationWindow is the parent window who launched you
        window.onbeforeunload = function (evt) {
            closeCurrentWindow();
        }

        ns.registerCommandResponse({
            windowClosed: function (payload) {
                closeCurrentWindow();
                window.close(); //we should close this window also
            }
        });

        window.receiveMessage = function (command, payload) {
            processReceivedMessage(command, payload);
        }
    }

    //having only once instance of destinationWindow prevents you from 
    //opening more than one window
    ns.openWindow = function (url, onClose) {
        //this means the window is the window who launched the child
        //destinationWindow is the child window who was launched
        if (destinationWindow) return destinationWindow;

        mainWindow = true;
        destinationWindow = window.open(url, "_blank"); //i think windowOpen only works in IE
        //now create an iframe in that window

        window.onbeforeunload = function (evt) {
            closeCurrentWindow();
        }

        ns.registerCommandResponse({
            windowClosed: function (payload) {
                if (payload && !payload.isMainWindow) {
                    onClose && onClose(destinationWindow);
                    destinationWindow = undefined;
                }
            }
        });

        window.receiveMessage = function (command, payload) {
            //alert('parent window receiveMessage');
            processReceivedMessage(command, payload);
        }
        return destinationWindow;
    }


    ns.closeWindow = function () {
        if (destinationWindow) {
            //this should clear other window automatically because 
            //the destinationWindow will send this window a windowClosed message also
            closeCurrentWindow();
        }
    }

    //having only once instance of destinationWindow prevents you from 
    //opening more than one window
    ns.openIFrameWindow = function (url, loadingUri, onClose) {
        //this means the window is the window who launched the child
        //destinationWindow is the child window who was launched
        if (destinationWindow) return destinationWindow;

        mainWindow = true;
        toggleCrossDomain(true);
        destinationWindow = window.open(url, "_blank"); //i think windowOpen only works in IE
        //now create an iframe in that window
        var doc = destinationWindow.document;
        var iframe = doc.getElementById('iframe');
        //iframe.width = '100%';
        //iframe.height = '100%';
        //iframe.src = loadingUri;
        //doc.body.appendChild(iframe);
        destinationWindow = iframe;

        window.onbeforeunload = function (evt) {
            closeCurrentWindow();
        }

        ns.registerCommandResponse({
            windowClosed: function (payload) {
                if (payload && !payload.isMainWindow) {
                    onClose && onClose(destinationWindow);
                    destinationWindow = undefined;
                }
            }
        });

        window.receiveMessage = function (command, payload) {
            //alert('parent window receiveMessage');
            processReceivedMessage(command, payload);
        }
        return destinationWindow;
    }




	//command and Control 
    var UIChannel = 'IUCommand';
    ns.broadcastUICommand = function (command, payload) {
        ns.publish(UIChannel, [command, payload]);
    };
    ns.subscribeUICommand = function (func) {
        ns.subscribe(UIChannel, func);
    };



    var DQChannel = 'DataQueryCommand';
    ns.broadcastDataQuery = function (command, payload) {
        ns.publish(DQChannel, [command, payload]);
    };
    ns.subscribeDataQuery = function (func) {
        ns.subscribe(DQChannel, func);
    };


	
}(Foundry.hub, Foundry));
///#source 1 1 /Foundry/FileSaver.js
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2013-01-23
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  || (navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  || (function(view) {
	"use strict";
	var
		  doc = view.document
		  // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, URL = view.URL || view.webkitURL || view
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link =  !view.externalHost && "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function (ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		, deletion_queue = []
		, process_deletion_queue = function() {
			var i = deletion_queue.length;
			while (i--) {
				var file = deletion_queue[i];
				if (typeof file === "string") { // file is an object URL
					URL.revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			}
			deletion_queue.length = 0; // clear queue
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, FileSaver = function(blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, get_object_url = function() {
					var object_url = get_URL().createObjectURL(blob);
					deletion_queue.push(object_url);
					return object_url;
				}
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_object_url(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
                        window.open(object_url, "_blank");
                    }
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_object_url(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									deletion_queue.push(file);
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	view.addEventListener("unload", process_deletion_queue, false);
	return saveAs;
}(self));

///#source 1 1 /Foundry/canvas2Blob.js
/* canvas-toBlob.js
 * A canvas.toBlob() implementation.
 * 2011-07-13
 * 
 * By Eli Grey, http://eligrey.com and Devin Samarin, https://github.com/eboyjr
 * License: X11/MIT
 *   See LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/canvas-toBlob.js/blob/master/canvas-toBlob.js */

(function(view) {
"use strict";
var
	  Uint8Array = view.Uint8Array
	, HTMLCanvasElement = view.HTMLCanvasElement
	, is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i
	, base64_ranks
	, decode_base64 = function(base64) {
		var
			  len = base64.length
			, buffer = new Uint8Array(len / 4 * 3 | 0)
			, i = 0
			, outptr = 0
			, last = [0, 0]
			, state = 0
			, save = 0
			, rank
			, code
			, undef
		;
		while (len--) {
			code = base64.charCodeAt(i++);
			rank = base64_ranks[code-43];
			if (rank !== 255 && rank !== undef) {
				last[1] = last[0];
				last[0] = code;
				save = (save << 6) | rank;
				state++;
				if (state === 4) {
					buffer[outptr++] = save >>> 16;
					if (last[1] !== 61 /* padding character */) {
						buffer[outptr++] = save >>> 8;
					}
					if (last[0] !== 61 /* padding character */) {
						buffer[outptr++] = save;
					}
					state = 0;
				}
			}
		}
		// 2/3 chance there's going to be some null bytes at the end, but that
		// doesn't really matter with most image formats.
		// If it somehow matters for you, truncate the buffer up outptr.
		return buffer;
	}
;
if (Uint8Array) {
	base64_ranks = new Uint8Array([
		  62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1
		, -1, -1,  0, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9
		, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25
		, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
		, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
	]);
}
if (HTMLCanvasElement && !HTMLCanvasElement.prototype.toBlob) {
	HTMLCanvasElement.prototype.toBlob = function(callback, type /*, ...args*/) {
		  if (!type) {
			type = "image/png";
		} if (this.mozGetAsFile) {
			callback(this.mozGetAsFile("canvas", type));
			return;
		}
		var
			  args = Array.prototype.slice.call(arguments, 1)
			, dataURI = this.toDataURL.apply(this, args)
			, header_end = dataURI.indexOf(",")
			, data = dataURI.substring(header_end + 1)
			, is_base64 = is_base64_regex.test(dataURI.substring(0, header_end))
			, blob
		;
		if (Blob.fake) {
			// no reason to decode a data: URI that's just going to become a data URI again
			blob = new Blob
			if (is_base64) {
				blob.encoding = "base64";
			} else {
				blob.encoding = "URI";
			}
			blob.data = data;
			blob.size = data.length;
		} else if (Uint8Array) {
			if (is_base64) {
				blob = new Blob([decode_base64(data)], {type: type});
			} else {
				blob = new Blob([decodeURIComponent(data)], {type: type});
			}
		}
		callback(blob);
	};
}
}(self));

/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */

(function () {

    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64DecodeChars = new Array(
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function base64encode(str) {
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }

    function base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1)
                break;

            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1)
                break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1)
                break;

            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }

    if (!window.btoa) window.btoa = base64encode;
    if (!window.atob) window.atob = base64decode;

})();

///#source 1 1 /Foundry/Foundry.workspace.core.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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
Foundry.workspace = Foundry.workspace || {};
Foundry.ws = Foundry.workspace;

//the goal of this module is to manage the API for the resources
//that an app might use like saving and recovering models from 
//local storage and the cloud


(function (ns, fo, cv, undefined) {

    var utils = fo.utils;


    var workspaceSpec = {
        isVisible: true,
        rootModel: function () {
        },
        rootPage: function () {
        },

        localStorageKey: 'FoundryLocal',
        userNickName: function () {
            return 'Anonymous';
        },
        userId: function () {
            return 'unknown';
        },
        hasUserId: function () {
            return !this.userId.matches('unknown');
        },
        sessionKey: function () {
            return 'NO_SESSION';
        },
        hasSessionKey: function () {
            var key = this.sessionKey;
            if (!key || key.length == 0) {
                this._sessionKey.smash();
                return false;
            }
            var result = !key.matches('NO_SESSION');
            return result;
        },
        sessionUrl: '',
        sessionTitle: '',
        documentName: '',
        documentExt:'',
        isDocumentSaved: false,
        documentTitle: function () {
            var result = this.documentName + this.documentExt;
            if (result && !this.isDocumentSaved) {
                result += "*";
            }
            return result;
        },
        title: function () { return this.rootModel ? this.rootModel.title : undefined },
        subTitle: function () { return this.rootModel ? this.rootModel.subTitle : undefined },

        clientCount: '#',
        traffic: '0',

        //knowtshareSessionUrl: function () {
        //    var loc = window.location;
        //    var url = "{0}//{1}/Home/KnowtShare/{2}".format(loc.protocol, loc.host, this.sessionKey);
        //    return url; // "http://knowtsignal.azurewebsites.net/KnowtShare/{0}".format(this.sessionKey);
        //},

    }

    var Workspace = function (properties, subcomponents, parent) {
        fo.exportTypes();

        this.base = fo.Component;
        this.base(utils.union(workspaceSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'Workspace';
        return this;
    };

    Workspace.prototype = (function () {
        var anonymous = function () { this.constructor = Workspace; };
        anonymous.prototype = fo.Component.prototype;
        return new anonymous();
    })();

    ns.Workspace = Workspace;
    utils.isaWorkspace = function (obj) {
        return obj instanceof Workspace ? true : false;
    };

    fo.myWorkspace = function (obj) {
        var type = obj && obj.myType;
        if (utils.isaWorkspace(obj)) return obj;
        if (obj && obj.myParent) return fo.myWorkspace(obj.myParent);
    }

    //thiis is used to move document data between contoler and workspace
    var copyDocumentMask = {
        documentName: true,
        documentExt: true,
        isDocumentSaved: true,
    }


    var copySessionMask = {
        sessionKey: true,
        sessionUrl: true,
        userNickName: true,
        userId: true,
    }

    function copyUsingMask(from, to, mask) {
        if (!from || !to) return;
        for (var key in mask) {
            if (mask[key]) {
                to[key] = from[key];
            }
        }
        return to;
    };

    
    Workspace.prototype.currentSessionSpec = function () {
        var spec = {};
        copyUsingMask(this, spec, copySessionMask);
        return spec;
    }
    Workspace.prototype.currentDocumentSpec = function () {
        var spec = {};
        copyUsingMask(this, spec, copyDocumentMask);
        return spec;
    }

    Workspace.prototype.attachDocumentDetails = function (details) {

        var document = fo.utils.union({
            version: fo.version,
            title: this.title,
            subTitle: this.subTitle,
            lastModified: new Date(),
        }, details);

        this.copyDocumentSpecTo(document);

        return document;
    };

    Workspace.prototype.defaultNS = function (name) {
        var id = fo.getNamespaceKey(this.myName, name);
        return id;
    }

    Workspace.prototype.stencilNS = function (name) {
        var id = fo.getNamespaceKey(this.myName, name);
        return id;
    }

    Workspace.prototype.copyDocumentSpecTo = function (target){
        return copyUsingMask(this, target, copyDocumentMask);
    }
    Workspace.prototype.copyDocumentSpecFrom = function (source) {
        return copyUsingMask(source, this, copyDocumentMask);
    }

    Workspace.prototype.clearDocumentSpec = function () {
        for (var key in copyDocumentMask) {
            if (copyDocumentMask[key]) {
                    this[key] = '';
                }
            }
            return this;
    }

    Workspace.prototype.copySessionSpecTo = function (target) {
        return copyUsingMask(this, target, copySessionMask);
    }
    Workspace.prototype.copySessionSpecFrom = function (source) {
        return copyUsingMask(source, this, copySessionMask);
    }

    Workspace.prototype.clearSessionSpec = function () {
        for (var key in copySessionMask) {
            if (copySessionMask[key]) {
                this[key] = '';
            }
        }
        return this;
    }


    Workspace.prototype.clear = function () {
        var self = this;
        self.rootModel.removeAllSubcomponents();
        if (self.rootPage) {
            self.rootPage.selectShape(undefined, true);
            self.rootPage.removeAllSubcomponents();
            self.rootPage.updateStage(true);
        }
        delete self.localData;
        fo.publish('WorkspaceClear', [self])

        //fo.digestLock && fo.digestLock(self.rootPage, function () {
        //    self.rootPage.clear();
        //    self.rootPage.updateStage(true);
        //});
    }

    Workspace.prototype.payloadSaveAs = function (payload, name, ext, onComplete) {
        //this depends on the function saveAs exisitng
        if (!saveAs && payload) return false;
        var data = utils.isString(payload) ? payload : fo.stringifyPayload(payload);
        fo.writeTextFileAsync(data, name, ext, onComplete);
        return true;
    }

    //this assumes the use just want to save the current file maybe with an new extension name
    Workspace.prototype.userSaveFileDialog = function (onComplete, defaultExt, defaultValue) {
        fo.publish('info', ['Workspace.userSaveFileDialog', 'method missing']);
    }

    Workspace.prototype.userOpenImageDialog = function (onComplete) {
        return this.userOpenFileDialog(onComplete, 'image/*');
    }

    Workspace.prototype.userOpenFileDialog = function (onComplete, defaultExt, defaultValue) {

        //http://stackoverflow.com/questions/181214/file-input-accept-attribute-is-it-useful
        //accept='image/*|audio/*|video/*'
        var accept = defaultExt || '.knt,.csv';

        var fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('accept', accept);
        fileSelector.setAttribute('value', defaultValue);
        fileSelector.setAttribute('style', 'visibility: hidden; width: 0px; height: 0px');
        //fileSelector.setAttribute('multiple', 'multiple');
        document.body.appendChild(fileSelector);
        fileSelector.click();
        var extensionExtract = /\.[0-9a-z]+$/i;

        var files = fileSelector.files;
        var count = files.length;
        var file = count > 0 && files[0];
        var ext = file ? file.name.match(extensionExtract) : [''];
        ext = ext[0];
        document.body.removeChild(fileSelector);

        if (file && file.type.startsWith('image')) {
            fo.readImageFileAsync(file, ext, onComplete);
        }
        else if (file && (ext.matches('.knt') || ext.matches('.csv') || ext.matches('.json') || ext.matches('.txt'))) {
            fo.readTextFileAsync(file, ext, onComplete);
        }
    }

    Workspace.prototype.matchesSession = function (sessionKey) {
        var result = this.hasSessionKey && this.sessionKey.matches(sessionKey);
        return result;
    }

    Workspace.prototype.matchesUser = function (userID) {
        var result = this.hasUserId && this.userId.matches(userID);
        return result;
    }

    Workspace.prototype.digestLock = function (callback, onComplete) {
        var page = this.rootPage;
        fo.digestLock(page, callback, onComplete);
    }

    Workspace.prototype.specToModelSync = function (spec, modifyModelTypeFn, modifyShapeTypeFn) {
        if (!spec) return;

        this.localData = fo.utils.mixin(this.localData, spec.localData);
        var rootModel = this.rootModel;
        var rootPage = this.rootPage;

        var space = this;
        space.modelDictionary = space.modelDictionary || {};
        space.pageDictionary = space.pageDictionary || {};


        //temp for this version;
        fo.modelDictionary = space.modelDictionary;
        fo.pageDictionary = space.pageDictionary;


        try {
            fo.runWithUIRefreshLock(function () {
                if (spec.document) {
                    space.copyDocumentSpecFrom(spec.document);
                }

                rootModel.rehydrate(rootModel, spec.model, space.modelDictionary, modifyModelTypeFn);

                if (rootPage) {
                    rootPage.rehydrate(rootPage, spec.drawing, space.pageDictionary, modifyShapeTypeFn);
                }

            });
        } catch (e) {
            throw new Error('specToModelSync: ' + e.message)
        }

        return {
            command: spec.command,
            document: spec.document,
        }
    }


    Workspace.prototype.saveSession = function (syncPayload, sessionName, onComplete) {
        var self = this;
        self.sessionStorageDate = Date.now();
        var key = self.documentName || sessionName || this.localStorageKey;
        //var syncPayload = self.currentModelAsPayload({}, true, true);
        if (localStorage) {
            localStorage.setItem('currentSession', key);
            localStorage.setItem(key, key ? syncPayload : '');
        }
        if (localStorage) {
            localStorage.setItem(sessionName || this.localStorageKey, syncPayload);
        }
        onComplete && onComplete();
        fo.publish('workspaceSessionSaved', [self])
    }

    Workspace.prototype.restoreSession = function (sessionName, syncToModelFn) {
        var self = this;
        var syncPayload;
        if (sessionStorage) {
            if (localStorage) {
                var key = localStorage.getItem('currentSession');
                syncPayload = key ? localStorage.getItem(key) : undefined;

                //uncomment this code to flush the local store
                //localStorage.setItem(key, '');
                //localStorage.setItem('currentSession', '');
                //localStorage.setItem(this.localStorageKey, syncPayload);
            }
            if (localStorage && !syncPayload) {
                syncPayload = localStorage.getItem(sessionName || this.localStorageKey);
            }

            try {
                var spec = syncToModelFn && syncToModelFn(syncPayload);

                //SRS write code to also update the titles from the last state,
                //olny using the session storage if local storage is not found
                if (spec && spec.document) {
                    space.copyDocumentSpecFrom(spec.document);

                    self.sessionStorageDate = spec.document.sessionStorageDate;
                }
            }
            catch (ex) {
                localStorage.setItem('currentSession', '');
            };
            fo.publish('workspaceSessionRestored', [self])
        }
        return syncPayload;
    }


    Workspace.prototype.payloadToCurrentModel = function (payload) {
        if (!payload) return;

        var spec = fo.parsePayload(payload);
        return this.specToModelSync(spec);
    };

    Workspace.prototype.currentModelToPayload = function (command, persist, keepSelection) {
        var spec = this.modelToSpec(command, persist, keepSelection);
        //now add the localData
        spec.localData = this.localData || {};

        return fo.stringifyPayload(spec);
    };

    Workspace.prototype.currentModelTarget = function(type) {
        var found = this.rootPage && this.rootPage.selectedContext();
        //found = !found ? found : found.findParentWhere(function (item) {
        //    return item.isOfType(type || 'note')
        //});
        return found ? found : this.rootModel;
    }

    Workspace.prototype.currentViewTarget = function (type) {
        var found = this.rootPage && this.rootPage.selectedShape();
        //found = !found ? found : found.findParentWhere(function (item) {
        //    return item.isOfType(type || 'note')
        //});

        return found ? found : this.rootPage;
    }


    ns.makeWorkspace = function (properties, subcomponents, parent) {
        var space = new Workspace(properties, subcomponents, parent);
        return space;
    };

    ns.makeModelWorkspace = function (name, properties, modelSpec) {

        //setup root model
        var defaultTemplate = {
            myName: name,
            spec: modelSpec,
            Subcomponents: {},
        };


        var space = new Workspace(properties);
        space.myName = name + 'Session';

        if (!space.rootModel) {
            space.rootModel = fo.makeModel(defaultTemplate, space);
        }


        space.modelToSpec = function (command, persist) {

            var model = !this.rootModel ? [] : this.rootModel.Subcomponents.map(function (item) {
                var result = item.dehydrate(true);
                return result;
            });

            var spec = {
                command: command,
                model: model,
                localData: this.localData,
            };

            if (persist) {
                spec.document = space.attachDocumentDetails();
            }

            return spec;
        };

        return space;
    };

    ns.makeNoteWorkspace = function (name, properties, modelSpec, enableDragDrop) {

        var spaceSpec = {
            localStorageKey:  name + 'Session',         
        }
        var canvasId = properties && properties.canvasId;
        var panZoomCanvasId = properties && properties.panZoomCanvasId;
        var pipId = properties && properties.pipId;

        var space = ns.makeModelWorkspace(name, utils.union(spaceSpec, properties), modelSpec);

        if (enableDragDrop) {
            fo.enableFileDragAndDrop(canvasId);
        }

        //create drawing;
        space.drawing = cv.makeDrawing(canvasId, panZoomCanvasId, pipId, properties);
        space.drawing.myParent = space;


        //setup root page
        space.rootPage = space.drawing.page;
        space.rootPage.setAnimationsOn(true);
        space.rootPage.updateStage();

        space.saveCanvasAsBlob = function (name, ext) {
            var canvas = space.rootPage.canvas;
            //var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            //var blob = new Blob([image]);
            //fo.writeBlobFile(blob, name, ext);
            ////Canvas2Image.saveAsPNG(canvas);
            canvas.toBlob(function (blob) {
                fo.writeBlobFile(blob, name, ext);
            });

        }


        space.doSessionSave = function () {
            var self = this;
            var payload = self.currentModelToPayload({}, true, true);
            self.saveSession(payload, self.localStorageKey, function () {
            });
        };

        space.doSessionRestore = function () {
            var self = this;
            self.restoreSession(self.localStorageKey, function (payload) {
                self.clear();
                self.digestLock(function () {
                    self.payloadToCurrentModel(payload);
                });
            });
        };

        space.payloadToLocalData = function (name, payloadCSV) {
            if (!payloadCSV) return;

            var self = this;
            self.localData = self.localData || {};

            var payload = fo.convert.csvToJson(payloadCSV);
            var json = fo.parsePayload(payload);
            self.localData[name] = json;
            return json;
        };



        space.modelToSpec = function (command, persist, keepSelection) {

            if (this.rootPage && !keepSelection) {
                this.rootPage.selectShape(undefined, true);
                this.rootPage.selectDropTarget(undefined, true);
            }

            var model = !this.rootModel ? [] : this.rootModel.Subcomponents.map(function (item) {
                var result = item.dehydrate(true);
                return result;
            });

            var page = !this.rootPage ? [] : this.rootPage.Subcomponents.map(function (item) {
                var result = item.dehydrate(true, { isSelected: false, isActiveTarget: false, });
                return result;
            });

            var spec = {
                command: command,
                model: model,
                drawing: page,
                localData: this.localData,
            };

            if (persist) {
                spec.document = space.attachDocumentDetails();
            }

            return spec;
        };


        return space;
    };





//        doToDoApp: function () {
//            fo.hub.openWindow('ToDo.html');
//            var self = this;
//            fo.hub.setCrossDomain(false);
//            fo.hub.registerCommandResponse({
//                syncModelRequest: function (payload) {
//                    var syncPayload = self.currentModelAsPayload();
//                    fo.hub.sendCommand('syncModelResponse', syncPayload);
//                },
//                createNote: function (obj) {
//                    var text = obj.text;

//                    var note = self.createNote(text).note;
//                    fo.publish('ModelChanged', [note]);

//                }
//            });
//        },
//        doRecommendationApp: function () {
//            fo.hub.openWindow('Recommendation.html');
//            var self = this;
//            fo.hub.setCrossDomain(false);
//            fo.hub.registerCommandResponse({
//                syncModelRequest: function (payload) {
//                    var syncPayload = self.currentModelAsPayload();
//                    fo.hub.sendCommand('syncModelResponse', syncPayload);
//                },
//            });
//        },



	
}(Foundry.workspace, Foundry, Foundry.canvas));
///#source 1 1 /Foundry/Foundry.undo.js
/*
    Foundry.undo.js part of the FoundryJS project
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
Foundry.undo = Foundry.undo || {};

(function (ns, fo, undefined) {

    var _undoID = 0;
    var _isDoing = false;
    var _isUndoing = false;
    var _undoRing = [];

    ns.clear = function () {
        _undoRing = [];
    }

    ns.canUndo = function () {
        return _undoRing.length ? true : false;
    }

    ns.isUndoing = function () {
        return _isUndoing;
    }
    ns.isDoing = function () {
        return _isDoing;
    }

    var _doActions = {};
    var _undoActions = {};
    var _verifyKeep = {};

    ns.do = function (action, item) {
        _isDoing = true;
        var func = _doActions[action];
        var undo = { action: action, payload: item, undoID: _undoID++ }
        _undoRing.push(undo);
        undo.payload = func ? func.call(undo, item) : item;

        _isDoing = false;
        fo.publish('undoAdded', [undo]);
        return undo;
    }

    ns.unDo = function (myUnDo) {
        if (!ns.canUndo()) return;

        _isUndoing = true;
        var undo = myUnDo;
        if (undo) {
            _undoRing.removeItem(myUnDo);
        } else {
            var index = _undoRing.length - 1;
            undo = _undoRing.splice(index, 1)[0];
        }

        var item = undo.payload;
        var func = _undoActions[undo.action];
        var payload = func ? func.call(undo, item) : item;
        _isUndoing = false;
        fo.publish('undoRemoved', [undo]);
        return payload;
    }

    //if the verify function return TRUE then keep the last undo action...
    ns.verifyKeep = function (undo, item) {
        if (!undo) return true;
        var action = undo.action;
        var func = _verifyKeep[action];
        var keep = func ? func.call(undo, item, undo.payload) : true;
        if (!keep) { //remove Undo from the queue
            _undoRing.removeItem(undo); //item has been removed..
        }
        return keep; 
    }

    ns.registerActions = function (action, doFunc, undoFunc, verifyKeepFunc) {
        _doActions[action] = doFunc ? doFunc : function (p) { return p; };
        _undoActions[action] = undoFunc ? undoFunc : function (p) { return p; };
        _verifyKeep[action] = verifyKeepFunc ? verifyKeepFunc : function (p) { return true; };
    }



}(Foundry.undo, Foundry));
///#source 1 1 /Foundry/moment.min.js
//! moment.js
//! version : 2.5.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function(a){function b(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function c(a,b){return function(c){return k(a.call(this,c),b)}}function d(a,b){return function(c){return this.lang().ordinal(a.call(this,c),b)}}function e(){}function f(a){w(a),h(this,a)}function g(a){var b=q(a),c=b.year||0,d=b.month||0,e=b.week||0,f=b.day||0,g=b.hour||0,h=b.minute||0,i=b.second||0,j=b.millisecond||0;this._milliseconds=+j+1e3*i+6e4*h+36e5*g,this._days=+f+7*e,this._months=+d+12*c,this._data={},this._bubble()}function h(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return b.hasOwnProperty("toString")&&(a.toString=b.toString),b.hasOwnProperty("valueOf")&&(a.valueOf=b.valueOf),a}function i(a){var b,c={};for(b in a)a.hasOwnProperty(b)&&qb.hasOwnProperty(b)&&(c[b]=a[b]);return c}function j(a){return 0>a?Math.ceil(a):Math.floor(a)}function k(a,b,c){for(var d=""+Math.abs(a),e=a>=0;d.length<b;)d="0"+d;return(e?c?"+":"":"-")+d}function l(a,b,c,d){var e,f,g=b._milliseconds,h=b._days,i=b._months;g&&a._d.setTime(+a._d+g*c),(h||i)&&(e=a.minute(),f=a.hour()),h&&a.date(a.date()+h*c),i&&a.month(a.month()+i*c),g&&!d&&db.updateOffset(a),(h||i)&&(a.minute(e),a.hour(f))}function m(a){return"[object Array]"===Object.prototype.toString.call(a)}function n(a){return"[object Date]"===Object.prototype.toString.call(a)||a instanceof Date}function o(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&s(a[d])!==s(b[d]))&&g++;return g+f}function p(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=Tb[a]||Ub[b]||b}return a}function q(a){var b,c,d={};for(c in a)a.hasOwnProperty(c)&&(b=p(c),b&&(d[b]=a[c]));return d}function r(b){var c,d;if(0===b.indexOf("week"))c=7,d="day";else{if(0!==b.indexOf("month"))return;c=12,d="month"}db[b]=function(e,f){var g,h,i=db.fn._lang[b],j=[];if("number"==typeof e&&(f=e,e=a),h=function(a){var b=db().utc().set(d,a);return i.call(db.fn._lang,b,e||"")},null!=f)return h(f);for(g=0;c>g;g++)j.push(h(g));return j}}function s(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=b>=0?Math.floor(b):Math.ceil(b)),c}function t(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function u(a){return v(a)?366:365}function v(a){return a%4===0&&a%100!==0||a%400===0}function w(a){var b;a._a&&-2===a._pf.overflow&&(b=a._a[jb]<0||a._a[jb]>11?jb:a._a[kb]<1||a._a[kb]>t(a._a[ib],a._a[jb])?kb:a._a[lb]<0||a._a[lb]>23?lb:a._a[mb]<0||a._a[mb]>59?mb:a._a[nb]<0||a._a[nb]>59?nb:a._a[ob]<0||a._a[ob]>999?ob:-1,a._pf._overflowDayOfYear&&(ib>b||b>kb)&&(b=kb),a._pf.overflow=b)}function x(a){return null==a._isValid&&(a._isValid=!isNaN(a._d.getTime())&&a._pf.overflow<0&&!a._pf.empty&&!a._pf.invalidMonth&&!a._pf.nullInput&&!a._pf.invalidFormat&&!a._pf.userInvalidated,a._strict&&(a._isValid=a._isValid&&0===a._pf.charsLeftOver&&0===a._pf.unusedTokens.length)),a._isValid}function y(a){return a?a.toLowerCase().replace("_","-"):a}function z(a,b){return b._isUTC?db(a).zone(b._offset||0):db(a).local()}function A(a,b){return b.abbr=a,pb[a]||(pb[a]=new e),pb[a].set(b),pb[a]}function B(a){delete pb[a]}function C(a){var b,c,d,e,f=0,g=function(a){if(!pb[a]&&rb)try{require("./lang/"+a)}catch(b){}return pb[a]};if(!a)return db.fn._lang;if(!m(a)){if(c=g(a))return c;a=[a]}for(;f<a.length;){for(e=y(a[f]).split("-"),b=e.length,d=y(a[f+1]),d=d?d.split("-"):null;b>0;){if(c=g(e.slice(0,b).join("-")))return c;if(d&&d.length>=b&&o(e,d,!0)>=b-1)break;b--}f++}return db.fn._lang}function D(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function E(a){var b,c,d=a.match(vb);for(b=0,c=d.length;c>b;b++)d[b]=Yb[d[b]]?Yb[d[b]]:D(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function F(a,b){return a.isValid()?(b=G(b,a.lang()),Vb[b]||(Vb[b]=E(b)),Vb[b](a)):a.lang().invalidDate()}function G(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(wb.lastIndex=0;d>=0&&wb.test(a);)a=a.replace(wb,c),wb.lastIndex=0,d-=1;return a}function H(a,b){var c,d=b._strict;switch(a){case"DDDD":return Ib;case"YYYY":case"GGGG":case"gggg":return d?Jb:zb;case"Y":case"G":case"g":return Lb;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return d?Kb:Ab;case"S":if(d)return Gb;case"SS":if(d)return Hb;case"SSS":if(d)return Ib;case"DDD":return yb;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Cb;case"a":case"A":return C(b._l)._meridiemParse;case"X":return Fb;case"Z":case"ZZ":return Db;case"T":return Eb;case"SSSS":return Bb;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return d?Hb:xb;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return xb;default:return c=new RegExp(P(O(a.replace("\\","")),"i"))}}function I(a){a=a||"";var b=a.match(Db)||[],c=b[b.length-1]||[],d=(c+"").match(Qb)||["-",0,0],e=+(60*d[1])+s(d[2]);return"+"===d[0]?-e:e}function J(a,b,c){var d,e=c._a;switch(a){case"M":case"MM":null!=b&&(e[jb]=s(b)-1);break;case"MMM":case"MMMM":d=C(c._l).monthsParse(b),null!=d?e[jb]=d:c._pf.invalidMonth=b;break;case"D":case"DD":null!=b&&(e[kb]=s(b));break;case"DDD":case"DDDD":null!=b&&(c._dayOfYear=s(b));break;case"YY":e[ib]=s(b)+(s(b)>68?1900:2e3);break;case"YYYY":case"YYYYY":case"YYYYYY":e[ib]=s(b);break;case"a":case"A":c._isPm=C(c._l).isPM(b);break;case"H":case"HH":case"h":case"hh":e[lb]=s(b);break;case"m":case"mm":e[mb]=s(b);break;case"s":case"ss":e[nb]=s(b);break;case"S":case"SS":case"SSS":case"SSSS":e[ob]=s(1e3*("0."+b));break;case"X":c._d=new Date(1e3*parseFloat(b));break;case"Z":case"ZZ":c._useUTC=!0,c._tzm=I(b);break;case"w":case"ww":case"W":case"WW":case"d":case"dd":case"ddd":case"dddd":case"e":case"E":a=a.substr(0,1);case"gg":case"gggg":case"GG":case"GGGG":case"GGGGG":a=a.substr(0,2),b&&(c._w=c._w||{},c._w[a]=b)}}function K(a){var b,c,d,e,f,g,h,i,j,k,l=[];if(!a._d){for(d=M(a),a._w&&null==a._a[kb]&&null==a._a[jb]&&(f=function(b){var c=parseInt(b,10);return b?b.length<3?c>68?1900+c:2e3+c:c:null==a._a[ib]?db().weekYear():a._a[ib]},g=a._w,null!=g.GG||null!=g.W||null!=g.E?h=Z(f(g.GG),g.W||1,g.E,4,1):(i=C(a._l),j=null!=g.d?V(g.d,i):null!=g.e?parseInt(g.e,10)+i._week.dow:0,k=parseInt(g.w,10)||1,null!=g.d&&j<i._week.dow&&k++,h=Z(f(g.gg),k,j,i._week.doy,i._week.dow)),a._a[ib]=h.year,a._dayOfYear=h.dayOfYear),a._dayOfYear&&(e=null==a._a[ib]?d[ib]:a._a[ib],a._dayOfYear>u(e)&&(a._pf._overflowDayOfYear=!0),c=U(e,0,a._dayOfYear),a._a[jb]=c.getUTCMonth(),a._a[kb]=c.getUTCDate()),b=0;3>b&&null==a._a[b];++b)a._a[b]=l[b]=d[b];for(;7>b;b++)a._a[b]=l[b]=null==a._a[b]?2===b?1:0:a._a[b];l[lb]+=s((a._tzm||0)/60),l[mb]+=s((a._tzm||0)%60),a._d=(a._useUTC?U:T).apply(null,l)}}function L(a){var b;a._d||(b=q(a._i),a._a=[b.year,b.month,b.day,b.hour,b.minute,b.second,b.millisecond],K(a))}function M(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function N(a){a._a=[],a._pf.empty=!0;var b,c,d,e,f,g=C(a._l),h=""+a._i,i=h.length,j=0;for(d=G(a._f,g).match(vb)||[],b=0;b<d.length;b++)e=d[b],c=(h.match(H(e,a))||[])[0],c&&(f=h.substr(0,h.indexOf(c)),f.length>0&&a._pf.unusedInput.push(f),h=h.slice(h.indexOf(c)+c.length),j+=c.length),Yb[e]?(c?a._pf.empty=!1:a._pf.unusedTokens.push(e),J(e,c,a)):a._strict&&!c&&a._pf.unusedTokens.push(e);a._pf.charsLeftOver=i-j,h.length>0&&a._pf.unusedInput.push(h),a._isPm&&a._a[lb]<12&&(a._a[lb]+=12),a._isPm===!1&&12===a._a[lb]&&(a._a[lb]=0),K(a),w(a)}function O(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e})}function P(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function Q(a){var c,d,e,f,g;if(0===a._f.length)return a._pf.invalidFormat=!0,a._d=new Date(0/0),void 0;for(f=0;f<a._f.length;f++)g=0,c=h({},a),c._pf=b(),c._f=a._f[f],N(c),x(c)&&(g+=c._pf.charsLeftOver,g+=10*c._pf.unusedTokens.length,c._pf.score=g,(null==e||e>g)&&(e=g,d=c));h(a,d||c)}function R(a){var b,c,d=a._i,e=Mb.exec(d);if(e){for(a._pf.iso=!0,b=0,c=Ob.length;c>b;b++)if(Ob[b][1].exec(d)){a._f=Ob[b][0]+(e[6]||" ");break}for(b=0,c=Pb.length;c>b;b++)if(Pb[b][1].exec(d)){a._f+=Pb[b][0];break}d.match(Db)&&(a._f+="Z"),N(a)}else a._d=new Date(d)}function S(b){var c=b._i,d=sb.exec(c);c===a?b._d=new Date:d?b._d=new Date(+d[1]):"string"==typeof c?R(b):m(c)?(b._a=c.slice(0),K(b)):n(c)?b._d=new Date(+c):"object"==typeof c?L(b):b._d=new Date(c)}function T(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function U(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function V(a,b){if("string"==typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!=typeof a)return null}else a=parseInt(a,10);return a}function W(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function X(a,b,c){var d=hb(Math.abs(a)/1e3),e=hb(d/60),f=hb(e/60),g=hb(f/24),h=hb(g/365),i=45>d&&["s",d]||1===e&&["m"]||45>e&&["mm",e]||1===f&&["h"]||22>f&&["hh",f]||1===g&&["d"]||25>=g&&["dd",g]||45>=g&&["M"]||345>g&&["MM",hb(g/30)]||1===h&&["y"]||["yy",h];return i[2]=b,i[3]=a>0,i[4]=c,W.apply({},i)}function Y(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=db(a).add("d",f),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function Z(a,b,c,d,e){var f,g,h=U(a,0,1).getUTCDay();return c=null!=c?c:e,f=e-h+(h>d?7:0)-(e>h?7:0),g=7*(b-1)+(c-e)+f+1,{year:g>0?a:a-1,dayOfYear:g>0?g:u(a-1)+g}}function $(a){var b=a._i,c=a._f;return null===b?db.invalid({nullInput:!0}):("string"==typeof b&&(a._i=b=C().preparse(b)),db.isMoment(b)?(a=i(b),a._d=new Date(+b._d)):c?m(c)?Q(a):N(a):S(a),new f(a))}function _(a,b){db.fn[a]=db.fn[a+"s"]=function(a){var c=this._isUTC?"UTC":"";return null!=a?(this._d["set"+c+b](a),db.updateOffset(this),this):this._d["get"+c+b]()}}function ab(a){db.duration.fn[a]=function(){return this._data[a]}}function bb(a,b){db.duration.fn["as"+a]=function(){return+this/b}}function cb(a){var b=!1,c=db;"undefined"==typeof ender&&(a?(gb.moment=function(){return!b&&console&&console.warn&&(b=!0,console.warn("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.")),c.apply(null,arguments)},h(gb.moment,c)):gb.moment=db)}for(var db,eb,fb="2.5.1",gb=this,hb=Math.round,ib=0,jb=1,kb=2,lb=3,mb=4,nb=5,ob=6,pb={},qb={_isAMomentObject:null,_i:null,_f:null,_l:null,_strict:null,_isUTC:null,_offset:null,_pf:null,_lang:null},rb="undefined"!=typeof module&&module.exports&&"undefined"!=typeof require,sb=/^\/?Date\((\-?\d+)/i,tb=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,ub=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,vb=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,wb=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,xb=/\d\d?/,yb=/\d{1,3}/,zb=/\d{1,4}/,Ab=/[+\-]?\d{1,6}/,Bb=/\d+/,Cb=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Db=/Z|[\+\-]\d\d:?\d\d/gi,Eb=/T/i,Fb=/[\+\-]?\d+(\.\d{1,3})?/,Gb=/\d/,Hb=/\d\d/,Ib=/\d{3}/,Jb=/\d{4}/,Kb=/[+-]?\d{6}/,Lb=/[+-]?\d+/,Mb=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,Nb="YYYY-MM-DDTHH:mm:ssZ",Ob=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],Pb=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],Qb=/([\+\-]|\d\d)/gi,Rb="Date|Hours|Minutes|Seconds|Milliseconds".split("|"),Sb={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},Tb={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},Ub={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},Vb={},Wb="DDD w W M D d".split(" "),Xb="M D H h m s w W".split(" "),Yb={M:function(){return this.month()+1},MMM:function(a){return this.lang().monthsShort(this,a)},MMMM:function(a){return this.lang().months(this,a)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.lang().weekdaysMin(this,a)},ddd:function(a){return this.lang().weekdaysShort(this,a)},dddd:function(a){return this.lang().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return k(this.year()%100,2)},YYYY:function(){return k(this.year(),4)},YYYYY:function(){return k(this.year(),5)},YYYYYY:function(){var a=this.year(),b=a>=0?"+":"-";return b+k(Math.abs(a),6)},gg:function(){return k(this.weekYear()%100,2)},gggg:function(){return k(this.weekYear(),4)},ggggg:function(){return k(this.weekYear(),5)},GG:function(){return k(this.isoWeekYear()%100,2)},GGGG:function(){return k(this.isoWeekYear(),4)},GGGGG:function(){return k(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return s(this.milliseconds()/100)},SS:function(){return k(s(this.milliseconds()/10),2)},SSS:function(){return k(this.milliseconds(),3)},SSSS:function(){return k(this.milliseconds(),3)},Z:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+k(s(a/60),2)+":"+k(s(a)%60,2)},ZZ:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+k(s(a/60),2)+k(s(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},X:function(){return this.unix()},Q:function(){return this.quarter()}},Zb=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"];Wb.length;)eb=Wb.pop(),Yb[eb+"o"]=d(Yb[eb],eb);for(;Xb.length;)eb=Xb.pop(),Yb[eb+eb]=c(Yb[eb],2);for(Yb.DDDD=c(Yb.DDD,3),h(e.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a){var b,c,d;for(this._monthsParse||(this._monthsParse=[]),b=0;12>b;b++)if(this._monthsParse[b]||(c=db.utc([2e3,b]),d="^"+this.months(c,"")+"|^"+this.monthsShort(c,""),this._monthsParse[b]=new RegExp(d.replace(".",""),"i")),this._monthsParse[b].test(a))return b},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=db([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b){var c=this._calendar[a];return"function"==typeof c?c.apply(b):c},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",preparse:function(a){return a},postformat:function(a){return a},week:function(a){return Y(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),db=function(c,d,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._i=c,g._f=d,g._l=e,g._strict=f,g._isUTC=!1,g._pf=b(),$(g)},db.utc=function(c,d,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._useUTC=!0,g._isUTC=!0,g._l=e,g._i=c,g._f=d,g._strict=f,g._pf=b(),$(g).utc()},db.unix=function(a){return db(1e3*a)},db.duration=function(a,b){var c,d,e,f=a,h=null;return db.isDuration(a)?f={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(f={},b?f[b]=a:f.milliseconds=a):(h=tb.exec(a))?(c="-"===h[1]?-1:1,f={y:0,d:s(h[kb])*c,h:s(h[lb])*c,m:s(h[mb])*c,s:s(h[nb])*c,ms:s(h[ob])*c}):(h=ub.exec(a))&&(c="-"===h[1]?-1:1,e=function(a){var b=a&&parseFloat(a.replace(",","."));return(isNaN(b)?0:b)*c},f={y:e(h[2]),M:e(h[3]),d:e(h[4]),h:e(h[5]),m:e(h[6]),s:e(h[7]),w:e(h[8])}),d=new g(f),db.isDuration(a)&&a.hasOwnProperty("_lang")&&(d._lang=a._lang),d},db.version=fb,db.defaultFormat=Nb,db.updateOffset=function(){},db.lang=function(a,b){var c;return a?(b?A(y(a),b):null===b?(B(a),a="en"):pb[a]||C(a),c=db.duration.fn._lang=db.fn._lang=C(a),c._abbr):db.fn._lang._abbr},db.langData=function(a){return a&&a._lang&&a._lang._abbr&&(a=a._lang._abbr),C(a)},db.isMoment=function(a){return a instanceof f||null!=a&&a.hasOwnProperty("_isAMomentObject")},db.isDuration=function(a){return a instanceof g},eb=Zb.length-1;eb>=0;--eb)r(Zb[eb]);for(db.normalizeUnits=function(a){return p(a)},db.invalid=function(a){var b=db.utc(0/0);return null!=a?h(b._pf,a):b._pf.userInvalidated=!0,b},db.parseZone=function(a){return db(a).parseZone()},h(db.fn=f.prototype,{clone:function(){return db(this)},valueOf:function(){return+this._d+6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().lang("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=db(this).utc();return 0<a.year()&&a.year()<=9999?F(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):F(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]},isValid:function(){return x(this)},isDSTShifted:function(){return this._a?this.isValid()&&o(this._a,(this._isUTC?db.utc(this._a):db(this._a)).toArray())>0:!1},parsingFlags:function(){return h({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(){return this.zone(0)},local:function(){return this.zone(0),this._isUTC=!1,this},format:function(a){var b=F(this,a||db.defaultFormat);return this.lang().postformat(b)},add:function(a,b){var c;return c="string"==typeof a?db.duration(+b,a):db.duration(a,b),l(this,c,1),this},subtract:function(a,b){var c;return c="string"==typeof a?db.duration(+b,a):db.duration(a,b),l(this,c,-1),this},diff:function(a,b,c){var d,e,f=z(a,this),g=6e4*(this.zone()-f.zone());return b=p(b),"year"===b||"month"===b?(d=432e5*(this.daysInMonth()+f.daysInMonth()),e=12*(this.year()-f.year())+(this.month()-f.month()),e+=(this-db(this).startOf("month")-(f-db(f).startOf("month")))/d,e-=6e4*(this.zone()-db(this).startOf("month").zone()-(f.zone()-db(f).startOf("month").zone()))/d,"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:j(e)},from:function(a,b){return db.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!b)},fromNow:function(a){return this.from(db(),a)},calendar:function(){var a=z(db(),this).startOf("day"),b=this.diff(a,"days",!0),c=-6>b?"sameElse":-1>b?"lastWeek":0>b?"lastDay":1>b?"sameDay":2>b?"nextDay":7>b?"nextWeek":"sameElse";return this.format(this.lang().calendar(c,this))},isLeapYear:function(){return v(this.year())},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=V(a,this.lang()),this.add({d:a-b})):b},month:function(a){var b,c=this._isUTC?"UTC":"";return null!=a?"string"==typeof a&&(a=this.lang().monthsParse(a),"number"!=typeof a)?this:(b=this.date(),this.date(1),this._d["set"+c+"Month"](a),this.date(Math.min(b,this.daysInMonth())),db.updateOffset(this),this):this._d["get"+c+"Month"]()},startOf:function(a){switch(a=p(a)){case"year":this.month(0);case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1),this},endOf:function(a){return a=p(a),this.startOf(a).add("isoWeek"===a?"week":a,1).subtract("ms",1)},isAfter:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)>+db(a).startOf(b)},isBefore:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)<+db(a).startOf(b)},isSame:function(a,b){return b=b||"ms",+this.clone().startOf(b)===+z(a,this).startOf(b)},min:function(a){return a=db.apply(null,arguments),this>a?this:a},max:function(a){return a=db.apply(null,arguments),a>this?this:a},zone:function(a){var b=this._offset||0;return null==a?this._isUTC?b:this._d.getTimezoneOffset():("string"==typeof a&&(a=I(a)),Math.abs(a)<16&&(a=60*a),this._offset=a,this._isUTC=!0,b!==a&&l(this,db.duration(b-a,"m"),1,!0),this)},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.zone(this._tzm):"string"==typeof this._i&&this.zone(this._i),this},hasAlignedHourOffset:function(a){return a=a?db(a).zone():0,(this.zone()-a)%60===0},daysInMonth:function(){return t(this.year(),this.month())},dayOfYear:function(a){var b=hb((db(this).startOf("day")-db(this).startOf("year"))/864e5)+1;return null==a?b:this.add("d",a-b)},quarter:function(){return Math.ceil((this.month()+1)/3)},weekYear:function(a){var b=Y(this,this.lang()._week.dow,this.lang()._week.doy).year;return null==a?b:this.add("y",a-b)},isoWeekYear:function(a){var b=Y(this,1,4).year;return null==a?b:this.add("y",a-b)},week:function(a){var b=this.lang().week(this);return null==a?b:this.add("d",7*(a-b))},isoWeek:function(a){var b=Y(this,1,4).week;return null==a?b:this.add("d",7*(a-b))},weekday:function(a){var b=(this.day()+7-this.lang()._week.dow)%7;return null==a?b:this.add("d",a-b)},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},get:function(a){return a=p(a),this[a]()},set:function(a,b){return a=p(a),"function"==typeof this[a]&&this[a](b),this},lang:function(b){return b===a?this._lang:(this._lang=C(b),this)}}),eb=0;eb<Rb.length;eb++)_(Rb[eb].toLowerCase().replace(/s$/,""),Rb[eb]);_("year","FullYear"),db.fn.days=db.fn.day,db.fn.months=db.fn.month,db.fn.weeks=db.fn.week,db.fn.isoWeeks=db.fn.isoWeek,db.fn.toJSON=db.fn.toISOString,h(db.duration.fn=g.prototype,{_bubble:function(){var a,b,c,d,e=this._milliseconds,f=this._days,g=this._months,h=this._data;h.milliseconds=e%1e3,a=j(e/1e3),h.seconds=a%60,b=j(a/60),h.minutes=b%60,c=j(b/60),h.hours=c%24,f+=j(c/24),h.days=f%30,g+=j(f/30),h.months=g%12,d=j(g/12),h.years=d},weeks:function(){return j(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*s(this._months/12)},humanize:function(a){var b=+this,c=X(b,!a,this.lang());return a&&(c=this.lang().pastFuture(b,c)),this.lang().postformat(c)},add:function(a,b){var c=db.duration(a,b);return this._milliseconds+=c._milliseconds,this._days+=c._days,this._months+=c._months,this._bubble(),this},subtract:function(a,b){var c=db.duration(a,b);return this._milliseconds-=c._milliseconds,this._days-=c._days,this._months-=c._months,this._bubble(),this},get:function(a){return a=p(a),this[a.toLowerCase()+"s"]()},as:function(a){return a=p(a),this["as"+a.charAt(0).toUpperCase()+a.slice(1)+"s"]()},lang:db.fn.lang,toIsoString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),f=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||f?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(f?f+"S":""):"P0D"}});for(eb in Sb)Sb.hasOwnProperty(eb)&&(bb(eb,Sb[eb]),ab(eb.toLowerCase()));bb("Weeks",6048e5),db.duration.fn.asMonths=function(){return(+this-31536e6*this.years())/2592e6+12*this.years()},db.lang("en",{ordinal:function(a){var b=a%10,c=1===s(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),rb?(module.exports=db,cb(!0)):"function"==typeof define&&define.amd?define("moment",function(b,c,d){return d.config&&d.config()&&d.config().noGlobal!==!0&&cb(d.config().noGlobal===a),db}):cb()}).call(this);
///#source 1 1 /Foundry/Foundry.rules.filtering.js
/*
    Foundry.rules.binding.js part of the FoundryJS project
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
/// <reference path="Foundry.trace.js" />
/// <reference path="Foundry.js" />


var Foundry = Foundry || {};
Foundry.filtering = Foundry.filtering || {};

(function (ns,undefined) {

    function isArray (obj) {
        if (Array.isArray) return Array.isArray(obj);
        return (Object.prototype.toString.call(obj) === '[object Array]') ? true : false;
    }
    function isFunction(obj) {
        return typeof obj === 'function';
    }
    function isString(obj) {
        return typeof obj === 'string';
    }
    function isNumber(obj) {
        return typeof obj === 'number';
    }
    function isObject (obj) {
        return obj && typeof obj === 'object'; //prevents typeOf null === 'object'
    }

    //special functions to support string EXACT match comparisons
    if (!String.prototype.matches) {
        String.prototype.matches = function (str) {
            if (str) return this.toLocaleLowerCase() === str.toLocaleLowerCase();
            return str === this;
        };
    }
    //special functions to support string contains comparisons
    if (!String.prototype.contains) {
        String.prototype.contains = function (string) {
            return this.toLocaleLowerCase().indexOf(string.toLocaleLowerCase()) !== -1;
        };
    }

    if (!Number.prototype.matches) {
        Number.prototype.matches = function (num) {
            return this.valueOf() == new Number(num).valueOf();
        };
    }
    if (!Number.prototype.contains) {
        Number.prototype.contains = function (num) {
            return this.valueOf() == new Number(num).valueOf();
        };
    }

    if (!Boolean.prototype.matches) {
        Boolean.prototype.matches = function (num) {
            return this.valueOf() == new Boolean(num).valueOf();
        };
    }
    if (!Boolean.prototype.contains) {
        Boolean.prototype.contains = function (num) {
            return this.valueOf() == new Boolean(num).valueOf();
        };
    }


    if (!Array.prototype.matchAnyItem) {
        Array.prototype.matchAnyItem = function (list) {
            for (var i = 0; i < list.length; i++) {
                var target = list[i].trim();
                for (var j = 0; j < this.length; j++) {
                    var source = this[j].trim();
                    if (source.length > 0 && source.matches(target)) return true;
                }
            }
        };
    }

    if (!Array.prototype.anyMatch) {
        Array.prototype.anyMatch = function (string) {
            var list = string.split(',');
            var result = this.matchAnyItem(list);
            return result;
        };
    }

    if (!Array.prototype.containsAnyItem) {
        Array.prototype.containsAnyItem = function (list) {
            for (var i = 0; i < list.length; i++) {
                var target = list[i].trim();
                for (var j = 0; j < this.length; j++) {
                    var source = this[j].trim();
                    if (source.length > 0 && source.contains(target)) return true;
                }
            }
        };
    }


    if (!Array.prototype.containsMatch) {
        Array.prototype.containsMatch = function (string) {
            var list = string.split(',');
            var result = this.containsAnyItem(list);
            return result;
        };
    }

    if (!Array.prototype.trimString) {
        Array.prototype.trimString = function () {
            var list = String.split(',');
            var result = this.matchAnyItem(list);
            return result;
        };
    }

    if (!Array.prototype.groupBy) {
        Array.prototype.groupBy = function (groupClause, hash) {
            var result = hash ? hash : {};
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var key = groupClause(item);
                result[key] ? result[key].push(item) : result[key] = [item];
            }
            return result;
        };
    }

    function trim(varString) {
        return varString.replace(/^\s+|\s+$/g, '');
    }

    function splitOnComma(obj) {
        return obj !== null ? String(obj).split(',') : [];
    }

    function pluck(propertyName) {
        return function (obj) {
            return obj[propertyName];
        };
    }



    var customProperty = {};
    ns.registerProperty = function (name, func) {
        customProperty[name] = func;
    };

    function getValue(name, obj) {
        var val = obj[name];
        if (val === undefined) {
            var func = customProperty[name];
            return func ? func(obj) : undefined;
        }
        return val;
    }

    function multiFieldGroup(list, listFn) {
        if (!listFn) return list;

        var result;
        var first = listFn[0];
        var rest = listFn.length > 1 ? listFn.slice(1, listFn.length) : null;

        if (Array.isArray(list)) {
            result = list.groupBy(first);
        } //assume this is an object 
        else {
            result = list;
            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    var data = result[key];
                    if (Array.isArray(data)) {
                        result[key] = multiFieldGroup(data, listFn);
                    }                   
                }
            }
            return result;
        }
        return rest ? multiFieldGroup(result, rest) : result;
    }

    var customGroups = {};
    ns.registerGroup = function (name, func) {
        customGroups[name] = func;
    };


    var customSorts = {};
    ns.registerSort = function (name, func) {
        customSorts[name] = func;
    };

    function singleFieldSort(c, d) {
        var dir = (d === undefined) ? 1 : d;
        var sortFn = customSorts[c] ? customSorts[c] : function (obj) { return obj[c]; };

        if (c === undefined || c === null) {
            return function (a, b) {
                return 0;
            };
        }
        else {
            return function (a, b) {
                var objA = sortFn(a);
                var objB = sortFn(b);

                if (typeof objA === "number" && typeof objB === "number")
                    return dir * (objA - objB);

                //check for time math the toDate function is on moment objects
                if (moment && moment.isMoment(objA) && moment.isMoment(objB))
                    return dir * objA.diff(objB);

                var left = objA || '';
                var right = objB || '';

                var val = dir * (left < right ? -1 : (left > right ? 1 : 0));
                return val;
            };
        }
    }

    function multiFieldSort(c, d) {
        if (c === null || c.length === 0) {
            return undefined;
        }
        else if (!Array.isArray(c)) {
            return singleFieldSort(c, d);
        }
        else {
            var first = c[0];
            var rest = c.length > 1 ? c.slice(1, c.length) : null;
            return function (a, b) {
                var dir = first.dir || d;
                var field = first.field || first;
                var result = singleFieldSort(field, dir)(a, b);
                if (result === 0 && rest !== null) {
                    return multiFieldSort(rest, d)(a, b);
                }
                return result;
            };
        }
    }


    function lessThanFilter(c, d) {
        return function (o, i, a) {
            var val = getValue(c,o);
            if (val === undefined) return false;
            return val < d;
        };
    }

    function lessThanFilterAndPositive(c, d) {
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            return val < d && val >= 0;
        };
    }


    function greaterThanFilter(c, d) {
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            return val > d;
        };
    }

    function inRangeFilter(c, d, e) {
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            return d <= val && val <= e;
        };
    }


    function equalsFilter(c, string) {
        var list = splitOnComma(string).map(trim);
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            var valArray = Array.isArray(val) ? val : splitOnComma(val);
            return valArray.matchAnyItem(list);
        };
    }

    //used for a port filter
    //function eitherOrFilter(c, d, string) {
    //    var list = splitOnComma(string).map(trim);
    //    return function (o, i, a) {
    //        var val1 = getValue(c, o);
    //        if (val1 === undefined) return false;
    //        var valArray1 = Array.isArray(val1) ? val1 : splitOnComma(val1);

    //        var val2 = getValue(d, o);
    //        if (val2 === undefined) return false;
    //        var valArray2 = Array.isArray(val2) ? val2 : splitOnComma(val2);

    //        return valArray1.matchAnyItem(list) || valArray2.matchAnyItem(list);
    //    };
    //}

    function eitherOrFilter(c, d, string) {
        return ifAnyContainFilter([c, d], string);
    }

    function ifAnyMatchFilter(fieldNames, string) {
        var fields = Array.isArray(fieldNames) ? fieldNames : splitOnComma(fieldNames).map(trim);
        var list = splitOnComma(string).map(trim);
        return function (o, i, a) {
            var total = fields.filter(function (field) {
                var val = getValue(field, o);
                if (val === undefined) return false;
                var valArray = Array.isArray(val) ? val : splitOnComma(val);
                var result = valArray.matchAnyItem(list);
                return result;
            });
            return total.length > 0;
        };
    }

    function ifAnyContainFilter(fieldNames, string) {
        var fields = Array.isArray(fieldNames) ? fieldNames : splitOnComma(fieldNames).map(trim);
        var list = splitOnComma(string).map(trim);
        return function (o, i, a) {
            var total = fields.filter(function (field) {
                var val = getValue(field, o);
                if (val === undefined) return false;
                var valArray = Array.isArray(val) ? val : splitOnComma(val);
                var result = valArray.containsAnyItem(list);
                return result;
            });
            return total.length > 0;
        };
    }


    function andFilter(x, y) {
        if (!x) return function (o, i, a) { return y(o, i, a); };
        if (!y) return function (o, i, a) { return x(o, i, a); };
        return function (o, i, a) {
            return x(o, i, a) && y(o, i, a);
        };
    }

    function orFilter(x, y) {
        if (!x) return function (o, i, a) { return y(o, i, a); };
        if (!y) return function (o, i, a) { return x(o, i, a); };
        return function (o, i, a) {
            return x(o, i, a) || y(o, i, a);
        };
    }

    function multiSelectFilter(c, string) {
        var list = splitOnComma(string).map(trim);
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            var valArray = Array.isArray(val) ? val : splitOnComma(val);
            return valArray.matchAnyItem(list);
        };
    }

    function matchesFilter(c, string) {
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            return val.matches(string);
        };
    }


    //var customForEach = {};
    //ns.registerForEach = function (name, path) {
    //    var pattern = path.split(':');
    //    customForEach[name] = {
    //        property: pattern[0],
    //        field: pattern[1],
    //    };
    //};

    //function isForEachValue(name) {
    //    return customForEach[name];
    //}

    //function getForEachArray(name, obj) {
    //    var pattern = customForEach[name];

    //    var array = obj[pattern.property].map(function (item) {
    //        return item[pattern.field]
    //    });
        
    //    return array;
    //}

    function containsFilter(c, string) {
        //first check to see if this is a customForEach
        //if (isForEachValue(c)) {
        //    return function (o, i, a) {
        //        //at this point getForEachArray(c, o);
        //        var val = getForEachArray(c, o);
        //        if (val === undefined) return false;
        //        var result = val.contains(string);
        //        return result;
        //    };
        //}

        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            var result = val.contains(string);
            return result;
        };
    }

    function typeInFilter(c, string) {
        var list = splitOnComma(string).map(trim);
        if (list.length > 1) {
            return multiSelectFilter(c, string);
        }
        return containsFilter(c, string);
    }

    function applyAndFilter(list) {
        if (list === undefined || !Array.isArray(list) || list.length === 0) {
            return undefined;
        }

        var result = list[0];
        for (var i = 1; i < list.length; i++) {
            var oItem = list[i];
            result = andFilter(result, oItem);
        }
        return result;
    }

    //New notFilter function just negates the result of any function (no relation or dependency on filters, so this might be better as a general-purpose utility function like debounce?)
    function notFilter(func) {
        return function () {
            return !func.apply(this, arguments);
        };
    }


    var customFilters = {};
    ns.registerFilter = function (name, func) {
        customFilters[name] = func;
    };

    function createFilterFunction(specArray) {
        if (specArray === undefined || specArray.length === 0)
            return undefined;

        return applyAndFilter(specArray.map(function (x) {
            if (!x) return;

            var propertyName = x.name;
            var filterValue = x.value;
            var isRangeFilter = filterValue.indexOf(":") > -1;
            var isNotFilter = x.negate;
            var key = x.bracketStart;

            // Determine filter function
            var filterFunction;
            if (customFilters[propertyName]) {
                filterFunction = customFilters[propertyName](filterValue);

            } else if (key === "[" && isRangeFilter) {
                var range = filterValue.split(':');
                var low = range[0] === "" || range[0] === "*" ? -1000000 : parseInt(range[0]);
                var high = range[1] === "" || range[1] === "*" ? 1000000 : parseInt(range[1]);
                if (low > high) {
                    var temp = high;
                    high = low;
                    low = temp;
                }
                filterFunction = inRangeFilter(propertyName, low, high);

            } else if (key === "[" && !isRangeFilter) {
                filterFunction = multiSelectFilter(propertyName, filterValue);

            } else if (key === "(" && !isRangeFilter) {
                filterFunction = typeInFilter(propertyName, filterValue);
            }

            // Apply negation
            if (isNotFilter) {
                filterFunction = notFilter(filterFunction);
            }

            return filterFunction;
        }));
    }



    function createSortFunction (specArray) {
        if (specArray === undefined || specArray.length === 0)
            return undefined;

        var sorts = multiFieldSort(specArray.map(function (x) {
            //the filter types are based on how the value is wraped
            var sortValue = x.value;
            var sValue = sortValue.substring(1, sortValue.length - 1);
            return {
                field: x.name,
                dir: sValue.contains("A") || sValue.contains("a") ? 1 : -1
            };
        }));
        return sorts;
    }

    ns.makeFilter = function (spec) {
        if (!spec) return undefined;
        var list = spec.split(';').filter(function (n) { return n; }); //removes null elements

        var specArray = list.map(function (item) {
            var parts = item.trim().match(/^(.+?)(\!?)([\[(])(.*)([\])])$/);
            if (parts) {
                return {
                    name: parts[1].trim(),
                    negate: parts[2] ? true : false,
                    bracketStart: parts[3],
                    value: parts[4].trim(),
                    bracketEnd: parts[5]
                };
            }
            return '';
        });


        return createFilterFunction(specArray);
    };

    ns.makeSort = function (spec) {
        if (!spec) return undefined;
        var list = spec.split(';').filter(function (n) { return n; }); //removes null elements

        var specArray = list.map(function (item) {
            var pr = item.split('(');
            if (pr.length === 2) {
                return { name: pr[0].trim(), value: '(' + pr[1].trim() };
            }
            return '';
        });

        return createSortFunction(specArray);
    };

    ns.applyFilter = function (list, filterSpec) {
        var filterFn = ns.makeFilter(filterSpec);
        var filteredList = filterSpec ? list.filter(filterFn) : list;
        return filteredList;
    };

    ns.applySort = function (list, sortSpec) {
        var sortFn = ns.makeSort(sortSpec);
        var sortedList = sortSpec ? list.sort(sortFn) : list;
        return sortedList;
    };

    ns.applyFilterAndSort = function (list, filterSpec, sortSpec) {
        var filteredList = ns.applyFilter(list,filterSpec)
        var sortedList =  ns.applySort(filteredList,sortSpec)
        return sortedList;
    };





    ns.makeGrouper = function (spec) {
        if (!spec) return undefined;
        var list = spec.split(';').filter(function (n) { return n; }); //removes null elements

        var groupings = list.map(function (item) {
            if (customGroups[item]) return customGroups[item];
            return pluck(item);
        });

        return groupings;
    };

    ns.applyGrouping = function (list, groupSpec) {
        var itemList = fo.utils.isaCollection(list) ? list.elements : list;
        var groupFn = ns.makeGrouper(groupSpec);
        var group = groupSpec ? multiFieldGroup(itemList, groupFn) : undefined;
        return group;
    };

    ns.applyMapping = function (list, groupSpec) {
        var itemList = fo.utils.isaCollection(list) ? list.elements : list;
        var group = ns.applyGrouping(itemList, groupSpec);
        var map = {};
        for (var key in group) {
            map[key] = group[key][0];
        }
        return map;
    };

    ns.identifyUniqueKeyFields = function (list) {
        if (!fo.utils.isArray(list) || !list[0]) return;
        var map = {};
        var keys = Object.keys(list[0]);
        var total = list.length;
        keys.forEach(function (item) {
            var group = ns.applyGrouping(list, item);
            var count = Object.keys(group).length;
            if (total == count) {
                map[item] = group;
            }
        })

        return map;
    };

    ns.applyFilterSortAndGrouping = function (list, filterSpec, sortSpec, groupSpec) {
        var filtersort = ns.applyFilterAndSort(list, filterSpec, sortSpec);
        var group = ns.applyGrouping(filtersort, groupSpec);
        return group;
    };


    ns.multiSelect = multiSelectFilter;
    ns.typeIn = typeInFilter;
    ns.eitherOr = eitherOrFilter;
    ns.ifAnyContains = ifAnyContainFilter;
    ns.ifAnyMatches = ifAnyMatchFilter;
    ns.inRange = inRangeFilter;
    ns.createFilterFunction = createFilterFunction;
    ns.createSortFunction = createSortFunction;


    return ns;
}(Foundry.filtering));

///#source 1 1 /Foundry/Foundry.convert.csv.js
// Source: http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
//http://jsfiddle.net/sturtevant/AZFvQ/

var Foundry = Foundry || {};
Foundry.convert = Foundry.convert || {};

(function (ns,undefined) {

    function CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"), "\"");
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }

    function CSV2JSON(csv) {
        var array = CSVToArray(csv);
        var objArray = [];
        for (var i = 1; i < array.length; i++) {
            objArray[i - 1] = {};
            for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                var key = array[0][k];
                objArray[i - 1][key] = array[i][k]
            }
        }

        var json = JSON.stringify(objArray);
        var str = json.replace(/},/g, "},\r\n");

        return str;
    }

    function JSON2CSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

        var str = '';
        var line = '';

        if ($("#labels").is(':checked')) {
            var head = array[0];
            if ($("#quote").is(':checked')) {
                for (var index in array[0]) {
                    var value = index + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
            } else {
                for (var index in array[0]) {
                    line += index + ',';
                }
            }

            line = line.slice(0, -1);
            str += line + '\r\n';
        }

        for (var i = 0; i < array.length; i++) {
            var line = '';

            if ($("#quote").is(':checked')) {
                for (var index in array[i]) {
                    var value = array[i][index] + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
            } else {
                for (var index in array[i]) {
                    line += array[i][index] + ',';
                }
            }

            line = line.slice(0, -1);
            str += line + '\r\n';
        }
        return str;

    }

    ns.csvToJson = CSV2JSON;
    ns.jsonToCsv = JSON2CSV;

}(Foundry.convert));

//$("#convert").click(function () {
//    var json = $.parseJSON($("#json").val());
//    var csv = JSON2CSV(json);
//    $("#csv").val(csv);
//});

//$("#download").click(function () {
//    var json = $.parseJSON($("#json").val());
//    var csv = JSON2CSV(json);
//    window.open("data:text/csv;charset=utf-8," + escape(csv))
//});
//$("#convert").click(function () {
//    var csv = $("#csv").val();
//    var json = CSV2JSON(csv);
//    $("#json").val(json);
//});

//$("#download").click(function () {
//    var csv = $("#csv").val();
//    var json = CSV2JSON(csv);
//    window.open("data:text/json;charset=utf-8," + escape(json))
//});

///#source 1 1 /Foundry/Foundry.canvas.js
/*
    Foundry.undo.js part of the FoundryJS project
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
Foundry.cv = Foundry.canvas;

//stubs to it runs if CreateJs is not present
if (createjs) {
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

    //extensions to text object to format text to fit max width;
    if ( createjs.Text && createjs.Text.prototype)     {

            var canonicalizeNewlines = function (str) {
                return str.replace(/(\r\n|\r|\n)/g, '\n');
            };

            createjs.Text.prototype.splitLine = function (st, n) {
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

            createjs.Text.prototype.flowText = function (text, n, maxLines) {
                if (!text) return;
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

} else {
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
}



//FoundryShape
(function(ns, fo, create, undefined) {


    var tween = create.Tween;
    var utils = fo.utils;

    ns.updateShapeForLayout = function (shape) { };


    var FoundryShape = function (properties, subcomponents, parent) {
        var shapeSpec = {
            isVisible: true,
            context: function () { //should be overriden by properties.. if not try to find in model
                if (!this.contextType) return;
                    var model = fo.newInstance(this.contextType);
                    return model;
                },
                geom: function () {
                    return create.createShape();
                },
                update: function () {
                    if (!this.geom) return false;
                    this.geom.graphics.clear();
                    return false;
                }
         }

        this.base = fo.Component;
        this.base(utils.union(shapeSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'FoundryShape';

        return this;
    };

    FoundryShape.prototype = (function () {
        var anonymous = function () { this.constructor = FoundryShape; };
        anonymous.prototype = fo.Component.prototype;
        return new anonymous();
    }) ();

    ns.FoundryShape = FoundryShape;
    utils.isaFoundryShape = function (obj) {
        return obj instanceof FoundryShape ? true: false;
    };

    FoundryShape.prototype.render = function (stage, context) {
        var property = this.getProperty('geom');
        if (property &&  this.update) {
            var geom = property.getValue();
            stage && stage.addChild && stage.addChild(geom);

            this.Subcomponents.forEach(function (subshape) {
                subshape.render(geom || stage, context);
            });
        }
    };

    FoundryShape.prototype.updateStage = function () {
        if (this.myParent) {
            this.render(this.myParent.geom);
        }
        return this;
    }

    FoundryShape.prototype.isPage = function () {
        return this == this.rootPage();
    };

    FoundryShape.prototype.outlineRef = function () {
        return "";
    };


    FoundryShape.prototype.isInGroup = function () {
        return this.myParent !== this.rootPage();
    };

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

    FoundryShape.prototype.subcomponentHitTest = function (gX, gY, skipSelected) {
        var elements = this.Subcomponents.elements
        //for(var i=0; i<elements.length; i++ ){

        var start = elements.length -1;
        for (var i = start; i >= 0; i--) {
            var subShape = elements[i];
            if (skipSelected && subShape.isSelected) continue;

            var found = subShape.isShapeHit(gX, gY, subShape.width, subShape.height, skipSelected);
            if (found) return found;
        }
    };


    FoundryShape.prototype.glueRemoveFromModel = function () {
        if(!this.Connections) return;

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
        if(this.Connections) {
            this.Connections.map(function (item) {
                var shape = item.target;
                shape.glueShapeMoved(target, x, y, w, h);
            });
            }

        if (!deep) return;

        this.Subcomponents.map(function (shape) {
            shape.glueShapeMoved(shape, x, y +h, shape.width, shape.height, deep);
            });

        }

    }(Foundry.canvas, Foundry, Foundry.createjs));

//Shape
(function (ns, fo, create, undefined) {
    var tween = create.Tween;
    var utils = fo.utils;

    var Shape = function (properties, subcomponents, parent) {

        var shapeSpec = {
            pinX: 0.0,
            pinY: 0.0,
            angle: 0.0,
            isSelected: false,
            isEditing: false,
            isActiveTarget: false,
            canGroupItems: function () { return true; },
            canBeGrouped: function () { return true; },
            showSubcomponents: true,
            showDetails: true,
        }

        this.base = ns.FoundryShape;
        this.base(utils.union(shapeSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'Shape';



        return this;
    };

    Shape.prototype = (function () {
        var anonymous = function () { this.constructor = Shape; };
        anonymous.prototype = ns.FoundryShape.prototype;
        return new anonymous();
    })();

    ns.Shape = Shape;
    utils.isaShape = function (obj) {
        return obj instanceof Shape ? true : false;
    };

    ns.makeShape = function (properties, subcomponents, parent) {
        var shape = new Shape(properties, subcomponents, parent);
        return shape;
    };

    Shape.prototype.setVisualState = function (state) {
    }

    Shape.prototype.angleInRads = function () {
        return (Math.PI / 180) * this.angle;
    }


    Shape.prototype.rootPage = function () {
        if (!this.myParent) {
            return;
        }
        return this.myParent.rootPage && this.myParent.rootPage();
    };

    Shape.prototype.outlineRef = function () {
        var depth = this.componentDepth();
        if (depth == 0 || !this.myParent) return '';
        var index = (this.myIndex() + 1).toString();
        if (this.myParent.componentDepth() == 0) return index;
        var root = this.myParent.outlineRef();

        var result = root ?  root + "." + index : index;
        return result;
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
        if (this.isInGroup() == false) {
            this.pinX = this.defaultPinX();
            this.pinY = this.defaultPinY();
        }
    }

    Shape.prototype.hasGroupMembers = function () {
        return this.Subcomponents.isNotEmpty();
    };

    Shape.prototype.hasDetails = function () {
        return this.context && this.context.isTextDifferent;
    };

    Shape.prototype.currentToggleSubcomponentsState = function () {
        if ( !this.hasGroupMembers()) return 'none';
        return this.showSubcomponents ? 'minus' : 'plus';
    };

    Shape.prototype.toggleShowSubcomponents = function () {
        this.showSubcomponents = !this.showSubcomponents;
        return this.showSubcomponents;
    };

    Shape.prototype.currentToggleDetailsState = function () {
        if (!this.hasDetails()) return 'none';
        return this.showDetails ? 'close' : 'open';
    };

    Shape.prototype.toggleShowDetails = function () {
        this.showDetails = !this.showDetails;
        return this.showDetails;
    };

    //500, createjs.Ease.sineInOut);
    Shape.prototype.MorphGeomTo = function (rule, time, ease, onComplete) {
        var geom = this.geom;
        return this.MorphTo(geom, rule, time, ease, onComplete);
    };

    //500, createjs.Ease.sineInOut);
    Shape.prototype.MorphTo = function (geom, rule, time, ease, onComplete) {
        var page = this.rootPage();
        page ? page.MorphTo(geom, rule, time, ease, onComplete) : onComplete && onComplete();
    }

    Shape.prototype.repositionTo = function (pinX, pinY, angle, onComplete) {
        var self = this;
        //this.canTrace() && ns.trace.writeLog("repositioning", self.name, pinX, pinY, angle);
        this.MorphGeomTo({ x: pinX, y: pinY }, 500, create.Ease.sineInOut, function () {
            self.pinX = pinX;
            self.pinY = pinY;
            self.angle = angle ? angle : 0.0;
            self.glueShapeMoved(self, pinX, pinY, self.width, self.height, true);

            if (onComplete) onComplete();
            //ns.trace.writeLog("reposition Complete", self.name, self.pinX, self.pinY, self.angle);
        });
    }



}(Foundry.canvas, Foundry, Foundry.createjs));

(function (ns, cv, undefined) {
    if (!ns.establishType) return;

    ns.establishType('Shape', {}, cv.makeShape);

}(Foundry, Foundry.canvas));


///#source 1 1 /Foundry/Foundry.canvas.structure.js
/*
    Foundry.undo.js part of the FoundryJS project
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

//Structure management for shapes...
(function (ns, fo, undefined) {

    var utils = fo.utils;
    //now define the page...

    fo.digestLockCount = 0;
    fo.globalDigestLock = function (cnt) {
        fo.digestLockCount = fo.digestLockCount + cnt;
        if (fo.digestLockCount == 0) {
            return fo.digestLockCount;
        }
        return fo.digestLockCount;
    };

    var digestMap = {}


    var prototype = ns.FoundryShape.prototype;

    prototype.doRepaint = function () {
        var prop = this._update;
         prop.smash();
         this.updateStage();
    }

    prototype.doUpdate = function (callback) {
        var prop = this._update;
        var id = prop.getID();
        fo.digestLock(undefined, function () {
            prop.smash();
            digestMap[id] = prop;
            callback && callback();
        });

        if (fo.digestLockCount == 0) {
            this.updateStage();
            fo.publish('refreshPanZoom', []);
        }
    }

    prototype.capture = function (shape, name, join) {
        var oldParent = this.captureSubcomponent(shape, name, join);

        //var note = shape.getID() + ' is now child of ' + this.getID();
        //fo.trace.warn(this.gcsIndent(note));

        if (fo.digestLockCount == 0) {
            shape.updateStage();
            fo.publish('refreshPanZoom', []);
        }
        return oldParent;
    }

    prototype.tracePropertyLifecycle = function (name,search) {
        var prop = this.getProperty(name, search);
        var self = this;

        //prop.onValueDetermined = function (value, formula, owner) {
        //    var note = self.gcsIndent(prop.asLocalReference() + ' onValueDetermined:' + owner.myName + '  value=' + value)
        //    fo.trace.info(note);
        //}

        //prop.onValueSmash = function (value, formula, owner) {
        //    var note = self.gcsIndent(prop.asLocalReference() + ' onValueSmash:' + owner.myName)
        //    fo.trace.error(note);
        //}
        //prop.onValueSet = function (value, formula, owner) {
        //    var note = self.gcsIndent(prop.asLocalReference() + ' onValueSet:' + owner.myName + '  value=' + value)
        //    fo.trace.warn(note);
        //}
    }

    prototype.fxMod = function (extra) {
        if (!this.myParent || utils.isaDrawing(this.myParent)) return;
        if (utils.isa2DCanvas(this.myParent)) {
            this.smashProperties(["height","width","update"]);
        }
        else {
            this.smashProperties(["height", "width", "pinX", "pinY", "update"]);
        }
        extra && this.smashProperties(extra);
    }

    prototype.markForUpdate = function () {
        var prop = this._update;
        var id = prop.getID();

        if (!digestMap[id]) {
            digestMap[id] = prop;
            //fo.trace.info(this.gcsIndent(prop.asLocalReference()) + " is marked for digest update");
        }

        this.fxMod();
    }

    prototype.forceLayout = function () {
        var scope = this;
        if (scope && scope.applyToSelfAndChildren) {
            scope.applyToSelfAndChildren(function () {
                if ( !this.fxMod ) {
                    return;
                }
                
               this.fxMod();
            }, true);
            scope.applyToSelfAndChildren(ns.updateShapeForLayout, true);
        }
        scope.render();
    }






    //you cannot assume a geom property exist on this object or the child
    prototype.unParentGeom = function (oldChild) {
        var oldParent = this;

        var parentGeom = oldParent.getProperty('geom');
        if (parentGeom && parentGeom.isValueKnown()) {

            var childGeom = oldChild.getProperty('geom');
            if (childGeom && childGeom.isValueKnown()) {
                parentGeom.getValue().removeChild(childGeom.getValue());
                return true;
            }
        }
    }

    prototype.reParentGeom = function (oldChild) {
        var oldParent = this;

        var parentGeom = oldParent.getProperty('geom');
        if (parentGeom && parentGeom.isValueKnown()) {

            var childGeom = oldChild.getProperty('geom');
            if (childGeom && childGeom.isValueKnown()) {
                parentGeom.getValue().addChild(childGeom.getValue());
                return true;
            }
        }
    }

    prototype.captureSubcomponent = function (subShape, name, join) {
        var newParent = this;
        var oldParent = subShape.myParent;

        if (name) subShape.myName = name;

        if (newParent.canCaptureSubcomponent(subShape)) {
            fo.digestLock(newParent,function () {

                if (oldParent && utils.isa2DCanvas(oldParent)) {
                    oldParent.removeSubcomponent(subShape);
                    oldParent.unParentGeom(subShape);

                    if (join) delete oldParent[name];

                    //only smash if shape is not new
                    subShape.fxMod();
                }
                else if (oldParent) {
                    //var oldname = oldParent.myName;
                    oldParent.removeSubcomponent(subShape);
                    oldParent.unParentGeom(subShape);

                    if (join) delete oldParent[name];

                    //oldParent.applyToSelfAndParents(ns.updateShapeForLayout);
                    oldParent.markForUpdate();

                    //only smash if shape is not new
                    subShape.fxMod();
                }

                //var myname = subShape.myName;
                //ns.updateShapeForLayout(subShape);

                if (newParent && utils.isa2DCanvas(newParent)) {
                    newParent.addSubcomponent(subShape);
                    newParent.reParentGeom(subShape);

                    if (join) newParent[name] = component;

                }
                else if (newParent) {
                    //var newname = newParent.myName;
                    newParent.addSubcomponent(subShape);
                    newParent.reParentGeom(subShape);

                    if (join) newParent[name] = component;

                    subShape.fxMod();
                    //newParent.applyToSelfAndChildren(ns.updateShapeForLayout);
                    newParent.markForUpdate();
                }

                subShape.markForUpdate();
            });
            return oldParent;
        }
    }

    prototype.captureInsertSubcomponent = function (index, subShape, name) {
        var newParent = this;
        var oldParent = subShape.myParent;

        if (name) subShape.myName = name;

        if (newParent.canCaptureSubcomponent(subShape)) {
            fo.digestLock(newParent,function () {

                if (oldParent && utils.isa2DCanvas(oldParent)) {
                    oldParent.removeSubcomponent(subShape);
                    oldParent.unParentGeom(subShape);

                    //only smash if shape is not new
                    subShape.fxMod();
                }
                else if (oldParent) {
                    //var oldname = oldParent.myName;
                    oldParent.removeSubcomponent(subShape);
                    oldParent.unParentGeom(subShape);

                    //oldParent.applyToSelfAndParents(ns.updateShapeForLayout);
                    oldParent.markForUpdate();

                    //only smash if shape is not new
                    subShape.fxMod();
                }

                   
                
                if (newParent && utils.isa2DCanvas(newParent)) {
                        newParent.insertSubcomponent(index, subShape);
                        newParent.reParentGeom(subShape);

                    }
                    else if (newParent) {
                        //var newname = newParent.myName;
                        newParent.insertSubcomponent(index, subShape);
                        newParent.reParentGeom(subShape);

                        subShape.fxMod();
                        //newParent.applyToSelfAndChildren(ns.updateShapeForLayout);
                        newParent.markForUpdate();
                    }

            });
            return oldParent;
        }
    }




    fo.globalDigestRefresh = function (scope, onChange) {
        var lock = fo.globalDigestLock(0);
        if (lock) return;

        var members = utils.getOwnPropertyValues(digestMap)

        if (members.length > 0) {  //0 is so we make sure complete fires..
            digestMap = {};

            members.forEach(function (prop) {
                if (!prop.isValueKnown()) {
                   var owner = prop.owner;
                   // fo.trace.log(owner.gcsIndent(prop.asLocalReference()) + " must be refreshed");

                    var result = prop.getValue();
                    //fo.trace.log(owner.gcsIndent(prop.asLocalReference()) + " is now refreshed " + result);
                }
            });
            onChange && onChange();
        }
    }






    //make sure things are run in content?
    fo.digestLock = function (scope, callback, onComplete) {
        var start = fo.globalDigestLock(1);
        var result = callback();
        var end = fo.globalDigestLock(-1);
        if (end == 0) {
            if (scope && scope.forceLayout) {
                scope.forceLayout();
            }
            fo.globalDigestRefresh(scope); //true or false on complete should run
            if (onComplete) {
                onComplete();
            }
        }
        return result;
    };


    function syncVisible (field, list, map) {
        var mapCopy = utils.union(map);
        var currentMap = fo.filtering.applyMapping(list, field);
        for (var key in mapCopy) {
            if (!currentMap[key]) {
                var item = mapCopy[key];
                item.isVisible = false;
            }
        }
        return currentMap;
    }




}(Foundry.canvas, Foundry));



///#source 1 1 /Foundry/Foundry.canvas.shape2D.js
/*
    Foundry.undo.js part of the FoundryJS project
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

//Shape2D
(function (ns, fo, create, undefined) {
    var tween = create.Tween;
    var utils = fo.utils;

    ns.colorsFill = ['#FFFFFF', '#FFFF99', '#FFFF33', '#FFCC66', '#FFCC00', '#CC9900', '#996600', '#663300'];
    ns.standardNoteOffset = 10;
    ns.standardNoteSize = 150;
    ns.minNoteSize = 50;

    ns.updateShapeForLayout = function (shape) {

        //fo.trace.log(shape.gcsIndent(" updateShapeForLayout start " + shape.myName));

        shape.shapeDepth = shape.componentDepth();
        shape.groupDepth = shape.branchDepth();
        shape.inGroup = shape.isInGroup();

        function segmentHeight(item) {
            var depth = item.groupDepth; //
            if (depth > 0 || item.inGroup) {
                return ns.minNoteSize;
            }
            var height = item.minHeight > 0 ? item.minHeight : ns.standardNoteSize;
            return height;
        }

        function segmentWidth(item) {
            var depth = item.groupDepth; //
            if (depth <= 0) return ns.standardNoteSize;
            if (depth <= 1) return item.minWidth + depth * ns.standardNoteOffset;

            item.applyToChildren(ns.updateShapeForLayout);

            var list = item.Subcomponents;
            var total = list.sumAll('width', ns.standardNoteOffset);
            return total;
        }

        shape.segHeight = segmentHeight(shape);
        shape.segWidth = segmentWidth(shape);

        var count = ns.colorsFill.length - 1;
        var depth = shape.groupDepth;
        var colorDepth = depth > count ? count : depth;

        shape.fillColor = ns.colorsFill[colorDepth || 0];
        shape.strokeColor = ns.colorsFill[colorDepth + 1];
        shape.textColor = depth >= 5 ? 'white' : 'black';

        //fo.trace.log(shape.gcsIndent(" updateShapeForLayout done " + shape.myName));

        return shape;
    }

    var shape2DSpec = {
        pinX: function () {
            var offset = ns.standardNoteOffset;
            var depth = this.mySiblingsMaxValue('groupDepth', 0);
            if (this.groupDepth == 0 && depth == 0) return offset;

            //horizontal location is based on position in subcomponents collection
            var list = this.mySiblingsBefore();
            var total = list.sumAll('width', offset);
            return total;
        },
        pinY: function () {
            var offset = ns.minNoteSize;
            //var count = this.myParent && this.myParent.Subcomponents.count;
            if (this.groupDepth > 0) return offset;
            var depth = this.mySiblingsMaxValue('groupDepth', 0);
            if (this.groupDepth == 0 && depth > 0) return offset;

            //vertical location is based on position in subcomponents collection
            var list = this.mySiblingsBefore();
            var total = list.sumAll('height', offset);
            return total;
        },
        locX: function () { return 0.0 * this.width; },
        locY: function () { return 0.0 * this.height; },
        minWidth: function () { return ns.standardNoteSize; },
        minHeight: function () { return ns.minNoteSize; },
        width: function () {
            this.context; //take a dependency on the context...
            var result = Math.max(this.segWidth, this.minWidth);
            if (isNaN(result)) result = ns.standardNoteSize
            return result;
        },
        height: function () {
            this.context; //take a dependency on the context...
            var result = Math.max(this.segHeight || this.minHeight);
            if (isNaN(result)) result = ns.standardNoteSize
            return result;
        },
        headerText: function () {
            return this.context ? this.context.headerText : this.myName;
        },
        headline: function () {
            return create.createText('', "bold 12px Arial", "#000000");
        },
        background: function () { return create.createShape(); },
        selected: function () { return create.createShape(); },
        dropTarget: function () { return create.createShape(); },
        geom: function () {
            var container = create.createContainer();
            container && container.addChild(this.background, this.dropTarget, this.selected, this.headline);
            return container;
        },
        update: function () {
            var container = this.geom;
            if (!container) {
                return false;
            }

            var self = this;
            if (self.myParent && !self.myParent.update) {
                return false;
            }
            ns.updateShapeForLayout(self);

            
            var shapeWidth = this.width;
            var shapeHeight = this.height;

          
            var g = this.background.graphics.clear();

            fo.suspendDependencies(function () {
                var fill = self.fillColor;
                var stroke = self.strokeColor;
                g.beginFill(fill).beginStroke(stroke).setStrokeStyle(1).drawRect(0, 0, self.width, self.height).endStroke().endFill();
            });

            g = this.selected.graphics.clear();
            g.beginStroke("blue").setStrokeStyle(5).drawRect(3, 3, shapeWidth - 6, shapeHeight - 6).endStroke();

            g = this.dropTarget.graphics.clear();
            g.beginStroke("green").setStrokeStyle(5).drawRect(2, 2, shapeWidth - 4, shapeHeight - 4).endStroke();

            var headline = this.headline;

            headline.flowText(this.headerText, 21, 3); //char not size //width);

            headline.textAlign = "center";
            headline.textBaseline = "top";
            headline.lineWidth = shapeWidth - 10;
            headline.x = shapeWidth / 2;

            var height = headline.getMeasuredHeight();
            headline.y = (shapeHeight - height) / 2;

            fo.suspendDependencies(function () {
                container.setTransform(self.pinX, self.pinY);
                self.selected.alpha = self.isSelected ? .5 : 0;
                self.dropTarget.alpha = self.isActiveTarget ? .5 : 0;
            });
            return true;
        }
    }


    var Shape2D = function (properties, subcomponents, parent) {
        this.base = ns.Shape;
        //protect this spec from having the formulas for pinX and PinY being replaced with a value
        //this might be a good example of adding a guard() function like in visio
        var pinX = properties && properties.pinX;
        if (pinX && !fo.utils.isFunction(pinX)) {
            delete properties.pinX;
        }
        else {
            pinX = undefined;
        }

        var pinY = properties && properties.pinY;
        if (pinY && !fo.utils.isFunction(pinY)) {
            delete properties.pinY;
        }
        else {
            pinY = undefined;
        }

        this.base(utils.union(shape2DSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'Shape2D';

        this.setXY(pinX, pinY)

        return this;
    };

    Shape2D.prototype = (function () {
        var anonymous = function () { this.constructor = Shape2D; };
        anonymous.prototype = ns.Shape.prototype;
        return new anonymous();
    })();

    ns.Shape2D = Shape2D;
    utils.isaShape2D = function (obj) {
        return obj instanceof Shape2D ? true : false;
    };

    Shape2D.prototype.setDefaultXY = function (point) {
        return this.setXY(point[0], point[1]);
    }

    Shape2D.prototype.setXY = function (x, y) {
        //assumes no rotation this will take time to do right
        if (!isNaN(x)) {
            this.pinX = this.locX + x;
        }
        if (!isNaN(y)) {
            this.pinY = this.locY + y;
        }
        return this;
    }


    ns.makeShape2D = function (properties, subcomponents, parent) {
        var shape = new Shape2D(properties, subcomponents, parent);

        //shape.tracePropertyLifecycle('geom');
        //shape.tracePropertyLifecycle('update')
        //shape.tracePropertyLifecycle('pinX')

        var prop = shape.getProperty('isVisible')
        prop.onValueSet = function (value, formula, owner) {
            owner.geom.isVisible = value;
        }

        shape.setVisualState = function (state, rule, duration, onComplete) {

            if (rule && duration && onComplete) {
                var geom = shape.geom;
                shape.MorphTo(geom, rule, duration, create.Ease.linear, onComplete);
                return;
            }

            if (state.matches('isActiveTarget')) {
                var alpha = shape.isActiveTarget ? .5 : 0;
                var dropTarget = shape.dropTarget;
                if (!dropTarget || dropTarget.alpha == alpha) return;

                shape.MorphTo(dropTarget, { alpha: alpha }, 10, create.Ease.linear, function () {
                    dropTarget.alpha = alpha;
                    // ns.trace && ns.trace.info("dropTarget: " + shape.myName + '  alpha = ' + alpha);
                });
                return;
            }

            if (state.matches('isSelected')) {
                var alpha = shape.isSelected ? .5 : 0;
                var selected = shape.selected;
                if (!selected || selected.alpha == alpha) return;

                shape.MorphTo(selected, { alpha: alpha }, 10, create.Ease.linear, function () {
                    selected.alpha = alpha;
                    //ns.trace && ns.trace.info("Selected: " + shape.myName + '  alpha = ' + alpha);
                });
                return;
            }

            if (state.matches('canPullFromGroup')) {
                //shape.MorphTo(container, { skewY: 10, skewX: 10 }, 100, createjs.Ease.linear, function () {  //backInOut
                //    container.skewY = 0;
                //    container.skewX = 0;
                //});
                var container = shape.geom;
                if (!container ) return;

                shape.MorphTo(container, { skewY: 2 }, 100, create.Ease.linear, function () {  //backInOut
                    container.skewY = 0;
                });
                return;
            }
        }

        return shape;
    };

}(Foundry.canvas, Foundry, Foundry.createjs));

//noteShape2D
(function (ns, fo, create, undefined) {

    var tween = create.Tween;
    var utils = fo.utils;

    var noteShape2D =  {
        noteText: function () {
            return this.context ? this.context.noteText : this.headerText;
        },
        note: function () {
            return create.createText('', "10px Arial", "#000000");
        },
        isTextDifferent: function () {
            if (this.headerText == this.noteText) return false;
            if (!this.headerText || !this.noteText) return false;
            return !this.headerText.matches(this.noteText);
        },
        height: function () {
            this.context; //take a dependency on the context...
            var result = Math.max(this.segHeight || this.minHeight);
            if (isNaN(result)) result = ns.standardNoteSize;
            if (!this.isTextDifferent) return result;
            var hasMembers = this.hasGroupMembers();
            var inGroup = this.isInGroup();
            if (hasMembers || inGroup) return result;
            result = ns.standardNoteSize;
            return result;
        },
        bitmap: function () {
            var context = this.context;
            if (!context) return;

            //http://stackoverflow.com/questions/13494746/canvas-cross-domain-pixel-error
            if (context.imageUri) {
                var imageWidth = this.minWidth;
                var bitmap = create.createBitmap(context.imageUri);
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
                return bitmap;
            }
            if (context.dataUri) {
                var bitmap = create.createBitmap(context.dataUri);
                var ratio = bitmap.image.width / bitmap.image.height;

                var maxWidth = 400;
                if (bitmap.image.width > maxWidth) {
                    var scale = maxWidth / bitmap.image.width;
                    bitmap.scaleX = scale
                    bitmap.scaleY = scale;
                }
                return bitmap;
            }
        },
        geom: function () {
            var container = create.createContainer();
            container && container.addChild(this.background, this.bitmap, this.dropTarget, this.selected, this.note, this.headline);
            return container;
        },
        update: function () {
            if (!this.geom) return false;

            var self = this;
            ns.updateShapeForLayout(self);

            var container = this.geom;

            var shapeWidth = this.width;
            var shapeHeight = this.height;

            this.note.lineWidth = shapeWidth - (2 * ns.standardNoteOffset);
            this.headline.lineWidth = shapeWidth - ns.standardNoteOffset;

            var fill = this.fillColor;
            var stroke = this.strokeColor;
            var g = this.background.graphics.clear();
            g.beginFill(fill).beginStroke(stroke).setStrokeStyle(1).drawRect(0, 0, shapeWidth, shapeHeight).endStroke().endFill();

            g = this.selected.graphics.clear();
            g.beginStroke("blue").setStrokeStyle(5).drawRect(3, 3, shapeWidth - 6, shapeHeight - 6).endStroke();

            g = this.dropTarget.graphics.clear();
            g.beginStroke("green").setStrokeStyle(5).drawRect(2, 2, shapeWidth - 4, shapeHeight - 4).endStroke();

            var context = this.context;
            var note = this.note;
            var headline = this.headline;

            var hasMembers = this.hasGroupMembers();
            var inGroup = this.isInGroup();

            if (context) {

                headline.flowText(context.headerText, 21, 3); //char not size //width);

                headline.textAlign = "center";
                headline.textBaseline = "top";
                headline.x = shapeWidth / 2;

                var headlineHeight = headline.getMeasuredHeight();
                headline.y = (shapeHeight - headlineHeight) / 2;


                note.flowText(context.noteText, 25, 15); //char not size //width);

                note.x  = (shapeWidth - note.lineWidth) / 2;

                note.textAlign = "left";
                note.textBaseline = "top";

                var noteHeight = note.getMeasuredHeight();
                 note.y = ns.minNoteSize;

                if (hasMembers || inGroup) {
                    note.visible = false;
                }
                else  {
                    note.visible = this.isTextDifferent;
                    if (note.visible) {
                        headline.y = (ns.minNoteSize - headlineHeight) / 2;
                    }

                }
               
            }





            fo.suspendDependencies(function () {
                container.setTransform(self.pinX, self.pinY);
                self.selected.alpha = self.isSelected ? .5 : 0;
                self.dropTarget.alpha = self.isActiveTarget ? .5 : 0;
            });

            return true;
        },
    };


    ns.makeNoteShape2D = function (properties, subcomponents, parent) {
        var customSpec = utils.union(noteShape2D, properties);
        var shape = ns.makeShape2D(customSpec, subcomponents, parent);

        return shape;
    };


}(Foundry.canvas, Foundry, Foundry.createjs));


//noteShape1D
(function (ns, fo, create, undefined) {

    var tween = create.Tween;
    var utils = fo.utils;

 


    ns.makeShape1D = function (properties, subcomponents, parent) {
        var shape = ns.makeShape2D({}, subcomponents, parent);
        return shape;
    };


}(Foundry.canvas, Foundry, Foundry.createjs));



//TableShape
(function (ns, fo, create, undefined) {
    var tween = create.Tween;
    var utils = fo.utils;


    var tableShape2DSpec = {
        pinX: function () {
            var offset = ns.standardNoteOffset;
            var depth = this.mySiblingsMaxValue('groupDepth', 0);
            if (this.groupDepth == 0 && depth == 0) return offset;

            //horizontal location is based on position in subcomponents collection
            var list = this.mySiblingsBefore();
            var total = list.sumAll('width', offset);
            return total;
        },
        pinY: function () {
            var offset = ns.minNoteSize;
            //var count = this.myParent && this.myParent.Subcomponents.count;
            if (this.groupDepth > 0) return offset;
            var depth = this.mySiblingsMaxValue('groupDepth', 0);
            if (this.groupDepth == 0 && depth > 0) return offset;

            //vertical location is based on position in subcomponents collection
            var list = this.mySiblingsBefore();
            var total = list.sumAll('height', offset);
            return total;
        },
        locX: function () { return 0.0 * this.width; },
        locY: function () { return 0.0 * this.height; },
        minWidth: function () { return ns.standardNoteSize; },
        minHeight: function () { return ns.minNoteSize; },
        width: function () {
            this.context; //take a dependency on the context...
            var result = Math.max(this.segWidth, this.minWidth);
            if (isNaN(result)) result = ns.standardNoteSize
            return result;
        },
        height: function () {
            this.context; //take a dependency on the context...
            var result = Math.max(this.segHeight || this.minHeight);
            if (isNaN(result)) result = ns.standardNoteSize
            return result;
        },
        headerText: function () {
            return this.context ? this.context.headerText : this.myName;
        },
        headline: function () {
            return create.createText('', "bold 12px Arial", "#000000");
        },
        background: function () { return create.createShape(); },
        selected: function () { return create.createShape(); },
        dropTarget: function () { return create.createShape(); },
        geom: function () {
            var container = create.createContainer();
            container && container.addChild(this.background, this.dropTarget, this.selected, this.headline);
            return container;
        },
        update: function () {
            var container = this.geom;
            if (!container) {
                return false;
            }

            var self = this;
            if (self.myParent && !self.myParent.update) {
                return false;
            }
            ns.updateShapeForLayout(self);


            var shapeWidth = this.width;
            var shapeHeight = this.height;


            var g = this.background.graphics.clear();

            fo.suspendDependencies(function () {
                var fill = 'yellow';
                var stroke = 'black';
                g.beginFill(fill).beginStroke(stroke).setStrokeStyle(1).drawRect(0, 0, self.width, self.height).endStroke().endFill();
            });

            g = this.selected.graphics.clear();
            g.beginStroke("blue").setStrokeStyle(5).drawRect(3, 3, shapeWidth - 6, shapeHeight - 6).endStroke();

            g = this.dropTarget.graphics.clear();
            g.beginStroke("green").setStrokeStyle(5).drawRect(2, 2, shapeWidth - 4, shapeHeight - 4).endStroke();

            var headline = this.headline;
            headline.textAlign = "center";
            headline.textBaseline = "top";
            headline.lineWidth = shapeWidth - 10;
            headline.x = shapeWidth / 2;

            var height = headline.getMeasuredHeight();
            headline.y = (shapeHeight - height) / 2;

            fo.suspendDependencies(function () {
                container.setTransform(self.pinX, self.pinY);
                self.selected.alpha = self.isSelected ? .5 : 0;
                self.dropTarget.alpha = self.isActiveTarget ? .5 : 0;
            });
            return true;
        }
    }


    var TableShape2D = function (properties, subcomponents, parent) {
        this.base = ns.Shape;
        //protect this spec from having the formulas for pinX and PinY being replaced with a value
        //this might be a good example of adding a guard() function like in visio
        var pinX = properties && properties.pinX;
        if (pinX && !fo.utils.isFunction(pinX)) {
            delete properties.pinX;
        }
        else {
            pinX = undefined;
        }

        var pinY = properties && properties.pinY;
        if (pinY && !fo.utils.isFunction(pinY)) {
            delete properties.pinY;
        }
        else {
            pinY = undefined;
        }

        this.base(utils.union(tableShape2DSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'TableShape2D';

        this.setXY(pinX, pinY)

        return this;
    };

    TableShape2D.prototype = (function () {
        var anonymous = function () { this.constructor = TableShape2D; };
        anonymous.prototype = ns.Shape.prototype;
        return new anonymous();
    })();

    ns.TableShape2D = TableShape2D;
    utils.isaTableShape2D = function (obj) {
        return obj instanceof TableShape2D ? true : false;
    };

    TableShape2D.prototype.setDefaultXY = function (point) {
        return this.setXY(point[0], point[1]);
    }

    TableShape2D.prototype.setXY = function (x, y) {
        //assumes no rotation this will take time to do right
        if (!isNaN(x)) {
            this.pinX = this.locX + x;
        }
        if (!isNaN(y)) {
            this.pinY = this.locY + y;
        }
        return this;
    }


    ns.makeTableShape2D = function (properties, subcomponents, parent) {
        var shape = new TableShape2D(properties, subcomponents, parent);

        //shape.tracePropertyLifecycle('geom');
        //shape.tracePropertyLifecycle('update')
        //shape.tracePropertyLifecycle('pinX')

        var prop = shape.getProperty('isVisible')
        prop.onValueSet = function (value, formula, owner) {
            owner.geom.isVisible = value;
        }

        shape.setVisualState = function (state, rule, duration, onComplete) {

            if (rule && duration && onComplete) {
                var geom = shape.geom;
                shape.MorphTo(geom, rule, duration, create.Ease.linear, onComplete);
                return;
            }

            if (state.matches('isActiveTarget')) {
                var alpha = shape.isActiveTarget ? .5 : 0;
                var dropTarget = shape.dropTarget;
                if (!dropTarget || dropTarget.alpha == alpha) return;

                shape.MorphTo(dropTarget, { alpha: alpha }, 10, create.Ease.linear, function () {
                    dropTarget.alpha = alpha;
                    // ns.trace && ns.trace.info("dropTarget: " + shape.myName + '  alpha = ' + alpha);
                });
                return;
            }

            if (state.matches('isSelected')) {
                var alpha = shape.isSelected ? .5 : 0;
                var selected = shape.selected;
                if (!selected || selected.alpha == alpha) return;

                shape.MorphTo(selected, { alpha: alpha }, 10, create.Ease.linear, function () {
                    selected.alpha = alpha;
                    //ns.trace && ns.trace.info("Selected: " + shape.myName + '  alpha = ' + alpha);
                });
                return;
            }

            if (state.matches('canPullFromGroup')) {
                //shape.MorphTo(container, { skewY: 10, skewX: 10 }, 100, createjs.Ease.linear, function () {  //backInOut
                //    container.skewY = 0;
                //    container.skewX = 0;
                //});
                var container = shape.geom;
                if (!container) return;

                shape.MorphTo(container, { skewY: 2 }, 100, create.Ease.linear, function () {  //backInOut
                    container.skewY = 0;
                });
                return;
            }
        }

        return shape;
    };

}(Foundry.canvas, Foundry, Foundry.createjs));

(function (ns, cv, undefined) {
    if (!ns.establishType) return;

    ns.establishType('Shape2D', {}, cv.makeShape2D);
    ns.establishType('noteShape2D', {}, cv.makeNoteShape2D);
    ns.establishType('tableShape2D', {}, cv.makeTableShape2D);
    ns.establishType('Shape1D', {}, cv.makeShape1D);

}(Foundry, Foundry.canvas));

///#source 1 1 /Foundry/canvas2image.js
/*
 * Canvas2Image v0.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

var Canvas2Image = Canvas2Image || {};

(function (ns,undefined) {

	// check if we have canvas support
	var bHasCanvas = false;
	var oCanvas = document.createElement("canvas");
	if (oCanvas.getContext("2d")) {
		bHasCanvas = true;
	}


	var bHasImageData = !!(oCanvas.getContext("2d").getImageData);
	var bHasDataURL = !!(oCanvas.toDataURL);
	var bHasBase64 = !!(window.btoa);

	var strDownloadMime = "image/octet-stream";

	// ok, we're good
	var readCanvasData = function(oCanvas) {
		var iWidth = parseInt(oCanvas.width);
		var iHeight = parseInt(oCanvas.height);
		return oCanvas.getContext("2d").getImageData(0,0,iWidth,iHeight);
	}

	// base64 encodes either a string or an array of charcodes
	var encodeData = function(data) {
		var strData = "";
		if (typeof data == "string") {
			strData = data;
		} else {
			var aData = data;
			for (var i=0;i<aData.length;i++) {
				strData += String.fromCharCode(aData[i]);
			}
		}
		return btoa(strData);
	}

	// creates a base64 encoded string containing BMP data
	// takes an imagedata object as argument
	var createBMP = function(oData) {
		var aHeader = [];
	
		var iWidth = oData.width;
		var iHeight = oData.height;

		aHeader.push(0x42); // magic 1
		aHeader.push(0x4D); 
	
		var iFileSize = iWidth*iHeight*3 + 54; // total header size = 54 bytes
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256);

		aHeader.push(0); // reserved
		aHeader.push(0);
		aHeader.push(0); // reserved
		aHeader.push(0);

		aHeader.push(54); // dataoffset
		aHeader.push(0);
		aHeader.push(0);
		aHeader.push(0);

		var aInfoHeader = [];
		aInfoHeader.push(40); // info header size
		aInfoHeader.push(0);
		aInfoHeader.push(0);
		aInfoHeader.push(0);

		var iImageWidth = iWidth;
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256);
	
		var iImageHeight = iHeight;
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256);
	
		aInfoHeader.push(1); // num of planes
		aInfoHeader.push(0);
	
		aInfoHeader.push(24); // num of bits per pixel
		aInfoHeader.push(0);
	
		aInfoHeader.push(0); // compression = none
		aInfoHeader.push(0);
		aInfoHeader.push(0);
		aInfoHeader.push(0);
	
		var iDataSize = iWidth*iHeight*3; 
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); 
	
		for (var i=0;i<16;i++) {
			aInfoHeader.push(0);	// these bytes not used
		}
	
		var iPadding = (4 - ((iWidth * 3) % 4)) % 4;

		var aImgData = oData.data;

		var strPixelData = "";
		var y = iHeight;
		do {
			var iOffsetY = iWidth*(y-1)*4;
			var strPixelRow = "";
			for (var x=0;x<iWidth;x++) {
				var iOffsetX = 4*x;

				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+2]);
				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+1]);
				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX]);
			}
			for (var c=0;c<iPadding;c++) {
				strPixelRow += String.fromCharCode(0);
			}
			strPixelData += strPixelRow;
		} while (--y);

		var strEncoded = encodeData(aHeader.concat(aInfoHeader)) + encodeData(strPixelData);

		return strEncoded;
	}


	// sends the generated file to the client
	var saveFile = function(strData) {
		document.location.href = strData;
	}

	var makeDataURI = function(strData, strMime) {
		return "data:" + strMime + ";base64," + strData;
	}

	// generates a <img> object containing the imagedata
	var makeImageObject = function(strSource) {
		var oImgElement = document.createElement("img");
		oImgElement.src = strSource;
		return oImgElement;
	}

	var scaleCanvas = function(oCanvas, iWidth, iHeight) {
		if (iWidth && iHeight) {
			var oSaveCanvas = document.createElement("canvas");
			oSaveCanvas.width = iWidth;
			oSaveCanvas.height = iHeight;
			oSaveCanvas.style.width = iWidth+"px";
			oSaveCanvas.style.height = iHeight+"px";

			var oSaveCtx = oSaveCanvas.getContext("2d");

			oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, iWidth, iHeight);
			return oSaveCanvas;
		}
		return oCanvas;
	}


		ns.saveAsPNG = function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!bHasDataURL) {
				return false;
			}
			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);
			var strData = oScaledCanvas.toDataURL("image/png");
			if (bReturnImg) {
				return makeImageObject(strData);
			} else {
				saveFile(strData.replace("image/png", strDownloadMime));
			}
			return true;
		},

		ns.saveAsJPEG = function(oCanvas, bReturnImg, iWidth, iHeight) {
			if (!bHasDataURL) {
				return false;
			}

			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);
			var strMime = "image/jpeg";
			var strData = oScaledCanvas.toDataURL(strMime);
	
			// check if browser actually supports jpeg by looking for the mime type in the data uri.
			// if not, return false
			if (strData.indexOf(strMime) != 5) {
				return false;
			}

			if (bReturnImg) {
				return makeImageObject(strData);
			} else {
				saveFile(strData.replace(strMime, strDownloadMime));
			}
			return true;
		},

		ns.saveAsBMP = function (oCanvas, bReturnImg, iWidth, iHeight) {
			if (!(bHasImageData && bHasBase64)) {
				return false;
			}

			var oScaledCanvas = scaleCanvas(oCanvas, iWidth, iHeight);

			var oData = readCanvasData(oScaledCanvas);
			var strImgData = createBMP(oData);
			if (bReturnImg) {
				return makeImageObject(makeDataURI(strImgData, "image/bmp"));
			} else {
				saveFile(makeDataURI(strImgData, strDownloadMime));
			}
			return true;
		}


})(Canvas2Image);
