"use strict";

var _utilites = require('./utilites');

var _utilites2 = _interopRequireDefault(_utilites);

var _Game = require('./components/ui/Game');

var _Game2 = _interopRequireDefault(_Game);

var _Loader = require('./components/core/loader/Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _app = require('./components/app/app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appInstance,
    promise = _Loader2.default.httpGet({ url: '../config/config.json' }).then(function (config) {
    appInstance = new _app2.default(JSON.parse(config), _Loader2.default, _Game2.default, PIXI, _utilites2.default);
});

//# sourceMappingURL=main-compiled.js.map