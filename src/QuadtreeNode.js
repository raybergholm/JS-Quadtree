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
        items: [],
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
    console.log(`Rebalancing items in node ${this._nodeId}`);

    if (!this.children && this._level < this.maxLevelsInTree) {
        this.createChildren();
    }

    if (this.children) {
        for(const child in this.children){
            this.items.forEach((item) => { 
                if(aabbSpatialUtils(child.bounds).is.enclosing(item.bounds)){
                    child.addItem(item);
                }
            });
            child.rebalanceItems();
        }
    }
}

function createChildren() {
    console.log(this);
    const childBounds = split(this.bounds, this.divider);

    this.children = objectHelper(childBounds).map((bounds, quadrantDirection) => new QuadtreeNode({
        bounds,
        divider: this.divider,
        parent: this,
        quadrantDirection,
        maxItemsInNode: this.maxItemsInNode,
        maxLevelsInTree: this.maxLevelsInTree
    }));
}

function addItem(item) {
    this.items.push(item);

    if (this.items.length > this.maxItemsInNode) {
        this.rebalanceItems();
    }
}

function removeItem(item) {
    const index = this.items.indexOf(item);
    if (index > -1) {
        this.items.splice(index, 1);
    } else {
        console.log(`Attempted to remove from node ${this._nodeId}, item not found: `, item);
    }
}

// depth-first traversal
function each(callback) {
    callback(this);

    if (this.children) {
        this.children.forEach(child => child.each(callback));
    }
}

QuadtreeNode.prototype.toString = function () {
    return JSON.stringify(this);
};