/*
    Foundry.asm.js part of the FoundryJS project
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

//this module is design to load all other modules 
// and as a result must be very lean

var Foundry = Foundry || {};
Foundry.ready = function () {};

(function (ns, undefined) {

    ns.ready = function () {
        ns.trace && ns.trace.error('default ready called');
    };


    var isBrowser = !!(typeof window !== 'undefined' && navigator && window.document);
    var isWebWorker = !isBrowser && typeof importScripts !== 'undefined';
    var jsSuffixRegExp = /\.js$/;
    var jsExtRegExp = /^\/|:|\?|\.js$/;
    var op = Object.prototype;
    var ostring = op.toString;
    var hasOwn = op.hasOwnProperty;
    var mainFile;
    var debugid;

    String.prototype.startsWith = function (str) {
        return (this.match("^" + str) == str);
    };

    String.prototype.endsWith = function (str) {
        return (this.match(str + "$") == str);
    };

    String.prototype.format = function () {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    function isString(it) {
        return typeof it === 'string';
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }


    function scripts() {
        return document.getElementsByTagName('script');
    }

    function localFileUrl(file) {
        if (file && file.startsWith('http')) return file;
        var loc = window.location;
        var baseurl = loc.href.replace(loc.pathname, '');
        return baseurl + '/' + file;
    }

    function fileToLabelName(file) {
        var loc = window.location;
        var baseurl = loc.href.replace(loc.pathname, '') + '/';
        return file.replace(baseurl,'');
    }


    function fileToModuleName(file) {
        //if (file && file.startsWith('http')) return file;
        if (!file) return undefined;

        var path = file.split('/');
        var filenameArray = path[path.length - 1].split('.');
        filenameArray = filenameArray.splice(0, filenameArray.length - 1);
        var filename = filenameArray.join('.');
        return filename;
    }

    function merge(items,list)
    {
        var result = list ? list : [];
        for (var i = 0; i < items.length; i++) {
            result.push(items[i]);
        }
        return result;
    }


    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function eachReverse(ary, func) {
        if (ary) {
            for (var i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    };

    function httpGet(theUrl) {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    var fileLoadingCount = 0;
    var currentlyLoadingUrl = '_';
    function loadElement(tag, url, callback) {

        var script = document.createElement(tag);
        var head = document.getElementsByTagName("head")[0]; 
        var body = document.getElementsByTagName("body")[0];

        fileLoadingCount++;
        currentlyLoadingUrl = url;

        if (script.readyState) {  //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    fileLoadingCount--;
                    callback && callback(script, url);
                }
            };
        } else {  //Others
            script.onload = function () {
                if (tag == 'div') return;
                fileLoadingCount--;
                callback && callback(script, url);
            };
        }

        if (tag == 'script') {
            script.type = "text/javascript";
            script.src = url;
            head.appendChild(script);
        }
        else if (tag == 'link') {
            script.rel = "stylesheet";
            script.type = "text/css";
            script.href = url;

            head.appendChild(script);
        }
        else if (tag == 'div') {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onload = function () {
                body.appendChild(script);
                var result = xmlHttp.responseText;
                script.innerHTML = result;
                fileLoadingCount--;
                callback && callback(script, url);
            };

            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);
        }

        return url;
    }

    ns.loadedModules = {
        fo: Foundry,
    };
 
    //now can we load the Foundry Modules before we load main
    var moduleSpec = {
        name: '',
        label: '',
        fileUrl: '',
        isLoaded: false,
        isBuilt: false,
        dependencies: [],
        status: 'unloaded',
        createFunction: function () { },
        module: undefined,
    }

    var moduleRegistry = {};
    var registerModule = function (spec) {
        var name = spec.name;
        var label = spec.label;
        var found = findModuleByLabel(label);
        if (!found) found = findModuleByName(name);
        if (!found) {
            var mod = new Module(spec);
            moduleRegistry[name] = mod;
            ns.trace && ns.trace.info('registerModule ' + name + '  ' + label);
            return mod;
        }
        else
        {
           // alert('module is already registered ' + label)
            ns.trace && ns.trace.info('already registerModule ' + name + '  ' + label);
            return found;
        }
    }

    var findModule = function (file) {
        var label = fileToLabelName(file);
        return findModuleByLabel(label);
    }

    var findModuleByLabel = function (label) {
        for (var key in moduleRegistry) {
            var mod = moduleRegistry[key];
            if (mod.label == label) return mod;
        }
    }

    var findModuleByUrl = function (url) {
        for (var key in moduleRegistry) {
            var mod = moduleRegistry[key];
            if (mod.fileUrl == url) return mod;
        }
    }

    var findModuleByName = function (name) {
        var mod = moduleRegistry[name];
        return mod;
    }

    var Module = function (spec) {
        for(var key in moduleSpec) { this[key] = moduleSpec[key]; }
        for(var key in spec) { this[key] = spec[key]; }
        return this;
    }

    var isAModule = function(obj) {
        return obj instanceof Module ? true : false;
    }



    Module.prototype.canBuild = function () {
        var mod = this;
        if (!mod.isLoaded) return false;
        if (mod.isBuilt) return true;

        //check if all modules are loaded
        var countDown = mod.dependencies.length;
        for (var i = 0; i < mod.dependencies.length; i++) {
            var label = mod.dependencies[i];
            var found = findModuleByLabel(label);
            if (found && found.canBuild()) {
                countDown--;
            }
        }

        var result = countDown == 0;
        return result;
    }

    Module.prototype.build = function () {
        var mod = this;
        if (!mod.module && mod.canBuild()) {

            var deps = [ns.loadedModules];
            for (var i = 0; i < mod.dependencies.length; i++) {
                var label = mod.dependencies[i];
                var found = findModuleByLabel(label);
                var results = found.build();
                deps.push(results);
            }
            if (mod.dependencies.length > 0) {
                mod.module = mod.createFunction.apply(mod, deps);
            }
            else {
                mod.module = mod.createFunction.apply(mod, deps);
            }
            ns.loadedModules[mod.name] = mod.module;
            mod.isBuilt = true;
            mod.status = 'ready';
        }
        return mod.module;
    }


    var fileLoadingQueue = [];

    Module.prototype.loadAsync = function (onLoaded) {
        var mod = this;
        var file = mod.fileUrl;

        displayModuleStatus();


        function onComplete(script, url) {
            ns.trace && ns.trace.info('load ed ' + file);
            mod.isLoaded = true;
            if (!mod.isBuilt) {
                mod.status = 'loaded';
            }
            onLoaded && onLoaded(mod);
            if (fileLoadingCount <= 0) {
                if (fileLoadingQueue.length > 0) {
                    var load = fileLoadingQueue.pop();
                    load();
                }
                else {
                    processQueue();
                }
            }
        }

        if (mod.isLoaded) {
            ns.trace && ns.trace.warn('previously loaded ' + file);
            onComplete();
        }
        else {
            ns.trace && ns.trace.info('loading ' + file);

            mod.status = 'loading';
            var tag = file.endsWith('js') ? 'script' : file.endsWith('css') ? 'link' : file.endsWith('svg') ? 'div' :  'script';

            var load = function () { loadElement(tag, file, onComplete); }
            if (fileLoadingQueue.length == 0 && fileLoadingCount == 0) {
                load();
            } else {
                fileLoadingQueue.push(load);
            }
        }
    };

    var moduleDependencyStack = [];
    //the process of queuing will force the loading of dependent modules and 
    //this module will not deque until all dependencies are loaded..
    function queueModule(mod, promise) {

        //if something can build, then just build it, do not queue it.
        if (mod.canBuild()) {
            mod.build();
            promise && promise();
            return mod;
        }

        ns.trace && ns.trace.info('queue module ' + mod.label);
        moduleDependencyStack.push(mod);

        //locate what I depend on push those modules on the queue

        //start loading dependent files async
        var deps = [];
        for (var i = 0; i < mod.dependencies.length; i++) {
            var label = mod.dependencies[i];
            var found = findModuleByLabel(label);
            if (!found) {
                found = registerModule({
                    name: fileToModuleName(label),
                    label: label,
                    fileUrl: localFileUrl(label),
                });
                found.loadAsync();
            }
            queueModule(found);
        }
    }

    function processQueue() {
        //if the top item on the Queue can build, then remove it and ask it to build

       
        if (moduleDependencyStack.length == 0) {
            displayModuleStatus();
            ns.ready && ns.ready(ns.loadedModules);
            return;
        }

        displayModuleStatus();
        var mod = moduleDependencyStack[moduleDependencyStack.length - 1];
        if (mod.canBuild()) {
            moduleDependencyStack.pop();
            mod.build();
            processQueue();
        }
    }


    function displayModuleStatus() {
        if (!debugid && !ns.trace) return;

        //ns.trace.clear();
        //ns.trace.p('total of active modules ' + Object.keys(moduleRegistry).length);

        //for (var key in moduleRegistry) {
        //    var mod = moduleRegistry[key];
        //    var text = "{0}:  {1}  {2}  {3}".format(mod.name, mod.status, mod.label, mod.fileUrl);
        //    ns.trace.p(text);
        //};
    }


    //http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
    //https://github.com/Mikhus/jsurl
    //http://unixpapa.com/js/dyna.html



    ns.define = function (name, callback) {
        var label = fileToLabelName(currentlyLoadingUrl);
        var moduleName = isString(name) ? name : fileToModuleName(currentlyLoadingUrl);
        var constructor = isFunction(name) ? name : callback;

        var module = findModuleByLabel(label);
        if (!module) module = findModuleByName(moduleName);
        if (module) {
            module.createFunction = constructor;
            module.isLoaded = true;
        }
        else {
            module = registerModule({
                name: moduleName,
                label: label,
                fileUrl: currentlyLoadingUrl,
                isLoaded: true,
                createFunction: constructor,
            });
        }

        var result = ns.loadedModules[moduleName];
        if (!result) {
            result = module.build();
            ns.loadedModules[moduleName] = result;
        }
        return result;
    };


    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */

    ns.require = function (deps, callback, errback, optional) {
        var moduleName = fileToModuleName(currentlyLoadingUrl);
        var label = fileToLabelName(currentlyLoadingUrl);
        var requiredList = isArray(deps) ? deps: [];
        var constructor = isFunction(callback) ? callback : errback;

        if (isString(deps)) {
            moduleName = deps;
        }

        var module = findModuleByLabel(label);
        if (!module) module = findModuleByName(moduleName);
        if (module) {
            module.dependencies = requiredList;
            module.createFunction = constructor;
        }
        else
        {
            module = registerModule({
                name: moduleName,
                label: fileToLabelName(currentlyLoadingUrl),
                fileUrl: currentlyLoadingUrl,
                dependencies: requiredList,
                createFunction: constructor,
            });
        }

        //I should add a then clause to this.
        var promise = function () { return module.build() };

        ns.trace && ns.trace.warn('require ' + requiredList.join('|') );
        if (!module.canBuild()) {
            queueModule(module, promise);
        }
        return promise;
    };

    function loadFileAsync(file, onLoaded) {
        //loading a file implies the creation of a module, 
        //even if it is never build sometimes just loading a file is enough..
        var url = file.startsWith('http') ? file : localFileUrl(file);
        var module = registerModule({
            name: fileToModuleName(file),
            label: file,
            fileUrl: url,
        });
       
        module.loadAsync(onLoaded);
        displayModuleStatus();
    }



    function loadAllFilesAsync(list, onComplete) {
        if (!list || list.length == 0) {
            return onComplete && onComplete();
        }
        var file = list.pop();
        loadFileAsync(file, function () {
            loadAllFilesAsync(list, onComplete);
        });
    };




    var scripts = scripts();
    var main;
    eachReverse(scripts, function (script) {
        mainFile = script.getAttribute('data-main');
        if (mainFile) {
            main = script;
            debugid = script.getAttribute('data-debugid');
            return true;
        }
    });

    var foundryFiles = ['Foundry/version.js', 'Foundry/Foundry.trace.js', 'Foundry/Foundry.js', 'Foundry/Foundry.regions.js'];
    var bootstrapFiles = ['bootstrap/css/bootstrap-theme.min.css', 'bootstrap/css/bootstrap.min.css', 'bootstrap/js/bootstrap.min.js'];
    var allFiles = merge(foundryFiles);
    allFiles = merge(bootstrapFiles, allFiles);

    loadAllFilesAsync(allFiles.reverse(), function () {
        if (mainFile) {
            loadFileAsync(mainFile)
            return true;
        }

    });

    ns.loadFile = function(path, onComplete) {
        return loadFileAsync(path, onComplete);
    }

}(Foundry));

//http://www.moreonfew.com/how-to-minify-or-pack-javascript/
//http://crockford.com/javascript/jsmin
//http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml

//ns.loadFile("Foundry/Foundry.trace.js", function () {
//    ns.traceEnabled = true;


//    ns.loadFile("Scripts/jquery-2.0.3.min.js", function () {
//        ns.define('$', function () {
//            return jQuery;
//        });
//    });

//    ns.loadFile("Apprentice/handlebars-1.0.rc.1.min.js", function () {
//        ns.define('bars', function () {
//            return handlebars;
//        });
//    });

//});







