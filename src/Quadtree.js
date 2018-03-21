import QuadtreeNode from "./quadtreeNode";

export const MaxItemsInNode = 5;
export const MaxLevelsInTree = 5;

export default function Quadtree({
    bounds,
    divider,
    maxItemsInNode = MaxItemsInNode,
    maxLevelsInTree = MaxLevelsInTree
}) {
    const attributesTemplate = {
        _maxItemsInNode: MaxItemsInNode,
        _maxLevelsInTree: MaxLevelsInTree,
        _root: null
    };

    const attributes = Object.assign({}, attributesTemplate, {
        _root: new QuadtreeNode({
            bounds,
            divider
        }),
        maxItemsInNode,
        maxLevelsInTree
    });

    const methods = {
        getBounds: getBounds,
        addItem: addItem,
        removeItem: removeItem,
        traverse: traverse
    };

    return Object.assign({}, attributes, methods);
}

function getBounds() {
    return this._root.bounds;
}

function addItem(item) {
    this._root.addItem(item);
}

function removeItem(item) {
    this._root.removeItem(item);
}

function traverse(callback) {
    return this._root.each(callback);
}

// const Quadtree = (bounds, configOverride) => {
//     const me = {};
//     me.config = handleConfig(...configOverride);

//     me.root = node(me.config)(bounds);

//     return me;
// };