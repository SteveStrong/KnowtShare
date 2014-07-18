//errorController

var EXCEPTIONS = EXCEPTIONS || {};
(function (ns) {
    var _listeners = [];
    var _errorWindow;
    var _errors = [];

    function sendToListeners(type, error) {
        /// <summary>
        /// Send the event to all attached listeners
        /// </summary>
        /// <param name="type">string: 'ERROR' || 'CLEAR'</param>
        /// <param name="error">object: error</param>
        for (var idx = 0, length = _listeners.length; idx != length; idx++) {
            _listeners[idx](type, error);
        }
    }

    var error = function (number, message, time) {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="number">integer: 1-999 indicates an error that may be recovered from, 1000 and above indicates fatal errrors and should hault application</param>
        /// <param name="message">string: The message to display</param>
        /// <param name="time">optional Date().toTimeString() set internally if not provided</param>
        this.number = number;
        this.message = message;
        if (time) {
            this.time = time;
        }
        else {
            this.time = new Date().toTimeString();
        }
    };

    error.prototype.toHtml = function () {
        var result = '<p>';
        result += 'Error at ' + this.time + "<br/>";
        result += '&nbsp;&nbsp;Number: ' + this.number + "<br/>";
        result += '&nbsp;&nbsp;Message: ' + this.message + "<br/>";
        if (this.isFatal()) {
            result += '&nbsp;&nbsp;A restart of the application is required to continue<br/><br/>';
        }
        result += '</p>';
        return result;
    }

    error.prototype.toText = function () {
        var result = 'Error at ' + this.time;
        result += ' - Number: ' + this.number;
        result += ' - Message: ' + this.message;
        if (this.isFatal()) {
            result += " - CTRL + F5 to restart...";
        }
        return result;
    }

    error.prototype.isFatal = function () {
        /// <summary>
        /// Determines it the error is fatal
        /// </summary>
        /// <returns type="integer"></returns>
        return this.number > 999;
    }

    ns.attachListener = function (listener) {
        /// <summary>
        /// Attaches a function to call in response to exception events.  Function parameters include [type] with possible values 'ERROR' || 'CLEAR' 
        /// and error which is the error object with properties number, message, and time.  In the event that type is 'CLEAR' the error parameter will be undefined.
        /// </summary>
        /// <param name="listener">function in the form function(type,error)</param>
        _listeners.push(listener);
    }

    ns.setError = function (number, message) {
        /// <summary>
        /// Creates a new error object and appends to the current set of uncleared errors. Raises the event to all functions attached via the 
        /// attachListener method.  *Note that the exception will set the current time stamp internally.
        /// </summary>
        /// <param name="number">integer: 1-999 indicates an error that may be recovered from, 1000 and above indicates fatal errrors and should hault application</param>
        /// <param name="message">string: The message to display</param>
        if (_errors.length === 100) {
            _errors.shift();
        }
        var newError = new error(number, message);
        _errors.push(newError);
        sendToListeners('ERROR', newError);
    }

    ns.allErrors = function () {
        /// <summary>
        /// Gets the complete array of uncleared errors
        /// </summary>
        /// <returns type="error[]"></returns>
        return _errors;
    }

    ns.loadFromSession = function () {
        /// <summary>
        /// Reads previously saved uncleared errors from session at key 'EXCEPTIONS'
        /// </summary>
        _errors.length = 0;
        var jsonString = window.sessionStorage.getItem('EXCEPTIONS');
        if (jsonString) {
            var jsonObject = JSON.parse(jsonString);
            jsonObject.forEach(function (item) {
                _errors.push(new error(item.number, item.message, item.time));
            });
        }
    }

    ns.saveToSession = function () {
        /// <summary>
        /// Saves uncleared errors to session at key 'EXCEPTIONS'.
        /// </summary>
        window.sessionStorage.setItem('EXCEPTIONS', JSON.stringify(_errors));
    }

    ns.clearError = function (number) {
        /// <summary>
        /// Clears a previously created error with the error.number equal to arg number.
        /// </summary>
        /// <param name="number">The number of the error to clear.</param>
        var filteredErrors = _errors.filter(function (item) {
            return item.number != number;
        });
        if (_errors.length != filteredErrors.length) {
            _errors = filteredErrors;
            var lastError = ns.lastError();
            if (lastError) {
                sendToListeners('ERROR', lastError);
            }
            else {
                sendToListeners('CLEAR');
            }
        }
    }

    ns.clearAll = function () {
        /// <summary>
        /// Clears all errors
        /// </summary>
        _errors.length = 0;
        sendToListeners('CLEAR');
    }

    ns.lastError = function () {
        /// <summary>
        /// Gets the last error of highest magnitude
        /// </summary>
        /// <returns type="error"></returns>
        var result;
        _errors.forEach(function (item) {
            if (item.isFatal()) {
                result = item;
            }
        });
        if (!result) {
            if (_errors.length != 0) {
                return _errors[_errors.length - 1];
            }
        }
        return result;
    }

    ns.openErrorWindow = function () {
        /// <summary>
        /// Saves the errors to sesstion and launches a popup window that reads the errors and displays them.
        /// </summary>
        ns.saveToSession();
        var width = 500;
        var height = 400;
        var screenLeft = window.screenX || window.screenLeft || 0;
        var screenTop = window.screenY || window.screenTop || 0;
        var left = ((window.innerWidth - width) / 2) + screenLeft;
        var top = ((window.innerHeight - height) / 2) + screenTop;
        var features = 'height=' + height + ', width=' + width + ', left=' + left + ', top=' + top + ', location=0, menubar=0, toolbar=0, scrollbar=1, resizeable=1';
        _errorWindow = window.open('errors.html', '_blank', features);
        _errorWindow.onbeforeunload = function () {
            window.removeEventListener("beforeunload", closeErrorWindow, false);
        }
        window.addEventListener("beforeunload", closeErrorWindow, false);
    }

    function closeErrorWindow() {
        _errorWindow.close()
    }

})(EXCEPTIONS);

(function (app, ex, undefined) {

    var header = app.header;

    function errorController($scope, $log) {



        $scope.errorNumber = 0;

        $scope.errorMessage = '';

        $scope.header = header;



        var errorListener = function (type, data) {

            if (type === 'CLEAR') {

                $scope.errorNumber = 0;

                $scope.errorMessage = '';

            }

            else if (type === 'ERROR') {

                $scope.errorMessage = data.toText();

                $scope.errorNumber = data.number;

            }

        }

        ex.attachListener(errorListener);



        $scope.showAllErrors = function () {

            ex.openErrorWindow();

        }

    }

    app.controller('errorController', errorController);

    app.directive('errorHeader', function () {

        function linkFunc(scope, element, attrs) {
        };

        return {
            restrict: 'EA',
            replace: false,
            link: linkFunc,
            controller: errorController,
            templateUrl: "errorHeader.html",
        }
    });



}(knowtApp, EXCEPTIONS));

