import {
    describe,
    it
} from "mocha";
import {
    expect
} from "chai";

import Divider, {
    DefaultDivider
} from "../src/spatial/Divider";

const equalityChecker = (reference, expected) => reference.x === expected.x &&
    reference.y === expected.y;

describe("Dividers class testing", () => {
    describe("Normal use cases", () => {
        it("No parameters result in defaults", () => {
            expect(equalityChecker(new Divider(), DefaultDivider)).to.be.true;
        });

        it("Passing parameters should not result in defaults", () => {
            expect(equalityChecker(new Divider({
                x: 30,
                y: 25
            }), {
                x: 30,
                y: 25
            })).to.be.true;
        });

        it("Partial parameters should be ok", () => {
            expect(equalityChecker(new Divider({
                x: 75,
            }), {
                x: 75,
                y: 50
            })).to.be.true;

            expect(equalityChecker(new Divider({
                y: 75
            }), {
                x: 50,
                y: 75
            })).to.be.true;
        });
    });

    describe("Invalid use cases", () => {
        it("Negative input should throw", () => {
            expect(() => new Divider({
                x: -25,
                y: 50
            })).to.throw();

            expect(() => new Divider({
                x: -1
            })).to.throw();

            expect(() => new Divider({
                y: -100
            })).to.throw();
        });

        it("Input >100 should throw", () => {
            expect(() => new Divider({
                x: 1000,
                y: 50
            })).to.throw();

            expect(() => new Divider({
                x: 100.1
            })).to.throw();

            expect(() => new Divider({
                y: 101
            })).to.throw();
        });

        it("Strings should throw", () => {
            expect(() => new Divider({
                y: "this is bad input"
            })).to.throw();
        });

        it("String emojis should throw too", () => {
            expect(() => new Divider({
                y: "😲"
            })).to.throw();
        });

        it("Populated arrays should throw", () => {
            expect(() => new Divider({
                y: [1, 2, 3]
            })).to.throw();
        });

        it("Empty array insanity: isNaN([]) gets coerced to 0", () => {
            expect(equalityChecker(new Divider({
                y: []
            }), {
                x: 50,
                y: 0
            })).to.be.true;
        });

        it("Objects should throw", () => {
            expect(() => new Divider({
                y: {x: 42, y: 42}
            })).to.throw();
        });

        it("Functions should throw", () => {
            expect(() => new Divider({
                y: () => 42
            })).to.throw();
        });
    });
});