"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Class for loading of resources
 */
var Loader = function () {
    /**
     * Constructor
     */
    function Loader() {
        _classCallCheck(this, Loader);

        this.XHR = "onload" in new XMLHttpRequest() ? XMLHttpRequest : XDomainRequest;
        this.serverAlias = "http://localhost:8080/slot/";
    }

    /**
     * GET Action
     * @param config
     * @returns {Promise}
     */

    _createClass(Loader, [{
        key: "httpGet",
        value: function httpGet() {
            var config = arguments.length <= 0 || arguments[0] === undefined ? { url: 'http://google.com' } : arguments[0];

            var request = new this.XHR();

            return new Promise(function (resolve, reject) {
                request.onload = function () {
                    resolve(request);
                };
                request.onerror = function () {
                    reject(request);
                };
                request.open("GET", config.url, true);
                request.send();
            });
        }

        /*****************SUGAR********************/

        /**
         * Send AJAX request to  Slot Server
         * @param config
         * @returns {Promise}
         */

    }, {
        key: "sendServerXHR",
        value: function sendServerXHR() {
            var config = arguments.length <= 0 || arguments[0] === undefined ? { action: "config" } : arguments[0];

            var serverActionUrl = this.serverAlias + config.action;
            return this.httpGet({ url: serverActionUrl });
        }
    }, {
        key: "loadResources",
        value: function loadResources() {
            console.info('BEGIN to load resources from a parsed JSON-S');
        }

        /**
         * //@TODO In a future server init action must be created
         */

    }, {
        key: "init",
        value: function init() {
            var me = this;
            this.sendServerXHR({ action: 'config' }).then(function () {
                //In case of good response get resources and start the game
                me._getResourceConfig().then(function (data) {
                    me.start(data);
                });
            }).catch(function (data) {
                console.error('Error in connection with a server >>> ', data);
            });
        }
    }, {
        key: "_getResourceConfig",
        value: function _getResourceConfig() {
            var me = this;

            return Promise.all([
            //IMAGES
            me.httpGet({ url: './config/images/desktop.json' }),
            //MAIN
            me.httpGet({ url: './config/config.json' })]);
        }
    }]);

    return Loader;
}();

exports.default = Loader;

//# sourceMappingURL=Loader-compiled.js.map

//# sourceMappingURL=Loader-compiled-compiled.js.map