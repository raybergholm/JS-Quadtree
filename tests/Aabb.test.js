import {
    describe,
    it
} from "mocha";
import {
    expect
} from "chai";

import Aabb, {
    ZERO_AABB,
    generateRandomAabbs,
} from "../src/spatial/Aabb";

import aabbSpatialUtils from "../src/spatial/aabbSpatialUtils";

const equalityChecker = (reference, expected) => reference.x === expected.x &&
    reference.y === expected.y &&
    reference.width === expected.width &&
    reference.height === expected.height;

describe("AABB class testing", () => {
    describe("Normal use cases", () => {
        it("No parameters result in zeroed bounds", () => {
            const zeroed = new Aabb();
            expect(equalityChecker(zeroed, ZERO_AABB)).to.be.true;
        });

        it("Passing parameters should not result in zeroed bounds", () => {
            const area = new Aabb({
                x: 50,
                y: 50,
                width: 100,
                height: 100
            });
            expect(equalityChecker(area, ZERO_AABB)).to.be.false;
        });

        it("Full parameters should match", () => {
            const area = new Aabb({
                x: 50,
                y: 50,
                width: 100,
                height: 100
            });
            expect(equalityChecker(area, {
                x: 50,
                y: 50,
                width: 100,
                height: 100
            })).to.be.true;
        });

        it("Point bounds should have x & y but zero width and height", () => {
            const area = new Aabb({
                x: 25,
                y: 25
            });
            expect(equalityChecker(area, {
                x: 25,
                y: 25,
                width: 0,
                height: 0
            })).to.be.true;
        });

        it("Bounds with no x & y starts at origin", () => {
            const area = new Aabb({
                width: 12.12,
                height: 101.5
            });
            expect(equalityChecker(area, {
                x: 0,
                y: 0,
                width: 12.12,
                height: 101.5
            })).to.be.true;
        });
    });

    describe("Invalid use cases", () => {
        it("Strings should throw", () => {
            expect(() => new Aabb({
                x: "this is bad input"
            })).to.throw();
        });

        it("String emojis should throw too", () => {
            expect(() => new Aabb({
                x: "😲"
            })).to.throw();
        });

        it("Populated arrays should throw", () => {
            expect(() => new Aabb({
                x: [1, 2, 3]
            })).to.throw();
        });

        it("Empty array insanity: isNaN([]) gets coerced to 0", () => {
            expect(equalityChecker(new Aabb({
                x: 25,
                y: [],
                width: 100,
                height: 100
            }), {
                x: 25,
                y: 0,
                width: 100,
                height: 100
            })).to.be.true;
        });

        it("Objects should throw", () => {
            expect(() => new Aabb({
                x: {
                    x: 42,
                    y: 42
                }
            })).to.throw();
        });

        it("Functions should throw", () => {
            expect(() => new Aabb({
                x: () => 42
            })).to.throw();
        });
    });

    describe("Testing the random AABB generator", () => {
        const bounds = new Aabb({
            x: 0,
            y: 0,
            width: 1000,
            height: 1000
        });
        const randomAabbs = generateRandomAabbs(bounds, 10000);

        it("10000 randomly generated AABBs should all be inside the parent area", () => {
            for (const aabb of randomAabbs) {
                expect(aabbSpatialUtils(aabb).is.enclosedBy(bounds)).to.be.true;
            }
        });
    });
});