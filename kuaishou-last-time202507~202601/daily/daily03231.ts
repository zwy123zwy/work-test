// array 方法全部自定义
// push
function push(arr: any[], ...args: any[]) {
  for (let i = 0; i < args.length; i++) {
    arr[arr.length] = args[i]
  }
  return arr.length
}

// pop
function pop(arr: any[]) {
  if (arr.length === 0) return undefined
  const last = arr[arr.length - 1]
  arr.length = arr.length - 1
  return last
}

// shift
function shift(arr: any[]) {
    if (arr.length === 0) return undefined
    const first = arr[0]
    for (let i = 0; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1]
    }
    arr.length = arr.length - 1
    return first
}

// unshift
function unshift(arr: any[], ...args: any[]) {
    for (let i = arr.length - 1; i >= 0; i--) {
        arr[i + args.length] = arr[i]
    }
    for (let i = 0; i < args.length; i++) {
        arr[i] = args[i]
    }
    return arr.length
}

// reverse
function reverse(arr: any[]) {
    for (let i = 0; i < arr.length / 2; i++) {
        const temp = arr[i]
        arr[i] = arr[arr.length - 1 - i]
        arr[arr.length - 1 - i] = temp
    }
    return arr
}

// slice
function slice(arr: any[], start: number = 0, end: number = arr.length) {
    const result = []
    for (let i = start; i < end; i++) {
        result.push(arr[i])
    }
    return result
}

// filter
function filter(arr: any[], callback: (value: any, index: number, array: any[]) => boolean) {
    const result = []
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            result.push(arr[i])
        }
    }
    return result
}

// sort
function sort(arr: any[], compareFn?: (a: any, b: any) => number) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (compareFn) {
                if (compareFn(arr[j], arr[j + 1]) > 0) {
                    const temp = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = temp
                }   
            } else {
                if (String(arr[j]) > String(arr[j + 1])) {
                    const temp = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = temp
                }
            }
            console.log(arr)
        }
        console.log(arr)
    }
    return arr  
    
}

// splice
function splice(arr: any[], start: number, deleteCount: number, ...items: any[]) {
    const result = []
    for (let i = start; i < start + deleteCount; i++) {
        result.push(arr[i])
    }
    for (let i = arr.length - 1; i >= start; i--) {
        arr[i + items.length] = arr[i]
    }
    for (let i = 0; i < items.length; i++) {
        arr[start + i] = items[i]
    }
    arr.length = arr.length - deleteCount + items.length
    return result
    
}

// map
function map(arr: any[], callback: (value: any, index: number, array: any[]) => any) {
    const result = []
    for (let i = 0; i < arr.length; i++) {
        result.push(callback(arr[i], i, arr))
    }
    return result
}

// reduce
function reduce(arr: any[], callback: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue?: any) {
    let result = initialValue
    for (let i = 0; i < arr.length; i++) {
        result = callback(result, arr[i], i, arr)
    }
    return result
}

// forEach
function forEach(arr: any[], callback: (value: any, index: number, array: any[]) => void) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i], i, arr)
    }
}



// includes
function includes(arr: any[], value: any, fromIndex: number = 0) {
    for (let i = fromIndex; i < arr.length; i++) {
            
        if (arr[i] === value) {
            return true
        }
    }
    return false
}

// indexOf
function indexOf(arr: any[], value: any, fromIndex: number = 0) {
    for (let i = fromIndex; i < arr.length; i++) {
        if (arr[i] === value) {
            return i
        }
    }
    return -1
}


// lastIndexOf
function lastIndexOf(arr: any[], value: any, fromIndex: number = arr.length - 1) {
    for (let i = fromIndex; i >= 0; i--) {
        if (arr[i] === value) {
            return i
        }
    }
    return -1
}

// every
function every(arr: any[], callback: (value: any, index: number, array: any[]) => boolean) {
    for (let i = 0; i < arr.length; i++) {
        if (!callback(arr[i], i, arr)) {
            return false
        }
    }
    return true
}

// some
function some(arr: any[], callback: (value: any, index: number, array: any[]) => boolean) {
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            return true
        }
    }
    return false
}

// concat
function concat(arr: any[], ...args: any[]) {
    const result = []
    for (let i = 0; i < arr.length; i++) {
        result.push(arr[i])
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

// bubble sort
function bubbleSort(arr: any[]) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    return arr
}


// selection sort
function selectionSort(arr: any[]) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        const temp = arr[i]
        arr[i] = arr[minIndex]
        arr[minIndex] = temp
    }
    return arr

}

// insertion sort
function insertionSort(arr: any[]) {
    for (let i = 1; i < arr.length; i++) {
        let j = i
        while (j > 0 && arr[j] < arr[j - 1]) {
            const temp = arr[j]
            arr[j] = arr[j - 1]
            arr[j - 1] = temp
            j--
        }
        return arr
        
    }
}

// quick sort
function quickSort(arr: any[]) { 
    if (arr.length <= 1) return arr
    const pivot = arr[arr.length - 1]
    const left = []
    const right = []
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    return quickSort(left).concat(pivot, quickSort(right))
}


// LIS
function lengthOfLIS(arr: number[]) {
    const dp = new Array(arr.length).fill(1)
    for (let i = 1; i < arr.length; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[i] > arr[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1)
            }
        }
    }
    return Math.max(...dp)
}