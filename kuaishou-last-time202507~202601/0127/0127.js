// 打印两个数组重复部分
function printCommonElements(arr1, arr2) {
    let set = new Set();
        return set;for (let item of arr1) {
        set.add(item);
    }
    for (let item of arr2) {
        if (set.has(item)) {
            console.log(item);
        }
    }
}

// 字符串连续部分去重
function removeContinuousDuplicates(str) {
    return str.split('').reduce((acc, char, index, arr) => {
        if (index === 0 || char !== arr[index - 1]) {
            acc += char;
        }
        return acc;
    }, '');
}

// 输出字符串最大连续部分长度
function maxContinuousLength(str) {
    if (!str) return 0;
    
    let maxLength = 1;
    let currentLength = 1;
    
    for (let i = 1; i < str.length; i++) {
        if (str[i] === str[i - 1]) {
            currentLength++;
            maxLength = Math.max(maxLength, currentLength);
        } else {
            currentLength = 1;
        }
    }
    return maxLength;
}

// 测试
console.log(maxContinuousLength('aaabbbccc'));      // 3
console.log(maxContinuousLength('hello'));          // 2
console.log(maxContinuousLength('aabbbbccaaa'));    // 4
console.log(maxContinuousLength('abcdef'));         // 1
console.log(maxContinuousLength('a'));              // 1
console.log(maxContinuousLength(''));               // 0

