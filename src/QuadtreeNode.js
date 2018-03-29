import {
    DEFAULT_DIVIDER
} from "./spatial/AxisAlignedDivider";

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

        // children
        createChildren: createChildren,

        // update tree state
        updateNode: updateNode,

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

    this.updateNode();
}

function createChildren() {
    const childBounds = this.bounds.split(this.divider);

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
    // if there are child nodes, check if a child is a better fit first. If so, toss it downwards recursively. Otherwise, this node is the best fit so far.
    if (this.children) {
        for (const entry in this.children) {
            if (entry[1].bounds.is.enclosing(item)) {
                entry[1].addItem(item);
                return;
            }
        }
    }

    this.items.add(item);

    // if this node count goes over the limit, try reallocating items to children
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
 * @summary Call this if items move around, this will recalculate where items should be in the tree
 */
function updateNode() {
    for (const item of this.items) {

        // check if items can go upwards (this shouldn't end up in a recursive loop since both parent and child are using enclosing)
        if(this.parent && !this.bounds.is.enclosing(item.bounds)) {
            this.parent.addItem(item);
            this.removeItem(item);
            continue;
        }

        // check if items can go downwards
        if(this.children){
            this.children.forEach((child) => {
                if (child.bounds.is.enclosing(item.bounds)) {
                    child.addItem(item);
                    this.removeItem(item);
                }
            });
        }
    }
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