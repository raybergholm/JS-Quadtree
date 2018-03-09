import QuadtreeConfig from "./models/QuadtreeConfig";
import node from "./quadtreeNode";

import config from "./config.json";

const handleConfig = ({
    maxItemsInNode = config.maxItemsInNode,
    maxLevelsInTree = config.maxLevelsInTree
}) => ({
    maxItemsInNode,
    maxLevelsInTree
});

const addItem = () => {

};

// const Quadtree = (bounds, configOverride) => {
//     const me = {};
//     me.config = handleConfig(...configOverride);

//     me.root = node(me.config)(bounds);

//     return me;
// };

const methods = {
    each: callback => this.root.each(callback)
};

const attributesTemplate = {
    maxItemsInNode: null,
    maxLevelsInTree: null,
    root: null,
};

function Quadtree() {

    const attributes = Object.assign({}, attributesTemplate);

    return Object.assign({}, ...attributes, ...methods);
}

export default Quadtree;