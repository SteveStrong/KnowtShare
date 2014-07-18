

(function (app, fo, undefined) {

    fo.defineType(app.defaultNS('traffic'), {
        bytesOutTraffic: 0,
        bytesInTraffic: 0,
        traffic: function () {
            var kbIn = parseInt(this.bytesInTraffic / 1000);
            var kbOut = parseInt(this.bytesOutTraffic / 1000);
            if (kbIn < 1000 && kbOut < 1000) {
                return 'I: {0}kb  O: {1}kb'.format(kbIn, kbOut);
            }
            mbIn = parseInt(100 * kbIn / 1000) / 100;
            mbOut = parseInt(100 * kbOut / 1000) / 100;
            return 'I: {0}mb  O: {1}mb'.format(mbIn, mbOut);
        }
    });

    //ctrl.updateSessionTraffic = function (bytesOut, bytesIn) {
    //    if (!ctrl.hasSessionKey) return;
    //    fo.runWithUIRefreshLock(function () {
    //        ctrl.bytesOutTraffic = ctrl.bytesOutTraffic + bytesOut;
    //        ctrl.bytesInTraffic = ctrl.bytesInTraffic + bytesIn;
    //    })
    //}


}(knowtApp, Foundry));
