function deepCopy(o) {
    return JSON.parse(JSON.stringify(o));
}

/**
 *
 * @param {[string]} keys
 * @param {Object} object
 * returns a new copy of object that only has keys in it
 */
function readKeys(keys, object) {
    o = deepCopy(object);

    for (let k of Object.keys(o)) {
        if (!keys.includes(k)) {
            delete o[k];
        }
    }
    return o;
}

/**
 * @param {Object} obj
 * inp :{
 *  a: {
 *          b: 1
 *     }
 * }
 *
 * out: {
 *  a.b: 1
 * }
 * 
 * ```doesn't work with arrays```
 */
function flattenObject(obj,subKey="",resObj={}) {

    for (let key in obj) {
        const k = subKey + key;
        if (typeof obj[key] === "object") {
            flattenObject(obj[key],k+".",resObj );
        } else {
            resObj[k] = obj[key];
        }
    }
    return resObj;
}

module.exports = {
    deepCopy,
    readKeys,
    flattenObject,
};
