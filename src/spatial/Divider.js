export const DefaultDivider = {
    x: 50,
    y: 50
};

function Divider(params) {
    let {
        x = DefaultDivider.x, y = DefaultDivider.y
    } = params ? params : DefaultDivider;

    if (isNaN(x) || x < 0 || x > 100 || isNaN(y) || y < 0 || y > 100) {
        throw new Error("Invalid Divider input", params);
    } else {
        x = Number(x);
        y = Number(y);

        return {
            x,
            y
        };
    }
}

export default Divider;