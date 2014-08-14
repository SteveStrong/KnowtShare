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