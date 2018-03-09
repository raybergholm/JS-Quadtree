const DEFAULT_DIVIDERS = {
    x: 50,
    y: 50
};

const isLeaf = () => !this.children;

const rebalanceItems = () => {
    console.log(`Rebalancing items in node ${this._nodeId}`);

    if (this.children) {
        this.children.forEach(child => child.rebalanceItems());
    } else {
        this.children = createChildren();
    }
};

const createChildren = () => {

};

const addItem = (item) => {
    this.items.push(item);

    if (this.items.length > this.MaxItemsInNode) {
        this.rebalanceItems();
    }
};

const removeItem = (item) => {
    const index = this.items.indexOf(item);
    if (index > -1) {
        this.items.splice(index, 1);
    } else {
        console.log(`Attempted to remove from node ${this._nodeId}, item not found: `, item);
    }
};

// depth-first traversal
const each = (callback) => {
    callback(this.items, this);

    if (this.children) {
        this.children.forEach(child => child.each(callback));
    }
};

const methods = {
    isLeaf: isLeaf,

    // item mutators
    addItem: addItem,
    removeItem: removeItem,
    rebalanceItems: rebalanceItems,

    each: each
};

const attributesTemplate = {
    _nodeId: null,
    bounds: null,
    children: null,
    dividers: DEFAULT_DIVIDERS
};

export default ({
    bounds,
    dividers = DEFAULT_DIVIDERS,
    parent = null,
    quadrantDirection = null,
    items = []
}) => {
    const _nodeId = parent ? `${parent._nodeId}-${quadrantDirection}` : root;

    const attributes = Object.assign({}, attributesTemplate, {
        _nodeId,
        bounds,
        dividers,
        parent,
        items
    });

    return Object.assign({}, ...attributes, ...methods);
};