
//define type to manage the layout of main knowtShare App.

(function (app, fo, undefined) {

    var $appHeader = $('#appHeader');
    var $appFooter = $('#appFooter');
    var $verticalMenu = $('#verticalMenu');
    var $horizontalMenu = $('#horizontalMenu');
    var $pictureContainer = $('#pictureContainer');
    var $textContainer = $('#textContainer');
    var $textCanvas = $('#textCanvas');


    var spec = {
        isViewOnlySession: false,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        margin: 5,
        aspectRatio: function () {
            return this.innerWidth / this.innerHeight;
        },
        headerHeight: function () {
            return $appHeader.height();
        },
        footerHeight: function () {
            return $appFooter.height();
        },
        canvasTop: function () {
            return this.headerHeight + this.horizontalMenuHeight;
        },
        canvasLeft: function () {
            return this.verticalMenuWidth + this.margin;
        },
        canvasWidth: function () {
            return this.innerWidth - this.verticalMenuWidth - 2 * this.margin;
        },
        canvasHeight: function () {
            return this.innerHeight - this.canvasTop - this.footerHeight - 2 * this.margin;
        },
        verticalMenuWidth: function () {
            var result = $verticalMenu.width();
            if (this.aspectRatio < 1 || this.isViewOnlySession) result = 0;
            return result;
        },
        horizontalMenuHeight: function () {
            var result = $horizontalMenu.height();
            if (this.aspectRatio > 1 || this.isViewOnlySession) result = 0;
            return result;
        },
 
    }

    fo.defineType(app.defaultNS('mainLayout'), spec, function (properties, subcomponents, parent) {
        var result = fo.makeAdaptor(properties);

        result.doResize = function () {
            var top = 0;
            var left = 0;
            $appHeader.css("top", top + 'px');
            $appHeader.css("left", left + 'px');


            if (this.aspectRatio > 1) {
                $verticalMenu.css("display", 'block');
                $horizontalMenu.css("display", 'none');
            }
            else {
                $verticalMenu.css("display", 'none');
                $horizontalMenu.css("display", 'block');
            }

            if (this.isViewOnlySession) {
                $verticalMenu.css("display", 'none');
                $horizontalMenu.css("display", 'none');
            }

            $verticalMenu.css("top", this.canvasTop + 'px');
            $verticalMenu.css("left", left + 'px');

            $horizontalMenu.css("top", this.headerHeight + 'px');
            $horizontalMenu.css("left", left + 'px');

            $pictureContainer.css("top", this.canvasTop + 'px');
            $pictureContainer.css("left", this.canvasLeft + 'px');

            $textContainer.css("top", this.canvasTop + 'px');
            $textContainer.css("left", this.canvasLeft + 'px');
            $textContainer.css("width", this.canvasWidth + 'px');


            $textCanvas.css("height", this.canvasHeight + 'px');

            $appFooter.css("top", this.canvasTop + this.canvasHeight + 'px');
            $appFooter.css("left", left + 'px');
        }

        var drawing = result.drawing;
        result.onScreenResize = function () {
            result.innerWidth = window.innerWidth;
            result.innerHeight = window.innerHeight;

            drawing.setScreenSize(result.canvasWidth, result.canvasHeight);

            result.doResize();
        }

        result.autoResize = function (on) {
            if (on) window.addEventListener('resize', result.onScreenResize, false);
            if (!on) window.removeEventListener('resize', result.onScreenResize, false);
            if (on) result.onScreenResize();
        }

        return result;
    });

}(knowtApp, Foundry));

(function (app, fo, undefined) {

}(knowtApp, Foundry));

