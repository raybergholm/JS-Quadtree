/**
 * @typedef Aabb
 */
export const ZERO_AABB = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};
/**
 * @summary Returns true if this is an object with x, y, widht and height properties
 * @param {object} obj 
 */
export const isAabb = (obj) => typeof obj === "object" && obj.x && obj.y && obj.width && obj.height;

/**
 * @summary Returns true if x, y, width and height values are equals
 * @param {Aabb} left 
 * @param {Aabb} right 
 */
export const aabbEquals = (left, right) => left.x === right.x && left.y === right.y && left.width === right.width && left.height === right.height;

/**
 * @summary Returns quantity number of Aabbs with random coordinates and sizes, all enclosed by the bounds
 * @param {Aabb} bounds 
 * @param {integer} quantity 
 */
export const generateRandomAabbs = (bounds, quantity) => {
    const randomInRange = (min, max) => Math.floor(min) + Math.random() * Math.floor(max - min);

    const left = bounds.x;
    const right = bounds.x + bounds.width;
    const top = bounds.y;
    const bottom = bounds.y + bounds.height;

    const aabbs = [];

    for (let i = 0; i < quantity; i++) {
        const x = randomInRange(left, right);
        const y = randomInRange(top, bottom);
        const width = randomInRange(0, right - x);
        const height = randomInRange(0, bottom - y);

        aabbs.push(new Aabb({
            x,
            y,
            width,
            height
        }));
    }

    return aabbs;
};

export default function Aabb(params) {
    let {
        x = ZERO_AABB.x, y = ZERO_AABB.y, width = ZERO_AABB.width, height = ZERO_AABB.height
    } = params ? params : ZERO_AABB;

    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        throw new Error("Invalid Bounds input", params);
    } else {
        x = Number(x);
        y = Number(y);
        width = Number(width);
        height = Number(height);

        Object.assign(this, {
            x,
            y,
            width,
            height
        });
    }
}