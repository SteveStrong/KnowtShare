

(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('traffic'), {
        clientCount: '#',
        bytesOutTraffic: 0,
        bytesInTraffic: 0,
        trafficDetails: function () {
            var kbIn = parseInt(this.bytesInTraffic / 1000);
            var kbOut = parseInt(this.bytesOutTraffic / 1000);
            if (kbIn < 1000 && kbOut < 1000) {
                return 'I: {0}kb  O: {1}kb'.format(kbIn, kbOut);
            }
            mbIn = parseInt(100 * kbIn / 1000) / 100;
            mbOut = parseInt(100 * kbOut / 1000) / 100;
            return 'I: {0}mb  O: {1}mb'.format(mbIn, mbOut);
        }
    },
    function (properties, subcomponents, parent) {

        var result = fo.makeAdaptor(properties);
        //subscribe to any do* of goto* messages...
        result.subscribeToCommands();

        fo.subscribe('sessionTraffic', function (bytesOut, bytesIn) {
            result.bytesOutTraffic = result.bytesOutTraffic + bytesOut;
            result.bytesInTraffic = result.bytesInTraffic + bytesIn;
        })

        fo.subscribe('sessionClientCount', function (count) {
            result.clientCount = count;
        })

        return result;
    });


}(knowtApp, Foundry));
