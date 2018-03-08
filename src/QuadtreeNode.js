const DEFAULT_DIVIDERS = {
    x: 50,
    y: 50
};

const attributesTemplate = {
    _nodeId: null,
    bounds: null,
    dividers: DEFAULT_DIVIDERS
};

const rebalanceItems = () => {
    console.log(`Rebalancing items in node ${this._nodeId}`);

    this.children.forEach(child => child.rebalanceItems());
};

const addItem = (item) => {
    this.items.push(item);

    if(this.items.length > this.MaxItemsInNode) {
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

const methods = {
    addItem: addItem,
    removeItem: removeItem,
    rebalanceItems: rebalanceItems
};

export default ({ bounds, dividers = DEFAULT_DIVIDERS, parent = null, quadrantDirection = null, items = [] }) => {
    const _nodeId = parent ? `${parent._nodeId}-${quadrantDirection}` : root;
    
    const attributes = Object.assign({}, attributesTemplate, { _nodeId, bounds, dividers, parent, items });
    
    return Object.assign({}, ...attributes, ...methods);
};