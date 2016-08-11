import Model from '../../core/Model';
import {viewConfig} from '../viewConfig';

export default class ReelsController {

    constructor(config) {
        this.model = new Model();
        this._init(config);
        this.tweens = [];
    }

    /**
     * @param config
     * @private
     */
    _init(config){
        var reelsContainer = new config.me.renderer.Container(),
            scale = config.me.model.getData('scaleFactor');

        reelsContainer.position = new config.me.renderer.Point(viewConfig.reelsPosition.x, viewConfig.reelsPosition.y);
        reelsContainer.width = viewConfig.reelsWidth;
        reelsContainer.height = viewConfig.reelsHeight;

        this._symWidth = config.textures.symA.width * scale.x * 0.8;
        this._symHeight = config.textures.symA.height * scale.y * 0.8;
        this._rootContainer = reelsContainer;

        this.model.setData('textures', config.textures);
        this.model.setData('renderer', config.me.renderer);
        this.model.setData('allowedSyms', 'ABC');
        this.model.setData('reelAnimTime', .5);

        this._initReelSet(config.reelSet);

        config.me.currentScene.addChild(reelsContainer);
    }

    /**
     * Creates PIXI container and all reels containers and symbols (sprites)
     * @param reelSet
     * @private
     */
    _initReelSet(reelSet){
        var   tempSyms = {},
            tempReels = {},
            symIdx,
            reelIdx = 0,
            reelsArray = [],
            renderer = this.model.getData('renderer'),
            textures = this.model.getData('textures');

        for(let reel of reelSet){
            tempReels[reelIdx] = new renderer.Container();
            reelsArray[reelIdx] = [];
            tempReels[reelIdx].width = this._symWidth + viewConfig.symbols.distanceBetween * 2;
            tempReels[reelIdx].height = viewConfig.reelsHeight;
            tempReels[reelIdx].position = new renderer.Point((reelIdx * this._symWidth)
                + (viewConfig.reelsPosition.distanceBetween * reelIdx), 0);
            symIdx = 0;
            //Fake Sym
            tempSyms[symIdx - 1] = new renderer.Sprite(
                textures[this._generateSymName(this.model.getData('allowedSyms'), false)]
            );
            tempSyms[symIdx - 1].width = this._symWidth;
            tempSyms[symIdx - 1].height = this._symHeight;
            tempSyms[symIdx - 1].x = viewConfig.symbols.distanceBetween;
            this._tempY =Math.floor(
                tempSyms[symIdx - 1].y = - (tempSyms[symIdx - 1].height + viewConfig.symbols.distanceBetween));
            tempReels[reelIdx].addChild(tempSyms[symIdx - 1]);
            reelsArray[reelIdx].push(tempSyms[symIdx - 1]);
            tempSyms[symIdx - 1].visible = false;
            //Other Syms
            for (let sym of reel){
                tempSyms[symIdx] = new renderer.Sprite(
                    textures[this._generateSymName(sym, false)]
                );
                tempSyms[symIdx].width = this._symWidth;
                tempSyms[symIdx].height = this._symHeight;
                tempSyms[symIdx].x = viewConfig.symbols.distanceBetween;
                tempSyms[symIdx]._tempY =Math.floor(
                    tempSyms[symIdx].y = (this._symHeight * symIdx) + (
                        viewConfig.symbols.distanceBetween * symIdx));
                tempReels[reelIdx].addChild(tempSyms[symIdx]);
                reelsArray[reelIdx].push(tempSyms[symIdx]);
                symIdx++;
            }
            this._rootContainer.addChild(tempReels[reelIdx]);
            reelIdx++;
        }

        this.model.setData('curReelSet', reelsArray);

        this._tempEndY = Math.floor(reelsArray[0][reelsArray[0].length - 1].y +
            reelsArray[0][reelsArray[0].length - 1].height +
            viewConfig.symbols.distanceBetween);
    }

    _generateSymName(string, isBlurred){
        let ending = isBlurred ? '_b' : '';
        return 'sym' + string[Math.floor(Math.random() * string.length)]+ ending;
    }
    /**
     *
     * @param symbol
     * @param isBlur
     * @private
     */
    _addFakeSymbol(symbol, isBlur){
        symbol.texture = this.model.getData('textures')[this._generateSymName(this.model.getData('allowedSyms'), isBlur)];
        symbol.y = this._tempY;
       this._animateSymbol(symbol);
    }

    /**
     * make tween animation. The easiest way to implement animation.
     * @param sym
     * @private
     */
    _animateSymbol(sym){
        let me = this;
        me.tweens.push(TweenLite.to(sym, me.model.getData('reelAnimTime'), {
            y: 1000 + sym.y, //@TODO move it
            onUpdate: function () {
                if(this.target.y >= me._tempEndY){
                    me._addFakeSymbol(sym, true);
                    this.kill();
                    me.tweens.slice(me.tweens.indexOf(this), 1);
                }
            },
            ease: 'Linear.easeNone'
        }))
    }

    /**
     *
     * @param reel
     * @private
     */
    _startReelAnimation(reel){
        let symIdx = 0;
        for (let sym of reel){
            this._animateSymbol(sym);
            if(symIdx === 0){
                sym.visible = true;
            }
            symIdx++;
        }
    }

    /**
     * Start all reel animation
     */
    animate(){
        let reelset = this.model.getData('curReelSet');
        for(let reel of reelset){
            this._startReelAnimation(reel)
        }
    }

    /**
     * Stops all animations
     * @param newReels
     */
    stop(newReels){
        let reelset = this.model.getData('curReelSet'),
            textures = this.model.getData('textures'),
            symIdx,
            reelIdx = 0,
            me = this,
            sym;
        for (let tween of this.tweens){
            tween.kill();
        }
        this.tweens = [];
        for (let reel of reelset){
            symIdx = 0;
            for (let sym of reel){
                if (symIdx === 0) {
                    symIdx++;
                    sym.y = me._tempY;
                    sym.visible = false;
                    continue;
                }
                sym.texture = textures['sym' + newReels[reelIdx][symIdx - 1]];
                sym.y = sym._tempY;
                symIdx++;
            }
            reelIdx++;
        }
    }
}