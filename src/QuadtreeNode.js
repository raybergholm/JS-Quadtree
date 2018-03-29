import {
    DEFAULT_DIVIDER
} from "./spatial/AxisAlignedDivider";

import aabbSpatialUtils, {
    split
} from "./spatial/aabbSpatialUtils";

import objectHelper from "./utils/objectHelper";

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
        for (const prop in this.children) {
            for (const item of this.items) {
                // console.log("child:", this.children[prop]);
                // console.log("item", item);
                if (aabbSpatialUtils(this.children[prop].bounds).is.enclosing(item.bounds)) {
                    this.children[prop].addItem(item);
                    this.removeItem(item);
                }
            }
        }
    }
}

function createChildren() {
    const childBounds = split(this.bounds, this.divider);

    this.children = objectHelper(childBounds).map((bounds, quadrantDirection) => new QuadtreeNode({
        bounds,
        divider: this.divider,
        parent: this,
        quadrantDirection,
        maxItemsInNode: this.maxItemsInNode,
        maxLevelsInTree: this.maxLevelsInTree
    }));

    // console.log(this);
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

// depth-first traversal
function each(callback) {
    callback(this);

    if (this.children) {
        for(const prop in this.children){
            this.children[prop].each(callback);
        }
    }
}

QuadtreeNode.prototype.toString = function () {
    return JSON.stringify(this);
};