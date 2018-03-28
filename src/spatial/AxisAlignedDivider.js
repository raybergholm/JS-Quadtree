/**
 * @typedef AxisAlignedDivider
 */
export const DEFAULT_DIVIDER = {
    x: 50,
    y: 50
};

export default function AxisAlignedDivider(params) {
    let {
        x = DEFAULT_DIVIDER.x, y = DEFAULT_DIVIDER.y
    } = params ? params : DEFAULT_DIVIDER;

    if (isNaN(x) || x < 0 || x > 100 || isNaN(y) || y < 0 || y > 100) {
        throw new Error("Invalid Divider input", params);
    } else {
        x = Number(x);
        y = Number(y);

        Object.assign(this, {
            x,
            y
        });
    }
}

AxisAlignedDivider.prototype.toString = function() {
    return JSON.stringify(this);
};