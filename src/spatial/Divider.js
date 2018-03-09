export const DefaultDivider = {
    x: 50,
    y: 50
};

function Divider(params) {
    const {
        x = 50, y = 50
    } = params ? params : DefaultDivider;

    if (isNaN(x) || isNaN(y) || x < 0 || x > 100 || y < 0 || y > 100) {
        throw new Error("Invalid Divider input", params);
    } else {
        return {
            x,
            y
        };
    }
}

export default Divider;