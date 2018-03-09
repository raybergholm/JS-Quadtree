export const ZeroBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

function Bounds(params) {
    const {
        x = 0, y = 0, width = 0, height = 0
    } = params ? params : ZeroBounds;

    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        throw new Error("Invalid Bounds input", params);
    } else {
        return {
            x,
            y,
            width,
            height
        };
    }
}

export default Bounds;