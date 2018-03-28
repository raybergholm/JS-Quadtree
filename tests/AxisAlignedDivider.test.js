import {
    describe,
    it
} from "mocha";
import {
    expect
} from "chai";

import AxisAlignedDivider, {
    DEFAULT_DIVIDER
} from "../src/spatial/AxisAlignedDivider";

const equalityChecker = (reference, expected) => reference.x === expected.x &&
    reference.y === expected.y;

describe("Dividers class testing", () => {
    describe("Normal use cases", () => {
        it("No parameters result in defaults", () => {
            expect(equalityChecker(new AxisAlignedDivider(), DEFAULT_DIVIDER)).to.be.true;
        });

        it("Passing parameters should not result in defaults", () => {
            expect(equalityChecker(new AxisAlignedDivider({
                x: 30,
                y: 25
            }), {
                x: 30,
                y: 25
            })).to.be.true;
        });

        it("Partial parameters should be ok", () => {
            expect(equalityChecker(new AxisAlignedDivider({
                x: 75,
            }), {
                x: 75,
                y: 50
            })).to.be.true;

            expect(equalityChecker(new AxisAlignedDivider({
                y: 75
            }), {
                x: 50,
                y: 75
            })).to.be.true;
        });
    });

    describe("Invalid use cases", () => {
        it("Negative input should throw", () => {
            expect(() => new AxisAlignedDivider({
                x: -25,
                y: 50
            })).to.throw();

            expect(() => new AxisAlignedDivider({
                x: -1
            })).to.throw();

            expect(() => new AxisAlignedDivider({
                y: -100
            })).to.throw();
        });

        it("Input >100 should throw", () => {
            expect(() => new AxisAlignedDivider({
                x: 1000,
                y: 50
            })).to.throw();

            expect(() => new AxisAlignedDivider({
                x: 100.1
            })).to.throw();

            expect(() => new AxisAlignedDivider({
                y: 101
            })).to.throw();
        });

        it("Strings should throw", () => {
            expect(() => new AxisAlignedDivider({
                y: "this is bad input"
            })).to.throw();
        });

        it("String emojis should throw too", () => {
            expect(() => new AxisAlignedDivider({
                y: "😲"
            })).to.throw();
        });

        it("Populated arrays should throw", () => {
            expect(() => new AxisAlignedDivider({
                y: [1, 2, 3]
            })).to.throw();
        });

        it("Empty array insanity: isNaN([]) gets coerced to 0", () => {
            expect(equalityChecker(new AxisAlignedDivider({
                y: []
            }), {
                x: 50,
                y: 0
            })).to.be.true;
        });

        it("Objects should throw", () => {
            expect(() => new AxisAlignedDivider({
                y: {x: 42, y: 42}
            })).to.throw();
        });

        it("Functions should throw", () => {
            expect(() => new AxisAlignedDivider({
                y: () => 42
            })).to.throw();
        });
    });
});