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

import aabbSpatialUtils, {
    xRelation,
    yRelation,
    split,
    RELATIONSHIPS
} from "../src/spatial/aabbSpatialUtils";

describe("aabbSpatialUtils tests", () => {
    describe("X-axis sanity tests", () => {
        const refAabb = new Aabb({
            x: 0,
            width: 100
        });
        const smallAabb = new Aabb({
            x: 25,
            width: 50
        });
        const bigAabb = new Aabb({
            x: -100,
            width: 500
        });
        const farAwayAabb = new Aabb({
            x: 300,
            width: 100
        });
        const intersectingAabb = new Aabb({
            x: -25,
            width: 100
        });
        const leftEdgeTouchingAabb = new Aabb({
            x: 0,
            width: 50
        });
        const rightEdgeTouchingAabb = new Aabb({
            x: 50,
            width: 50
        });

        it("Enclosing should work", () => {
            expect(xRelation(refAabb, smallAabb)).to.equal(RELATIONSHIPS.ENCLOSING);
        });

        it("EnclosedBy should work", () => {
            expect(xRelation(refAabb, bigAabb)).to.equal(RELATIONSHIPS.ENCLOSED_BY);
        });

        it("OutOfBounds should work", () => {
            expect(xRelation(refAabb, farAwayAabb)).to.equal(RELATIONSHIPS.OUT_OF_BOUNDS);
        });

        it("Intersecting should work", () => {
            expect(xRelation(refAabb, intersectingAabb)).to.equal(RELATIONSHIPS.INTERSECTING);
        });
        it("... for touching edges too", () => {
            expect(xRelation(refAabb, leftEdgeTouchingAabb)).to.equal(RELATIONSHIPS.INTERSECTING);
            expect(xRelation(refAabb, rightEdgeTouchingAabb)).to.equal(RELATIONSHIPS.INTERSECTING);
        });
    });

    describe("Y-axis sanity tests", () => {
        const refAabb = new Aabb({
            y: 0,
            height: 100
        });
        const smallAabb = new Aabb({
            y: 25,
            height: 50
        });
        const bigAabb = new Aabb({
            y: -100,
            height: 500
        });
        const farAwayAabb = new Aabb({
            y: 300,
            height: 100
        });
        const intersectingAabb = new Aabb({
            y: -25,
            height: 100
        });
        const leftEdgeTouchingAabb = new Aabb({
            y: 0,
            height: 50
        });
        const rightEdgeTouchingAabb = new Aabb({
            y: 50,
            height: 50
        });

        it("Enclosing should work", () => {
            expect(yRelation(refAabb, smallAabb)).to.equal(RELATIONSHIPS.ENCLOSING);
        });

        it("EnclosedBy should work", () => {
            expect(yRelation(refAabb, bigAabb)).to.equal(RELATIONSHIPS.ENCLOSED_BY);
        });

        it("OutOfBounds should work", () => {
            expect(yRelation(refAabb, farAwayAabb)).to.equal(RELATIONSHIPS.OUT_OF_BOUNDS);
        });

        it("Intersecting should work", () => {
            expect(yRelation(refAabb, intersectingAabb)).to.equal(RELATIONSHIPS.INTERSECTING);
        });
        it("... for touching edges too", () => {
            expect(yRelation(refAabb, leftEdgeTouchingAabb)).to.equal(RELATIONSHIPS.INTERSECTING);
            expect(yRelation(refAabb, rightEdgeTouchingAabb)).to.equal(RELATIONSHIPS.INTERSECTING);
        });
    });

    describe("Intersection and relational tests", () => {
        const refAabb = new Aabb({
            x: 0,
            y: 0,
            width: 100,
            height: 100
        });
        const enclosedAabb = new Aabb({
            x: 25,
            y: 25,
            width: 25,
            height: 25
        });
        const biggerAabb = new Aabb({
            x: -50,
            y: -50,
            width: 200,
            height: 200
        });
        const farAwayAabb = new Aabb({
            x: -200,
            y: 300,
            width: 10,
            height: 10
        });
        const tooFarRightAabb = new Aabb({
            x: 101,
            y: 25,
            width: 10,
            height: 10
        });
        const tooFarUpAabb = new Aabb({
            x: 25,
            y: -11,
            width: 10,
            height: 10
        });
        const intersectingAabb = new Aabb({
            x: 20,
            y: -12,
            width: 25,
            height: 25
        });
        const leftEdgeTouchingAabb = new Aabb({
            x: 0,
            y: 25,
            width: 50,
            height: 200
        });
        const rightEdgeTouchingAabb = new Aabb({
            x: 50,
            y: 25,
            width: 50,
            height: 200
        });

        const wrappedRef = aabbSpatialUtils(refAabb);

        describe("Single AABB - AABB tests", () => {
            it("Smaller AABB should be inside", () => {
                expect(wrappedRef.is.enclosing(enclosedAabb)).to.be.true;
            });
            it("... and all others should be false", () => {
                expect(wrappedRef.is.enclosing(biggerAabb)).to.be.false;
                expect(wrappedRef.is.enclosing(farAwayAabb)).to.be.false;
                expect(wrappedRef.is.enclosing(tooFarRightAabb)).to.be.false;
                expect(wrappedRef.is.enclosing(tooFarUpAabb)).to.be.false;
                expect(wrappedRef.is.enclosing(intersectingAabb)).to.be.false;
                expect(wrappedRef.is.enclosing(leftEdgeTouchingAabb)).to.be.false;
                expect(wrappedRef.is.outOfBounds(rightEdgeTouchingAabb)).to.be.false;
            });

            it("Bigger AABB should be outside", () => {
                expect(wrappedRef.is.enclosedBy(biggerAabb)).to.be.true;
            });
            it("... and all others should be false", () => {
                expect(wrappedRef.is.enclosedBy(enclosedAabb)).to.be.false;
                expect(wrappedRef.is.enclosedBy(farAwayAabb)).to.be.false;
                expect(wrappedRef.is.enclosedBy(tooFarRightAabb)).to.be.false;
                expect(wrappedRef.is.enclosedBy(tooFarUpAabb)).to.be.false;
                expect(wrappedRef.is.enclosedBy(intersectingAabb)).to.be.false;
                expect(wrappedRef.is.enclosedBy(leftEdgeTouchingAabb)).to.be.false;
                expect(wrappedRef.is.enclosedBy(rightEdgeTouchingAabb)).to.be.false;
            });

            it("Out of bounds AABB should be recognised", () => {
                expect(wrappedRef.is.outOfBounds(farAwayAabb)).to.be.true;
            });
            it("... one axis is entirely misaligned should also be picked up", () => {
                expect(wrappedRef.is.outOfBounds(tooFarRightAabb)).to.be.true;
                expect(wrappedRef.is.outOfBounds(tooFarUpAabb)).to.be.true;
            });
            it("... and all others should be false", () => {
                expect(wrappedRef.is.outOfBounds(enclosedAabb)).to.be.false;
                expect(wrappedRef.is.outOfBounds(biggerAabb)).to.be.false;
                expect(wrappedRef.is.outOfBounds(intersectingAabb)).to.be.false;
                expect(wrappedRef.is.outOfBounds(leftEdgeTouchingAabb)).to.be.false;
                expect(wrappedRef.is.outOfBounds(rightEdgeTouchingAabb)).to.be.false;
            });

            it("Intersecting AABB should be touching", () => {
                expect(wrappedRef.is.intersecting(intersectingAabb)).to.be.true;
            });
            it("... and edge-touching AABBs too", () => {
                expect(wrappedRef.is.intersecting(leftEdgeTouchingAabb)).to.be.true;
                expect(wrappedRef.is.intersecting(rightEdgeTouchingAabb)).to.be.true;
            });
            it("... plus enclosing/enclosed AABBs too", () => {
                expect(wrappedRef.is.intersecting(enclosedAabb)).to.be.true;
                expect(wrappedRef.is.intersecting(biggerAabb)).to.be.true;
            });

            it("... and all others should be false", () => {
                expect(wrappedRef.is.intersecting(farAwayAabb)).to.be.false;
                expect(wrappedRef.is.intersecting(tooFarRightAabb)).to.be.false;
                expect(wrappedRef.is.intersecting(tooFarUpAabb)).to.be.false;
            });
        });
    });
});