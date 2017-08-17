/// <reference path="C:\Users\Steve\Documents\Visual Studio 2012\Projects\Apprentice8\KnowtShare\KnowtShare\Foundry/Foundry.core.utils.js" />


//http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#what-is

//http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/



(function (app, fo, undefined) {

    function makeEstablish(table) {
        var cloudtable = table;
        return function (obj) {
            var spec = fo.utils.isManaged(obj) ? obj.getSpec(true) : obj;

            function establishSuccess(arg) {
                fo.publish('success', ['it worked'])
            }
            function establishFail() {
                fo.publish('error', ['it did not worked ' + err])
            }
            function updateFail() {
                cloudtable.insert(spec).then(establishSuccess, insertFail);
            }
            cloudtable.update(spec).then(establishSuccess, updateFail)
            return obj;
        }
    }

    fo.defineType(app.defaultNS('knowtApp'), {
        userId: 'sedona',
        appname: 'beach towns',
        id: '2F25C48D-350D-4D3E-A053-6399DB212C31',
    });

    fo.defineType(app.defaultNS('knowtAsset'), {
        id: '',
        payload: '',
        filename: '',
        extension: '',
        owner: '',
    });
    fo.defineType(app.defaultNS('imageAsset'), {
        id: '',
        payload: '',
        filename: '',
        extension: '',
        owner: '',
    });

    fo.defineType(app.defaultNS('cloudStorage'), {
        dialogService: fo.fromParent,

        mobileClient: function () {
            var client = new WindowsAzure.MobileServiceClient('https://knowtshare.azure-mobile.net/', 'TgqajRoTjJGUXtBpkjedHyCSJmPyev37');
            return client;
        },
        appTable: function () {
            var table = this.mobileClient.getTable('knowtApp');
            return table;
        },
        documentTable: function () {
            var table = this.mobileClient.getTable('knowtAsset');
            return table;
        },
        imageTable: function () {
            var table = this.mobileClient.getTable('imageAsset');
            return table;
        },
        currentApp: function () {
            var establish = makeEstablish(this.appTable)
            return establish(this.currentRoot);
        },
        currentRoot: function() {
            var current = app.typeFactory().newKnowtApp({}, this);
            return current;
        },
        todoData: function () {
            var query = todoTable.where({ complete: false });
            query.read().then(function (todoItems) {
                return todoItems;
            });
            return '';
        },


    },
    function (properties, subcomponents, parent) {

        var space = parent;

        var result = fo.makeComponent(properties, subcomponents, parent);
        //subscribe to any do* of goto* messages...
        result.subscribeToCommands();
        var currentRoot = result.currentRoot;

        var query = result.appTable.where({ id: currentRoot.id });

        query.read().then(function (list) {
            var item = list[0];
            var subSpec = item.subSpec;

           // currentRoot.extend(item);
        });

        function establishId(payload) {
            var obj = JSON.parse(payload);
            var id = obj.document.id ? obj.document.id : fo.utils.generateUUID();
            obj.document.id = id;
            return obj;
        }

        fo.subscribe('fileAdded.knt', function (payload, name, ext) {
            var current = result.currentApp;
            var establishApp = makeEstablish(result.appTable)

            var establishDocument = makeEstablish(result.documentTable)
            var obj = establishId(payload);

            var doc = app.typeFactory().newKnowtAsset({
                id: obj.id,
                payload: JSON.stringify(obj),
                filename: name,
                extension: ext,
                owner: current.userId,
            }, current);


            establishDocument(doc);
            current.capture(doc, obj.id)
            doc.payload = '';


            establishApp(current);
        });

        fo.subscribe('fileAdded.csv', function (payloadCSV, name, ext) {
            var current = result.currentApp;
            var establishApp = makeEstablish(result.appTable)


            var payload = fo.convert.csvToJson(payloadCSV);
            var establishDocument = makeEstablish(result.documentTable)


            var obj = JSON.parse(payload);
            obj.id = fo.utils.generateUUID();

            var doc = app.typeFactory().newKnowtAsset({
                id: obj.id,
                payload: JSON.stringify(obj),
                filename: name,
                extension: ext,
                owner: current.userId,
            }, current);

            establishDocument(doc);
            current.capture(doc, obj.id)
            doc.payload = '';

            establishApp(current);

        })

        return result;
    });


}(knowtApp, Foundry));
