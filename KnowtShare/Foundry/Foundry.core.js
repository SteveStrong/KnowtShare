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
