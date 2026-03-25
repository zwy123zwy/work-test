var a = 1
function fun1() {

    function fun2() {
        console.log(a)
    }
    function fun3() {
        var a
        fun2()
        a = 4
    }

    var a = 2
    return fun3
}

const fn = fun1()
fn() // 2