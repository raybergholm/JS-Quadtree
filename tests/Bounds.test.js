import {
    describe,
    it
} from "mocha";
import {
    expect
} from "chai";

import Bounds, {
    ZeroBounds
} from "../src/spatial/Bounds";

const boundsChecker = (reference, expected) => reference.x === expected.x &&
    reference.y === expected.y &&
    reference.width === expected.width &&
    reference.height === expected.height;

describe("Bounds class testing", () => {
    it("No parameters result in zeroed bounds", () => {
        const zeroed = new Bounds();
        expect(boundsChecker(zeroed, ZeroBounds)).to.be.true;
    });

    it("Passing parameters should not result in zeroed bounds", () => {
        const area = new Bounds({
            x: 50,
            y: 50,
            width: 100,
            height: 100
        });
        expect(boundsChecker(area, ZeroBounds)).to.be.false;
    });

    it("Full parameters should match", () => {
        const area = new Bounds({
            x: 50,
            y: 50,
            width: 100,
            height: 100
        });
        expect(boundsChecker(area, {
            x: 50,
            y: 50,
            width: 100,
            height: 100
        })).to.be.true;
    });

    it("Point bounds should have x & y but zero width and height", () => {
        const area = new Bounds({
            x: 25,
            y: 25
        });
        expect(boundsChecker(area, {
            x: 25,
            y: 25,
            width: 0,
            height: 0
        })).to.be.true;
    });

    it("Bounds with no x & y starts at origin", () => {
        const area = new Bounds({
            width: 12.12,
            height: 101.5
        });
        expect(boundsChecker(area, {
            x: 0,
            y: 0,
            width: 12.12,
            height: 101.5
        })).to.be.true;
    });

    it("Invalid input should not be accepted", () => {
        expect(() => new Bounds({
            x: "hello",
            y: "world",
            width: "no",
            height: "1234aaa"
        })).to.throw(Error);
    });
});