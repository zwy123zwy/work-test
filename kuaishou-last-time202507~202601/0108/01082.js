function urlParse(url){
    const path = url.split('?')[1] || '';
    console.log(path);
    const queryString = path?.split('&') ?? [];
    let query = {};
    for(const item of queryString){
        const [rawKey,rawValue] = item.split('=');
        const key = decodeURIComponent(rawKey);
        const value = decodeURIComponent(rawValue);
    
        if(query[key] !== undefined){
            if(Array.isArray(query[key])){
                query[key].push(value);
            }else{
                query[key] = [query[key],value];
            }
        }else{
            query[key] = value;
        }
    }
    return query;
}
const url = "https:/(url));om?a=1&b=2&c=&d&ids=10&ids=20&name=%E5%BC%A0%E4%B8%89";
console.log(urlParse(url));

// 函数判断数据类型

function typeOf(data){
    return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
}
console.log(typeOf([])); // "array"
console.log(typeOf({})); // "object"
console.log(typeOf(null)); // "null"
console.log(typeOf(undefined)); // "undefined"
console.log(typeOf(123)); // "number"
console.log(typeOf("hello")); // "string"
console.log(typeOf(()=>{})); // "function"


// 数组拆分 固定长度
function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}


