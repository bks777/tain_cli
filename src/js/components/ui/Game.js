import GameController from './GameController';
import GameView from './GameView';
import GameModel from './GameModel';
export default class Game {

    /**
     *
     * @param configs {object} Configs
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
        configs.model = new GameModel();
        configs.view = new GameView(configs.model, renderer);
        this.controller = new GameController(
            configs,
            renderer,
            utils,
            ua_cb,
            fl_cb
        );
    }

    setState(responses){
        this.controller.setState(responses);
    }
}