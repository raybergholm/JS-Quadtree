import {
    describe,
    it
} from "mocha";
import {
    expect
} from "chai";

import Aabb, {
    generateRandomAabbs
} from "../src/spatial/Aabb";

import Quadtree from "../src/Quadtree";

describe("Quadtree testing", () => {
    const bounds = new Aabb({
        x: 0,
        y: 0,
        width: 1000,
        height: 1000
    });

    const quadtree = new Quadtree({
        bounds
    });

    it("Adding an item shouldn't explode", () => {
        const aabbs = generateRandomAabbs(bounds, 1);
        quadtree.addItem({
            _id: 0,
            bounds: aabbs[0]
        });
    });

    it("... 100 more shouldn't explode either", () => {
        const aabbs = generateRandomAabbs(bounds, 100);
        let id = 0;
        for (const aabb of aabbs) {
            quadtree.addItem({
                _id: ++id,
                bounds: aabb
            });
        }
    });

    it("tree traversal should work", () => {
        // console log report to manually check the quadtree
        const preOrderCallback = (node) => {
            console.log(`${node._nodeId} is at level ${node._level} and has ${node.items.size} items`);
        };
        quadtree.traverseTree({
            preOrderCallback
        });
    });

    it("Items inside each node should be inside the bounds", () => {
        // console log report to manually check the quadtree
        const postOrderCallback = (node) => {
            for (const item in node.items) {
                if (!node.bounds.is.enclosing(item.bounds)) {
                    console.log("out of bounds!");
                }
            }
        };
        quadtree.traverseTree({
            postOrderCallback
        });
    });

    it("Item count should be 101", () => {
        expect(quadtree.countItems()).to.be.equal(101);
    });

    it("Clearing items should not explode", () => {
        quadtree.clearItems(true);
    });

    it("Item count should be 0", () => {
        expect(quadtree.countItems()).to.be.equal(0);
    });

    it("Add 1000 new items with constant sizes: should have more items ending up in leaves", () => {
        const maxItemsInNode = 10;
        const maxLevelsInTree = 3;
        const localQuadtree = new Quadtree({
            bounds,
            maxItemsInNode,
            maxLevelsInTree
        });

        const aabbs = generateRandomAabbs(bounds, 1000);
        let id = 0;
        for (const aabb of aabbs) {
            aabb.width = 5;
            aabb.height = 5;
            localQuadtree.addItem({
                _id: id++,
                bounds: aabb
            });
        }

        // console log report to manually check the quadtree
        const preOrderCallback = (node) => {
            console.log(`${node._nodeId} is at level ${node._level} and has ${node.items.size} items`);
        };
        localQuadtree.traverseTree({
            preOrderCallback
        });

        expect(localQuadtree.countItems()).to.be.equal(1000);
    });
});