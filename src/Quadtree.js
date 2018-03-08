import QuadtreeConfig from "./models/QuadtreeConfig";
import node from "./quadtreeNode";



const addItem = () => {

};

const Quadtree = (bounds, config ) => {
    const me = {};
    me.config = QuadtreeConfig(...config);

    me.root = node(me.config)(bounds);

    return me;
};

export default Quadtree;