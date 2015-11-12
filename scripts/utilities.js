/**
 * Merge all the given dictionaries into a single one.
 */
function mergeDicts() {
    var dicts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        dicts[_i - 0] = arguments[_i];
    }
    var result = {};
    for (var a = 0; a < dicts.length; a++) {
        var dict = dicts[a];
        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                result[key] = dict[key];
            }
        }
    }
    return result;
}
