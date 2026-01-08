// Array.prototype.forEach() 方法用于对数组的每个元素执行一次提供的函数。
Array.prototype.forEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i, this);
    }
};

console.log('hello world');
// filter
Array.prototype.filter = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
};

// find
Array.prototype.find = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return this[i];
        }
    }
    return undefined;
};

// findIndex
Array.prototype.findIndex = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return i;
        }
    }
    return -1;
}

//map
Array.prototype.map = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
};
console.log('hello world');

// reduce

Array.prototype.reduce = function (callback, initialValue) {
    let accumulator = initialValue !== undefined ? initialValue : this[0];
    for(let i = 1; i < this.length; i++){
        accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
}

// every
Array.prototype.every = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (!callback(this[i], i, this)) {
            return false;
        }
    }
    return true;
}
// some
Array.prototype.some = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return true;
        }
    }
    return false;
}

// flat
Array.prototype.flat = function (depth = 1) {
    const result = [];
    const flatten = (arr, depth) => {
        for (let item of arr) {
            if (Array.isArray(item) && depth > 0) {
                flatten(item, depth - 1);
            } else {
                result.push(item);
            }
        }
    };
    flatten(this, depth);
    return result;
}

// isArray
Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
}

// of
Array.of = function (...elements) {
    return elements;
}

// 去重
Array.prototype.unique = function () {
    return [...new Set(this)];

}

// 去重2
Array.prototype.unique2 = function () {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (result.indexOf(this[i]) === -1) {
            result.push(this[i]);
        }
    }
    return result;
}

// includes
Array.prototype.includes = function (searchElement, fromIndex = 0) {
    for (let i = fromIndex; i < this.length; i++) {
        if (this[i] === searchElement) {
            return true;
        }
    }
    return false;
}
// 对象数组去重
Array.prototype.uniqueByKey = function (key) {
    const seen = new Set();
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (!seen.has(this[i][key])) {
            seen.add(this[i][key]);
            result.push(this[i]);
        }
    }
    return result;
}