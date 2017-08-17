/// <reference path="cardTemplate.html" />

(function (app, fo, undefined) {

    app.directive('card', function ($templateCache) {

        var template = 'recommenderTemplate.html';


        return {
            restrict: 'AE',
            scope: {
                item: '=',
            },
            templateUrl: template,
        }
    });




}(angular.module('foundry', []), Foundry))

