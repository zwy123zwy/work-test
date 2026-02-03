// useRequest
// const useRequest = (request, options = {}){
//     const { debounceWait = 0, throttleWait = 0 } = options
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState(null)
//     const [data, setData] = useState(null)
//     const run = useCallback((params) => {
//         setLoading(true)
//         const doRequest = () => {
//             request(params).then(res => setData(res)).catch(e => setError(e))
//                 .finally(setLoading(false))
//         }
//         if (debounceWait > 0) {
//             debounce(doRequest, debounceWait)
//         } else if (throttleWait > 0) {
//             throttle(doRequest, throttleWait)
//         } else {
//             doRequset()
//         }
//     }
//         , [request, debounceWait, throttleWait])
//     return { loading, run, error, data }
// }


// 模拟
// function MyComponent() {
//     useEffect(() => {
//         // 这里的代码会在组件挂载后执行，模拟componentDidMount的行为
//         console.log('Component did mount');

//         // 返回一个函数，在组件卸载之前执行，模拟componentWillUnmount的行为
//         return () => {
//             console.log('Component will unmount');
//         };
//     }, []); // 传递一个空数组[]表示这个effect不依赖于props或state中的任何值，因此只运行一次

//     return (
//         <div>Hello, World!</div>
//     );
// }


// 单例模式
class Singleton {
    constructor(name, age) {
        if (!Singleton.instance) {
            this.name = name
            this.age = age
            Singleton.instance = this
        }
        return Singleton.instance
    }
}

console.log(new Singleton("Taobao", 18) === new Singleton("Baidu", 15)) // true



const data = [
    {
        id: '1',
        name: '父节点1',
        children: [
            {
                id: '1-1',
                name: '子节点1-1',
                children: [
                    {
                        id: '1-1-1',
                        name: '子节点1-1-1'
                    },
                    {
                        id: '1-1-2',
                        name: '子节点1-1-2'
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        name: '父节点2',
        children: [
            {
                id: '2-1',
                name: '子节点2-1'
            }
        ]
    }
]
const result = data.reduce(function (acc, cur) {
    acc.push({
        id: cur.id,
        name: cur.name,
        parentId: cur.parentId
    });
    cur.children && cur.children.forEach(child => {
        child.parentId = cur.id;
        arguments.callee(acc, child);
    })
    return acc;
}, []);


const arr = [1, [2, 3, [4, 5]], 1, 2, [6, 7]]
Array.prototype.flat = function (deep = 1) {
    let res = []
    deep--
    for (const p of this) {
        if (Array.isArray(p) && deep >= 0) {
            res = res.concat(p.flat(deep))
        } else {
            res.push(p)
        }
    }
    return res
}
console.log(arr.flat(1))

// 无返回值，调用callback
Array.prototype.myForEach = function (callback) {
    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i, this);
    }
};


const arr1 = [1, 2, 3]
Array.prototype.map = function (callback) {
    const res = [];
    for (let i = 0; i < this.length; i++) {
        res.push(callback(this[i], i, this))
    }
    return res;
}
const res = arr1.map((ele, index, arr) => {
    return ele * 2
})
console.log(res)


function myAssign(target, ...sources) {
    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);

    sources.forEach(source => {
        if (source != null) {
            Object.keys(source).forEach(key => {
                to[key] = source[key];
            });
        }
    });

    return to;
}

// 打印两个数组重复部分
const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const arr3 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
function printRepeat(arr1, arr2) {
    const map = new Map()
    let res = []
    arr1.forEach(item => {
        map.set(item, true)
    })
    arr2.forEach(item => {
        if (map.has(item)) {
            // console.log(item)
            res.push(item)
        }
    })
    return res
}

console.log(printRepeat(arr2, arr3))
// 字符串连续部分去重
function removeConsecutiveDuplicates(str) {
    if (!str) return str;
    
    let result = str[0]; // 第一个字符总是保留
    
    for (let i = 1; i < str.length; i++) {
        if (str[i] !== str[i - 1]) {
            result += str[i];
        }
    }
    
    return result;
}

console.log(removeConsecutiveDuplicates("aaabbbcccaaaddd")); // "abcbcad"
console.log(removeConsecutiveDuplicates("aabbccddee"));      // "abcde"

// 输出字符串最大连续部分长度
function getMaxConsecutiveLength(str) {
    if (!str) return 0;
    
    let maxLength = 1;
    let currentLength = 1;
    
    for (let i = 1; i < str.length; i++) {
        if (str[i] === str[i - 1]) {
            currentLength++;
        } else {
            maxLength = Math.max(maxLength, currentLength);
            currentLength = 1;
        }
    }
    
    // 检查最后一段连续字符的长度
    maxLength = Math.max(maxLength, currentLength);
    
    return maxLength;
}

console.log(getMaxConsecutiveLength("aaabbbcccaaaddd")); // 3 ("aaa", "bbb", "aaa", "ddd")
console.log(getMaxConsecutiveLength("aabccccdefgghh"));  // 4 ("cccc")
console.log(getMaxConsecutiveLength("abcdefg"));         // 1 (没有重复)
console.log(getMaxConsecutiveLength("aaaaaaa"));         // 7 (全部相同)

// 手写深拷贝
function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    let newObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
        }
    }
    return newObj; 
}

// // 2.实现一个响应式的三桶布局
// .container{
//     display: flex;
//     flex-direction: row;
    
// }

// 3.手写useState

// React useState Hook 的简单模拟实现
function createUseState() {
    // 维护一个状态池，每个索引对应组件中 hooks 的位置
    const statePool = [];
    let currentIndex = 0; // 当前组件渲染时的 hook 索引
    
    // 重置索引，模拟组件重新渲染
    function resetIndex() {
        currentIndex = 0;
    }
    
    // useState 模拟实现
    function useState(initialValue) {
        // 如果当前索引还没有状态，则初始化
        if (statePool[currentIndex] === undefined) {
            statePool[currentIndex] = typeof initialValue === 'function' ? initialValue() : initialValue;
        }
        
        // 获取当前状态
        const currentState = statePool[currentIndex];
        
        // 创建 setState 函数
        const setState = (newState) => {
            if (typeof newState === 'function') {
                statePool[currentIndex] = newState(statePool[currentIndex]);
            } else {
                statePool[currentIndex] = newState;
            }
            
            // 触发组件重新渲染（简化版）
            resetIndex();
            renderComponent(); // 重新渲染组件
        };
        
        currentIndex++; // 移动到下一个 hook 位置
        
        return [currentState, setState];
    }
    
    return { useState, resetIndex };
}

// 模拟组件渲染
function renderComponent() {
    // 重置索引，准备下一次渲染
    useStateHook.resetIndex();
    
    // 重新渲染组件逻辑
    console.log("组件重新渲染");
}

// 创建 useState 实例
const { useState: useStateMock, resetIndex } = createUseState();
const useState = useStateMock;

// 使用示例
function MyComponent() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('Guest');
    
    console.log(`Count: ${count}, Name: ${name}`);
    
    return {
        count,
        name,
        increment: () => setCount(count + 1),
        decrement: () => setCount(count - 1),
        updateName: (newName) => setName(newName)
    };
}

// 测试组件
console.log("初始状态:");
const component = MyComponent();

console.log("\n增加计数:");
component.increment();
component.increment();

console.log("\n更改姓名:");
component.updateName("Alice");
