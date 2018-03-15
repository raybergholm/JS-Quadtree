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

describe("aabbSpatialUtils tests", () => {
    describe("Intersection and relational tests", () => {
        const refAabb = new Aabb({x: 0, y: 0, width: 100, height: 100});
        const enclosedAabb = new Aabb({x: 25, y: 25, width: 25, height: 25});
        const biggerAabb = new Aabb({x: -50, y: -50, width: 200, height: 200});
        const oobAabb = new Aabb({x: -200, y: 300, width: 10, height: 10});
        const intersectingAabb = new Aabb({x: 20, y: -12, width: 25, height: 25});
        
        const wrappedRef = aabbSpatialUtils(refAabb);

        describe("Single AABB - AABB tests", () => {
            it("Smaller AABB should be inside ...", () => {
                expect(wrappedRef.is.enclosing(enclosedAabb)).to.be.true;
            });
            it("... and all others should be false", () => {
                expect(wrappedRef.is.enclosing(biggerAabb)).to.be.false;
                expect(wrappedRef.is.enclosing(oobAabb)).to.be.false;
                expect(wrappedRef.is.enclosing(intersectingAabb)).to.be.false;
            });
    
            it("Bigger AABB should be outside ...", () => {
                expect(wrappedRef.is.enclosedBy(biggerAabb)).to.be.true;
            });
            it("... and all others should be false", () => {
                expect(wrappedRef.is.enclosedBy(enclosedAabb)).to.be.false;
                expect(wrappedRef.is.enclosedBy(oobAabb)).to.be.false;
                expect(wrappedRef.is.enclosedBy(intersectingAabb)).to.be.false;
            });
    
            it("Out of bounds AABB should not be touching the ref AABB ...", () => {
                expect(wrappedRef.is.outOfBounds(oobAabb)).to.be.true;
            });
            it("... and all others should be false", () => {
                expect(wrappedRef.is.outOfBounds(enclosedAabb)).to.be.false;
                expect(wrappedRef.is.outOfBounds(biggerAabb)).to.be.false;
                expect(wrappedRef.is.outOfBounds(intersectingAabb)).to.be.false;
            });

            it("Intersecting AABB should be touching ...", () => {
                expect(wrappedRef.is.intersecting(intersectingAabb)).to.be.true;
            });
            it("... and all others should be false", () => {
                expect(wrappedRef.is.intersecting(enclosedAabb)).to.be.false;
                expect(wrappedRef.is.intersecting(biggerAabb)).to.be.false;
                expect(wrappedRef.is.intersecting(oobAabb)).to.be.false;
            });
        });
    });
});
