/**
 * Class for loading of resources
 */

var loaderInstance;

class Loader {
    /**
     * Constructor
     */
    constructor() {
        this.XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        this.serverAlias = "http://localhost:8080/slot/";
    }

    /**
     * GET Action
     * @param config
     * @returns {Promise}
     */
    httpGet(config = {url: 'http://google.com'}) {
        var request = new this.XHR();

        return new Promise((resolve, reject)=> {
            request.onload = function () {
                resolve(request.responseText);
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
    sendServerXHR(config = {action: "config"}) {
        let serverActionUrl = this.serverAlias + config.action;
        return this.httpGet({url: serverActionUrl});
    }

    loadResources() {
        console.info('BEGIN to load resources from a parsed JSON-S');
    }

    /**
     * //@TODO In a future server init action must be created
     */
    init() {
        let me = this;
        this.sendServerXHR({action: 'config'}).then(()=> {
                //In case of good response get resources and start the game
                me._getResourceConfig()
                    .then((data)=> {
                        me.start(data);
                    });

            })
            .catch((data)=> {
                console.error('Error in connection with a server >>> ', data);
            });
    }

    _getResourceConfig() {
        let me = this;

        return Promise.all([
            //IMAGES
            me.httpGet({url: './config/images/desktop.json'}),
            //MAIN
            me.httpGet({url: './config/config.json'})
        ])
    }
}
if (!loaderInstance) {
    loaderInstance = new Loader();
}

export default loaderInstance;
