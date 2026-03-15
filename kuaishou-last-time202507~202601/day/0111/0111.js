// 发布-订阅
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
    emit(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                callback(...args);
            })
        }

    }

    off(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(item => item !== callback);
        }

    }
}

// array.flat

Array.prototype.myFlat = function (depth = 1) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        if (Array.isArray(this[i]) && depth > 0) {
            result = result.concat(this[i].myFlat(depth - 1));
        } else {
            result.push(this[i]);
        }
    }
}

// array.forEach
Array.prototype.myForEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i, this);
    }
}


// array.map
Array.prototype.myMap = function (callback) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
}

// array.filter
Array.prototype.myFilter = function (callback) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
}

// array.push
Array.prototype.myPush = function (...args) {
    for (let i = 0; i < args.length; i++) {
        this[this.length] = args[i];
    }
    return this.length;
}

// array.pop

Array.prototype.myPop = function () {
    if (this.length === 0) {
        return undefined;
    }
    let result = this[this.length - 1];
    delete this[this.length - 1];
    this.length--;
    return result;
}

// array.shift
Array.prototype.myShift = function () {
    if (this.length === 0) {
        return undefined;
    }
    let result = this[0];
    for (let i = 1; i < this.length; i++) {
        this[i - 1] = this[i];
    }
    delete this[this.length - 1];
    this.length--;
    return result;
}

// array.unshift    
Array.prototype.myUnshift = function (...args) {
    for (let i = this.length - 1; i >= 0; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[i] = args[i];
    }
    return this.length;
}

// array.reduce

Array.prototype.myReduce = function (callback, initialValue) {
    let result = initialValue;
    for (let i = 0; i < this.length; i++) {
        result = callback(result, this[i], i, this);
    }
    return result;
}

// array.some
Array.prototype.mySome = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return true;
        }
    }
    return false;
}

// array.every
Array.prototype.myEvery = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (!callback(this[i], i, this)) {
            return false;
        }
    }
    return true;
}

// array.find
Array.prototype.myFind = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return this[i];
        }
    }
    return undefined;
}

// array.findIndex
Array.prototype.myFindIndex = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return i;
        }
    }
    return -1;
}

// array.includes
Array.prototype.myIncludes = function (value) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return true;
        }
    }
    return false;
}

// array.join
Array.prototype.myJoin = function (separator = ',') {
    let result = '';
    for (let i = 0; i < this.length; i++) {
        result += this[i] + separator;
    }
    return result.slice(0, -separator.length);
}

// array.reverse
Array.prototype.myReverse = function () {
    for (let i = 0; i < this.length / 2; i++) {
        let temp = this[i];
        this[i] = this[this.length - 1 - i];
        this[this.length - 1 - i] = temp;
    }
    return this;
}

// array.splice
Array.prototype.mySplice = function (start, deleteCount, ...args) {
    let result = [];
    for (let i = start; i < start + deleteCount; i++) {
        result.push(this[i]);
        delete this[i];
    }
    for (let i = this.length - 1; i >= start + deleteCount; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[start + i] = args[i];
    }
    this.length = this.length - deleteCount + args.length;
    return result;
}

// array.slice
Array.prototype.mySlice = function (start, end) {
    let result = [];
    for (let i = start; i < end; i++) {
        result.push(this[i]);
    }
    return result;
}

// array.concat
Array.prototype.myConcat = function (...args) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(this[i]);
    }
    for (let i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            for (let j = 0; j < args[i].length; j++) {
                result.push(args[i][j]);
            }
        } else {
            result.push(args[i]);
        }
    }
    return result;
}
// array.indexOf
Array.prototype.myIndexOf = function (value) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return i;
        }
    }
    return -1;
}

// array.lastIndexOf
Array.prototype.myLastIndexOf = function (value) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (this[i] === value) {
            return i;
        }
    }
    return -1;
}

// array.reduce
Array.prototype.myReduce = function (callback, initialValue) {
    let result = initialValue;
    for (let i = 0; i < this.length; i++) {
        result = callback(result, this[i], i, this);
    }
    return result;
}
// array.reduceRight
Array.prototype.myReduceRight = function (callback, initialValue) {
    let result = initialValue;
    for (let i = this.length - 1; i >= 0; i--) {
        result = callback(result, this[i], i, this);
    }
    return result;
}

