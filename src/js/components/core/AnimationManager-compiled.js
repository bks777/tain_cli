// import Utilities from '../../utilites';
// import Scene from '../ui/Scene'
//
// export default class AnimationManager {
//     constructor(config) {
//         let me = this;
//
//         //set up a canvas list
//         me.canvasList = {};
//
//         me.initWebGL(config);
//
//         me.animationBuffer = [];
//
//         me.currentTime = 0;
//         me.timeFromStart = 0;
//
//         me.paused = false;
//
//         me.currentStepTime = 0;
//
//         me.setupImages(config.images);
//
//         me.setupScenes(config.scenes);
//
//         me.renderLoopEndEvents = [];
//
//         me.isRunning = false;
//
//         me.sprites = config.images.sprites;
//
//         // Select which render function to use
//         me.selectRenderFunction();
//     }
//
//     /**
//      * Starts the animation for the given queue
//      *
//      * @param {String} sceneName Name of the scene to start
//      */
//     start (sceneName) {
//         var me = this;
//
//         // Switch current scene
//         me.currentScene = sceneName;
//
//         me.isRunning = true;
//
//         me.currentTime = 0;           // Time since the animation started
//         me.lastTimeStepOccured = Date.now();   // The time of last time step render
//         me.paused = false;
//
//         me.scenes[me.currentScene].lists.sort(function (a, b) {
//             return a.prop.depth - b.prop.depth;
//         });
//
//         me.requestNextAnimationStep();
//     }
//
//     /**
//      *
//      * @param sceneName
//      */
//     switchScenes(sceneName) {
//         this.currentScene = sceneName;
//     }
//
//     /**
//      * Removes all the scenes from the specified scene
//      * @param {String} sceneName The scene to be cleared
//      */
//     clearScene(sceneName) {
//         if (typeof sceneName !== "undefined") {
//             this.scenes[sceneName].lists = [];
//         }
//     }
//
//     addToRenderLoop(list, sceneName) {
//         var me = this,
//             targetScene = typeof sceneName !== "undefined" ? sceneName : this.currentScene;
//
//         if (list.id !== "reelsMainList"){
//             console.error("change list to Container and use addPixiToRenderLoop")
//         }
//
//         // Make sure that the list does not already exist in the scene
//         if (!me.isInScene(list, targetScene)) {
//             me.scenes[targetScene].lists.push(list);
//
//             list.pixiItem.listDepth = me.getListDepth(list);
//             if (list.pixiItem.listDepth >= 0) {
//                 me.addAndSort(list.pixiItem);
//             }
//         }
//         // If it does make sure that it is running
//         else {
//             list.prop.running = true;
//         }
//     }
//
//     addAndSort(item) {
//         var me = this;
//
//         me.rootDisplayObject.addChild(item);
//         me.rootDisplayObject.children.sort(function (a, b) {
//             return a.listDepth - b.listDepth;
//         })
//     }
//
//     getListDepth(item) {
//         var me = this,
//             depth;
//
//         depth = zIndeces.indexOf(item.id);
//         if (depth < 0) {
//             console.error("Invalid depth of list " + item.id);
//         }
//         return depth;
//     }
//
//     addPixiToRenderLoop(item) {
//         var me = this;
//         item.listDepth = me.getListDepth(item);
//         if (item.listDepth >= 0) {
//             me.addAndSort(item);
//         }
//     }
//
//     /**
//      * Check if the provided list is present in the provided scene.
//      *
//      * @param {Animation.CanvasAnimationList} list The list to check for
//      * @param {String} scene The name of the scene
//      * @return {Boolean} True if it is already there and false other
//      */
//     isInScene(list, scene) {
//         var targetScene = Utilities.isDefined(scene) ? scene : this.currentScene,
//             sceneObj = this.scenes[targetScene];
//
//         return (sceneObj.lists.contains(list) || sceneObj.listsToAdd.contains(list) || sceneObj.nonActiveLists.contains(list));
//     }
//
//     /**
//      * Check if the manager is running render loop
//      */
//     isRunningRendering() {
//         return this.isRunning;
//     }
//
//     /**
//      * Removes the specified list from the current scene
//      *
//      * @param {Animation.CanvasAnimationList} list The list to remove
//      * @param {String} [scene] The list to remove
//      */
//     removeList(list, scene) {
//         var me = this,
//             sceneToUse = Utilities.isDefined(scene) ? scene : me.currentScene,
//             currentScene = me.scenes[sceneToUse],
//             activeIndex = currentScene.lists.indexOf(list),
//             toAddIndex = currentScene.listsToAdd.indexOf(list),
//             nonActiveIndex = currentScene.nonActiveLists.indexOf(list);
//
//         // Remove it if it is in the lists array
//         if (activeIndex > -1) {
//             currentScene.lists[activeIndex].prop.running = false;
//         }
//         else if (nonActiveIndex > -1) {
//             currentScene.nonActiveLists[nonActiveIndex].prop.running = false;
//         }
//         else if (toAddIndex > -1) {
//             currentScene.listsToAdd.splice(toAddIndex, 1);
//         }
//     }
//
//
//     /**
//      * Pause the animation
//      */
//     pauseAnimation() {
//         this.paused = true;
//
//         clearTimeout(this.renderTimeout);
//     }
//
//     /**
//      * Start the animation again
//      */
//     continueAnimation() {
//         this.paused = false;
//
//         this.run();
//     }
//
//     /**
//      * Returns the sprite index for the specified sprite
//      *
//      * @param {String} name The name of the sprite sequence to get
//      * @return {Array} An array of sprite frames
//      */
//     getSpriteSequence(name) {
//         return this.sprites[name];
//     }
//
//     /**
//      *
//      * @param imagesToAdd
//      */
//     addImages(imagesToAdd) {
//         Utilities.apply(this.images, imagesToAdd);
//     }
//
//     /**
//      *
//      * @return {boolean}
//      */
//     shouldRenderNextFrame() {
//         return (!this.paused);
//     }
//
//
//     /**
//      * @private
//      *
//      */
//     run() {
//         var me = this;
//         me.stats.begin();
//
//         me.renderLoopEndEvents.length = 0;
//
//         me.calculate();
//         me.animate();
//
//         me.renderer.render(me.stage);
//
//         if (me.renderLoopEndEvents.length > 0) {
//             me.fireLoopEndEvents();
//         }
//
//         // If we are allowed to draw another time step, do so
//         if (me.shouldRenderNextFrame()) {
//             me.lastTimeStepOccured = me.updateTime();
//
//             // Request next animation step
//             me.requestNextAnimationStep();
//         } else {
//             me.isRunning = false;
//         }
//
//         me.stats.end();
//     }
//
//     /**
//      * @private
//      * Will fire all the events collected in the last render loop
//      */
//     fireLoopEndEvents() {
//         var me = this,
//             numItems = me.renderLoopEndEvents.length,
//             i, eventObj;
//
//         for (i = -1; ++i < numItems;) {
//             eventObj = me.renderLoopEndEvents[i];
//
//             eventObj.scope.fireEvent(eventObj.event, eventObj.argument);
//         }
//     }
//
//     /**
//      * @private
//      * Runs the animation loop one time step
//      */
//     calculate() {
//         var me = this,
//             name, filtersArray, i,
//             sceneToRun = this.scenes[this.currentScene];
//
//         if (typeof sceneToRun !== "undefined") {
//
//             // Run the scene
//             sceneToRun.run({
//                 timeStep: me.currentStepTime,
//                 time: me.currentTime
//             });
//
//             //UPDATE SHADERS UNIFORMS
//             // for(name in FiltersNS){
//             //     filtersArray = FiltersNS[name];
//             //
//             //     if(filtersArray instanceof Array && filtersArray.length > 0){
//             //         for(i=0;i<filtersArray.length;i++){
//             //             filtersArray[i].updateUniforms({
//             //                 timeStep: me.currentStepTime,
//             //                 time: me.currentTime
//             //             });
//             //         }
//             //     }
//             // }
//
//         } else {
//             console.error("CanvasAnimationManager:calculate - currentScene '" + sceneToRun + "' could not be found");
//         }
//     }
//
//     /**
//      * @private
//      * Signals the manager that the next animation step should be rendered
//      */
//     requestNextAnimationStep() {
//         var me = this;
//
//         me.animationFunction.call(window, function () {
//             me.run();
//         });
//     }
//
//     /**
//      * @private
//      *
//      * @return {number}
//      */
//     updateTime() {
//         var me = this,
//             now = Date.now(),
//             diff = now - me.lastTimeStepOccured;
//
//         // Check if more time than allowed has passed since the last frame
//         if (diff > 250) {
//             diff = 1000 / 60;
//         }
//
//         me.currentStepTime = diff | 0;
//
//         me.currentTime += me.currentStepTime;
//
//         return now;
//     }
//
//     /**
//      * @private
//      * Select which render function to use
//      */
//     selectRenderFunction() {
//         var me = this;
//
//         this.animationFunction = window.requestAnimationFrame ||
//             window.webkitRequestAnimationFrame ||
//             window.mozRequestAnimationFrame ||
//             window.oRequestAnimationFrame ||
//             window.msRequestAnimationFrame ||
//             function (callback) {
//                 clearTimeout(me.renderTimeout);
//                 me.renderTimeout = setTimeout(callback, Math.round(1000 / 60));
//             };
//     }
//
//     /**
//      * @private
//      *
//      * @param extraScenes
//      */
//     setupScenes(extraScenes) {
//         var sceneCfg = Utilities.isDefined(extraScenes) ? extraScenes : [],
//             scenes = {};
//
//         sceneCfg.push("base");
//
//         for (let i of sceneCfg){
//             scenes[i] = new Scene({});
//         }
//
//         this.scenes = scenes;
//         this.scenes.base.play();
//         this.currentScene = "base";
//     }
//
//     setupImages(config) {
//         let me = this,
//             rawImages = Utilities.isDefined(config.files) ? config.files : config,
//             // images = Resources.readData("animationImages") || {},
//             // spines = Resources.readData("spines") || {},
//             // bitmapFonts = Resources.readData("bitmapFonts") || {},
//             spriteConfigurations = Resources.readData("spriteConfigurations") || {},
//             assetsToLoader = [];
//
//         // me.imageReadyEvent = readyEvent;
//         me.imagesRemaining = [];
//         me.remainingImages = 0;
//
//         Sys.iterate(rawImages, function (imageName, imageSrc) {
//             assetsToLoader.push({name: imageName, src: imageSrc});
//         });
//
//         // if (Sys.isDefined(config.spineConfigurations)) {
//         //     Sys.iterate(config.spineConfigurations, function (spineName, JSONPath) {
//         //         assetsToLoader.push({name: spineName, src: JSONPath});
//         //         spines[spineName] = JSONPath;
//         //     });
//         //
//         // }
//
//         // if (Sys.isDefined(config.bitmapFontConfigurations)) {
//         //     Sys.iterate(config.bitmapFontConfigurations, function (bitmapFontName, fntSrc) {
//         //         assetsToLoader.push({name: bitmapFontName, src: fntSrc});
//         //         bitmapFonts[bitmapFontName] = fntSrc;
//         //     });
//         //     Resources.storeData("bitmapFonts", bitmapFonts);
//         // }
//
//         me.loader = PIXI.loader;
//         me.loader.once('complete', function (loader, res) {
//             Sys.iterate(rawImages, function (imageName, imageSrc) {
//                 images[imageName] = PIXI.Texture.fromImage(imageSrc);
//             });
//
//             // Sys.iterate(config.spineConfigurations, function (spineName, spineSrc) {
//             //     spines[spineName] = res[spineName].spineData;
//             // });
//             // Resources.storeData("spines", spines);
//
//             me.images = images;
//             // Resources.storeData("animationImages", images);
//
//             // me.processSprites(me.imageReadyEvent);
//         });
//
//
//         for (var i = 0; i < assetsToLoader.length; i++) {
//             me.loader.add(assetsToLoader[i].name, assetsToLoader[i].src);
//         }
//         me.loader.load();
//
//
//         if (Sys.isDefined(config.spriteConfigurations)) {
//             Sys.iterate(config.spriteConfigurations, function (spriteName, configuration) {
//                 spriteConfigurations[spriteName] = configuration;
//             });
//         }
//         me.spriteConfigurations = spriteConfigurations;
//         Resources.storeData("spriteConfigurations", spriteConfigurations);
//     }
//
//     processSprites(readyEvent) {
//         var me = this;
//
//         for (var key in me.sprites) if (me.sprites.hasOwnProperty(key)){
//             me.sprites[key].frames = me.getFramesFromSpriteSheet(me.sprites[key]);
//         }
//         Resources.storeData("sprites", me.sprites);
//         me.fireEvent(readyEvent);
//     }
//
//     getFramesFromSpriteSheet(config) {
//         var frames = [],
//             texture = this.images[config.texture],
//             fw = config.frameWidth, fh = config.frameHeight;
//
//         if (!Sys.isDefined(texture)) {
//             console.error("Spritesheet texture: " + config.texture + "is not found");
//             return;
//         }
//
//         for (var i = 0; i <= texture.height - fh; i += fh) {
//             for(var j = 0; j <= texture.width - fw; j += fw) {
//                 frames.push(new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(j, i, fw, fh)));
//             }
//         }
//         return frames;
//     }
//
//     //------------------------------------------------------------
//     // PIXI NEW FUNCTIONS
//     //------------------------------------------------------------
//     onResize() {
//         var me = this,
//             scaleValue = Environment.getVirtualToWindowScale(3);
//         me.rootDisplayObject.scale = new PIXI.Point(scaleValue, scaleValue);
//
//     }
//
//     initWebGL(config) {
//         let me = this,
//             stage = new PIXI.Container(),
//             renderer,
//             renderDisplay = "Error";
//
//             renderer = PIXI.autoDetectRenderer(config.width, config.height, {antialias: true, resolution: 1});
//             renderDisplay = "Auto - ";
//             if (Utilities.isDefined(renderer.filterManager)) {
//                 renderDisplay += "WebGL";
//             }
//             else {
//                 renderDisplay += "Canvas";
//             }
//
//         // var queryData = Resources.readData("queryData");
//         // var forceCanvasRendering = queryData.forcecanvasrendering;
//
//         // if (Utilities.isDefined(forceCanvasRendering) && forceCanvasRendering === true) {
//         //     renderer = new PIXI.CanvasRenderer(config.width, config.height, {antialias: false, resolution: 1});
//         //     renderDisplay = "Canvas";
//         // }
//         // else {
//         //     renderer = PIXI.autoDetectRenderer(config.width, config.height, {antialias: true, resolution: 1});
//         //     renderDisplay = "Auto - ";
//         //     if (Utilities.isDefined(renderer.filterManager)) {
//         //         renderDisplay += "WebGL";
//         //     }
//         //     else {
//         //         renderDisplay += "Canvas";
//         //     }
//         //
//         // }
//         //
//         // if (Environment.platform === "mobileLow") {
//         //     renderer = new PIXI.CanvasRenderer(config.width, config.height, {antialias: false, resolution: 1});
//         //     renderDisplay = "Canvas";
//         // }
//         // else {
//         //     renderer = PIXI.autoDetectRenderer(config.width, config.height, {antialias: false, resolution: 1});
//         //     renderDisplay = "Auto - ";
//         //     if (Sys.isDefined(renderer.filterManager)) {
//         //         renderDisplay += "WebGL";
//         //     }
//         // }
//
//         renderer.view.id = "canvasAnimationManager";
//         config.parent.appendChild(renderer.view);
//
//         me.stage = stage;
//         me.rootDisplayObject = new PIXI.Container();
//         me.stage.addChild(me.rootDisplayObject);
//         me.renderer = renderer;
//
//
//         me.setupStats(config, renderDisplay);
//         me.onResize();
//     }
//
//     //@TODO remove stats before release
//     setupStats(config, renderDisplay) {
//         var me = this;
//         me.stats = new Stats();
//         config.parent.appendChild(me.stats.domElement);
//         me.stats.domElement.style.position = "absolute";
//         me.stats.domElement.style.top = '17px';
//         me.stats.domElement.style.left = '24px';
//         me.stats.domElement.style.webkitTransform = "scale(1.5)";
//         me.stats.addLogElement("renderer", renderDisplay);
//         // me.stats.domElement.hidden = true;
//     }
//
//     animate () {
//         var me = this;
//
//         me.animationBuffer.forEach(function (item) {
//             if (item.running) {
//                 item.run({
//                     timeStep: me.currentStepTime,
//                     time: me.currentTime
//                 });
//             }
//         });
//     }
//
//     addAnimationItem(item) {
//         var me = this,
//             index = me.animationBuffer.indexOf(item);
//
//         if (index === -1) {
//             this.animationBuffer.push(item);
//         }
//     }
//
//     removeAnimationItem(item) {
//         var me = this,
//             index = me.animationBuffer.indexOf(item);
//
//         if (index > -1) {
//             me.animationBuffer.splice(index, 1);
//         }
//     }
// }
"use strict";

//# sourceMappingURL=AnimationManager-compiled.js.map