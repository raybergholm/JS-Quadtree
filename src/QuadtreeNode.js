import {
    DEFAULT_DIVIDER
} from "./spatial/AxisAlignedDivider";

import aabbSpatialUtils, {
    split
} from "./spatial/aabbSpatialUtils";

export default function QuadtreeNode({
    bounds,
    divider = DEFAULT_DIVIDER,
    parent = null,
    quadrantDirection = null,
    maxItemsInNode,
    maxLevelsInTree
}) {
    const attributesTemplate = {
        _nodeId: null,
        bounds: null,
        children: null,
        dividers: DEFAULT_DIVIDER,
        items: new Set(),
        maxItemsInNode: null,
        maxLevelsInTree: null
    };

    const attributes = Object.assign({}, attributesTemplate, {
        _nodeId: parent ? `${parent._nodeId}-${quadrantDirection}` : "root",
        _level: parent ? parent._level + 1 : 0,
        bounds,
        divider,
        parent,
        maxItemsInNode,
        maxLevelsInTree
    });

    const methods = {
        isLeaf: isLeaf,

        // item mutators
        addItem: addItem,
        removeItem: removeItem,
        clearItems: clearItems,
        rebalanceItems: rebalanceItems,
        createChildren: createChildren,

        each: each
    };

    Object.assign(this, attributes, methods);
}

function isLeaf() {
    return !this.children;
}

function rebalanceItems() {
    // console.log(`Rebalancing items in node ${this._nodeId}`);

    if (!this.children && this._level < this.maxLevelsInTree) {
        this.createChildren();
    }

    if (this.children) {
        this.children.forEach((child) => {
            for (const item of this.items) {
                if (aabbSpatialUtils(child.bounds).is.enclosing(item.bounds)) {
                    child.addItem(item);
                    this.removeItem(item);
                }
            }
        });
    }
}

function createChildren() {
    const childBounds = split(this.bounds, this.divider);

    this.children = new Map();

    for (const quadrant in childBounds) {
        const childNode = new QuadtreeNode({
            bounds: childBounds[quadrant],
            divider: this.divider,
            parent: this,
            quadrantDirection: quadrant,
            maxItemsInNode: this.maxItemsInNode,
            maxLevelsInTree: this.maxLevelsInTree
        });

        this.children.set(quadrant, childNode);
    }
}

function addItem(item) {
    this.items.add(item);

    if (this.items.size > this.maxItemsInNode) {
        this.rebalanceItems();
    }
}

function removeItem(item) {
    return this.items.delete(item);
}

function clearItems(isRecursive = true) {
    isRecursive ? this.each({
        preOrderCallback: (node) => node.items.clear()
    }) : this.items.clear();
}

/**
 * @summary Tree traversal method. Pass in pre- or post-order callbacks
 * @param {params.preOrderCallback} function
 * @param {params.postOrderCallback} function
 */
function each(params) {
    const {
        preOrderCallback,
        postOrderCallback
    } = params;

    if (preOrderCallback) {
        preOrderCallback(this);
    }

    if (this.children) {
        this.children.forEach((child) => {
            child.each({
                preOrderCallback,
                postOrderCallback
            });
        });
    }

    if (postOrderCallback) {
        postOrderCallback(this);
    }
}

QuadtreeNode.prototype.toString = function () {
    return JSON.stringify(this);
};