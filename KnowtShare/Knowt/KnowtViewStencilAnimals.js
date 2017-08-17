
(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('stencilAnimalNotes'), {

        doAddNote: function () {
            return this.doCreateNote();
        },
 
    }, 
    function (properties, subcomponents, parent) {

        //can we inherit from the other menu?  and just override create note?
        var obj = fo.makeComponent(properties, subcomponents, parent);

        var iCounter = 0;
        var animals = ['Alligator', 'Barracuda', 'Camel', 'Dolphin', 'Elephant', 'Falcon', 'Gila Monster', 'Hummingbird', 'Ibis', 'Jaguar', 'Kangaroo', 'Lemur'];

        obj.doCreateNote = function (onComplete) {
            if ( iCounter > animals.length) iCounter = 1;
            var animal = animals[iCounter++];

            var spec = {
                headerText: animal,
                noteText: animal.substring(0, 1) + " is for " + animal,
                noteUri: function () { return "http://a-z-animals.com/animals/" + animal },
            };

            parent.doCreateNote(spec);
        }

 
        return obj;
    });

}(knowtApp, Foundry));

