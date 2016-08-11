export default class Scene {
    /**
     * Constructor
     *
     * @param {Object} config The configuration object
     */
    constructor(config) {
        var me = this,
            // updated since Environment.scaleValue() no longer returns the scale value we want
            scaleValue = 1;//@TODO change this

        me._utils = config.utils;

        me.prop = {
            delay : 0,
            duration : 0,
            running : true,
            matrix : new Float32Array([scaleValue, 0, 0, scaleValue, 0, 0]),
            opacity : 1
        };

        me.prop = me._utils.apply(me.prop, config);

        me.endEvent = config.endEvent || undefined;

        me.lists = [];          // The lists located in this scenes render loop
        me.listsToAdd = [];     // The lists that will be added to the render loop during the next iteration
        me.nonActiveLists = []; // The lists that have been removed from the render loop

        // Is this scene active ?
        me.active = config.active || false;
    }

    /**
     * Runs the animation function on the given scene.
     *
     * @param {Object} timeObj the time object
     */
    run(timeObj) {
        var me = this,
            prop = me.prop,
            numLists,
            items = [],
            list,
            i;

        if(timeObj.time >= prop.delay) {

            // Check if any of the active lists have returned to active status
            me.checkNonActiveLists();

            if(me.listsToAdd.length > 0) {
                me.addLists(me.listsToAdd);
                me.listsToAdd.length = 0;
            }

            numLists = me.lists.length; // needs to be set after the addition of lists or we will start animating the second time we get here

            for(i = -1 ; ++i < numLists ;) {
                list = me.lists[i];

                if(list.prop.running) {
                    items.push.apply(items, list.run(timeObj, {matrix : prop.matrix, opacity : prop.opacity}));
                }
                else {
                    me.nonActiveLists.push(list);
                    me.lists.splice(i,1);
                    numLists--;
                    i--;
                }
            }
        }

        return items;
    }

    /**
     * Adds a Canvas Animation List to the scene.
     *
     * @param {Object} list The Canvas Animation List to be added to the scene.
     */
    add(list) {
        return;
        // Set list as running
        list.prop.running = true;

        this._utils.insertInOrder(list, this.lists);
    }

    /**
     * Adds an array of Canvas Animation Lists to the scene.
     *
     * @param {Array} lists The array of Canvas Animation Lists to be added to the scene.
     */
    addLists(lists) {
        return;
        var numLists = lists.length,
            i;

        for(i = -1 ; ++i < numLists ; ) {
            this.add(lists[i]);
        }
    }

    /**
     * Start the scene
     */
    play() {
        this.prop.running = true;
    }

    /**
     * Stops the scene
     */
    stop() {
        this.prop.running = false;
    }

    /**
     * Check if the scene is active or not
     * @return {Boolean} Whether the scene is active or not
     */
    isActive() {
        return this.active;
    }

    /**
     * @private
     * Checks if some of the non active lists have returned to an active state and adds them to the render loop if that is the case.
     */
    checkNonActiveLists() {
        return;
        var lists = this.nonActiveLists,
            numLists = lists.length,
            i;

        for(i = -1 ; ++i < numLists ; ) {
            if(lists[i].prop.running) {
                this.listsToAdd.push(lists[i]);
                lists.splice(i,1);
                numLists--;
                i--;
            }
        }
    }
}