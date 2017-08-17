
var knowtApp = angular.module('recommenderApp', ['ui.bootstrap', 'foundry', 'ngRoute', 'ngAnimate']);
knowtApp.header = { title: 'Recommender', help: 'knowtshareHelp.html' };

//initial document and run implemented...
(function (app, fo, undefined) {
    app.defaultNS = function (name) {
        var id = fo.getNamespaceKey(this.name, name);
        return id;
    }

    app.stencilNS = function (name) {
        var id = fo.getNamespaceKey("KnowtShare", name);
        return id;
    }

    app.getNamespace = function (obj) {
        return fo.utils.getNamespace(obj);
    }

    app.getType = function (obj) {
        return fo.utils.getType(obj);
    }

    app.typeFactory = function () {
        if (!fo[app.name]) {
            fo.exportTypes();
        }
        return fo[app.name];
    }


}(knowtApp, Foundry));



(function (app, fo, undefined) {

    //recomender object definitions

    fo.defineType(app.stencilNS('note'), {
        text: function () {
            return this.noteUri ? this.noteUri : this.headerText ? this.headerText : this.noteText;
        },
        done: function () {
            if (this.Subcomponents.count == 0) return false;
            var totalDone = this.Subcomponents.filter(function (item) {
                return item.done;
            });
            return totalDone.count == this.Subcomponents.count;
        },
        isBranch: function () {
            return this.Subcomponents.count > 0;
        },
        isLeaf: function () {
            return this.Subcomponents.count == 0;
        },
        isLeafParent: function () {
            if (this.isLeaf) return false;
            var result = true;
            this.Subcomponents.forEach(function (child) {
                if (child.isBranch) result = false;
            });
            return result;
        },
        details: function () {
            if (!this.hasCard) return;
            var result = this.hasCard.first();
            return result;
        }
    }, function createNote(properties, subcomponents, parent) {

        var obj = fo.makeComponent(properties, subcomponents, parent);
        //this rule let the user over setting the value of done to true, but if unset it 
        //reverts to the formula and the value of the children
        obj.onPropertyValueSet('done', function (newValue, formula, owner) {
            if (!newValue) {
                this.smash();
                fo.publish('unpinAsRoot', [owner]);
            }
            else {
                //make sure siblings are unselected
                var list = owner.myParent.Subcomponents;
                list.forEach(function (item) {
                    if (item != owner && item.done) item.done = false;
                });
                fo.publish('pinAsRoot', [owner]);
            }
        });
        return obj;
    });

    fo.defineType(app.stencilNS('card'), {
        "Town": "<string>",
        "State": "<string>",
        "Population": "<number>",
        "Median Household Income": "<currency>",
        "Median Age": "<number>",
        "% Below Poverty Level": "<number>",
        "High Flood Risk?": "<YesNo>",
        "URL": "<Url>",
        "Picture": "<Picture>",
    });

    fo.establishRelationship('hasCard|hasNote');
 

}(knowtApp, Foundry));


(function (app, fo, undefined) {

    app.service('workspaceService', ['$log', function ($log) {

        var space;

        this.workSpace = function (properties, modelTemplate) {
            if (space) return space;

            var spec = {
                title: "Recommender",
                subTitle: "",
            }
            space = fo.ws.makeModelWorkspace(app.name, fo.utils.union(spec, properties), modelTemplate);

            return space;
        };

        this.activeWorkSpace = function () {
            if (!space) throw new Error('Workspace is not initialized');
            return space;
        }

    }]);

}(knowtApp, Foundry));



(function (app, fo, undefined) {
    



    app.controller('recommendationController', function ($scope, $log, workspaceService) {

        var space = workspaceService.workSpace({
            factory: app.typeFactory(),
        }, {
            pinAsRoot: function () {
                var root = this.Subcomponents.first();
                return root ? root : this;
            },
            rootNode: function () {
                var root = this.Subcomponents.first();
                return root ? root: this;
            },
            showAll: false,
            doShowAll: function () {
                this.showAll = !this.showAll;
            },

            noMoreChoice: function () {
                if (this.pinAsRoot == this) return false;
                if (this.rootNode.isBranch) return false;
                return true;
            },
            selectionPath: function () {
                var path = [];
                var self = this;
                var parent = this.pinAsRoot;
                while (parent && parent != self) {
                    path.push(parent);
                    parent = parent.myParent;
                }
                if (path.length == 0) path.push(this.rootNode);
                return path.reverse();

            },
            canDoBack: function () {
                return this.rootNode != this.Subcomponents.item(0);
            },
            doBack: function () {
                if (this.canDoBack) {
                    this.rootNode = this.rootNode.myParent;
                    //$location.path('#' + this.modelRoot.text);
                }
            },
            canDoNext: function () {
                var list = this.rootNode.Subcomponents.filter(function (item) {
                    return item.done;
                });
                if (list.count != 1) return false;
                return true;
            },
            doNext: function () {
                if (!this.canDoNext) return;


                var list = this.rootNode.Subcomponents.filter(function (item) {
                    return item.done;
                });
                if (list.count == 1) {
                    this.rootNode = list.first();
                }
            },
            choices: function () {
                var result = this.rootNode.Subcomponents.elements;
                return result;
            },
        });

        var client = new WindowsAzure.MobileServiceClient('https://knowtshare.azure-mobile.net/', 'TgqajRoTjJGUXtBpkjedHyCSJmPyev37');
        var table = client.getTable('knowtAsset');


        var knowts = fo.ws.makeModelWorkspace('rec');


        table.read().then(function (list) {
            list.forEach(function (doc) {
                if (doc.extension.matches('.knt')) {
                    knowts.payloadToCurrentModel(doc.payload);
                    var model = knowts.rootModel.Subcomponents.first();
                    space.rootModel.capture(model);
                    space.rootModel.smashProperty('rootNode')
                    space.rootModel.smashProperty('pinAsRoot')                
                }
                if (doc.extension.matches('.csv')) {
                    space.data = JSON.parse(doc.payload);

                    //var model = knowts.rootModel.Subcomponents.first();
                    //space.rootModel.capture(model);
                    //space.rootModel.smashProperty('rootNode')
                    //space.rootModel.smashProperty('pinAsRoot')
                }
            });
            var table = space.data;
            var cards = table.map(function (item) {
                var card = fo.KnowtShare.newCard(item);
                return card;
            });

            var root = space.rootModel.rootNode;
            var leaves = root.selectComponents(function (item) {
                return item.isLeaf;
            });

            var cardMap = fo.filtering.applyMapping(cards, 'Town');
            var noteMap = fo.filtering.applyMapping(leaves, 'text');
            //a relationship is established by matching two key fields
            var hasCard = fo.establishRelation('hasCard');

            for (var key in noteMap) {
                var note = noteMap[key];
                var card = cardMap[key];
                hasCard(note, card, true);
            }


            $scope.$apply();
        });





        var vm = space.rootModel;
        //vm.list = data;

        vm.goto = function (item) {
            this.rootNode = item;
        }

        vm.toggleDone = function (item) {
            item.done = !item.done;
            $scope.$apply();
            setTimeout(function () {
                if (item.done) {
                    vm.doNext;
                }
                $scope.$apply();
            }, 300)
        }



        fo.subscribe('pinAsRoot', function (item) {
            vm.pinAsRoot = item ? item : vm;
        });

        fo.subscribe('unpinAsRoot', function (item) {
            if (vm.pinAsRoot == item) {
                vm.pinAsRoot = vm;
            }
        });


        return vm;
    });



}(knowtApp, Foundry))
