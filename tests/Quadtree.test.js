import {
    describe,
    it
} from "mocha";
import {
    expect
} from "chai";

import Aabb, {
    ZERO_AABB,
    generateRandomAabbs
} from "../src/spatial/Aabb";

import AxisAlignedDivider, {
    DEFAULT_DIVIDER
} from "../src/spatial/AxisAlignedDivider";

import aabbSpatialUtils, {
    RELATIONSHIPS
} from "../src/spatial/aabbSpatialUtils";

import Quadtree from "../src/Quadtree";

describe("Quadtree testing", () => {
    const bounds = new Aabb({
        x: 0,
        y: 0,
        width: 1000,
        height: 1000
    });

    it("This should compile", () => {
        const quadtree = new Quadtree(bounds);
        expect(1).to.equal(1);

    });

    it("Adding an item shouldn't explode", () => {
        const quadtree = new Quadtree({
            bounds
        });

        const aabbs = generateRandomAabbs(bounds, 1);
        quadtree.addItem({
            _id: 1,
            bounds: aabbs[0]
        });
    });

    it("... 100 shouldn't explode either", () => {
        const quadtree = new Quadtree({
            bounds
        });

        const aabbs = generateRandomAabbs(bounds, 100);
        let id = 0;
        for (const aabb of aabbs) {
            quadtree.addItem({
                _id: ++id,
                bounds: aabb
            });
        }

        quadtree.traverseTree((node) => {
            console.log(`${node._nodeId} is at level ${node._level} and has ${node.items.size} items`);
        });
        // console.log(quadtree);
    });
});