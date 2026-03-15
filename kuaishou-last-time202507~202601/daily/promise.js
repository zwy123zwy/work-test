// jsonToTree
// function jsonToTree(json) {
//     const result = [];
//     for (const key in json) {
//         const node = { name: key }; 
//         if (typeof json[key] === 'object') {
//             node.children = jsonToTree(json[key]); 
//         }
//         result.push(node);
//     }   
//     return result;
// }

// ['aaafsd', 'aawwewer', 'aaddfff'] => 'aa'

function longestCommonPrefix(strs) {
    if (strs.length === 0) return '';
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === '') return '';
            
        }
    }
    return prefix;
}
console.log(longestCommonPrefix(['aa/bb/sd', 'aa/bb/wwewer', 'aa/bb/ddfff']));
console.log('Test 1:', longestCommonPrefix(['aaafsd', 'aawwewer', 'aaddfff'])); console.log('Test 2:', longestCommonPrefix(['flower', 'flow', 'flight'])); console.log('Test 3:', longestCommonPrefix(['a'])); console.log('Test 4:', longestCommonPrefix(['', 'a']));


// 实现一个redux【编程】

