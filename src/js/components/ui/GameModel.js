/**
 * Model for UI component
 */
import Model from '../core/Model';
export default class GameModel extends Model{
    constructor(){
        super();

        /*********BASE DATA**********/
        this.setData('balance', 0);
        this.setData('activeBetLines', 3);
        this.setData('betPerLine', 100);//@TODO need to come from server
        this.setData('nextAction', null);
        this.setData('denominator', 0.1);
        this.setData('scaleFactor', {
            x: 1,
            y: 1
        });
    }

    handleInitResponse(configs){
        this.setData('baseConfig', configs.base);
        this.setData('initResponse', configs.init);
        this.setData('configResponse', configs.config);

        this.setData('curReelSet', configs.init.symbols);
        this.setData('denominator', configs.config['coinValue']);
    }
}