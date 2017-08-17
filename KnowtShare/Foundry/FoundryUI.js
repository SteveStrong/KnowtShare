///#source 1 1 /Foundry/Foundry.js
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
                if (notExist && !mp.canExport) return;

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


            if (deep && this.Subcomponents.count > 0) {
                var results = this.Subcomponents.map(function (item) {
                    var value = item;
                    if (ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) {
                        value = value.getSpec(deep);
                    }
                    return value;
                });
                spec["SubSpec"] = JSON.stringify(results);
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
            return self;
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


    Component.prototype.tracePropertyLifecycle = function (name, search) {
        var self = this;
        var prop = this.getProperty(name, search);

        if (prop) {
            prop.onValueDetermined = function (value, formula, owner) {
                fo.publish('info', [prop.asLocalReference(), ' onValueDetermined:' + owner.myName + '  value=' + value]);
            }
            prop.onValueSmash = function (value, formula, owner) {
                fo.publish('error', [prop.asLocalReference(), ' onValueSmash:' + owner.myName]);
            }
            prop.onValueSet = function (value, formula, owner) {
                fo.publish('warning', [prop.asLocalReference(), ' onValueSet:' + owner.myName + '  value=' + value]);
            }
            return true;
        }
    }

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
        model.myParent = parent; //models should be aware of their workspace
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

    //collections can also have relationships
    ns.Collection.prototype.establishRelationship = function (name, init, spec) {
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

    var _dictionarys = {};
    function establishDictionary(id) {
        if (!ns.isValidNamespaceKey(id)) return;

        var found = _dictionarys[id];
        if (!found) {
            _dictionarys[id] = {};
            found = _dictionarys[id];
        }
        return found;
    }

    ns.getDictionary = function (specId) {
        if (!ns.isValidNamespaceKey(specId)) return;
        return establishDictionary(specId)
    }

    function exportEstablishConstructor(specId) {
        var id = specId;

        return function (mixin, idFunc, dictionary, parent, onComplete) {
            var definedSpec = _specs[id];
            var extract = ns.extractSpec(id, mixin);


            if (!idFunc) {
                var result = ns.makeInstance(definedSpec, extract, parent, onComplete);
                return result;
            }

            dictionary = dictionary ? dictionary : establishDictionary(id);

            var myKey = fo.utils.isFunction(idFunc) ? idFunc(mixin) : idFunc;
            var found = dictionary[myKey];
            if (!found) {
                dictionary[myKey] = found = ns.makeInstance(definedSpec, extract, parent, onComplete);
                found.myName = myKey;
            } else {
                found.extendWith(extract);
                onComplete && onComplete(found);
            }
            return found;
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
        exported['new' + name + 'Establish'] = exportEstablishConstructor(specId);

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


    Workspace.prototype.clear = function (includeDocument) {
        var self = this;
        self.rootModel.removeAllSubcomponents();
        if (self.rootPage) {
            self.rootPage.selectShape(undefined, true);
            self.rootPage.removeAllSubcomponents();
            self.rootPage.updateStage(true);
        }
        delete self.localData;
        if (includeDocument) {
            self.clearDocumentSpec();
        }
        fo.publish('WorkspaceClear', [self])
        fo.publish('info', ['Workspace Cleared']);
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

    Workspace.prototype.payloadExportSave = function (payload, name, ext) {
        var self = this;
        self.isDocumentSaved = true;
        self.documentName = name;
        self.documentExt = ext;

        var resut = this.payloadSaveAs(payload, name, ext);
        fo.publish('WorkspaceExportSave', [self])

        return resut;
    };

    Workspace.prototype.payloadOpenMerge = function (payload, name, ext) {
        var self = this;
        self.isDocumentSaved = true;
        self.documentName = name;
        self.documentExt = ext;

        var resut = this.payloadToCurrentModel(payload);
        fo.publish('WorkspaceOpenMerge', [self])

        return resut;
    };

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
            space.rootModel.myParent = space;
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

        //bindable to PIP header bar
        space.pip = space.drawing.panZoom;


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
            //fo.publish('info', ['Saving Session']);
            var payload = self.currentModelToPayload({}, true, true);
            self.saveSession(payload, self.localStorageKey, function () {
                //fo.publish('success', ['Session Saved']);
                fo.publish('sessionStorage', [payload.length,0]);
                fo.publish('sessionSaved', [payload]);
            });
        };

        space.doSessionRestore = function () {
            var self = this;
            self.restoreSession(self.localStorageKey, function (payload) {
                //fo.publish('info', ['Restoring Session']);
                //I think cording a clear here is bad and unnecessary   self.clear();
                self.digestLock(function () {
                    self.payloadToCurrentModel(payload);
                    fo.publish('sessionStorage', [0, payload.length]);
                    fo.publish('sessionRestored', [payload]);
                    //fo.publish('success', ['Session Restored']);
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

    ns.applyCollectionMapping = function (list, groupSpec) {
        var itemList = fo.utils.isaCollection(list) ? list.elements : list;
        var group = ns.applyGrouping(itemList, groupSpec);
        var map = {};
        for (var key in group) {
            var collection = fo.makeCollection(group[key]);
            collection.myName = key;
            map[key] = collection;
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

///#source 1 1 /Foundry/Foundry.rules.binding.js
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

(function (ns, $, undefined) {
    "use strict";

    var utils = ns.utils || {};
    var bi = ns.binding = ns.binding || {};
    ns.customBindings = ns.customBindings || {};

    function createItemDictionary(source) {
        var children = source.children;
        var length = children ? children.length : 0

        var result = {};
        for (var i = 0; i < length; i++) {
            var child = children[i];
            if (child.nodeType == 1 && child.hasAttribute("data-guid")) {
                var guid = child.getAttribute("data-guid");
                result[guid] = child;
            }
        }
        return result;
    }

    function doesItemExist(item,lookup) {
        var guidKey = item.getID ? item.getID() : item.toString();
        if (lookup[guidKey]) {
            delete lookup[guidKey];
            return true;
        }
    }

    function purgeUnusedItems(lookup) {
        for (var key in lookup) {
            if (lookup.hasOwnProperty(key)) {
                var element = lookup[key];
                $(element).remove();
            }
        }
    }



    bi.generateHtmlForSelectOptions = function(context, collection, stylingplan) {
        //dynamically generate the options and bind to property so they can recomputed
        var displayStyle = stylingplan && stylingplan.display ? stylingplan.display : 'display'; //what is shown in the drop down
        //var mode = stylingplan && stylingplan.mode ? stylingplan.mode : '';  //single: multipule
        //var defaultValue = stylingplan.defaultValue ? stylingplan.defaultValue : ''; //put something that is the default prompt
        var html = '';
        if (collection && collection.isNotEmpty()) {
            html = collection.map(function (item, index) {
                var display = displayStyle && item[displayStyle] ? item[displayStyle] : item;
                var value = index;

                var disabled = item.disabled || (context && context.isOptionValid && !context.isOptionValid(item)) ? "disabled" : "";
                var selected = item.selected ? "selected" : "";
                return "<option {0} {1} value='{2}'>{3}</option>".format(disabled, selected, value, display);
            }).join('');
        }

        var prompt = stylingplan && stylingplan.prompt ? stylingplan.prompt : 'Choose...'; //put something that is the default prompt
        if (prompt && html) html = "<option value='-1'>{0}</option>{1}".format(prompt, html);
        return html;
    }

    bi.scopeDictionary = {};
    function createScopeRule(name) {
        bi.scopeDictionary[name] = { scopeRule: name };
        return bi.scopeDictionary[name];
    }
    function findScopeRule(name) {
        return bi.scopeDictionary[name];
    }

    var managed = createScopeRule('managed');  //default for all common bindings
    managed['attribute'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var attribute = resolved.aspect;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                if (value) { //looking for a truthy value here
                    $element.attr(attribute, value);
                }
                else {
                    $element.removeAttr(attribute)
                }
            };
            property.addBinding(binding);
        },
    };

    function resolvedValue(content, resolved) {
        if ( resolved.slot ) return  resolved.slot;
        if (resolved.formula) return resolved.formula.call(context);
        return content;
    }

    var unmanaged = createScopeRule('unmanaged');
    unmanaged['text'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var result = resolvedValue(context, resolved);
            $element.text(result);
        },
    };
    unmanaged['innertext'] = unmanaged['text'];
    unmanaged['html'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var result = resolvedValue(context, resolved);
            $element.html(result);
        },
    };
    unmanaged['innerhtml'] = unmanaged['html'];
    unmanaged['value'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var result = resolvedValue(context, resolved);
            $element.val(result);
        },
    }
    unmanaged['attribute'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var result = resolvedValue(context, resolved);
            $element.attr(resolved.aspect, result);
        },
    }

    var component = createScopeRule('component');
    component['value'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                $element.val(value);
            };
            property.addBinding(binding);
        },
        readFromElement: function (context, uiElement, trigger, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var converter = resolved.converter;
            var eventBinding = function (e) {
                var event = e || window.event;
                event.cancelBubble = true;
                property.owner.doCommand(function () {
                    var val = event.target.value;
                    property.setValue(converter ? converter(val) : val);
                });
            };
            var trigger = trigger || 'blur';
            $element.on(trigger, eventBinding);
        },
    }

    component['text'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                $element.text(value);
            };
            var property = resolved.property || resolved.propertyPeek;
            if (property) {
                property.addBinding(binding);
            }
            else if (resolved.component) {
                binding(resolved.component);
            }
        },
    };
    component['innertext'] = component['text'];
    component['html'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                $element.html(value);
            };
            property.addBinding(binding);
        },
    };
    component['innerhtml'] = component['html'];
    component['staticHTML'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                value = window.toStaticHTML ? window.toStaticHTML(value) : value;
                $element.html(value);
            };
            property.addBinding(binding);
        },
    };
    component['click'] = {
        readFromElement: function (context, uiElement, trigger, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;

            if (property && resolved.reference[0] === '?') {
                $element.show();
            }

            var eventBinding = function (e) {
                var event = e || window.event;
                event.cancelBubble = true;
                var isDialogButton = event.target.id.endsWith('DialogButton')
                if (ns.isDialogOpen && !isDialogButton) {
                    return;
               }
                context.doCommand(function () {
                    var el = uiElement;
                    if (!property) property = context.resolveReference(resolved.reference).property;
                    var result = property && property.doCommand(context, meta);
                    if (result && property.status) ns.markForRefresh(property);
                    return result;
                });
            };

            $element.click(eventBinding);
        },
    };
    component['onclick'] = component['click'];

    component['blur'] = {
        readFromElement: function (context, uiElement, trigger, resolved) {

            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;

            var eventBinding = function (e) {
                var event = e || window.event;
                event.cancelBubble = true;
                context.doCommand(function () {
                    var el = uiElement;
                    if (!property) property = context.resolveReference(resolved.reference).property;
                    var result = property && property.doCommand(context, meta);
                    if (result && property.status) ns.markForRefresh(property);
                    return result;
                });
            };

            $element.blur(eventBinding);

            var pressBinding = function (e) {
                var event = e || window.event;
                event.cancelBubble = true;
                if (event.key.matches('Enter')) {
                    //eventBinding(e);
                    $element.blur();
                }
            }

            $element.keypress(pressBinding);
        },
    };
    component['onblur'] = component['blur'];


    //http://www.csharpguru.in/2013/03/javascript-to-allow-only-numbers-only.html
    //Except only numbers for Age textbox
    function onlyNumbers(event) {
        var charCode = (event.which) ? event.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }


    component['submit'] = {
        readFromElement: function (context, uiElement, trigger, resolved) {
            var $element = $(uiElement);
            var source = context;
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;

            var eventBinding = function (e) {
                var event = e || window.event;
                event.cancelBubble = true;
                var spec = meta ? meta : source.getSpec();
                var form = event.target;
                context.doCommand(function () {
                    var result = property.doCommand(source, spec, form)
                    if (result && property.status) ns.markForRefresh(property);
                    return result;
                });
            };
            $element.submit(eventBinding);
        },
    };

    component['src'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                $element.attr(resolved.aspect, value);
            };
            property.addBinding(binding);
        },
    };

    component['attribute'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                $element.attr(resolved.aspect, value);
            };
            property.addBinding(binding);
        },
    }
    component['href'] = component['src'];
    component['show'] = {
        writeToElement: function (context, uiElement, resolved) {
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                var jElement = $(uiElement);
                return (value) ? jElement.show() : jElement.hide();
            };
            property.addBinding(binding);
        },
    };

    component['visible'] = component['show'];
    component['hide'] = {
        writeToElement: function (context, uiElement, resolved) {
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = !p.getValue(meta);
                var jElement = $(uiElement);
                return (value) ? jElement.show() : jElement.hide();
            };
            property.addBinding(binding);
        },
    };

    component['invisible'] = component['hide'];
    component['json'] = {
        writeToElement: function (context, uiElement, resolved) {
            var property = resolved.property || resolved.propertyPeek;
            var binding = function (p) {
                var value = p.getValue(resolved.meta);
                var string = value && value.stringify ? value.stringify.call(value) : JSON.stringify(value, null, 2);
                var jString = "<pre>{0}</pre>".format(string);
                $(uiElement).html(jString);
            };
            property.addBinding(binding);
        },
    };
    component['spec'] = {
        writeToElement: function (context, uiElement, resolved) {
            var property = resolved.property || resolved.propertyPeek;
            var binding = function (p) {
                var value = p.getValue(resolved.meta);
                var string = value && value.getSpec ? value.getSpec.call(value) : '';
                var jString = "<pre>{0}</pre>".format(string);
                $(uiElement).html(jString);
            };
            property.addBinding(binding);
        },
    };
    component['disabled'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                if (value) { //looking for a truthy value here
                    $element.attr("disabled", "disabled");
                } else {
                    $element.removeAttr("disabled")
                }
            };
            property.addBinding(binding);
        },
    };
    component['disable'] = component['disabled'];
    component['enabled'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                if (value) { //looking for a truthy value here
                    $element.removeAttr("disabled")
                } else {
                    $element.attr("disabled", "disabled");
                }
            };
            property.addBinding(binding);
        },
    };
    component['enable'] = component['enabled'];



    //element
    component['select'] = {
        modifyElement: function (context, uiElement, resolved) {
            uiElement.setAttribute("type", "select");

            //preview this binding plan to link option to value as lookup!!
            var sBindRule = utils.unComment(uiElement.getAttribute("data-bind"));
            var bindingPlan = utils.stylingStringToObject(sBindRule);
            if (utils.isaProperty(context)) {
                var validValuesPromise = context.getMetaDataAsync('validValues')
                validValuesPromise.whileWaiting(function () {
                }).continueWith(function (newValue) {
                    context['dynamicOptions'] = newValue;
                });
               
                return uiElement;  //somehow the property ownes the valid values
            }
            else if (bindingPlan.value && bindingPlan.options) {
                var value = context.getProperty(bindingPlan.value);
                var resolvedTo = context.resolveProperty(bindingPlan.options);
                var options = resolvedTo.collection ? resolvedTo.collection : resolvedTo.property ? resolvedTo.property : undefined;
                value['dynamicOptions'] = options;
            }
            return uiElement;
        }
    }

    //element,attribute
    component['select']['options'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var collection = resolved.collection;
            var meta = resolved.meta;

            collection = collection ? collection : property ? property.getValue(meta) : undefined;

            var sOptionRule = uiElement.getAttribute("data-option");
            var stylingplan = utils.stylingStringToObject(sOptionRule);
            //
            //  options should also remark the selected item if the value changes from and outside force
            //  like being set programtically  maybe notify with pub-sub?
            //


            var binding = function (context) {
                //assume the metaData always returns a promise that May execure right away..
                var value = collection ? collection : context ? context.getValue(meta) : undefined;

                if (utils.isArray(value)) {
                    //dynamically create collection just for UI, attach to property object 
                    collection = context['dynamic_collection'];
                    collection = collection ? collection : new ns.Collection([], context.owner); //special case
                    collection.reset(value);
                    context['dynamic_collection'] = collection;
                }
                else if (utils.isaCollection(value)) {
                    collection = value;
                }
 
                var validValuesPromise = collection ? collection.getMetaDataAsync() : context.getMetaDataAsync('validValues')

                validValuesPromise.whileWaiting(function () {
                    //go ahead and create it even if you are just going to replace or update it later
                    var html = "<option value='-1'>Loading...</option>";
                    $element.html(html); //this is a Select element
                }).continueWith(function (newValue) {
                    ///var xxx = context.getMetaData('validValues');  //this could be processed again
                    var html = bi.generateHtmlForSelectOptions(context, newValue, stylingplan);
                    $element.html(html); //this is a Select element
                });
            };

            if (utils.isaCollection(collection)) {
                collection.getProperty('count').addBinding(binding);
            }
            if (utils.isaProperty(property)) {
                property.addBinding(binding);
            }

            //? subscribe to value change using pub sub 
            // subscribe("value change", function() { binding(property) } so options rerender?
            //var id = $element.attr('id');
            //if (id === undefined && property) {  //establish ID for pub sub
            //    id = "{0}{1}".format(property.myName, new Date().getUTCMilliseconds());
            //    $element.attr('id', id);
            //}

            //ns.subscribe('SelectRefreshOptions', function (selectID) {
            //    if (selectID == id) {
            //        binding(property);
            //    }
            //});
        },

    }

    component['select']['value'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;

            var sOptionRule = uiElement.getAttribute("data-option");
            var stylingplan = utils.stylingStringToObject(sOptionRule);


            var valueStyle = stylingplan && stylingplan.value ? stylingplan.value : 'value'; //what is used to set the value
            valueStyle = property.getMetaData('validValuesKey', valueStyle);

            //this event sets the control value when it changes
            var binding = function () {
                var uiValue = $element.val();
                var newValue = property.getValue();

                var dynamicOptions = property['dynamicOptions'];
                var validValues = utils.isaProperty(dynamicOptions) ? dynamicOptions.getValue() : dynamicOptions;
                var valueLookup = validValues && validValues.indexOfFirst && validValues.itemByIndex ? validValues : undefined;

                if (newValue) {
                    if (valueLookup) {  //kinda test for array or collection
                        //first dereference the value if necessary
                        var index = parseInt(uiValue);
                        var valueIndex = valueLookup.indexOfFirst(function (item) {
                            var value = valueStyle && item[valueStyle] ? item[valueStyle] : item;
                            //might need a smarter equals for arrays , objects and such
                            return value == newValue;
                        });
                        if (index != valueIndex) {
                            $element.val(valueIndex);
                        }
                    }
                    else { //assume that there is no value lookup
                        if (uiValue != newValue) {
                            $element.val(newValue);
                        }
                    }
                }
                else {  //publish that bound value was smashed
                    //var id = $element.attr('id');
                    //ns.publish('SelectRefreshOptions', [id]);
                }
            };


            property.addBinding(binding);
        },

        readFromElement: function (context, uiElement, trigger, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;

            var sOptionRule = uiElement.getAttribute("data-option");
            var stylingplan = utils.stylingStringToObject(sOptionRule);


            var valueStyle = stylingplan && stylingplan.value ? stylingplan.value : 'value'; //what is used to set the value
            valueStyle = property.getMetaData('validValuesKey', valueStyle);


            $element.on('change', function () {
                var uiValue = $(this).val();

                var dynamicOptions = property['dynamicOptions'];
                var validValues = utils.isaProperty(dynamicOptions) ? dynamicOptions.getValue() : dynamicOptions;
                var valueLookup = validValues && validValues.indexOfFirst && validValues.itemByIndex ? validValues : undefined;

                ns.runWithUIRefreshLock(function () {
                    if (valueLookup) {  //kinda test for array or collection
                        var index = parseInt(uiValue);
                        if (index >= 0) { //could be NAN or something googy
                            var value = valueLookup.itemByIndex(index); //might return undefined if out of range
                            var newValue = value && valueStyle && value[valueStyle] ? value[valueStyle] : value;
                            property.setValue(newValue);
                        }
                        else {
                            property.smash();
                        }
                    }
                    else {
                        property.setValue(uiValue);
                    }
                });
            });
        },
    }

    //element
    component['input'] = {
        modifyElement: function (context, uiElement, resolved) {
            return uiElement;
        }
    }

    //element, attribute
    component['input']['value'] = {        
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                var currentValue = $element.val();
                if (value != currentValue) {
                    $element.val(value);
                }
            };
            property.addBinding(binding);
        },
        readFromElement: function (context, uiElement, trigger, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var converter = resolved.converter;
            var eventBinding = function (e) {
                var event = e || window.event;
                event.cancelBubble = true;
                property.owner.doCommand(function () {
                    var val = event.target.value;
                    property.setValue(converter ? converter(val) : val);
                });
            };
            var trigger = trigger || 'blur';
            $element.on(trigger, eventBinding);
            $element.on('paste', eventBinding);
        },
    }

    //element, attribute
    component['textarea'] = {
        modifyElement: function (context, uiElement, resolved) {
            return uiElement;
        }
    }

    component['textarea']['value'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                var currentValue = $element.val();
                if (value != currentValue) {
                    $element.val(value);
                }
            };
            property.addBinding(binding);
        },
        readFromElement: function (context, uiElement, trigger, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var converter = resolved.converter;
            var eventBinding = function (e) {
                var event = e || window.event;
                event.cancelBubble = true;
                property.owner.doCommand(function () {
                    var val = event.target.value;
                    property.setValue(converter ? converter(val) : val);
                });
            };
            var trigger = trigger || 'blur';
            $element.on(trigger, eventBinding);
            $element.on('paste', eventBinding);
        },
    }

    //element, attribute
    component['input']['placeholder'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var value = p.getValue(meta);
                $element.attr('placeholder', value);
            };
            property.addBinding(binding);
        },
    }


    component['input']['button'] = {};
    component['input']['button']['value'] = {
        writeToElement: component['input']['value'].writeToElement,
    }

    component['input']['range'] = {};
    component['input']['range']['value'] = {
        writeToElement: component['input']['value'].writeToElement,
        readFromElement: function (context, uiElement, trigger, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var converter = resolved.converter ? resolved.converter : function (val) { return parseInt(val) };
            var eventBinding = function (e) {
                var event = e || window.event;
                event.cancelBubble = true;
                property.owner.doCommand(function () {
                    var val = event.target.value;
                    property.setValue(converter ? converter(val) : val);
                });
            };
            var trigger = trigger || 'change';
            $element.on(trigger, eventBinding);
        },
    }

    //element, type, attribute
    component['input']['radio'] = {};
    component['input']['radio']['value'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;

            var binding = function (p) {
                var currentValue = p.getValue(meta);
                //looking for a truthy value here
                var value = $element.val();
                $element.prop('checked', currentValue == value);
            };
            property.addBinding(binding);
        },
        readFromElement: function (context, uiElement, trigger, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            $element.on('change', function () {
                var value = $(this).val();
                //property.setValue(value);
                ns.runWithUIRefreshLock(function () {
                    property.setValue(value);
                });
            });
        },
    }

    //element, type, attribute
    component['input']['checkbox'] = {};
    component['input']['checkbox']['value'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;

            var binding = function (p) {
                var currentValue = p.getValue(meta);
                //looking for a truthy value here
                var value = $element.is(':checked');
                if (value !== currentValue) $element.prop('checked', currentValue);
            };
            property.addBinding(binding);
        },
        readFromElement: function (context, uiElement, trigger, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            $element.on('change', function () {
                var value = $(this).is(':checked');
                ns.runWithUIRefreshLock(function () {
                    property.setValue(value);
                });
            });
        },
    }



    var collection = createScopeRule('collection');
    collection['foreach'] = {
        writeToElement: function (context, uiElement, resolved) {
            var collection = resolved.collection;
            var binding = bi.createCollectionForeachBindingFunction(context, resolved, uiElement);
            if (utils.isaCollection(collection)) {
                collection.getProperty('count').addBinding(binding);
            }
        },
    };

    collection['innerhtml'] = component['innerhtml'];
    collection['select'] = {
        modifyElement: function (context, uiElement, resolved) {
            uiElement.setAttribute("type", "select");

            //preview this binding plan to link option to value as lookup!!
            var sBindRule = utils.unComment(uiElement.getAttribute("data-bind"));
            var bindingPlan = utils.stylingStringToObject(sBindRule);

            if (bindingPlan.value && bindingPlan.options) {
                var value = context.getProperty(bindingPlan.value);
                var options = context[bindingPlan.options];
                value['dynamicOptions'] = options;
            }
            return uiElement;
        }
    }
    collection['select']['options'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var collection = resolved.collection;
            var property = resolved.property || resolved.propertyPeek;

            var sOptionRule = uiElement.getAttribute("data-option");
            var stylingplan = utils.stylingStringToObject(sOptionRule);
 
            var binding = function (p) {
                //assume the metaData always returns a promise that May execure right away..
                var html = bi.generateHtmlForSelectOptions(context, collection, stylingplan);
                $element.html(html); //this is a Select element
            };
            if (utils.isaCollection(collection)) {
                collection.getProperty('count').addBinding(binding);
            }
            if (utils.isaProperty(property)) {
                property.addBinding(binding);
            }
        },
    }


    var property = createScopeRule('property');
    property['attribute'] = managed['attribute'];
    property['text'] = component['text'];
    property['innertext'] = component['innertext'];
    property['select'] = component['select'];
    property['select']['options'] = component['select']['options'];

    property['input'] = component['input'];
    property['input']['value'] = component['input']['value'];
    property['input']['placeholder'] = component['input']['placeholder'];

    var propertyPeek = createScopeRule('propertyPeek');
    propertyPeek['disabled'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var newValue = p.status !== undefined && p.value !== undefined;
                var oldValue = p.status === undefined && p.value !== undefined;
                var noValue = p.status === undefined && p.value === undefined;

                if (newValue) { //looking for a truthy value here
                    $element.attr("disabled", "disabled");
                } else if (oldValue || noValue) {
                    $element.removeAttr("disabled")
                }
            };
            property.addBinding(binding);
        },
    };

    propertyPeek['enabled'] = {
        writeToElement: function (context, uiElement, resolved) {
            var $element = $(uiElement);
            var property = resolved.property || resolved.propertyPeek;
            var meta = resolved.meta;
            var binding = function (p) {
                var oldValue = p.status === undefined && p.value !== undefined;
                var noValue = p.status === undefined && p.value === undefined;

                if (p.value == undefined || p.value == 0) { //looking for a truthy value here
                    $element.removeAttr("disabled")
                } else if (oldValue || noValue) {
                    $element.attr("disabled", "disabled");
                }
            };
            property.addBinding(binding);
        },
    };
   

    ns.computeBindingScope = function (context, uiElement, aspect, resolvedTo) {

        var elementName = uiElement.localName;
        var bindingScope = findScopeRule('component'); //the default scope is assume primitive bindings

        //remember to call modifyElement if it exist...
        if (utils.isaProperty(resolvedTo.propertyPeek)) {
            bindingScope = findScopeRule('propertyPeek');
        }
        else if (utils.isaComponent(context)) {
            bindingScope = findScopeRule('component');
        }
        else if (utils.isaCollection(context)) {
            bindingScope = findScopeRule('collection');
        }
        else if (utils.isaProperty(context)) {
            bindingScope = findScopeRule('property');
        }


        //hard rule...
        if (!resolvedTo.property) {
            if (resolvedTo.formula && utils.isManaged(context)) {
                //Maybe if not necessary to compute property  var result = resolvedValue(context, resolved);

                var tempName = utils.createID('temp_');
                var property = context.createProperty(tempName, resolvedTo.formula);
                resolvedTo.property = property;
            }
            else if (resolvedTo.slot) {
                bindingScope = findScopeRule('unmanaged');
            }
        }



        //last rule only goto element if it contains the aspect you are looking for

        //could this be details about an element? check and modify
        var detailBindingScope = bindingScope[elementName];
        if ( utils.hasAspect(detailBindingScope,aspect) ) {
            if (detailBindingScope.modifyElement) {
                detailBindingScope.modifyElement(context, uiElement, resolvedTo)

                //look for type attribute..
                var type = uiElement.hasAttribute('type') ? uiElement.getAttribute('type') : undefined;
                if (type && detailBindingScope[type]) {
                    var typedBindingScope = detailBindingScope[type];
                    if (typedBindingScope.modifyElement) {
                        typedBindingScope.modifyElement(context, uiElement, resolvedTo)
                    }

                    if (utils.hasAspect(typedBindingScope,aspect)) {
                        return typedBindingScope;
                    }
                }
            }
            return detailBindingScope;
        }
        
        return bindingScope;
    }

    ns.managedBinding = function (context, reference, uiElement, aspect) {

        if (reference && reference[0] === '?') {
            $(uiElement).hide();
        }

        var resolvedTo = context.resolveProperty(reference);
        if (Object.keys(resolvedTo).length == 0 ) {
            return false;
        }

        resolvedTo.reference = reference;
        resolvedTo.aspect = aspect;

        var bindingScope = ns.computeBindingScope(context, uiElement, aspect, resolvedTo);

        //first verify that the binding scope supports the aspect...
        var details = utils.getAspectOrDefault( bindingScope, aspect);
        details = details ? details : uiElement.hasAttribute(aspect) ? bindingScope['attribute'] : undefined;

        if (aspect.startsWith('data_')) {
            resolvedTo.aspect = 'data-' + aspect.substring(5);
            details = bindingScope['attribute'];
        }

        if (details === undefined) {
            var error = "Cannot find binding rule\n Context: {0}\n Scope: {1}\n Aspect: {2}\n Reference: {3}\n Element {4}";
            var source = utils.isManaged(context) ? context.myName : JSON.stringify(context);
            error = error.format(source, bindingScope.myName, aspect, reference, uiElement.toString());
            //throw Error(error);
            return false;
        }



        if (details.writeToElement) {
            details.writeToElement(context, uiElement, resolvedTo)
        }

        if (details.readFromElement) {
            var trigger = uiElement.getAttribute("data-update");
            details.readFromElement(context, uiElement, trigger, resolvedTo);
            var speech = uiElement.getAttribute("x-webkit-speech");
            if (speech) {
                details.readFromElement(context, uiElement, 'onChange', resolvedTo);
            }
        }
        return true;
    }

    ns.unmanagedBinding = function (context, reference, uiElement, aspect) {

        var bindingScope = findScopeRule('unmanaged'); //the default scope is assume primitive bindings
        //first verify that the binding scope supports the aspect...
        

        var details = bindingScope[aspect.toLowerCase()];
        if (details === undefined) {
            details= bindingScope['attribute'];
            //report that bindingScope does not know how to link to this aspect of an element
            return false;
        }

        var resolvedTo = {}; //(reference);

        if (details.writeToElement) {
            details.writeToElement(context, uiElement, resolvedTo)
        }

        if (details.readFromElement) {
            var trigger = uiElement.getAttribute("data-update");
            details.readFromElement(context, uiElement, trigger, resolvedTo)
        }
        return true;
    }

    ns.customBinding = function (context, reference, uiElement, aspect) {

        var custom = ns.customBindings[aspect];  //rename custom binding or directive??
        if (custom === undefined) return false;

       var resolvedTo = context.resolveProperty(reference);

        if (resolvedTo.property) {
            var property = resolvedTo.property;
            custom.init(uiElement, property, reference);
            var binding = function () { custom.update(uiElement, property, reference) };
            property.addBinding(binding);
            return true;
        }
    }



    var generic = createScopeRule('generic');
    generic['context'] = {
        writeToElement: function (context, uiElement, resolved, html) {
            var property = resolved.property;
            var component = resolved.component;

            var binding = bi.createContextBindingFunction(context, resolved, uiElement, html);
            if (utils.isaProperty(property)) {
                property.addBinding(binding);
            }
            if (component) {
                binding();
            }
        },
    };
    generic['repeater'] = {
        writeToElement: function (context, uiElement, resolved, html) {
            //ns.trace && ns.trace.funcTrace(arguments, 'writeToElement');

            var property = resolved.property;
            var collection = resolved.collection;
            var component = resolved.component;

            var binding = bi.createRepeaterBindingFunction(context, resolved, uiElement, html);

            //bind to collection if exist as value of propertu
            collection = collection ? collection : property ? property.getValue(resolved.meta) : undefined;


            if (utils.isaCollection(collection)) {
                var refresh = !utils.isaProperty(property);
                collection.getProperty('count').addBinding(binding, refresh);
            }
            if (utils.isaProperty(property)) {
                property.addBinding(binding);
            }
            if (component) {
                binding();
            }
        },
    };

    //simple implementation that could be overridden
    ns.getTemplate = function (id, defaultTemplate) {
        return defaultTemplate;
    }

    bi.appendRepeaterTemplate = function (item, uiParent, html) {
        //ns.trace && ns.trace.funcTrace(arguments, 'appendRepeaterTemplate');
        var elements = jQuery.parseHTML(html);
        $(uiParent).append(elements);

        var context = item;
        elements.forEach(function (element) {
            ns.bindTo(context, element);
        });

        return elements;
    }


    bi.createRepeaterBindingFunction = function (context, resolved, uiElement, outerHTML) {
        //ns.trace && ns.trace.funcTrace(arguments, 'createRepeaterBindingFunction');

        //var template = utils.cleanTemplateHtml(uiElement.outerHTML.trim());
        var defaultTemplate = outerHTML;


        //You may need to cashe this inline template
        var idTemplate = $(uiElement).attr("data-template");
        var parentElement = uiElement.parentNode;
        parentElement.removeChild(uiElement);

        return function () {
            //ns.trace && ns.trace.funcTrace(arguments, 'function used in binding');

            var property = resolved.property;
            var collection = resolved.collection;

            //var list = collection ? collection : property ? property.getValue(resolved.meta) : undefined;
            var list = property ? property.getValue(resolved.meta) : collection;



            //wrap arrays is temp collections

            if (utils.isArray(list)) list = new ns.Collection(list);
            if (utils.isaComponent(list)) list = new ns.Collection([list]);
            if (list === undefined && utils.isaComponent(component)) list = new ns.Collection([component]);

            //look if this is a false item and apply an existance test
            if (!list) {
                //delete this stuff..
                parentElement.innertext = '';
                //while (parentElement.hasChildNodes()) {
                //    parentElement.removeChild(parentElement.lastChild);
                //}

                return;
            }

            if (list && list.indexName) {  //for now delete everything and rerender
                //purgeUnusedItems(lookup);                
                while (parentElement.hasChildNodes()) {
                    parentElement.removeChild(parentElement.lastChild);
                } 
            }
 

            //add code to get all data guids and put in dictionary
            parentElement.innertext = '';
            var lookup = createItemDictionary(parentElement);

            function ApplyTemplateToArray(array, html) {
                //ns.trace && ns.trace.funcTrace(arguments, 'ApplyTemplateToArray');
                ns.runWithUIRefreshLock(function () {
                    array && array.forEach(function (item) {
                        if (!doesItemExist(item, lookup)) {
                            var boundItems = bi.appendRepeaterTemplate(item, parentElement, html);
                            boundItems.map(function (newlyBound) {
                                var id = item && item.getID ? item.getID() : item.toString();
                                $(newlyBound).attr("data-guid", id);
                            });
                        }
                    });
                });
            }

            //this forces the template to be located when the function is executed
            var myTemplate = ns.getTemplate(idTemplate, defaultTemplate);

            //at this point a template can just be text or a property object
            //create the new ones and keep store

            if (utils.isaPromise(myTemplate) && list) {
                myTemplate.continueWith(function (newValue) {
                    ApplyTemplateToArray(list, newValue);
                });
            }
            else if (list) {  //assume template is string of html, probably an inline template...
                ApplyTemplateToArray(list, myTemplate);
            }

            //delete what is not there be careful of scope
            purgeUnusedItems(lookup);

            //var text = parentElement.innerHTML; 
        }

    };


    bi.insertContextTemplate = function (item, uiParent, html) {
        var elements = jQuery.parseHTML(html);

        $(uiParent).html('');

        var context = item;
        $(uiParent).append(elements);

        elements.forEach(function (element) {
            ns.bindTo(context, element);
        });

        return elements;
    }


    bi.createContextBindingFunction = function (context, resolved, uiElement, outerHTML) {

        //var template = utils.cleanTemplateHtml(uiElement.outerHTML.trim());
        var defaultTemplate = outerHTML;


        //You may need to cashe this inline template
        var idTemplate = $(uiElement).attr("data-template");
        var parentElement = uiElement.parentNode;
        parentElement.removeChild(uiElement);

        return function () {

            var property = resolved.property;
            var component = resolved.component;

            var source = component ? component : property ? property.getValue(resolved.meta) : undefined;

            //look if this is a false item and apply an existance test
            if (!source) {
                //delete this stuff..
                parentElement.innertext = '';
                return;
            }

            function ApplyTemplateToContext(obj, html) {
                ns.runWithUIRefreshLock(function () {
                    var boundItems = bi.insertContextTemplate(obj, parentElement, html);
                    boundItems.map(function (newlyBound) {
                        var id = obj && obj.getID ? obj.getID() : obj.toString();
                        $(newlyBound).attr("data-guid", id);
                    });                       
                });
            }

            //this forces the template to be located when the function is executed
            var myTemplate = ns.getTemplate(idTemplate, defaultTemplate);

            //at this point a template can just be text or a property object
            //create the new ones and keep store

            if (utils.isaPromise(myTemplate) && source) {
                myTemplate.continueWith(function (newValue) {
                    ApplyTemplateToContext(source, newValue);
                });
            }
            else if (source) {  //assume template is string of html, probably an inline template...
                ApplyTemplateToContext(source, myTemplate);
            }
        }
    };


    ns.contextBinding = function (context, reference, uiElement, aspect) {

        var resolvedTo = context.resolveProperty(reference);

        var bindingScope = findScopeRule('generic');
        var details = bindingScope['context'];


        if (details === undefined) {
            var error = "Cannot find binding rule\n Context: {0}\n Scope: {1}\n Aspect: {2}\n Reference: {3}\n Element {4}";
            var source = utils.isManaged(context) ? context.myName : JSON.stringify(context);
            error = error.format(source, bindingScope.myName, aspect, reference, uiElement.toString());
            //throw Error(error);
            return false;
        }

        //var html = utils.cleanTemplateHtml(uiElement.outerHTML.trim());
        var html = utils.cleanTemplateHtml(uiElement.innerHTML.trim());


        if (details.writeToElement) {
            details.writeToElement(context, uiElement, resolvedTo, html)
        }

        if (details.readFromElement) {
            var trigger = uiElement.getAttribute("data-update");
            details.readFromElement(context, uiElement, trigger, resolvedTo)
        }
        return true;
    }

    ns.repeaterBinding = function (context, reference, uiElement, aspect) {

        var resolvedTo = context.resolveProperty(reference);

        var bindingScope = findScopeRule('generic');
        var details = bindingScope['repeater'];


        if (details === undefined) {
            var error = "Cannot find binding rule\n Context: {0}\n Scope: {1}\n Aspect: {2}\n Reference: {3}\n Element {4}";
            var source = utils.isManaged(context) ? context.myName : JSON.stringify(context);
            error = error.format(source, bindingScope.myName, aspect, reference, uiElement.toString());
            //throw Error(error);
            return false;
        }

        //var html = utils.cleanTemplateHtml(uiElement.outerHTML.trim());
        var html = utils.cleanTemplateHtml(uiElement.innerHTML.trim());


        if (details.writeToElement) {
            details.writeToElement(context, uiElement, resolvedTo, html)
        }

        if (details.readFromElement) {
            var trigger = uiElement.getAttribute("data-update");
            details.readFromElement(context, uiElement, trigger, resolvedTo)
        }
        return true;
    }


    ns.createBinding = function (uiElement, bindingPlan, context) {

        var bindingRules = ns.utils.isManaged(context) ? ns.managedBinding : ns.unmanagedBinding;

        var success = false;
        utils.forEachValue(bindingPlan, function (reference, aspect) {
            if (!ns.customBinding(context, reference, uiElement, aspect)) {
                success = bindingRules(context, reference, uiElement, aspect) || success;
            }
        });
        return success;
    }



    bi.createClassBindingEvent = function (sClass, property, uiElement, meta) {
        return function () {
            var oValue = property.getValue(meta);
            var $element = $(uiElement);
            var exist = $element.hasClass(sClass);
            if (sClass) {
                if (oValue && !exist) { //looking for a truthy value here
                    $element.addClass(sClass);
                }
                else if (!oValue && exist) {
                    $element.removeClass(sClass)
                }
            }
        };
    }

    ns.createStyleBinding = function (uiElement, stylingPlan, context) {

        ns.utils.forEachValue(stylingPlan, function (sClass, sProperty) {
            var ref = context.resolveProperty(sProperty);

            //this is how we set the class attribute.
            var binding = bi.createClassBindingEvent(sClass, ref.property, uiElement, ref.meta);
            ref.property.addBinding(binding);
        });

        bi.clearDataCSS(uiElement, context);
    }

    bi.clearDataCSS = function (uiElement, context) {
        if (uiElement.hasAttribute && uiElement.hasAttribute("data-css")) {
            var sBind = uiElement.getAttribute("data-css");
            uiElement.setAttribute("data-css", '//' + sBind);

            if (utils.isManaged(context)) {
                var sSource = context.asReference();
                uiElement.setAttribute("data-css-source", sSource);
            }
            return true;
        }
    }

    ns.bind = function (obj, element) {
        if (element && element.hasAttribute) {
            if (element.hasAttribute("data-context")) {
                var sContextRule = element.getAttribute("data-context");
                if (sContextRule && !utils.isComment(sContextRule)) {
                    sContextRule = sContextRule.trim();
                    element.setAttribute("data-context", utils.comment(sContextRule));
                    ns.contextBinding(obj, sContextRule, element, 'context');
                }
            }

            if (element.hasAttribute("data-repeater")) {
                var sRepeaterRule = element.getAttribute("data-repeater");
                if (sRepeaterRule && !utils.isComment(sRepeaterRule)) {
                    sRepeaterRule = sRepeaterRule.trim();
                    element.setAttribute("data-repeater", utils.comment(sRepeaterRule));
                    ns.repeaterBinding(obj, sRepeaterRule, element, 'repeater');
                }
            }

            if (element.hasAttribute("data-bind")) {
                var sBindRule = element.getAttribute("data-bind");
                if (!utils.isComment(sBindRule)) {
                    sBindRule = sBindRule.trim();
                    element.setAttribute("data-bind", utils.comment(sBindRule));
                    var bindingPlan = utils.bindingStringToObject(sBindRule);
                    if (bindingPlan) {
                        if (!ns.createBinding(element, bindingPlan, obj)) {
                            element.setAttribute("data-bind", utils.unComment(sBindRule));
                        };
                    }
                }
            }
            //maybe this need to be done in post binding??
            //returns a json dictionary        
            if (element.hasAttribute("data-css")) {
                var cssRule = element.getAttribute("data-css");
                if (!utils.isComment(cssRule)) {
                    cssRule = cssRule.trim();
                    element.setAttribute("data-css", utils.comment(cssRule));
                    var stylingPlan = utils.stylingStringToObject(cssRule);
                    if (stylingPlan) ns.createStyleBinding(element, stylingPlan, obj);
                }
            }
        }
    }

    function getAllBindableChildren(source, list, deep) {
        var children = source.children;
        var length = children ? children.length : 0

        for (var i = 0; i < length; i++) {
            var child = children[i];
            if (child.nodeType == 1) {
                if (child.hasAttribute && child.hasAttribute("data-context")) {
                    var sContextRule = child.getAttribute("data-context");
                    if (utils.isComment(sContextRule)) continue;

                    list.push(child)
                }
                else if (child.hasAttribute && child.hasAttribute("data-repeater")) {
                    var sRepeaterRule = child.getAttribute("data-repeater");
                    if (utils.isComment(sRepeaterRule)) continue;

                    list.push(child)
                }
                else if (child.hasAttribute && child.hasAttribute("data-bind")) {
                    var sBindRule = child.getAttribute("data-bind");
                    if (utils.isComment(sBindRule)) continue;

                    list.push(child)
                    if (deep) getAllBindableChildren(child, list, deep);
                }
                else if (child && child.children && child.children.length) {
                    getAllBindableChildren(child, list, deep)
                }
            }
        }
        return list;
    }

    ns.getBindableElements = function (source) {
        var results = [];

        if (source.hasAttribute && source.hasAttribute("data-bind")) {
            var sBindRule = source.getAttribute("data-bind");
            if (!utils.isComment(sBindRule)) results.push(source)
        }


        results = getAllBindableChildren(source, results, true);
    
        return results;
    }

    ns.bindTo = function (obj, target) {
        var element = target || document.body;
        var children = ns.getBindableElements(element);
        if (children.length == 0) return;


        //if there are not children, then bind directly
        ns.runWithUIRefreshLock(function () {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                ns.bind(obj, child);
            };
        });

        return children;
    }


    function getAllLinkableChildren(source, list) {
        var children = source.children;
        var length = children ? children.length : 0

        for (var i = 0; i < length; i++) {
            var child = children[i];
            if (child.nodeType == 1) {
                if (child.hasAttribute && child.hasAttribute("data-link")) {
                    var sLinkRule = child.getAttribute("data-link");
                    if (sLinkRule.startsWith('//')) continue;

                    list.push(child)
                    getAllLinkableChildren(child, list);
                }
                else if (child && child.children && child.children.length) {
                    getAllLinkableChildren(child, list)
                }
            }
        }
        return list;
    }

    ns.linkTo = function (obj, target) {

        var uiElements = getAllLinkableChildren(target, []);
        ns.runWithUIRefreshLock(function () {

            for (var i = 0; i < uiElements.length; i++) {
                var child = uiElements[i];
                var sLinkRule = child.getAttribute("data-link");

                var context = ns.linkQueue[sLinkRule];
                //root.bindTo(context, child);
                if (context)
                    ns.bind(context, child);
                
            }
        });
        //deleting this queue was bad on second render
        ns.linkQueue = {};
    }


    ns.linkQueue = {};
    ns.queuelinkItem = function (obj) {
        var id = obj.getID();
        ns.linkQueue[id] = obj;
    }

    if (!ns.Component.prototype.bindTo$) {
        ns.Component.prototype.bindTo$ = function (selector) {
            var comp = this;
            ns.runWithUIRefreshLock(function () {
                $(selector).each(function (index, element) {
                    ns.bindTo(comp, element);
                });
            });
            return comp;
        };
    }

    ns.bindTo$ = function (comp, selector) {
        var reference = "#{0} {1}".format(comp.myName, utils.asString(selector));
        comp.bindTo$(reference);
    }

    ns.bindComponentByid = function (comp) {
        if (comp === undefined) return;

        var members = comp.elements;
        if (members === undefined) {
            var selector = "#{0},#{1}".format(comp.getID(),comp.myName);
            $(selector).each(function (i, element) {
                ns.bindTo(comp, element, true);
            });
        }
        else {
            members.forEach(ns.bindComponentByid);
        }
    }

    ns.bindModel = function (comp) {
        if (comp === undefined) return;
        var all = comp.selectComponents();
        all.forEach(function (item) {
            ns.bindComponentByid(item);
        });
        ns.bindComponentByid(comp);
    }

    if (!ns.Component.prototype.bindModelTo$) {
        ns.Component.prototype.bindModelTo$ = function (selector) {
            var comp = this;
            ns.runWithUIRefreshLock(function () {
                $(selector).each(function (index, element) {
                    ns.bindModel(comp, element);
                });
            });
            return comp;
        };
    }

    //need a way un unbind lets attach the funct to a data-attribute
    ns.bindEvent = function (uiElement, event, comp, callback) {
        //$('#foo').bind('click', handler);
        //$('#foo').unbind('click', handler);
        var handler = function () { ns.runWithUIRefreshLock(callback) };
        $(uiElement).on(event, handler);
    }

    if (!ns.Component.prototype.bindToEvent$) {
        ns.Component.prototype.bindToEvent$ = function (selector, event, callback) {
            var comp = this;
            $(selector).each(function (index, element) {
                ns.bindEvent(element, event, comp, callback);
            });
            return comp;
        };
    }


    return ns;

}(Foundry, jQuery));
///#source 1 1 /Foundry/handlebars.min.js
// lib/handlebars/base.js
/*jshint eqnull:true*/this.Handlebars={},function(e){e.VERSION="1.0.rc.1",e.helpers={},e.partials={},e.registerHelper=function(e,t,n){n&&(t.not=n),this.helpers[e]=t},e.registerPartial=function(e,t){this.partials[e]=t},e.registerHelper("helperMissing",function(e){if(arguments.length===2)return undefined;throw new Error("Could not find property '"+e+"'")});var t=Object.prototype.toString,n="[object Function]";e.registerHelper("blockHelperMissing",function(r,i){var s=i.inverse||function(){},o=i.fn,u="",a=t.call(r);return a===n&&(r=r.call(this)),r===!0?o(this):r===!1||r==null?s(this):a==="[object Array]"?r.length>0?e.helpers.each(r,i):s(this):o(r)}),e.K=function(){},e.createFrame=Object.create||function(t){e.K.prototype=t;var n=new e.K;return e.K.prototype=null,n},e.registerHelper("each",function(t,n){var r=n.fn,i=n.inverse,s=0,o="",u;n.data&&(u=e.createFrame(n.data));if(t&&typeof t=="object")if(t instanceof Array)for(var a=t.length;s<a;s++)u&&(u.index=s),o+=r(t[s],{data:u});else for(var f in t)t.hasOwnProperty(f)&&(u&&(u.key=f),o+=r(t[f],{data:u}),s++);return s===0&&(o=i(this)),o}),e.registerHelper("if",function(r,i){var s=t.call(r);return s===n&&(r=r.call(this)),!r||e.Utils.isEmpty(r)?i.inverse(this):i.fn(this)}),e.registerHelper("unless",function(t,n){var r=n.fn,i=n.inverse;return n.fn=i,n.inverse=r,e.helpers["if"].call(this,t,n)}),e.registerHelper("with",function(e,t){return t.fn(e)}),e.registerHelper("log",function(t){e.log(t)})}(this.Handlebars);var handlebars=function(){function n(){this.yy={}}var e={trace:function(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,statements:6,simpleInverse:7,statement:8,openInverse:9,closeBlock:10,openBlock:11,mustache:12,partial:13,CONTENT:14,COMMENT:15,OPEN_BLOCK:16,inMustache:17,CLOSE:18,OPEN_INVERSE:19,OPEN_ENDBLOCK:20,path:21,OPEN:22,OPEN_UNESCAPED:23,OPEN_PARTIAL:24,params:25,hash:26,DATA:27,param:28,STRING:29,INTEGER:30,BOOLEAN:31,hashSegments:32,hashSegment:33,ID:34,EQUALS:35,pathSegments:36,SEP:37,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",27:"DATA",29:"STRING",30:"INTEGER",31:"BOOLEAN",34:"ID",35:"EQUALS",37:"SEP"},productions_:[0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[17,1],[25,2],[25,1],[28,1],[28,1],[28,1],[28,1],[28,1],[26,1],[32,2],[32,1],[33,3],[33,3],[33,3],[33,3],[33,3],[21,1],[36,3],[36,1]],performAction:function(t,n,r,i,s,o,u){var a=o.length-1;switch(s){case 1:return o[a-1];case 2:this.$=new i.ProgramNode(o[a-2],o[a]);break;case 3:this.$=new i.ProgramNode(o[a]);break;case 4:this.$=new i.ProgramNode([]);break;case 5:this.$=[o[a]];break;case 6:o[a-1].push(o[a]),this.$=o[a-1];break;case 7:this.$=new i.BlockNode(o[a-2],o[a-1].inverse,o[a-1],o[a]);break;case 8:this.$=new i.BlockNode(o[a-2],o[a-1],o[a-1].inverse,o[a]);break;case 9:this.$=o[a];break;case 10:this.$=o[a];break;case 11:this.$=new i.ContentNode(o[a]);break;case 12:this.$=new i.CommentNode(o[a]);break;case 13:this.$=new i.MustacheNode(o[a-1][0],o[a-1][1]);break;case 14:this.$=new i.MustacheNode(o[a-1][0],o[a-1][1]);break;case 15:this.$=o[a-1];break;case 16:this.$=new i.MustacheNode(o[a-1][0],o[a-1][1]);break;case 17:this.$=new i.MustacheNode(o[a-1][0],o[a-1][1],!0);break;case 18:this.$=new i.PartialNode(o[a-1]);break;case 19:this.$=new i.PartialNode(o[a-2],o[a-1]);break;case 20:break;case 21:this.$=[[o[a-2]].concat(o[a-1]),o[a]];break;case 22:this.$=[[o[a-1]].concat(o[a]),null];break;case 23:this.$=[[o[a-1]],o[a]];break;case 24:this.$=[[o[a]],null];break;case 25:this.$=[[new i.DataNode(o[a])],null];break;case 26:o[a-1].push(o[a]),this.$=o[a-1];break;case 27:this.$=[o[a]];break;case 28:this.$=o[a];break;case 29:this.$=new i.StringNode(o[a]);break;case 30:this.$=new i.IntegerNode(o[a]);break;case 31:this.$=new i.BooleanNode(o[a]);break;case 32:this.$=new i.DataNode(o[a]);break;case 33:this.$=new i.HashNode(o[a]);break;case 34:o[a-1].push(o[a]),this.$=o[a-1];break;case 35:this.$=[o[a]];break;case 36:this.$=[o[a-2],o[a]];break;case 37:this.$=[o[a-2],new i.StringNode(o[a])];break;case 38:this.$=[o[a-2],new i.IntegerNode(o[a])];break;case 39:this.$=[o[a-2],new i.BooleanNode(o[a])];break;case 40:this.$=[o[a-2],new i.DataNode(o[a])];break;case 41:this.$=new i.IdNode(o[a]);break;case 42:o[a-2].push(o[a]),this.$=o[a-2];break;case 43:this.$=[o[a]]}},table:[{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,27:[1,24],34:[1,26],36:25},{17:27,21:23,27:[1,24],34:[1,26],36:25},{17:28,21:23,27:[1,24],34:[1,26],36:25},{17:29,21:23,27:[1,24],34:[1,26],36:25},{21:30,34:[1,26],36:25},{1:[2,1]},{6:31,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,32],21:23,27:[1,24],34:[1,26],36:25},{10:33,20:[1,34]},{10:35,20:[1,34]},{18:[1,36]},{18:[2,24],21:41,25:37,26:38,27:[1,45],28:39,29:[1,42],30:[1,43],31:[1,44],32:40,33:46,34:[1,47],36:25},{18:[2,25]},{18:[2,41],27:[2,41],29:[2,41],30:[2,41],31:[2,41],34:[2,41],37:[1,48]},{18:[2,43],27:[2,43],29:[2,43],30:[2,43],31:[2,43],34:[2,43],37:[2,43]},{18:[1,49]},{18:[1,50]},{18:[1,51]},{18:[1,52],21:53,34:[1,26],36:25},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:54,34:[1,26],36:25},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:41,26:55,27:[1,45],28:56,29:[1,42],30:[1,43],31:[1,44],32:40,33:46,34:[1,47],36:25},{18:[2,23]},{18:[2,27],27:[2,27],29:[2,27],30:[2,27],31:[2,27],34:[2,27]},{18:[2,33],33:57,34:[1,58]},{18:[2,28],27:[2,28],29:[2,28],30:[2,28],31:[2,28],34:[2,28]},{18:[2,29],27:[2,29],29:[2,29],30:[2,29],31:[2,29],34:[2,29]},{18:[2,30],27:[2,30],29:[2,30],30:[2,30],31:[2,30],34:[2,30]},{18:[2,31],27:[2,31],29:[2,31],30:[2,31],31:[2,31],34:[2,31]},{18:[2,32],27:[2,32],29:[2,32],30:[2,32],31:[2,32],34:[2,32]},{18:[2,35],34:[2,35]},{18:[2,43],27:[2,43],29:[2,43],30:[2,43],31:[2,43],34:[2,43],35:[1,59],37:[2,43]},{34:[1,60]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,61]},{18:[1,62]},{18:[2,21]},{18:[2,26],27:[2,26],29:[2,26],30:[2,26],31:[2,26],34:[2,26]},{18:[2,34],34:[2,34]},{35:[1,59]},{21:63,27:[1,67],29:[1,64],30:[1,65],31:[1,66],34:[1,26],36:25},{18:[2,42],27:[2,42],29:[2,42],30:[2,42],31:[2,42],34:[2,42],37:[2,42]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,36],34:[2,36]},{18:[2,37],34:[2,37]},{18:[2,38],34:[2,38]},{18:[2,39],34:[2,39]},{18:[2,40],34:[2,40]}],defaultActions:{16:[2,1],24:[2,25],38:[2,23],55:[2,21]},parseError:function(t,n){throw new Error(t)},parse:function(t){function v(e){r.length=r.length-2*e,i.length=i.length-e,s.length=s.length-e}function m(){var e;return e=n.lexer.lex()||1,typeof e!="number"&&(e=n.symbols_[e]||e),e}var n=this,r=[0],i=[null],s=[],o=this.table,u="",a=0,f=0,l=0,c=2,h=1;this.lexer.setInput(t),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,typeof this.lexer.yylloc=="undefined"&&(this.lexer.yylloc={});var p=this.lexer.yylloc;s.push(p);var d=this.lexer.options&&this.lexer.options.ranges;typeof this.yy.parseError=="function"&&(this.parseError=this.yy.parseError);var g,y,b,w,E,S,x={},T,N,C,k;for(;;){b=r[r.length-1];if(this.defaultActions[b])w=this.defaultActions[b];else{if(g===null||typeof g=="undefined")g=m();w=o[b]&&o[b][g]}if(typeof w=="undefined"||!w.length||!w[0]){var L="";if(!l){k=[];for(T in o[b])this.terminals_[T]&&T>2&&k.push("'"+this.terminals_[T]+"'");this.lexer.showPosition?L="Parse error on line "+(a+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+k.join(", ")+", got '"+(this.terminals_[g]||g)+"'":L="Parse error on line "+(a+1)+": Unexpected "+(g==1?"end of input":"'"+(this.terminals_[g]||g)+"'"),this.parseError(L,{text:this.lexer.match,token:this.terminals_[g]||g,line:this.lexer.yylineno,loc:p,expected:k})}}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+b+", token: "+g);switch(w[0]){case 1:r.push(g),i.push(this.lexer.yytext),s.push(this.lexer.yylloc),r.push(w[1]),g=null,y?(g=y,y=null):(f=this.lexer.yyleng,u=this.lexer.yytext,a=this.lexer.yylineno,p=this.lexer.yylloc,l>0&&l--);break;case 2:N=this.productions_[w[1]][1],x.$=i[i.length-N],x._$={first_line:s[s.length-(N||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(N||1)].first_column,last_column:s[s.length-1].last_column},d&&(x._$.range=[s[s.length-(N||1)].range[0],s[s.length-1].range[1]]),S=this.performAction.call(x,u,f,a,this.yy,w[1],i,s);if(typeof S!="undefined")return S;N&&(r=r.slice(0,-1*N*2),i=i.slice(0,-1*N),s=s.slice(0,-1*N)),r.push(this.productions_[w[1]][0]),i.push(x.$),s.push(x._$),C=o[r[r.length-2]][r[r.length-1]],r.push(C);break;case 3:return!0}}return!0}},t=function(){var e={EOF:1,parseError:function(t,n){if(!this.yy.parser)throw new Error(t);this.yy.parser.parseError(t,n)},setInput:function(e){return this._input=e,this._more=this._less=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var e=this._input[0];this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e;var t=e.match(/(?:\r\n?|\n).*/g);return t?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},unput:function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t-1),this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this},more:function(){return this._more=!0,this},less:function(e){this.unput(this.match.slice(e))},pastInput:function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?"...":"")+e.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var e=this.pastInput(),t=(new Array(e.length+1)).join("-");return e+this.upcomingInput()+"\n"+t+"^"},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var e,t,n,r,i,s;this._more||(this.yytext="",this.match="");var o=this._currentRules();for(var u=0;u<o.length;u++){n=this._input.match(this.rules[o[u]]);if(n&&(!t||n[0].length>t[0].length)){t=n,r=u;if(!this.options.flex)break}}if(t){s=t[0].match(/(?:\r\n?|\n).*/g),s&&(this.yylineno+=s.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:s?s[s.length-1].length-s[s.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],e=this.performAction.call(this,this.yy,this,o[r],this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1);if(e)return e;return}return this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var t=this.next();return typeof t!="undefined"?t:this.lex()},begin:function(t){this.conditionStack.push(t)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function(t){this.begin(t)}};return e.options={},e.performAction=function(t,n,r,i){var s=i;switch(r){case 0:n.yytext.slice(-1)!=="\\"&&this.begin("mu"),n.yytext.slice(-1)==="\\"&&(n.yytext=n.yytext.substr(0,n.yyleng-1),this.begin("emu"));if(n.yytext)return 14;break;case 1:return 14;case 2:return n.yytext.slice(-1)!=="\\"&&this.popState(),n.yytext.slice(-1)==="\\"&&(n.yytext=n.yytext.substr(0,n.yyleng-1)),14;case 3:return n.yytext=n.yytext.substr(0,n.yyleng-4),this.popState(),15;case 4:return 24;case 5:return 16;case 6:return 20;case 7:return 19;case 8:return 19;case 9:return 23;case 10:return 23;case 11:this.popState(),this.begin("com");break;case 12:return n.yytext=n.yytext.substr(3,n.yyleng-5),this.popState(),15;case 13:return 22;case 14:return 35;case 15:return 34;case 16:return 34;case 17:return 37;case 18:break;case 19:return this.popState(),18;case 20:return this.popState(),18;case 21:return n.yytext=n.yytext.substr(1,n.yyleng-2).replace(/\\"/g,'"'),29;case 22:return n.yytext=n.yytext.substr(1,n.yyleng-2).replace(/\\'/g,"'"),29;case 23:return n.yytext=n.yytext.substr(1),27;case 24:return 31;case 25:return 31;case 26:return 30;case 27:return 34;case 28:return n.yytext=n.yytext.substr(1,n.yyleng-2),34;case 29:return"INVALID";case 30:return 5}},e.rules=[/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\{\{>)/,/^(?:\{\{#)/,/^(?:\{\{\/)/,/^(?:\{\{\^)/,/^(?:\{\{\s*else\b)/,/^(?:\{\{\{)/,/^(?:\{\{&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{)/,/^(?:=)/,/^(?:\.(?=[} ]))/,/^(?:\.\.)/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}\}\})/,/^(?:\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@[a-zA-Z]+)/,/^(?:true(?=[}\s]))/,/^(?:false(?=[}\s]))/,/^(?:[0-9]+(?=[}\s]))/,/^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/],e.conditions={mu:{rules:[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],inclusive:!1},emu:{rules:[2],inclusive:!1},com:{rules:[3],inclusive:!1},INITIAL:{rules:[0,1,30],inclusive:!0}},e}();return e.lexer=t,n.prototype=e,e.Parser=n,new n}();typeof require!="undefined"&&typeof exports!="undefined"&&(exports.parser=handlebars,exports.Parser=handlebars.Parser,exports.parse=function(){return handlebars.parse.apply(handlebars,arguments)},exports.main=function(t){if(!t[1])throw new Error("Usage: "+t[0]+" FILE");var n,r;return typeof process!="undefined"?n=require("fs").readFileSync(require("path").resolve(t[1]),"utf8"):n=require("file").path(require("file").cwd()).join(t[1]).read({charset:"utf-8"}),exports.parser.parse(n)},typeof module!="undefined"&&require.main===module&&exports.main(typeof process!="undefined"?process.argv.slice(1):require("system").args)),Handlebars.Parser=handlebars,Handlebars.parse=function(e){return Handlebars.Parser.yy=Handlebars.AST,Handlebars.Parser.parse(e)},Handlebars.print=function(e){return(new Handlebars.PrintVisitor).accept(e)},Handlebars.logger={DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(e,t){}},Handlebars.log=function(e,t){Handlebars.logger.log(e,t)},function(){Handlebars.AST={},Handlebars.AST.ProgramNode=function(e,t){this.type="program",this.statements=e,t&&(this.inverse=new Handlebars.AST.ProgramNode(t))},Handlebars.AST.MustacheNode=function(e,t,n){this.type="mustache",this.escaped=!n,this.hash=t;var r=this.id=e[0],i=this.params=e.slice(1),s=this.eligibleHelper=r.isSimple;this.isHelper=s&&(i.length||t)},Handlebars.AST.PartialNode=function(e,t){this.type="partial",this.id=e,this.context=t};var e=function(e,t){if(e.original!==t.original)throw new Handlebars.Exception(e.original+" doesn't match "+t.original)};Handlebars.AST.BlockNode=function(t,n,r,i){e(t.id,i),this.type="block",this.mustache=t,this.program=n,this.inverse=r,this.inverse&&!this.program&&(this.isInverse=!0)},Handlebars.AST.ContentNode=function(e){this.type="content",this.string=e},Handlebars.AST.HashNode=function(e){this.type="hash",this.pairs=e},Handlebars.AST.IdNode=function(e){this.type="ID",this.original=e.join(".");var t=[],n=0;for(var r=0,i=e.length;r<i;r++){var s=e[r];s===".."?n++:s==="."||s==="this"?this.isScoped=!0:t.push(s)}this.parts=t,this.string=t.join("."),this.depth=n,this.isSimple=e.length===1&&!this.isScoped&&n===0},Handlebars.AST.DataNode=function(e){this.type="DATA",this.id=e},Handlebars.AST.StringNode=function(e){this.type="STRING",this.string=e},Handlebars.AST.IntegerNode=function(e){this.type="INTEGER",this.integer=e},Handlebars.AST.BooleanNode=function(e){this.type="BOOLEAN",this.bool=e},Handlebars.AST.CommentNode=function(e){this.type="comment",this.comment=e}}();var errorProps=["description","fileName","lineNumber","message","name","number","stack"];Handlebars.Exception=function(e){var t=Error.prototype.constructor.apply(this,arguments);for(var n=0;n<errorProps.length;n++)this[errorProps[n]]=t[errorProps[n]]},Handlebars.Exception.prototype=new Error,Handlebars.SafeString=function(e){this.string=e},Handlebars.SafeString.prototype.toString=function(){return this.string.toString()},function(){var e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},t=/[&<>"'`]/g,n=/[&<>"'`]/,r=function(t){return e[t]||"&amp;"};Handlebars.Utils={escapeExpression:function(e){return e instanceof Handlebars.SafeString?e.toString():e==null||e===!1?"":n.test(e)?e.replace(t,r):e},isEmpty:function(e){return typeof e=="undefined"?!0:e===null?!0:e===!1?!0:Object.prototype.toString.call(e)==="[object Array]"&&e.length===0?!0:!1}}}(),Handlebars.Compiler=function(){},Handlebars.JavaScriptCompiler=function(){},function(e,t){e.prototype={compiler:e,disassemble:function(){var e=this.opcodes,t,n=[],r,i;for(var s=0,o=e.length;s<o;s++){t=e[s];if(t.opcode==="DECLARE")n.push("DECLARE "+t.name+"="+t.value);else{r=[];for(var u=0;u<t.args.length;u++)i=t.args[u],typeof i=="string"&&(i='"'+i.replace("\n","\\n")+'"'),r.push(i);n.push(t.opcode+" "+r.join(" "))}}return n.join("\n")},guid:0,compile:function(e,t){this.children=[],this.depths={list:[]},this.options=t;var n=this.options.knownHelpers;this.options.knownHelpers={helperMissing:!0,blockHelperMissing:!0,each:!0,"if":!0,unless:!0,"with":!0,log:!0};if(n)for(var r in n)this.options.knownHelpers[r]=n[r];return this.program(e)},accept:function(e){return this[e.type](e)},program:function(e){var t=e.statements,n;this.opcodes=[];for(var r=0,i=t.length;r<i;r++)n=t[r],this[n.type](n);return this.isSimple=i===1,this.depths.list=this.depths.list.sort(function(e,t){return e-t}),this},compileProgram:function(e){var t=(new this.compiler).compile(e,this.options),n=this.guid++,r;this.usePartial=this.usePartial||t.usePartial,this.children[n]=t;for(var i=0,s=t.depths.list.length;i<s;i++){r=t.depths.list[i];if(r<2)continue;this.addDepth(r-1)}return n},block:function(e){var t=e.mustache,n=e.program,r=e.inverse;n&&(n=this.compileProgram(n)),r&&(r=this.compileProgram(r));var i=this.classifyMustache(t);i==="helper"?this.helperMustache(t,n,r):i==="simple"?(this.simpleMustache(t),this.opcode("pushProgram",n),this.opcode("pushProgram",r),this.opcode("pushLiteral","{}"),this.opcode("blockValue")):(this.ambiguousMustache(t,n,r),this.opcode("pushProgram",n),this.opcode("pushProgram",r),this.opcode("pushLiteral","{}"),this.opcode("ambiguousBlockValue")),this.opcode("append")},hash:function(e){var t=e.pairs,n,r;this.opcode("push","{}");for(var i=0,s=t.length;i<s;i++)n=t[i],r=n[1],this.accept(r),this.opcode("assignToHash",n[0])},partial:function(e){var t=e.id;this.usePartial=!0,e.context?this.ID(e.context):this.opcode("push","depth0"),this.opcode("invokePartial",t.original),this.opcode("append")},content:function(e){this.opcode("appendContent",e.string)},mustache:function(e){var t=this.options,n=this.classifyMustache(e);n==="simple"?this.simpleMustache(e):n==="helper"?this.helperMustache(e):this.ambiguousMustache(e),e.escaped&&!t.noEscape?this.opcode("appendEscaped"):this.opcode("append")},ambiguousMustache:function(e,t,n){var r=e.id,i=r.parts[0];this.opcode("getContext",r.depth),this.opcode("pushProgram",t),this.opcode("pushProgram",n),this.opcode("invokeAmbiguous",i)},simpleMustache:function(e,t,n){var r=e.id;r.type==="DATA"?this.DATA(r):r.parts.length?this.ID(r):(this.addDepth(r.depth),this.opcode("getContext",r.depth),this.opcode("pushContext")),this.opcode("resolvePossibleLambda")},helperMustache:function(e,t,n){var r=this.setupFullMustacheParams(e,t,n),i=e.id.parts[0];if(this.options.knownHelpers[i])this.opcode("invokeKnownHelper",r.length,i);else{if(this.knownHelpersOnly)throw new Error("You specified knownHelpersOnly, but used the unknown helper "+i);this.opcode("invokeHelper",r.length,i)}},ID:function(e){this.addDepth(e.depth),this.opcode("getContext",e.depth);var t=e.parts[0];t?this.opcode("lookupOnContext",e.parts[0]):this.opcode("pushContext");for(var n=1,r=e.parts.length;n<r;n++)this.opcode("lookup",e.parts[n])},DATA:function(e){this.options.data=!0,this.opcode("lookupData",e.id)},STRING:function(e){this.opcode("pushString",e.string)},INTEGER:function(e){this.opcode("pushLiteral",e.integer)},BOOLEAN:function(e){this.opcode("pushLiteral",e.bool)},comment:function(){},opcode:function(e){this.opcodes.push({opcode:e,args:[].slice.call(arguments,1)})},declare:function(e,t){this.opcodes.push({opcode:"DECLARE",name:e,value:t})},addDepth:function(e){if(isNaN(e))throw new Error("EWOT");if(e===0)return;this.depths[e]||(this.depths[e]=!0,this.depths.list.push(e))},classifyMustache:function(e){var t=e.isHelper,n=e.eligibleHelper,r=this.options;if(n&&!t){var i=e.id.parts[0];r.knownHelpers[i]?t=!0:r.knownHelpersOnly&&(n=!1)}return t?"helper":n?"ambiguous":"simple"},pushParams:function(e){var t=e.length,n;while(t--)n=e[t],this.options.stringParams?(n.depth&&this.addDepth(n.depth),this.opcode("getContext",n.depth||0),this.opcode("pushStringParam",n.string)):this[n.type](n)},setupMustacheParams:function(e){var t=e.params;return this.pushParams(t),e.hash?this.hash(e.hash):this.opcode("pushLiteral","{}"),t},setupFullMustacheParams:function(e,t,n){var r=e.params;return this.pushParams(r),this.opcode("pushProgram",t),this.opcode("pushProgram",n),e.hash?this.hash(e.hash):this.opcode("pushLiteral","{}"),r}};var n=function(e){this.value=e};t.prototype={nameLookup:function(e,n,r){return/^[0-9]+$/.test(n)?e+"["+n+"]":t.isValidJavaScriptVariableName(n)?e+"."+n:e+"['"+n+"']"},appendToBuffer:function(e){return this.environment.isSimple?"return "+e+";":"buffer += "+e+";"},initializeBuffer:function(){return this.quotedString("")},namespace:"Handlebars",compile:function(e,t,n,r){this.environment=e,this.options=t||{},Handlebars.log(Handlebars.logger.DEBUG,this.environment.disassemble()+"\n\n"),this.name=this.environment.name,this.isChild=!!n,this.context=n||{programs:[],aliases:{}},this.preamble(),this.stackSlot=0,this.stackVars=[],this.registers={list:[]},this.compileStack=[],this.compileChildren(e,t);var i=e.opcodes,s;this.i=0;for(o=i.length;this.i<o;this.i++)s=i[this.i],s.opcode==="DECLARE"?this[s.name]=s.value:this[s.opcode].apply(this,s.args);return this.createFunctionContext(r)},nextOpcode:function(){var e=this.environment.opcodes,t=e[this.i+1];return e[this.i+1]},eat:function(e){this.i=this.i+1},preamble:function(){var e=[];if(!this.isChild){var t=this.namespace,n="helpers = helpers || "+t+".helpers;";this.environment.usePartial&&(n=n+" partials = partials || "+t+".partials;"),this.options.data&&(n+=" data = data || {};"),e.push(n)}else e.push("");this.environment.isSimple?e.push(""):e.push(", buffer = "+this.initializeBuffer()),this.lastContext=0,this.source=e},createFunctionContext:function(e){var t=this.stackVars.concat(this.registers.list);t.length>0&&(this.source[1]=this.source[1]+", "+t.join(", "));if(!this.isChild){var n=[];for(var r in this.context.aliases)this.source[1]=this.source[1]+", "+r+"="+this.context.aliases[r]}this.source[1]&&(this.source[1]="var "+this.source[1].substring(2)+";"),this.isChild||(this.source[1]+="\n"+this.context.programs.join("\n")+"\n"),this.environment.isSimple||this.source.push("return buffer;");var i=this.isChild?["depth0","data"]:["Handlebars","depth0","helpers","partials","data"];for(var s=0,o=this.environment.depths.list.length;s<o;s++)i.push("depth"+this.environment.depths.list[s]);if(e)return i.push(this.source.join("\n  ")),Function.apply(this,i);var u="function "+(this.name||"")+"("+i.join(",")+") {\n  "+this.source.join("\n  ")+"}";return Handlebars.log(Handlebars.logger.DEBUG,u+"\n\n"),u},blockValue:function(){this.context.aliases.blockHelperMissing="helpers.blockHelperMissing";var e=["depth0"];this.setupParams(0,e),this.replaceStack(function(t){return e.splice(1,0,t),t+" = blockHelperMissing.call("+e.join(", ")+")"})},ambiguousBlockValue:function(){this.context.aliases.blockHelperMissing="helpers.blockHelperMissing";var e=["depth0"];this.setupParams(0,e);var t=this.topStack();e.splice(1,0,t),this.source.push("if (!"+this.lastHelper+") { "+t+" = blockHelperMissing.call("+e.join(", ")+"); }")},appendContent:function(e){this.source.push(this.appendToBuffer(this.quotedString(e)))},append:function(){var e=this.popStack();this.source.push("if("+e+" || "+e+" === 0) { "+this.appendToBuffer(e)+" }"),this.environment.isSimple&&this.source.push("else { "+this.appendToBuffer("''")+" }")},appendEscaped:function(){var e=this.nextOpcode(),t="";this.context.aliases.escapeExpression="this.escapeExpression",e&&e.opcode==="appendContent"&&(t=" + "+this.quotedString(e.args[0]),this.eat(e)),this.source.push(this.appendToBuffer("escapeExpression("+this.popStack()+")"+t))},getContext:function(e){this.lastContext!==e&&(this.lastContext=e)},lookupOnContext:function(e){this.pushStack(this.nameLookup("depth"+this.lastContext,e,"context"))},pushContext:function(){this.pushStackLiteral("depth"+this.lastContext)},resolvePossibleLambda:function(){this.context.aliases.functionType='"function"',this.replaceStack(function(e){return"typeof "+e+" === functionType ? "+e+".apply(depth0) : "+e})},lookup:function(e){this.replaceStack(function(t){return t+" == null || "+t+" === false ? "+t+" : "+this.nameLookup(t,e,"context")})},lookupData:function(e){this.pushStack(this.nameLookup("data",e,"data"))},pushStringParam:function(e){this.pushStackLiteral("depth"+this.lastContext),this.pushString(e)},pushString:function(e){this.pushStackLiteral(this.quotedString(e))},push:function(e){this.pushStack(e)},pushLiteral:function(e){this.pushStackLiteral(e)},pushProgram:function(e){e!=null?this.pushStackLiteral(this.programExpression(e)):this.pushStackLiteral(null)},invokeHelper:function(e,t){this.context.aliases.helperMissing="helpers.helperMissing";var n=this.lastHelper=this.setupHelper(e,t);this.register("foundHelper",n.name),this.pushStack("foundHelper ? foundHelper.call("+n.callParams+") "+": helperMissing.call("+n.helperMissingParams+")")},invokeKnownHelper:function(e,t){var n=this.setupHelper(e,t);this.pushStack(n.name+".call("+n.callParams+")")},invokeAmbiguous:function(e){this.context.aliases.functionType='"function"',this.pushStackLiteral("{}");var t=this.setupHelper(0,e),n=this.lastHelper=this.nameLookup("helpers",e,"helper");this.register("foundHelper",n);var r=this.nameLookup("depth"+this.lastContext,e,"context"),i=this.nextStack();this.source.push("if (foundHelper) { "+i+" = foundHelper.call("+t.callParams+"); }"),this.source.push("else { "+i+" = "+r+"; "+i+" = typeof "+i+" === functionType ? "+i+".apply(depth0) : "+i+"; }")},invokePartial:function(e){var t=[this.nameLookup("partials",e,"partial"),"'"+e+"'",this.popStack(),"helpers","partials"];this.options.data&&t.push("data"),this.context.aliases.self="this",this.pushStack("self.invokePartial("+t.join(", ")+");")},assignToHash:function(e){var t=this.popStack(),n=this.topStack();this.source.push(n+"['"+e+"'] = "+t+";")},compiler:t,compileChildren:function(e,t){var n=e.children,r,i;for(var s=0,o=n.length;s<o;s++){r=n[s],i=new this.compiler,this.context.programs.push("");var u=this.context.programs.length;r.index=u,r.name="program"+u,this.context.programs[u]=i.compile(r,t,this.context)}},programExpression:function(e){this.context.aliases.self="this";if(e==null)return"self.noop";var t=this.environment.children[e],n=t.depths.list,r,i=[t.index,t.name,"data"];for(var s=0,o=n.length;s<o;s++)r=n[s],r===1?i.push("depth0"):i.push("depth"+(r-1));return n.length===0?"self.program("+i.join(", ")+")":(i.shift(),"self.programWithDepth("+i.join(", ")+")")},register:function(e,t){this.useRegister(e),this.source.push(e+" = "+t+";")},useRegister:function(e){this.registers[e]||(this.registers[e]=!0,this.registers.list.push(e))},pushStackLiteral:function(e){return this.compileStack.push(new n(e)),e},pushStack:function(e){return this.source.push(this.incrStack()+" = "+e+";"),this.compileStack.push("stack"+this.stackSlot),"stack"+this.stackSlot},replaceStack:function(e){var t=e.call(this,this.topStack());return this.source.push(this.topStack()+" = "+t+";"),"stack"+this.stackSlot},nextStack:function(e){var t=this.incrStack();return this.compileStack.push("stack"+this.stackSlot),t},incrStack:function(){return this.stackSlot++,this.stackSlot>this.stackVars.length&&this.stackVars.push("stack"+this.stackSlot),"stack"+this.stackSlot},popStack:function(){var e=this.compileStack.pop();return e instanceof n?e.value:(this.stackSlot--,e)},topStack:function(){var e=this.compileStack[this.compileStack.length-1];return e instanceof n?e.value:e},quotedString:function(e){return'"'+e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r")+'"'},setupHelper:function(e,t){var n=[];this.setupParams(e,n);var r=this.nameLookup("helpers",t,"helper");return{params:n,name:r,callParams:["depth0"].concat(n).join(", "),helperMissingParams:["depth0",this.quotedString(t)].concat(n).join(", ")}},setupParams:function(e,t){var n=[],r=[],i,s,o;n.push("hash:"+this.popStack()),s=this.popStack(),o=this.popStack();if(o||s)o||(this.context.aliases.self="this",o="self.noop"),s||(this.context.aliases.self="this",s="self.noop"),n.push("inverse:"+s),n.push("fn:"+o);for(var u=0;u<e;u++)i=this.popStack(),t.push(i),this.options.stringParams&&r.push(this.popStack());return this.options.stringParams&&n.push("contexts:["+r.join(",")+"]"),this.options.data&&n.push("data:data"),t.push("{"+n.join(",")+"}"),t.join(", ")}};var r="break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "),i=t.RESERVED_WORDS={};for(var s=0,o=r.length;s<o;s++)i[r[s]]=!0;t.isValidJavaScriptVariableName=function(e){return!t.RESERVED_WORDS[e]&&/^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(e)?!0:!1}}(Handlebars
.Compiler,Handlebars.JavaScriptCompiler),Handlebars.precompile=function(e,t){t=t||{};var n=Handlebars.parse(e),r=(new Handlebars.Compiler).compile(n,t);return(new Handlebars.JavaScriptCompiler).compile(r,t)},Handlebars.compile=function(e,t){function r(){var n=Handlebars.parse(e),r=(new Handlebars.Compiler).compile(n,t),i=(new Handlebars.JavaScriptCompiler).compile(r,t,undefined,!0);return Handlebars.template(i)}t=t||{};var n;return function(e,t){return n||(n=r()),n.call(this,e,t)}},Handlebars.VM={template:function(e){var t={escapeExpression:Handlebars.Utils.escapeExpression,invokePartial:Handlebars.VM.invokePartial,programs:[],program:function(e,t,n){var r=this.programs[e];return n?Handlebars.VM.program(t,n):r?r:(r=this.programs[e]=Handlebars.VM.program(t),r)},programWithDepth:Handlebars.VM.programWithDepth,noop:Handlebars.VM.noop};return function(n,r){return r=r||{},e.call(t,Handlebars,n,r.helpers,r.partials,r.data)}},programWithDepth:function(e,t,n){var r=Array.prototype.slice.call(arguments,2);return function(n,i){return i=i||{},e.apply(this,[n,i.data||t].concat(r))}},program:function(e,t){return function(n,r){return r=r||{},e(n,r.data||t)}},noop:function(){return""},invokePartial:function(e,t,n,r,i,s){var o={helpers:r,partials:i,data:s};if(e===undefined)throw new Handlebars.Exception("The partial "+t+" could not be found");if(e instanceof Function)return e(n,o);if(!Handlebars.compile)throw new Handlebars.Exception("The partial "+t+" could not be compiled when running in runtime-only mode");return i[t]=Handlebars.compile(e,{data:s!==undefined}),i[t](n,o)}},Handlebars.template=Handlebars.VM.template;
///#source 1 1 /Foundry/Foundry.rules.templates.js
/*
    Foundry.rules.templates.js part of the FoundryJS project
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
/// <reference path="../Apprentice/handlebars-1.0.rc.1.js" />


var Foundry = Foundry || {};


(function (ns, $, bars, undefined) {


    $.expr[':'].focus = function (elem) {
        return elem === document.activeElement && (elem.type || elem.href);
    };

    ns.templateCashe = ns.makeComponent();

    ns.templateCashe.DoGetAsync = function (url, OnComplete) {
        var token = ns.templateCashe.createAsyncToken(url, OnComplete, self.NetworkFailed);
        $.get(url).success(function (data) {
            token.onComplete(data);
            });
        return token;
    };

    ns.loadAllTemplatesAsync = function (onLoaded) {
        var cashe = ns.templateCashe;
        $("script[type*=html],script[type*=x-handlebars-template]").each(function (i, uiElement) {
            var $element = $(uiElement);
            var id = $element.attr('id');
            if (id && cashe[id] === undefined) {
                var html = $element.html();
                var src = $element.attr('src');
                if (src) { //async chase down this value, return a promice...
                    cashe.establishManagedProperty(id, function () {
                        var result = cashe.DoGetAsync(src, function (data) {
                            var resultData = data;
                            if (src.endsWith('.svg')) {
                                var XMLS = new XMLSerializer();
                                resultData = XMLS.serializeToString(data)
                            }
                            result.fulfillPromised(resultData);
                            onLoaded && onLoaded(id, resultData);
                        });
                        return result;
                    }).getValue();  //this forces a call
                }
                else if (html) { // assert this html value
                    cashe.establishManagedProperty(id, html);
                    onLoaded && onLoaded(id, html);
                }
            }
        });
    };

    ns.loadScriptAsync = function (id) {
        var cashe = ns.templateCashe;
        if (cashe[id] === undefined) {
            $("#" + id).each(function (i, uiElement) {
                var $element = $(uiElement);
                if (id && cashe[id] === undefined) {
                    var html = $element.html();
                    var src = $element.attr('src');
                    if (src) { //async chase down this value, return a promice...
                        cashe.establishManagedProperty(id, function () {
                            var result = cashe.DoGetAsync(src, function (data) {
                                result.fulfillPromised(data);
                            });
                            return result;
                        }).getValue();  //this forces a call
                    }
                    else if (html) { // assert this html value
                        cashe.establishManagedProperty(id, html);
                    }
                }
            });
        }
        var result = cashe[id];
        return result;
    };

    //maybe this should return a propery object that can be demanded and tracked;
    //this is like returning an observable...
    ns.getTemplate = function (id, defaultTemplate) {
        if (id === undefined) return defaultTemplate;

        var cashe = ns.templateCashe;
        var result = ns.loadScriptAsync(id, defaultTemplate);
        result ? result : cashe.establishManagedProperty(id, defaultTemplate);

        var result = result && result.trim ? result.trim() : result;
        var html = fo.utils.cleanTemplateHtml(result);
        return html;

    }




}(Foundry, jQuery, handlebars));

