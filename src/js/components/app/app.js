/**
 * Business logic
 */
var AppInstance;

import AppModel from './AppModel';

export default class App {
    /**
     *
     * @param baseConfig base parsed config
     * @param loader Pixi Loader
     * @param gameConstructor constructor of UI component
     * @param PIXI Renerer
     * @param Utilities Base Utils
     */
    constructor(baseConfig, loader, gameConstructor, PIXI, Utilities) {

        this.model = new AppModel();
        this.model.setData('baseConfig', baseConfig);
        this._gameLoaded = false;
        this._loader = loader;

        let me = this;
        this._baseUrl = this.model.getData('baseConfig').baseUrl;

        loader.httpGet({url: this._baseUrl + '/slot/state'})//@TODO make not a fake init response
            .then((res)=>{
                me.model.setData('initResponse', JSON.parse(res));
                loader.httpGet({url: this._baseUrl + '/slot/config'})
                    .then((res)=>{
                        me.model.setData('configResponse', JSON.parse(res));
                        let responses = {
                            base:  me.model.getData('baseConfig'),
                            init: me.model.getData('initResponse'),
                            config: me.model.getData('configResponse'),
                        };
                        //create UI instance
                        me._game = new gameConstructor(
                            responses,
                            PIXI,
                            Utilities,
                            me.gameStart.bind(me),
                            me.gameLoaded.bind(me)
                        );
                    });
            });
    }

    /**
     * Callback of User Action
     * @param bet Bet per line
     * @param linesCount number of lines i a round
     */
    gameStart(bet = 100, linesCount = 3) {
        var me = this;
        if (!me._gameLoaded) {
            console.error('gameStartCalled on game which is not ready');
            return;
        }
        this._loader
            //Send action to server
            .httpGet({
                url: this._baseUrl + '/slot/spin?lineBet=' + bet
                + '&linesCount=' + linesCount
            })
            //call UI action
            .then(function (res) {
                me.model.setData('actionResponse', JSON.parse(res));
                let responses = {
                    config: me.model.getData('configResponse'),
                    action: me.model.getData('actionResponse')
                };
                me._game.setState(responses);
            });
    }

    /**
     * Callback of resources loaded
     */
    gameLoaded() {
        this._gameLoaded = true;
    }
}
