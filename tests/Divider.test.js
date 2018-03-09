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

    it("Passing invalid input should throw errors", () => {
        expect(() => new Divider({
            x: -25,
            y: 2000
        })).to.throw();

        expect(() => new Divider({
            x: 50,
            y: "this is bad input" 
        })).to.throw();

        expect(() => new Divider({
            x: () => 10,
            y: []
        })).to.throw();

        expect(() => new Divider({
            x: 10,
            y: "😲"
        })).to.throw();
    });
});