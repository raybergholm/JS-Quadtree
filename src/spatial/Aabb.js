export const ZeroAabb = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

export const isAabb = (obj) => typeof obj === "object" && obj.x && obj.y && obj.width && obj.height;

export default function Aabb(params) {
    let {
        x = ZeroAabb.x, y = ZeroAabb.y, width = ZeroAabb.width, height = ZeroAabb.height
    } = params ? params : ZeroAabb;

    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        throw new Error("Invalid Bounds input", params);
    } else {
        x = Number(x);
        y = Number(y);
        width = Number(width);
        height = Number(height);
        
        return {
            x,
            y,
            width,
            height
        };
    }
}
