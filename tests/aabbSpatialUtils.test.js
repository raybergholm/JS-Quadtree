import {
    describe,
    it
} from "mocha";
import {
    expect
} from "chai";

import Aabb, {
    ZeroAabb
} from "../src/spatial/Aabb";

import aabbSpatialUtils from "../src/spatial/aabbSpatialUtils";

describe("aabbSparialUtils tests", () => {
    describe("Intersection and relational tests", () => {
        const refAabb = new Aabb({x: 0, y: 0, width: 100, height: 100});
        const enclosedAabb = new Aabb({x: 25, y: 25, width: 25, height: 25});
        const biggerAabb = new Aabb({x: -50, y: -50, width: 200, height: 200});
        const oobAabb = new Aabb({x: -200, y: 300, width: 10, height: 10});
        
        const curried = aabbSpatialUtils(refAabb);

        it("Smaller AABB should be inside", () => {
            expect(curried.is.enclosing(enclosedAabb)).to.be.true;
        });

        it("Bigger AABB should be outside", () => {
            expect(curried.is.enclosedBy(biggerAabb)).to.be.true;
        });

        it("Out of bounds AABB should not be touching the ref AABB", () => {
            expect(curried.is.outOfBounds(oobAabb)).to.be.true;
        });
    });
});
