import Bounds from "./Bounds";

export const splitBounds = (reference, dividers) => {
    const fulcrumX = 100 / dividers.x;
    const fulcrumY = 100 / dividers.y;

    const horizontalSplitPoint = (reference.x + reference.width) / fulcrumX;
    const verticalSplitPoint = (reference.y + reference.height) / fulcrumY;

    return {
        ne: new Bounds({
            x: horizontalSplitPoint,
            y: reference.y,
            width: reference.width / (100 / fulcrumX),
            height: reference.height / fulcrumY
        }),
        nw: new Bounds({
            x: reference.x,
            y: reference.y,
            width: reference.width / fulcrumX,
            height: reference.height / fulcrumY
        }),
        sw: new Bounds({
            x: reference.x,
            y: verticalSplitPoint,
            width: reference.width / fulcrumX,
            height: reference.height / (100 / fulcrumY)
        }),
        se: new Bounds({
            x: horizontalSplitPoint,
            y: verticalSplitPoint,
            width: reference.width / (100 / fulcrumX),
            height: reference.height / (100 / fulcrumY)
        })
    };
};

export const isEnclosing = (reference, target) => !(target.x < reference.x ||
    target.x + target.width > reference.x + reference.width ||
    target.y < reference.y ||
    target.y + target.height > reference.y + reference.height);

export const mapEnclosedBounds = (reference, targets) => targets.filter((target) => isEnclosing(reference, target));

// curried object: since each node generally keeps the same bounds and methods get called using that as a reference
export default (reference) => ({
    splitBounds: dividers => splitBounds(reference, dividers),
    isEnclosing: target => isEnclosing(reference, target),
    mapEnclosedBounds: targets => mapEnclosedBounds(reference, targets)
});