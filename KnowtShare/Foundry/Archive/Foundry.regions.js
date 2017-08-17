/*
    Foundry.regions.js part of the FoundryJS project
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
Foundry.regions = Foundry.regions || {};


(function (ns, re, undefined) {

    //now define the page...

    re.regionSpec = {

    }

    var Region = function (elementId, properties, subcomponents, parent) {
        var spec = fo.utils.union(ns.regionSpec, properties);
        spec.elementId = elementId;

        this.base = ns.Component;
        this.base(spec, subcomponents, parent);
        this.myType = 'Region';
        return this;
    }


    Region.prototype = (function () {
        var anonymous = function () { this.constructor = Region; };
        anonymous.prototype = ns.Component.prototype;
        return new anonymous();
    })();

    ns.region = function (elementId, properties, subcomponents, parent) {
        var result = new Region(elementId, properties, subcomponents, parent);
        return result;
    }

    ns.utils.isaRegion = function (obj) {
        return obj instanceof Region ? true : false;
    };

    Region.prototype.setSize = function (w, h) {
        var region = this;
    };

    Region.prototype.setPosition = function (x, y) {
        var region = this;
    };


}(Foundry, Foundry.regions));
