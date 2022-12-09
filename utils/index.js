function deepCopy(o){
    return JSON.parse(JSON.stringify(o));
}

/**
 * 
 * @param {[string]} keys 
 * @param {Object} object 
 * returns a new copy of object that only has keys in it
 */
function readKeys(keys,object){
    o = deepCopy(object);

    for(let k of Object.keys(o)){
        if(!keys.includes(k)){
            delete o[k];
        }
    }
    return o;
}
module.exports = {
    deepCopy,readKeys
}