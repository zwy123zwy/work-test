class MyPromise {
    constructor(executor) {
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (value instanceof MyPromise) {
                return value.then(resolve, reject);
            }

            setTimeout(() => {
                if (this.status === 'pending') {
                    this.status = 'fulfilled';
                    this.value = value;
                    this.onFulfilledCallbacks.forEach(callback => callback(value));
                }   
            }, 0);
        }
        
        const reject = (reason) => {
            setTimeout(() => {
                if (this.status === 'pending') {
                    this.status = 'rejected';
                    this.reason = reason;
                    this.onRejectedCallbacks.forEach(callback => callback(reason));
                }
            }, 0);
        }

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
        
    }
    
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            
            const fulfilledCallback = (value) => {
                try {
                    const result =onFulfilled(value) ;
                    return result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                }
            }
            
            const rejectedCallback = (reason) => {
                try {
                    const result = onRejected(reason);
                    return result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                }
            }
            
            switch (this.status) {
                case 'fulfilled':
                    fulfilledCallback(this.value); 
                    break;
                case 'rejected':
                    rejectedCallback(this.reason);
                    break;
                case 'pending':
                    this.onFulfilledCallbacks.push(fulfilledCallback);
                    this.onRejectedCallbacks.push(rejectedCallback);
                    break;
            }
                
        })
    }
}               