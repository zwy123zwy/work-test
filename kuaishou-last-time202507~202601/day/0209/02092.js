// 已知两个递增数组，求合并后的中位数（要求 O(log(m+n))的复杂度）
// function findMedianSortedArrays(nums1, nums2) {
//     const m = nums1.length;
//     const n = nums2.length;
//     if (m > n) {
//         [nums1, nums2] = [nums2, nums1];
//         [m, n] = [n, m];
//     }
//     let iMin = 0, iMax = m, halfLen = Math.floor((m + n + 1) / 2);
//     while (iMin <= iMax) {
//         const i = Math.floor((iMin + iMax) / 2);
//         const j = halfLen - i;
//         if (i < iMax && nums2[j - 1] > nums1[i]) {
//             iMin = i + 1;
//         } else if (i > iMin && nums1[i - 1] > nums2[j]) {
//             iMax = i - 1;
//         }
//     }
//     const i = iMin;
//     const j = halfLen - i;
//     if (i === 0) {
//         return nums2[j - 1];
//     }
//     if (j === 0) {
//         return nums1[i - 1];
//     }
//     return (Math.max(nums1[i - 1], nums2[j - 1]) + Math.min(nums1[i], nums2[j])) / 2;
// }


// 实现一个日期格式化功能，支持自定义格式化设置
// const text = format(new Date(),”yyyy-MM-dd HH:mm:ss”) 
// 输出：2024-04-06 12:22:43
// const text = format(new Date(),”yyyy年MM月dd日”) 
// 输出：2024年04月06日
// const text = format(new Date(),”yyyy/M/d”) 
// 输出：2024/4/6

function format(date, format) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const map = {
        "yyyy": year,
        "MM": month,
        "M": month,
        "dd": day,
        "d": day,
        "HH": hour,
        "H": hour,
        "mm": minute,
        "m": minute,
        "ss": second,
        "s": second
    }
    
    for (let key in map) {
        format = format.replace(key, map[key]);
    }
    return format;
}

const text1 = format(new Date(),'yyyy-MM-dd HH:mm:ss');
console.log(text1);
const text2 = format(new Date(),'yyyy年MM月dd日');
console.log(text2);
const text3 = format(new Date(),'yyyy/M/d');
console.log(text3);

