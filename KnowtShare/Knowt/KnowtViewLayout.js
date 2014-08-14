
//define type to manage the layout of main knowtShare App.

(function (app, fo, undefined) {

    var result = {};

    result.onScreenResize = function () {
        result.innerWidth = window.innerWidth;
        result.innerHeight = window.innerHeight;

        //fit the drawing canvas inside the container

        var appHeader = window.document.getElementById('appHeader');
        var appHeaderStyle = window.getComputedStyle(appHeader);

        var appContent = window.document.getElementById('appContent');
        var contentTop = parseInt(appHeaderStyle.getPropertyValue("height"));

        var verticalMenu = window.document.getElementById('verticalMenu');

        $(appContent).css("top", contentTop + 'px');
        $(verticalMenu).css("top", contentTop + 'px');

        $(appContent).css("height", (result.innerHeight - contentTop - 3) + 'px');

        var mainContent = window.document.getElementById('mainContent');
        var appFooter = window.document.getElementById('appFooter');

        var diagramContainer = window.document.getElementById('diagramContainer');
        var diagramContainerStyle = window.getComputedStyle(diagramContainer);

        var diagramContainerNavigation = window.document.getElementById('diagramContainerNavigation');
        var diagramContainerNavigationStyle = window.getComputedStyle(diagramContainerNavigation);

        var diagramCanvas = window.document.getElementById('diagramCanvas');
        var diagramCanvasStyle = window.getComputedStyle(diagramCanvas);

        var top = parseInt(diagramContainerNavigationStyle.getPropertyValue("height"));
        $(diagramCanvas).css("top", top + 'px');

        var width = parseInt(diagramContainerStyle.getPropertyValue("width"));
        diagramCanvas.width = width;

        var height = parseInt(diagramContainerStyle.getPropertyValue("height"));
        diagramCanvas.height = height;

        fo.publish('canvasResize', [diagramCanvas, diagramCanvas.width, diagramCanvas.height]);

        var pip = window.document.getElementById('PIP');
        var pipLeft = 0.6 * result.innerWidth
        var pipTop = 0.6 * result.innerHeight;
        $(pip).css("left", pipLeft + 'px');
        $(pip).css("top", pipTop + 'px');
    }

    result.autoResize = function (on) {
        if (on) window.addEventListener('resize', result.onScreenResize, false);
        if (!on) window.removeEventListener('resize', result.onScreenResize, false);
        if (on) {
            setTimeout(result.onScreenResize, 200);
        }
    }

    result.autoResize(true);

    app.forceResizeRefresh = function () {
        result.onScreenResize();
    }

}(knowtApp, Foundry));


