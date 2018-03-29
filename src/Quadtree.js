import QuadtreeNode from "./quadtreeNode";

export const DEFAULT_MAX_ITEMS_IN_NODE = 5;
export const DEFAULT_MAX_LEVELS_IN_TREE = 5;

export default function Quadtree({
    bounds,
    divider,
    maxItemsInNode = DEFAULT_MAX_ITEMS_IN_NODE,
    maxLevelsInTree = DEFAULT_MAX_LEVELS_IN_TREE
}) {
    const attributesTemplate = {
        _root: null,
        maxItemsInNode: DEFAULT_MAX_ITEMS_IN_NODE,
        maxLevelsInTree: DEFAULT_MAX_LEVELS_IN_TREE
    };

    const attributes = Object.assign({}, attributesTemplate, {
        _root: new QuadtreeNode({
            bounds,
            divider,
            maxItemsInNode,
            maxLevelsInTree
        }),
        maxItemsInNode,
        maxLevelsInTree
    });

    const methods = {
        getBounds: getBounds,
        addItem: addItem,
        removeItem: removeItem,
        clearItems: clearItems,
        countItems: countItems,
        traverseTree: traverseTree,
        update: update
    };

    const debug = {
        _debug: {
            assert: _debugAssert
        }
    };

    Object.assign(this, attributes, methods, debug);
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

function clearItems(isRecursive = true) {
    this._root.clearItems(isRecursive);
}

function countItems() {
    let count = 0;

    const preOrderCallback = (node) => count += node.items.size;
    this._root.each({
        preOrderCallback
    });

    return count;
}

function traverseTree(callbacks) {
    this._root.each(callbacks);
}

function update() {
    const postOrderCallback = (node) => node.updateNode();
    this._root.each({
        postOrderCallback
    });
}

function _debugAssert() {
    this.traverseTree();
}

Quadtree.prototype.toString = function () {
    return JSON.stringify(this);
};