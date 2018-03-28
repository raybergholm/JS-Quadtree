import {
    DEFAULT_DIVIDER
} from "./spatial/AxisAlignedDivider";

export default function QuadtreeNode({
    bounds,
    divider = DEFAULT_DIVIDER,
    parent = null,
    quadrantDirection = null,
    items = [],
    maxItemsInNode,
    maxLevelsInTree
}) {
    const attributesTemplate = {
        _nodeId: null,
        bounds: null,
        children: null,
        dividers: DEFAULT_DIVIDER,
        _maxItemsInNode: null,
        _maxLevelsInTree: null
    };

    const attributes = Object.assign({}, attributesTemplate, {
        _nodeId: parent ? `${parent._nodeId}-${quadrantDirection}` : "root",
        bounds,
        divider,
        parent,
        items,
        maxItemsInNode,
        maxLevelsInTree
    });

    const methods = {
        isLeaf: isLeaf,
    
        // item mutators
        addItem: addItem,
        removeItem: removeItem,
        rebalanceItems: rebalanceItems,
    
        each: each
    };

    return Object.assign({}, attributes, methods);
}

function isLeaf() {
    return !this.children;
}

function rebalanceItems() {
    console.log(`Rebalancing items in node ${this._nodeId}`);

    if (!this.children) {
        this.children = createChildren();
    }

    this.children.forEach(child => child.rebalanceItems());
}

function createChildren() {

}

function addItem(item) {
    this.items.push(item);

    if (this.items.length > this._maxItemsInNode) {
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