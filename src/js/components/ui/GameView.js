/**
 * View for UI component
 */
import {viewConfig} from './viewConfig';
import Reels from './Reels/ReelsController';
import LinesManager from './Lines/LinesManager';

export default class GameView{
    /**
     * Init of UI View
     * @param model
     * @param renderer
     */
    constructor(model, renderer){
        this.model = model;
        this.renderer = renderer;
    }

    /**
     * Init function for all UI components
     * @param globalContainer
     * @param cb callback for user action
     */
    init(globalContainer, cb){
        let me = this,
            textures = me.model.getData('images'),
            reelSet = me.model.getData('curReelSet');

        me.currentScene = globalContainer;

        //call init for all UI components
        me._createBG(textures);
        me._createControls(textures);
        me._createReels(textures, reelSet);
        me._createSpinBtn(textures, cb);
        me._createBetLines(this.model.getData('configResponse'));
    }

    /**
     * Created the background container
     * @private
     * @param textures Pixi textures
     */
    _createBG(textures){
        let me = this,
            rootContainer = new me.renderer.Container(),
            bgImage = new me.renderer.Sprite(textures.background),
            baseConfig = me.model.getData('baseConfig'),
            dimensions = {
                real: {
                    width: bgImage.width,
                    height: bgImage.height
                },
                base: {
                    width: baseConfig.width,
                    height: baseConfig.height
                }
            },
            scale;


        me._setScaleFactor(dimensions.real, dimensions.base);
        scale = me.model.getData('scaleFactor');

        bgImage.width *= scale.x;
        bgImage.height *= scale.y;

        rootContainer.addChild(bgImage);
        me.currentScene.addChild(rootContainer);
    }

    /**
     * set global scale
     * @param real_dimensions
     * @param new_dimensions
     * @private
     */
    _setScaleFactor(real_dimensions, new_dimensions){
        let scaleFactor = {
            x: new_dimensions.width / real_dimensions.width,
            y: new_dimensions.height / real_dimensions.height
        };

        this.model.setData('scaleFactor', scaleFactor);
    }

    /**
     *
     * @param textures
     * @private
     */
    _createControls(textures){
        let controlsContainer = new this.renderer.Container(),
            balanceContainer = new this.renderer.Container(),
            balanceLabel = new this.renderer.Text(viewConfig.text.balance.text, viewConfig.text.style),
            balanceText = new this.renderer.Text(
                this.model.getData('balance') / this.model.getData('denominator'),
                viewConfig.text.balance.contentStyle),
            totalBetText = new this.renderer.Text(
                viewConfig.text.totalBet.text +
                    (this.model.getData('activeBetLines') * this.model.getData('betPerLine')),
                viewConfig.text.style),
            totalWinText = new this.renderer.Text(viewConfig.text.totalWin.text, viewConfig.text.style),
            roundText = new this.renderer.Text(viewConfig.text.rounds.text
                + this.model.getData('initResponse')['gameRoundId'], viewConfig.text.style);

        console.log(this.model._data);
        if (+this.model.getData('initResponse')['totalWin'] > 0){
            totalWinText.text += this.model.getData('initResponse')['totalWin'];
        }
        //Settings positions
        totalBetText.position = new this.renderer.Point(
            viewConfig.text.totalBet.position.x,
            viewConfig.text.totalBet.position.y
        );
        totalWinText.position = new this.renderer.Point(
            viewConfig.text.totalWin.position.x,
            viewConfig.text.totalWin.position.y
        );
        roundText.position = new this.renderer.Point(
            viewConfig.text.rounds.position.x,
            viewConfig.text.rounds.position.y
        );
        balanceContainer.position = new this.renderer.Point(
            viewConfig.text.balance.position.x,
            viewConfig.text.balance.position.y
        );
        balanceText.y = balanceLabel.height;

        this._generateBetsPanel(textures['arrow']);
        this._generateTotalLinesPanel(textures['arrow']);

        controlsContainer.addChild(totalBetText);
        controlsContainer.addChild(totalWinText);
        controlsContainer.addChild(roundText);
        controlsContainer.addChild(balanceContainer);
        balanceContainer.addChild(balanceLabel);
        balanceContainer.addChild(balanceText);
        this.currentScene.addChild(controlsContainer);

        this._balanceText = balanceText;
        this._winText = totalWinText;
        this._roundText = roundText;
        this._totalBetText = totalBetText;
    }

    /**
     * Generates two buttons and labels for a bet
     * @param texture
     * @private
     */
    _generateBetsPanel(texture){
        let me = this,
            betPerLine = this.model.getData('betPerLine'),
            betPanelContainer = new this.renderer.Container(),
            betLeftButton = new this.renderer.Sprite(texture),
            betRightButton = new this.renderer.Sprite(texture),
            betLabel = new this.renderer.Text(betPerLine + '', viewConfig.text.style),
            betCaption = new this.renderer.Text('BET/LINE:', viewConfig.text.style),
            filter = new this.renderer.filters.GrayFilter();

        betLeftButton.x = 0;
        betLabel.x = betLeftButton.width;
        betLabel.y -= viewConfig.betPanel.labelOffset;
        betRightButton.x = betLabel.x + viewConfig.betPanel.labelWidth;

        //make buttons
        betLeftButton.interactive = true;
        betLeftButton.buttonMode = true;
        betLeftButton.defaultCursor = 'pointer';
        //decrement
        betLeftButton.click = function(){
            let newBetPerLine = me.model.getData('betPerLine')
            - viewConfig.betPanel.betDelta < 0 ? 0 : me.model.getData('betPerLine') - viewConfig.betPanel.betDelta;
            betLabel.text = newBetPerLine + '';
            //Disabling/enabling
            if (newBetPerLine === 0){
                betLeftButton.filters = [filter];
                betRightButton.filters = null;
            } else {
                betLeftButton.filters = null;
                betRightButton.filters = null;
            }
            me.model.setData('betPerLine', newBetPerLine);
            me._updateTotalBet();
        };

        betRightButton.interactive = true;
        betRightButton.buttonMode = true;
        betRightButton.defaultCursor = 'pointer';
        //increment
        betRightButton.click = function(){
            let newBetPerLine = me.model.getData('betPerLine')
            + viewConfig.betPanel.betDelta > viewConfig.betPanel.maxBetPerLine
                ? viewConfig.betPanel.maxBetPerLine
                : me.model.getData('betPerLine') + viewConfig.betPanel.betDelta;
            betLabel.text = newBetPerLine + '';
            //Disabling/enabling
            if (newBetPerLine === viewConfig.betPanel.maxBetPerLine){
                betRightButton.filters = [filter];
                betLeftButton.filters = null;
            } else {
                betRightButton.filters = null;
                betLeftButton.filters = null;
            }
            me.model.setData('betPerLine', newBetPerLine);
            me._updateTotalBet();
        };

        //rotate a texture
        betLeftButton.anchor = new this.renderer.Point(1, 1);
        betLeftButton.rotation = Math.PI / 2 * 90;
        betLeftButton.y -= 2;//Setting proper Y after rotating. Maybe it's a bug of png texture.

        //check for disable
        if(betPerLine >=  viewConfig.betPanel.maxBetPerLine){
            betRightButton.filters = [filter];
        } else if (betPerLine <= 0){
            betLeftButton.filters = [filter];
        }

        betCaption.y = - (betCaption.height + viewConfig.betPanel.captionOffset);

        betPanelContainer.addChild(betCaption);
        betPanelContainer.addChild(betLeftButton);
        betPanelContainer.addChild(betLabel);
        betPanelContainer.addChild(betRightButton);

        //setting position for container
        betPanelContainer.x = viewConfig.betPanel.x;
        betPanelContainer.y = viewConfig.betPanel.y;
        this.currentScene.addChild(betPanelContainer);
    }

    _generateTotalLinesPanel(texture){
        let me = this,
            activeLinesCount = this.model.getData('activeBetLines'),
            linesPanelContainer = new this.renderer.Container(),
            linesLeftButton = new this.renderer.Sprite(texture),
            linesRightButton = new this.renderer.Sprite(texture),
            linesLabel = new this.renderer.Text(activeLinesCount + '', viewConfig.text.style),
            linesCaption = new this.renderer.Text('LINES:', viewConfig.text.style),
            filter = new this.renderer.filters.GrayFilter();

        linesLeftButton.x = 0;
        linesLabel.x = linesLeftButton.width + linesLabel.width / 2;
        linesLabel.y -= viewConfig.linesPanel.labelOffset;
        linesRightButton.x = linesLabel.x + viewConfig.linesPanel.labelWidth;

        //make buttons
        linesLeftButton.interactive = true;
        linesLeftButton.buttonMode = true;
        linesLeftButton.defaultCursor = 'pointer';
        //decrement
        linesLeftButton.click = function(){
            let newLinesCount = me.model.getData('activeBetLines')
            - viewConfig.linesPanel.linesDelta < 0 ? 0 :
                me.model.getData('activeBetLines') - viewConfig.linesPanel.linesDelta;
            linesLabel.text = newLinesCount + '';
            //Disabling/enabling
            if (newLinesCount === 0){
                linesLeftButton.filters = [filter];
                linesRightButton.filters = null;
            } else {
                linesLeftButton.filters = null;
                linesRightButton.filters = null;
            }
            me.model.setData('activeBetLines', newLinesCount);
            me._updateTotalBet();
        };

        linesRightButton.interactive = true;
        linesRightButton.buttonMode = true;
        linesRightButton.defaultCursor = 'pointer';
        //increment
        linesRightButton.click = function(){
            let newLinesCount = me.model.getData('activeBetLines')
            + viewConfig.linesPanel.linesDelta > viewConfig.linesPanel.maxLines
                ? viewConfig.linesPanel.maxLines
                : me.model.getData('activeBetLines') + viewConfig.linesPanel.linesDelta;
            linesLabel.text = newLinesCount + '';
            //Disabling/enabling
            if (newLinesCount === viewConfig.linesPanel.maxLines){
                linesRightButton.filters = [filter];
                linesLeftButton.filters = null;
            } else {
                linesRightButton.filters = null;
                linesLeftButton.filters = null;
            }
            me.model.setData('activeBetLines', newLinesCount);
            me._updateTotalBet();
        };

        //rotate a texture
        linesLeftButton.anchor = new this.renderer.Point(1, 1);
        linesLeftButton.rotation = Math.PI / 2 * 90;
        linesLeftButton.y -= 1;//Setting proper Y after rotating. Maybe it's a bug of png texture.

        //check for disable
        if(activeLinesCount >=  viewConfig.linesPanel.maxLines){
            linesRightButton.filters = [filter];
        } else if (activeLinesCount <= 0){
            linesLeftButton.filters = [filter];
        }

        linesCaption.y = - (linesCaption.height + viewConfig.linesPanel.captionOffset);

        linesPanelContainer.addChild(linesCaption);
        linesPanelContainer.addChild(linesLeftButton);
        linesPanelContainer.addChild(linesLabel);
        linesPanelContainer.addChild(linesRightButton);

        //setting position for container
        linesPanelContainer.x = viewConfig.linesPanel.x;
        linesPanelContainer.y = viewConfig.linesPanel.y;
        this.currentScene.addChild(linesPanelContainer);
    }

    /**
     *
     * @param textures
     * @param reelSet
     * @private
     */
    _createReels(textures, reelSet){
        var me = this;
        this.reels = new Reels({
            textures,
            reelSet,
            me
        });
    }

    /**
     *
     * @param textures
     * @param sb
     * @private
     */
    _createSpinBtn(textures, sb){
        let me = this,
            spinBtnContainer = new me.renderer.Container(),
            spinBtn = new me.renderer.Sprite(textures.spinBTN),
            scale = me.model.getData('scaleFactor'),
            greyFilter = new me.renderer.filters.GrayFilter();

        spinBtn.width *= scale.x;
        spinBtn.height *= scale.y;

        spinBtnContainer.position = new me.renderer.Point(viewConfig.spinButton.position.x, viewConfig.spinButton.position.y);

        spinBtnContainer.addChild(spinBtn);
        spinBtn.interactive = true;
        spinBtn.buttonMode = true;
        spinBtn.defaultCursor = 'pointer';
        spinBtn.click = function(){
            spinBtn.interactive = false;
            spinBtn.filters = [greyFilter];
            me.linesManager.hideWinLines();
            me.reels.animate();
            sb(me.model.getData('betPerLine'), me.model.getData('activeBetLines'));
        };

        me.currentScene.addChild(spinBtnContainer);
        me._spinBtn = spinBtn;
    }

    /**
     * Make a spin animation
     */
    spinAction(error = false){
        let nextAction = this.model.getData('nextAction');
        if (error){
            this.reels.stop(nextAction.symbols);
            alert(error.errorCode)
        } else {
            this._updateEndActions(nextAction);
        }

    }

    /**
     * After response getted and parsed action!
     * @param nextAction
     * @private
     */
    _updateEndActions(nextAction){
        var newBalance = nextAction.balance,
            newSyms = nextAction.symbols,
            lineResults = nextAction.lineResults,
            me = this;

        setTimeout(function () {
            me._checkForWinAction(lineResults);
            me.reels.stop(newSyms);
            me.model.setData('balance', newBalance);
            me._updateControls();
            me._spinBtn.interactive = true;
            me._spinBtn.filters = null;
        }, viewConfig.responseActionDelay);
    }

    /**
     * Collecting of all win lines win
     * @param lineResults
     * @private
     */
    _checkForWinAction(lineResults){
        let winLines = [],
            totalWin = 0; //@TODO need to be implemented from server side
        for(let line of lineResults){
            if (line.win > 0){
                winLines.push(line);
                totalWin += line.win;
            }
        }
        if (winLines.length > 0){
            this.linesManager.showWinLines(winLines, totalWin);
        } else {
            // console.log('No win');
        }
    }

    /**
     *
     * @param config
     * @private
     */
    _createBetLines(config){
        this.linesManager = new LinesManager(
            config.lines,
            this.renderer,
            this.currentScene,
            this.reels.model.getData('curReelSet')
        );
    }

    /**
     * updates all controls value
     */
    _updateControls(){
        let totalWin = this.model.getData('nextAction')['totalWin'];

        if (+totalWin > 0){
            this._winText.text = viewConfig.text.totalWin.text + totalWin;
        } else {
            this._winText.text = viewConfig.text.totalWin.text;
        }
        this._balanceText.text = this.model.getData('balance') / this.model.getData('denominator');
        this._roundText.text = viewConfig.text.rounds.text + this.model.getData('nextAction')['gameRoundId'];

    }

    /**
     * Updates a bet field from click callbacks
     * @private
     */
    _updateTotalBet(){
        this._totalBetText.text = viewConfig.text.totalBet.text + (this.model.getData('betPerLine')
            * this.model.getData('activeBetLines'))
    }
}