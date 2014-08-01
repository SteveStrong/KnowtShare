

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
        },
        bytesOutStorage: 0,
        bytesInStorage: 0,
        storageCount: 0,
        bytesOutPayload: 0,
        bytesInPayload: 0,

        storageDetails: function () {
            if (this.bytesInPayload < 1000 && this.bytesOutPayload < 1000) {
                return 'R: {0}b  W: {1}b n:{2}'.format(this.bytesInPayload, this.bytesOutPayload, this.storageCount);
            }
            var kbIn = parseInt(this.bytesInPayload / 1000);
            var kbOut = parseInt(this.bytesOutPayload / 1000);
            if (kbIn < 1000 && kbOut < 1000) {
                return 'R: {0}kb  W: {1}kb n:{2}'.format(kbIn, kbOut, this.storageCount);
            }
            mbIn = parseInt(100 * kbIn / 1000) / 100;
            mbOut = parseInt(100 * kbOut / 1000) / 100;
            return 'R: {0}mb W: {1}mb n:{2}'.format(mbIn, mbOut, this.storageCount);
        },

    },
    function (properties, subcomponents, parent) {

        var result = fo.makeAdaptor(properties);
        //subscribe to any do* of goto* messages...
        result.subscribeToCommands();

        fo.subscribe('sessionTraffic', function (bytesOut, bytesIn) {
            result.bytesOutTraffic += bytesOut;
            result.bytesInTraffic += bytesIn;
        })

        fo.subscribe('sessionStorage', function (bytesOut, bytesIn) {
            result.storageCount += 1;
            result.bytesOutPayload = bytesOut;
            result.bytesInPayload = bytesIn;

            result.bytesOutStorage += bytesOut;
            result.bytesInStorage += bytesIn;
        })

        fo.subscribe('sessionClientCount', function (count, status) {
            result.clientCount = count;
        })

        return result;
    });


}(knowtApp, Foundry));
