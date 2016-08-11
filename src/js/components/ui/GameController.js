/**
 * Main handler for UI component
 */
import Scene from './Scene';

export default class GameController{
    /**
     * Init UI Controller
     * @param configs {object} all base configs
     * {
     *     base: {},
     *     init: {},
     *     config:{}
     * }
     * @param renderer
     * @param utils
     * @param ua_cb User Action callback
     * @param fl_cb Finish Load callback
     */
    constructor(configs,
                renderer,
                utils,
                ua_cb,
                fl_cb
            ){
        configs.cb = ua_cb;
        configs.fl = fl_cb;

        let me = this;

        me.view = configs.view;
        me.model = configs.model;
        me.model.handleInitResponse(configs);

        me._utils = utils;
        me._renderer = renderer;
        me.canvasList = {};

        me._init(configs);
        me._updateBalance();

        me.animationBuffer = [];
        me.currentTime = 0;
        me.timeFromStart = 0;
        me.paused = false;
        me.currentStepTime = 0;
        me.renderLoopEndEvents = [];
        me.isRunning = false;
        me.sprites = configs.base.images.sprites || {};

        // Select which render function to use
        me._selectRenderFunction();
        me.start();
    }

    /**
     * Base Init
     * @param configs
     * @private
     */
    _init(configs){
        let me = this;
        me._initRenderer(configs.base);
        me._setupImages(configs);
    }

    /**
     * Start to render
     */
    start(){
        var me = this;

        // Switch current scene
        // me.currentScene = sceneName;

        me.isRunning = true;

        me.currentTime = 0;           // Time since the animation started
        me.lastTimeStepOccured = Date.now();   // The time of last time step render
        me.paused = false;

        // me.scenes[me.currentScene].lists.sort(function (a, b) {
        //     return a.prop.depth - b.prop.depth;
        // });

        me._requestNextAnimationStep();
    }

    /**
     * @private
     * Select which render function to use
     */
    _selectRenderFunction() {
        var me = this;

        this.animationFunction = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                clearTimeout(me.renderTimeout);
                me.renderTimeout = setTimeout(callback, Math.round(1000 / 60));
            };
    }

    /**
     * @private
     *
     * @return {number}
     */
    _updateTime() {
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
    _requestNextAnimationStep() {
        var me = this;

        me.animationFunction.call(window, function () {
            me._run();
        });
    }

    /**
     * @private
     * Main render method
     */
    _run() {
        let me = this;

        me.renderLoopEndEvents.length = 0;

        me._calculate();
        me._animate();

        me.renderer.render(me.stage);


        // If we are allowed to draw another time step, do so
        if (me._shouldRenderNextFrame()) {
            me.lastTimeStepOccured = me._updateTime();

            // Request next animation step
            me._requestNextAnimationStep();
        } else {
            me.isRunning = false;
        }
    }

    /**
     * @private
     * @returns {boolean}
     */
    _shouldRenderNextFrame() {
        return (!this.paused);
    }

    /**
     * @private
     * Runs the animation loop one time step
     */
    _calculate() {
        let me = this;

        // Run the scene
        me._currentScene.run({
            timeStep: me.currentStepTime,
            time: me.currentTime
        });

        //UPDATE SHADERS UNIFORMS
        // for(name in FiltersNS){
        //     filtersArray = FiltersNS[name];
        //
        //     if(filtersArray instanceof Array && filtersArray.length > 0){
        //         for(i=0;i<filtersArray.length;i++){
        //             filtersArray[i].updateUniforms({
        //                 timeStep: me.currentStepTime,
        //                 time: me.currentTime
        //             });
        //         }
        //     }
        // }

        // }
    }

    /**
     *
     * @private
     */
    _animate () {
        var me = this;

        me.animationBuffer.forEach(function (item) {
            if (item.running) {
                item.run({
                    timeStep: me.currentStepTime,
                    time: me.currentTime
                });
            }
        });
    }

    /**
     * Add Pixi render and main PIXI container
     * @param config
     * @private
     */
    _initRenderer(config) {
        let me = this,
            stage = new this._renderer.Container(),
            renderer;

        renderer = this._renderer.autoDetectRenderer(config.width, config.height, {antialias: true, resolution: 1});
        // renderDisplay = "Auto - ";

        renderer.view.id = "canvasAnimationManager";
        document.getElementById('container').appendChild(renderer.view);

        me.stage = stage;
        me.rootDisplayObject = new this._renderer.Container();
        me.stage.addChild(me.rootDisplayObject);
        me.renderer = renderer;

        me._initScene();
    }

    /**
     * Add a base scene
     * @deprecated
     * @private
     */
    _initScene(){
        let me = this,
            scene = new Scene({utils:me._utils});

        me.model.setData('scenes', scene);
        me._currentScene = scene;
    }

    /**
     * Load all images and make PIXI textures from them
     * @param configs
     * @private
     */
    _setupImages(configs) {
        let me = this,
            rawImages = configs.base.images.animationImages || [],
            fl = configs.fl || function(){console.error('PLEASE, add callback for finish load')},
            images = {};

        me.loader = me._renderer.loader;
        for (let image of rawImages){
            me.loader.add(image.imageName, image.imageSrc);
        }
        me.loader.once('complete', function (loader, res) {
            for (let image in res){
                images[image] = new me._renderer.Texture(
                    new me._renderer.BaseTexture(res[image].data)
                );
            }

            me.model.setData('images', images);

            //Set up my scene after promise end
            me.view.init(me.stage, configs.cb);
            //call a callback
            fl();
        });
        me.loader.load();
    }

    /**
     * @deprecated
     * @param item
     */
    addAnimationItem(item) {
        var me = this,
            index = me.animationBuffer.indexOf(item);

        if (index === -1) {
            this.animationBuffer.push(item);
        }
    }

    /**
     * @deprecated
     * @param item
     */
    removeAnimationItem(item) {
        var me = this,
            index = me.animationBuffer.indexOf(item);

        if (index > -1) {
            me.animationBuffer.splice(index, 1);
        }
    }

    /**
     * Start the animation again
     */
    continueAnimation() {
        this.paused = false;

        this._run();
    }

    /**
     * Handle server response after user action
     * @param responses {object}
     * {
     *     config: {},
     *     action: {}
     * }
     */
    setState(responses){
        this.model.setData('configResponse', responses.config);
        this.model.setData('nextAction', responses.action);

        let action = responses.action;

        if (typeof action.errorCode === 'string' && action.errorCode.length > 0){
            this.view.spinAction(action);
        } else {
            this.model.setData('balance', action.balance);
            this.view.spinAction();
        }
    }

    /**
     * Handle Server Response Error
     * @param action
     */
    errorAction(action){
        alert('Bad... '+ action.error);
    }

    /**
     * Updates model
     * @param new_balance
     * @private
     */
    _updateBalance(new_balance = this.model.getData('initResponse').balance){
        this.model.setData('balance', new_balance);
    }
}