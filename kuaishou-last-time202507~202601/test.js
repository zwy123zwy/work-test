// 题目：实现数组的扁平化

// 示例：
// 输入：[1, 2, [3, 4, [5, 6]]]
// 输出：[1, 2, 3, 4, 5, 6]
function flat(arr) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            res.push(...flat(arr[i]));
        } else {
            res.push(arr[i]);
        }
    }
    return res;
}
// console.log(flat([1, 2, [3, 4, [5, 6]]]))

// 题目：三数之和

// 给定一个整数数组nums，
// 返回所有不重复的三元组[nums[i], nums[j], nums[k]]，
// 使得i != j != k且nums[i] + nums[j] + nums[k] = 0

// 示例：
// 输入：nums = [-1, 0, 1, 2, -1, -4]
// 输出：[[-1, -1, 2], [-1, 0, 1]]

// 要求：
// 时间复杂度优化至O(n²)，写出完整代码并解释思路

function threeSum(nums) {
    const res = [];
    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 2; i++) {
        // 
        if (i > 0 && nums[i] === nums[i - 1]) {
            continue;
        }

        let left = i + 1;
        let right = nums.length - 1;

        const target = -nums[i];
        while (left < right) {
            const sum = nums[left] + nums[right];
            if (sum === target) {
                res.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    return res;
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]))