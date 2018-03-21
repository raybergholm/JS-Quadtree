import Aabb from "./Aabb";

export const RELATIONSHIPS = {
    ENCLOSED_BY: 0,
    ENCLOSING: 1,
    INTERSECTING: 2,
    OUT_OF_BOUNDS: 3
};

/**
 * Generic single axis relation comparator
 * @param {object} reference 
 * @param {object} target 
 * @param {string} prop 
 * @param {string} modifier 
 */
const relation = (reference, target, prop, modifier) => {
    if (reference[prop] > target[prop] + target[modifier] || reference[prop] + reference[modifier] < target[prop]) {
        return RELATIONSHIPS.OUT_OF_BOUNDS;
    } else if (reference[prop] < target[prop] && reference[prop] + reference[modifier] > target[prop] + target[modifier]) {
        return RELATIONSHIPS.ENCLOSING;
    } else if (target[prop] < reference[prop] && target[prop] + target[modifier] > reference[prop] + reference[modifier]) {
        return RELATIONSHIPS.ENCLOSED_BY;
    } else {
        return RELATIONSHIPS.INTERSECTING;
    }
};

/**
 * X-axis relation comparator
 * @param {{x: number, width: number}} reference 
 * @param {{x: number, width: number}} target 
 */
export const xRelation = (reference, target) => relation(reference, target, "x", "width");

/**
 * Y-axis relation comparator
 * @param {{y: number, height: number}} reference 
 * @param {{y: number, height: number}} target 
 */
export const yRelation = (reference, target) => relation(reference, target, "y", "height");

/**
 * 
 * @param {Aabb} reference 
 * @param {AxisAlignedDivider} dividers 
 */
export const split = (reference, divider) => {
    const xRatios = [divider.x / 100, (100 - divider.x) / 100];
    const yRatios = [divider.y / 100, (100 - divider.y) / 100];

    const horizontalSplitPoint = reference.x + (reference.width * xRatios[0]);
    const verticalSplitPoint = reference.y + (reference.height * yRatios[0]);

    return {
        ne: new Aabb({
            x: horizontalSplitPoint,
            y: reference.y,
            width: reference.width * xRatios[1],
            height: reference.height * yRatios[0]
        }),
        nw: new Aabb({
            x: reference.x,
            y: reference.y,
            width: reference.width * xRatios[0],
            height: reference.height * yRatios[0]
        }),
        sw: new Aabb({
            x: reference.x,
            y: verticalSplitPoint,
            width: reference.width * xRatios[0],
            height: reference.height * yRatios[1]
        }),
        se: new Aabb({
            x: horizontalSplitPoint,
            y: verticalSplitPoint,
            width: reference.width * xRatios[1],
            height: reference.height * yRatios[1]
        })
    };
};

/**
 * 
 * @param {Aabb} reference 
 * @param {Aabb} target 
 */
export const isEnclosing = (reference, target) => xRelation(reference, target) === RELATIONSHIPS.ENCLOSING 
    && yRelation(reference, target) === RELATIONSHIPS.ENCLOSING;

/**
 * 
 * @param {Aabb} reference 
 * @param {Aabb} target 
 */
export const isEnclosedBy = (reference, target) => isEnclosing(target, reference);

/**
 * 
 * @param {Aabb} reference 
 * @param {Aabb} target 
 */
export const isOutOfBounds = (reference, target) => xRelation(reference, target) === RELATIONSHIPS.OUT_OF_BOUNDS 
    || yRelation(reference, target) === RELATIONSHIPS.OUT_OF_BOUNDS;

/**
 * 
 * @param {Aabb} reference 
 * @param {Aabb} target 
 */
export const isIntersecting = (reference, target) => !isOutOfBounds(reference, target);

/**
 * 
 * @param {Aabb} reference 
 * @param {Aabb[]} targets
 */
export const filterEnclosing = (reference, targets) => targets.filter(target => isEnclosing(reference, target));

/**
 * 
 * @param {Aabb} reference 
 * @param {Aabb[]} targets
 */
export const filterEnclosedBy = (reference, targets) => targets.filter(target => isEnclosedBy(reference, target));

/**
 * 
 * @param {Aabb} reference 
 * @param {Aabb[]} targets
 */
export const filterOutOfBounds = (reference, targets) => targets.filter(target => isOutOfBounds(reference, target));

/**
 * 
 * @param {Aabb} reference 
 * @param {Aabb[]} targets
 */
export const filterIntersecting = (reference, targets) => targets.filter(target => isIntersecting(reference, target));

// curried object: since each node generally keeps the same bounds and methods get called using that as a reference
export default (reference) => ({
    split: dividers => split(reference, dividers),
    is: {
        enclosing: target => isEnclosing(reference, target),
        enclosedBy: target => isEnclosedBy(reference, target),
        intersecting: target => isIntersecting(reference, target),
        outOfBounds: target => isOutOfBounds(reference, target)
    },
    filter: {
        enclosing: targets => filterEnclosing(reference, targets),
        enclosedBy: targets => filterEnclosedBy(reference, targets),
        intersecting: targets => filterIntersecting(reference, targets),
        outOfBounds: targets => filterOutOfBounds(reference, targets)
    }
});