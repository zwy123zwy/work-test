/**
 * 021001 Array 原生方法复现
 * 日期：2026-02-10
 * 规则：手写实现，不直接调用对应原生方法（可调用其他已实现的）。
 */

// ==================== 1. forEach ====================
// 遍历数组，对每项执行 callback(item, index, arr)。无返回值。

function myForEach(arr, callback, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        if (i in arr) callback.call(thisArg, arr[i], i, arr);
    }
}


// ==================== 2. map ====================
// 对每项执行 fn(item, i, arr)，返回新数组。

function myMap(arr, fn, thisArg) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (i in arr) result.push(fn.call(thisArg, arr[i], i, arr));
    }
    return result;
}


// ==================== 3. filter ====================
// 对每项执行 fn(item, i, arr)，保留返回真值的项，返回新数组。

function myFilter(arr, fn, thisArg) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (i in arr && fn.call(thisArg, arr[i], i, arr)) result.push(arr[i]);
    }
    return result;
}


// ==================== 4. reduce ====================
// fn(acc, cur, i, arr)，无 init 时首项为 acc，从第二项开始；空数组无 init 抛错。

function myReduce(arr, fn, init) {
    if (arr.length === 0 && init === undefined) throw new TypeError('Reduce of empty array with no initial value');
    let acc = init !== undefined ? init : arr[0];
    let start = init !== undefined ? 0 : 1;
    for (let i = start; i < arr.length; i++) {
        if (i in arr) acc = fn(acc, arr[i], i, arr);
    }
    return acc;
}


// ==================== 5. find ====================
// 返回第一个使 fn(item, i, arr) 为真的项，否则 undefined。

function myFind(arr, fn, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        if (i in arr && fn.call(thisArg, arr[i], i, arr)) return arr[i];
    }
    return undefined;
}


// ==================== 6. findIndex ====================
// 返回第一个使 fn(item, i, arr) 为真的下标，否则 -1。

function myFindIndex(arr, fn, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        if (i in arr && fn.call(thisArg, arr[i], i, arr)) return i;
    }
    return -1;
}


// ==================== 7. some ====================
// 有一项使 fn 为真则返回 true，否则 false。空数组返回 false。

function mySome(arr, fn, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        if (i in arr && fn.call(thisArg, arr[i], i, arr)) return true;
    }
    return false;
}


// ==================== 8. every ====================
// 全部项使 fn 为真则返回 true，否则 false。空数组返回 true。

function myEvery(arr, fn, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        if (i in arr && !fn.call(thisArg, arr[i], i, arr)) return false;
    }
    return true;
}


// ==================== 9. indexOf ====================
// indexOf(arr, value, fromIndex)，从 fromIndex 起找 value，严格相等，返回下标或 -1。

function myIndexOf(arr, value, fromIndex = 0) {
    const start = fromIndex < 0 ? Math.max(0, arr.length + fromIndex) : fromIndex;
    for (let i = start; i < arr.length; i++) {
        if (i in arr && arr[i] === value) return i;
    }
    return -1;
}


// ==================== 10. includes ====================
// includes(arr, value, fromIndex)，能正确判断 NaN。

function myIncludes(arr, value, fromIndex = 0) {
    const start = fromIndex < 0 ? Math.max(0, arr.length + fromIndex) : fromIndex;
    for (let i = start; i < arr.length; i++) {
        if (i in arr && (arr[i] === value || (Number.isNaN(value) && Number.isNaN(arr[i])))) return true;
    }
    return false;
}


// ==================== 11. flat ====================
// flat(arr, depth)，depth 默认 1，支持 Infinity，不改变原数组。

function myFlat(arr, depth = 1) {
    const result = [];
    const flatten = (a, d) => {
        for (let i = 0; i < a.length; i++) {
            if (i in a) {
                if (Array.isArray(a[i]) && d > 0) flatten(a[i], d - 1);
                else result.push(a[i]);
            }
        }
    };
    flatten(arr, depth);
    return result;
}


// ==================== 12. flatMap ====================
// flatMap(arr, fn)，对每项执行 fn(item, i, arr)，将返回值 concat 成一维数组。

function myFlatMap(arr, fn, thisArg) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (i in arr) {
            const val = fn.call(thisArg, arr[i], i, arr);
            if (Array.isArray(val)) result.push(...val);
            else result.push(val);
        }
    }
    return result;
}


// ==================== 13. fill ====================
// fill(arr, value, start, end)，填充 [start, end)，会改变原数组。start 默认 0，end 默认 length。

function myFill(arr, value, start = 0, end = arr.length) {
    const s = start < 0 ? Math.max(0, arr.length + start) : Math.min(start, arr.length);
    const e = end < 0 ? Math.max(0, arr.length + end) : Math.min(end, arr.length);
    for (let i = s; i < e; i++) arr[i] = value;
    return arr;
}


// ==================== 14. concat ====================
// concat(arr, ...args)，arr 与 args 中的每一项（若为数组则展开其元素）拼接成新数组。

function myConcat(arr, ...args) {
    const result = [...arr];
    for (const x of args) {
        if (Array.isArray(x)) result.push(...x);
        else result.push(x);
    }
    return result;
}


// ==================== 15. join ====================
// join(arr, separator)，默认 separator 为 ','。

function myJoin(arr, separator = ',') {
    let s = '';
    for (let i = 0; i < arr.length; i++) {
        if (i > 0) s += separator;
        s += i in arr ? (arr[i] != null ? String(arr[i]) : '') : '';
    }
    return s;
}


// ==================== 16. slice ====================
// slice(arr, start, end)，返回 [start, end) 的浅拷贝。不改变原数组。

function mySlice(arr, start = 0, end = arr.length) {
    const len = arr.length;
    const s = start < 0 ? Math.max(0, len + start) : Math.min(start, len);
    const e = end < 0 ? Math.max(0, len + end) : Math.min(end, len);
    const result = [];
    for (let i = s; i < e; i++) {
        if (i in arr) result.push(arr[i]);
    }
    return result;
}


// ==================== 17. splice（说明） ====================
// splice 会改变原数组：删除 [start, start+deleteCount)，再在 start 处插入 ...items。
// 返回被删除元素组成的数组。手写时注意 length 与索引的同步。

// 实现：
function mySplice(arr, start, deleteCount = arr.length - start, ...items) {
    const len = arr.length;
    const s = start < 0 ? Math.max(0, len + start) : Math.min(start, len);
    const delCount = Math.max(0, Math.min(deleteCount, len - s));
    const deleted = [];
    for (let i = 0; i < delCount; i++) {
        if (s + i in arr) deleted.push(arr[s + i]);
    }
    const tail = [];
    for (let i = s + delCount; i < len; i++) {
        if (i in arr) tail.push(arr[i]);
    }
    arr.length = s;
    for (const x of items) arr.push(x);
    for (const x of tail) arr.push(x);
    return deleted;
}


// ==================== 18. reverse ====================
// reverse(arr)，原地反转，返回 arr。

function myReverse(arr) {
    let i = 0, j = arr.length - 1;
    while (i < j) {
        if (i in arr || j in arr) {
            const t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }
        i++;
        j--;
    }
    return arr;
}


// ==================== 19. sort（说明） ====================
// sort(arr, compareFn)：原地排序。compareFn(a,b) 返回负数、0、正数。
// 不传 compareFn 时按字符串升序（需将元素转字符串再比较）。手写可用任意排序算法。

// 实现（简单冒泡 + compareFn）：
function mySort(arr, compareFn) {
    const cmp = compareFn != null ? compareFn : (a, b) => String(a).localeCompare(String(b));
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (j in arr && j + 1 in arr && cmp(arr[j], arr[j + 1]) > 0) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}


// ==================== 20. at ====================
// at(arr, index)，支持负索引，-1 为最后一项。越界返回 undefined。

function myAt(arr, index) {
    const i = index >= 0 ? index : arr.length + index;
    if (i < 0 || i >= arr.length) return undefined;
    return arr[i];
}
