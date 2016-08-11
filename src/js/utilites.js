export default class Utilities {
    /**
     * Utility function that determines if the input parameter is defined or not.
     *
     *
     *     Utilities.isDefined()          === false
     *     Utilities.isDefined(undefined) === false
     *     Utilities.isDefined(null)      === true
     *     Utilities.isDefined("")        === true
     *
     *
     * Utilities.isDefined is useful when checking input parameters
     *
     *
     *     var foo = function(p1) {
     *          if(!Utilities.isDefined(p1)) {
     *              return;
     *          }
     *          // ....
     *     };
     *
     * @param object The parameter to check.
     * @return {Boolean} True if parameter is defined, false otherwise.
     */
    static isDefined(object){
        return typeof object !== "undefined";
    }

    /**
     * Copies all properties !== undefined from one object to another, overwriting properties if already existing.
     *
     *     // declare "input" object
     *     var obj1 = {
     *         p1 : "banana",
     *         p2 : "apple"
     *     };
     *
     *     // create obj2 where we overwrite fields in obj1 with a newly defined object
     *     var obj2 = Utilities.apply(obj1, {
     *         p2 : "cookie",
     *         p3 : "icecream"
     *     };
     *
     *     // output:
     *     console.log(obj2);
     *     >> obj2 = {
     *         p1 : "banana",
     *         p2 : "cookie",
     *         p3 : "icecream"
     *     };
     *
     * @param {Object} receiver The object to copy properties to
     * @param {Object} giver The new properties in an object form
     * @return {Object} The receiver with the new properties added.
     */
    static apply(receiver, giver){
        var keys = Object.keys(giver),
            keyCount = keys.length,
            i, key;

        for(i = -1; ++i < keyCount; ){
            key = keys[i];
            if(this.isDefined(giver[key])) {
                receiver[key] = giver[key];
            }
        }

        return receiver;
    }

    /**
     * Adds the item to the list according to the depth order.
     *
     * @param item The list or item to add to the array
     * @param list The array containing items or lists
     */
    static insertInOrder(item, list) {
        var i = 0,
            current, next, length = list.length,
            itemDepth = item.prop.depth;

        if (length > 0) {

            if (itemDepth < list[0].prop.depth) {
                list.unshift(item);
                return;
            }
            else if (itemDepth >= list[length - 1].prop.depth) {
                list.push(item);
                return;
            }

            for (i; i < length; i++) {

                current = list[i].prop.depth;

                if (length > i + 1) {
                    next = list[i + 1].prop.depth;
                }
                else {
                    next = current;
                }

                // IF greater than current and less than next INSERT
                if (itemDepth > current && itemDepth < next) {
                    list.splice(i + 1, 0, item);
                    return;
                }
                // ELSE IF less than current INSERT before
                else if (itemDepth < current) {
                    list.splice(i, 0, item);
                    return;
                }
            }
        }
        else {
            list.push(item);
        }
    }
}