// array
// 冒泡排序
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
    return arr
}

console.log(bubbleSort([1, 5, 3, 2, 4]))

// 选择排序
function selectSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
    return arr
}

console.log(selectSort([1, 5, 3, 2, 4]))

// 插入排序
function insertSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let j = i - 1
        let temp = arr[i]
        while (j >= 0 && arr[j] > temp) {
            arr[j + 1] = arr[j]
            j--
        }
        arr[j + 1] = temp
    }
    return arr
}

console.log(insertSort([1, 5, 3, 2, 4]))

// 快速排序
function quickSort(arr) {
    if (arr.length <= 1) return arr
    let pivotIndex = Math.floor(arr.length / 2)
    let pivot = arr.splice(pivotIndex, 1)[0]
    let left = []
    let right = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    return quickSort(left).concat([pivot], quickSort(right))
}

console.log(quickSort([1, 5, 3, 2, 4]))

// 堆排序
function heapSort(arr) {
    function heapify(arr, i, size) {
        let left = 2 * i + 1
        let right = 2 * i + 2
        let largest = i
        if (left < size && arr[left] > arr[largest]) {
            largest = left
        }
        if (right < size && arr[right] > arr[largest]) {
            largest = right
        }
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]]
            heapify(arr, largest, size)
        }
        return arr
    }

    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        heapify(arr, i, arr.length)
    }
    for (let i = arr.length - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]]
        heapify(arr, 0, i)
    }
    return arr
}

// 去重
function unique(arr) {
    return Array.from(new Set(arr))
}

console.log(unique([1, 5, 3, 2, 4, 5, 3, 2, 1]))

// 去重2
function unique2(arr) {
    let obj = {}
    return arr.filter(item => {
        return !obj[item] && (obj[item] = true)
    })
}

console.log(unique2([1, 5, 3, 2, 4, 5, 3, 2, 1]))

// 去重3
function unique3(arr) {
    return arr.reduce((acc, cur) => {
        if (!acc.includes(cur)) {
            acc.push(cur)
        }
        return acc
    }, [])
}

// flat

function flat(arr) {
    return arr.reduce((acc, cur) => {
        return acc.concat(Array.isArray(cur) ? flat(cur) : cur)
    }, [])
}

console.log(flat([1, [2, [3, [4, [5]]]]]))


// push
Array.prototype.push = function (...args) {
    for (let i = 0; i < args.length; i++) {
        this[this.length] = args[i]
    }
    return this.length
}

// shift
Array.prototype.shift = function () {
    for (let i = 0; i < this.length - 1; i++) {
        this[i] = this[i + 1]
    }
    this.length--
    return this[0]
}

// unshift
Array.prototype.unshift = function (...args) {
    for (let i = this.length - 1; i >= 0; i--) {
        this[i + args.length] = this[i]
    }
    for (let i = 0; i < args.length; i++) {
        this[i] = args[i]
    }
    return this.length
}

// pop
Array.prototype.pop = function () {
    let temp = this[this.length - 1]
    this.length--
    return temp
}

// reverse
Array.prototype.reverse = function () {
    for (let i = 0; i < this.length / 2; i++) {
        [this[i], this[this.length - 1 - i]] = [this[this.length - 1 - i], this[i]]
    }
    return this
}

// reduce
Array.prototype.reduce = function (callback, initialValue) {
    let accumulator = initialValue
    for (let i = 0; i < this.length; i++) {
        accumulator = callback(accumulator, this[i], i, this)
    }
    return accumulator
}

// reduceRight
Array.prototype.reduceRight = function (callback, initialValue) {
    let accumulator = initialValue
    for (let i = this.length - 1; i >= 0; i--) {
        accumulator = callback(accumulator, this[i], i, this)
    }
    return accumulator
}

// forEach
Array.prototype.forEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i, this)
    }
}

// map
Array.prototype.map = function (callback) {
    let result = []
    for (let i = 0; i < this.length; i++) {
        result[i] = callback(this[i], i, this)
    }
    return result
}

// filter
Array.prototype.filter = function (callback) {
    let result = []
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            result.push(this[i])
        }
    }
    return result
}

// includes
Array.prototype.includes = function (searchElement) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === searchElement) {
            return true
        }
    }
    return false
}

// indexOf
Array.prototype.indexOf = function (searchElement) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === searchElement) {
            return i
        }
    }
    return -1
}

// lastIndexOf
Array.prototype.lastIndexOf = function (searchElement) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (this[i] === searchElement) {
            return i
        }
    }
    return -1
}


// find
Array.prototype.find = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return this[i]
        }
    }
    return undefined
}

// findIndex

Array.prototype.findIndex = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return i
        }
    }
    return -1
}

// some
Array.prototype.some = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return true
        }
    }
    return false
}

// every
Array.prototype.every = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (!callback(this[i], i, this)) {
            return false
        }
    }
    return true
}

// sort
Array.prototype.sort = function (compareFn) {
    for (let i = 0; i < this.length; i++) {
        for (let j = i + 1; j < this.length; j++) {
            if (compareFn(this[i], this[j]) > 0) {
                [this[i], this[j]] = [this[j], this[i]]
            }
        }
    }
    return this
}

// toString
Array.prototype.toString = function () {
    return this.join(',')
}

// slice
Array.prototype.slice = function (start, end) {
    let result = []
    for (let i = start; i < end; i++) {
        result.push(this[i])
    }
    return result
}

// splice
Array.prototype.splice = function (start, deleteCount, ...args) {
    let result = []
    for (let i = start; i < start + deleteCount; i++) {
        result.push(this[i])
    }
    for (let i = start + deleteCount; i < this.length; i++) {
        this[i - deleteCount] = this[i]
    }
    this.length -= deleteCount
    for (let i = 0; i < args.length; i++) {
        this[this.length + i] = args[i]
    }
    return result
}

// concat
Array.prototype.concat = function (...args) {
    let result = []
    for (let i = 0; i < this.length; i++) {
        result.push(this[i])
    }
    for (let i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            for (let j = 0; j < args[i].length; j++) {
                result.push(args[i][j])
            }
        } else {
            result.push(args[i])
        }
    }
    return result
}