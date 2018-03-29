// Execute the callback for each property in source then return a new object with the same properties as source.
export const map = (source, callback) => Object.keys(source).reduce((reducer, prop) => {
    reducer[prop] = callback(source[prop], prop);
    return reducer;
}, {});

// For each property in source, execute the predicate (expects a boolean return value). If true, the property will be copied into the resulting object.
export const filter = (source, predicate) => Object.keys(source).reduce((reducer, prop) => {
    if (predicate(source[prop])) {
        reducer[prop] = source[prop];
    }
    return reducer;
}, {});

// For each proeprty in source, execute the callback. The reducer is shared across all callback invocations. It's up to the callback to remember to return the reducer though!
export const each = (source, callback, reducer) => Object.keys(source).reduce((reducer, prop) => {
    reducer = callback(source[prop], prop);
    return reducer;
}, reducer);

// Partial currying: wraps around the source and allows you to execute any of the objectHelper methods on it.
export default (source) => ({
    map: (callback) => map(source, callback),
    filter: (callback) => filter(source, callback),
    each: (callback, reducer) => each(source, callback, reducer)
});