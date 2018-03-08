const DEFAULT_MAX_ITEMS = 5;
const DEFAULT_MAX_LEVELS = 5;

export default ({
    maxItemsInNode = DEFAULT_MAX_ITEMS,
    maxLevelsInTree = DEFAULT_MAX_LEVELS
}) => ({
    maxItemsInNode,
    maxLevelsInTree
});