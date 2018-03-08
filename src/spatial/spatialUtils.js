import Bounds from "./Bounds";

export const splitBounds = (bounds, dividers) => {
    const fulcrumX = 100 / dividers.x;
    const fulcrumY = 100 / dividers.y;
    
    const horizontalSplitPoint = (bounds.x + bounds.width) / fulcrumX;
    const verticalSplitPoint = (bounds.y + bounds.height) / fulcrumY;

    return {
        ne: new Bounds({x: horizontalSplitPoint, y: bounds.y, width: bounds.width / (100 / fulcrumX), height: bounds.height / fulcrumY }),
        nw: new Bounds({x: bounds.x, y: bounds.y, width: bounds.width / fulcrumX, height: bounds.height / fulcrumY }),
        sw: new Bounds({x: bounds.x, y: verticalSplitPoint, width: bounds.width / fulcrumX, height: bounds.height / (100 / fulcrumY) }),
        se: new Bounds({x: horizontalSplitPoint, y: verticalSplitPoint, width: bounds.width / (100 / fulcrumX), height: bounds.height / (100 / fulcrumY) })
    };
};