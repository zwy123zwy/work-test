new Promise((resolve) => {
    console.log("A");
    resolve("");
    return Promise.resolve("").then(() => {
        console.log("C");
        resolve("11111");
    });
}).then((res) => {
    console.log(res.toString());
});

new Promise((resolve) => {
    console.log("B");
    resolve("");
}).then(() => {
    console.log("F");
});