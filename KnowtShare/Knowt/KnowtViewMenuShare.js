
(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('menuShare'), {
    },
    function (properties, subcomponents, parent) {

        var result = fo.makeAdaptor(properties);
        //subscribe to any do* of goto* messages...
        result.subscribeToCommands();



        return result;
    });

}(knowtApp, Foundry));