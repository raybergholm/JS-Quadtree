export const ZeroBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

function Bounds(params) {
    let {
        x = ZeroBounds.x, y = ZeroBounds.y, width = ZeroBounds.width, height = ZeroBounds.height
    } = params ? params : ZeroBounds;

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

export default Bounds;