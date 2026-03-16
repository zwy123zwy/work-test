function flatten(arr: any[], depth: number = 1) {
    if (depth <= 0) return arr;
    return arr.reduce((acc, item) => {
        if (Array.isArray(item)) {
            return acc.concat(flatten(item, depth - 1));
        }
        return acc.concat(item);
    }, []);
}

console.log(flatten([1, [2, 3], [4, [5, 6]]]));           // [1, 2, 3, 4, 5, 6]
console.log(flatten([1, [2, 3], [4, [5, 6]]], 1));        // [1, 2, 3, 4, [5, 6]]
console.log(flatten([1, [2, 3], [4, [5, 6]]], Infinity)); // 完全扁平化