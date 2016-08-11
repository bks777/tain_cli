'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Scene = require('./Scene');

var _Scene2 = _interopRequireDefault(_Scene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameController = function () {
    function GameController(config, renderer, utils) {
        _classCallCheck(this, GameController);

        var me = this;

        me._utils = utils;
        me._renderer = renderer;
        me.canvasList = {};
        me._init(config);
        me.animationBuffer = [];
        me.currentTime = 0;
        me.timeFromStart = 0;
        me.paused = false;
        me.currentStepTime = 0;

        me.renderLoopEndEvents = [];
        me.isRunning = false;
        me.sprites = config.images.sprites || {};
        // Select which render function to use
        me._selectRenderFunction();
    }

    _createClass(GameController, [{
        key: 'start',
        value: function start(cb) {}
    }, {
        key: '_init',
        value: function _init(config) {
            var me = this;
            me._initRenderer(config);
            me._setupImages(config.images);
            me._setupScenes(config.scenes);
        }

        /**
         * @private
         * Select which render function to use
         */

    }, {
        key: '_selectRenderFunction',
        value: function _selectRenderFunction() {
            var me = this;

            this.animationFunction = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                clearTimeout(me.renderTimeout);
                me.renderTimeout = setTimeout(callback, Math.round(1000 / 60));
            };
        }

        /**
         * @private
         *
         * @return {number}
         */

    }, {
        key: '_updateTime',
        value: function _updateTime() {
            var me = this,
                now = Date.now(),
                diff = now - me.lastTimeStepOccured;

            // Check if more time than allowed has passed since the last frame
            if (diff > 250) {
                diff = 1000 / 60;
            }

            me.currentStepTime = diff | 0;

            me.currentTime += me.currentStepTime;

            return now;
        }

        /**
         * @private
         * Signals the manager that the next animation step should be rendered
         */

    }, {
        key: '_requestNextAnimationStep',
        value: function _requestNextAnimationStep() {
            var me = this;

            me.animationFunction.call(window, function () {
                me.run();
            });
        }
    }, {
        key: '_initRenderer',
        value: function _initRenderer(config) {
            var me = this,
                stage = new this._renderer.Container(),
                renderer = void 0;

            renderer = this._renderer.autoDetectRenderer(config.width, config.height, { antialias: true, resolution: 1 });
            // renderDisplay = "Auto - ";

            renderer.view.id = "canvasAnimationManager";
            config.parent.appendChild(renderer.view);

            me.stage = stage;
            me.rootDisplayObject = new this._renderer.Container();
            me.stage.addChild(me.rootDisplayObject);
            me.renderer = renderer;
        }
    }, {
        key: '_setupImages',
        value: function _setupImages() {
            var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var me = this,
                rawImages = config.animationImages || [],
                images = {};

            me.loader = me._renderer.loader;
            me.loader.once('complete', function (loader, res) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = rawImages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var image = _step.value;

                        images[image.imageName] = me._renderer.Texture.fromImage(image.imageSrc);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                me.images = images;
            });
        }

        /**
         * @private
         *
         * @param extraScenes
         */

    }, {
        key: '_setupScenes',
        value: function _setupScenes(extraScenes) {
            var sceneCfg = this._utils.isDefined(extraScenes) ? extraScenes : [],
                scenes = {};

            sceneCfg.push("base");

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = sceneCfg[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var i = _step2.value;

                    scenes[i] = new _Scene2.default({ utils: this._utils });
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.scenes = scenes;
            this.scenes['base'].play();
            this.currentScene = "base";
        }
    }]);

    return GameController;
}();

exports.default = GameController;

//# sourceMappingURL=GameController-compiled.js.map