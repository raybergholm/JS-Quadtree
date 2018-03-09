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

const dividerChecker = (reference, expected) => reference.x === expected.x &&
    reference.y === expected.y;

describe("Dividers class testing", () => {
    describe("Normal use cases", () => {
        it("No parameters result in defaults", () => {
            const divider = new Divider();
            expect(dividerChecker(divider, DefaultDivider)).to.be.true;
        });

        it("Passing parameters should not result in defaults", () => {
            const divider = new Divider({
                x: 30,
                y: 25
            });
            expect(dividerChecker(divider, DefaultDivider)).to.be.false;
        });

        it("Partial parameters should be ok", () => {
            expect(dividerChecker(new Divider({
                x: 30
            }), {
                x: 30,
                y: 0
            })).to.be.true;

            expect(dividerChecker(new Divider({
                y: 25
            }), {
                x: 0,
                y: 25
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

        it("Arrays should throw", () => {
            expect(() => new Divider({
                y: []
            })).to.throw();
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