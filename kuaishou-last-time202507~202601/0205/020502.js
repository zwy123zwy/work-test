/**
 * 020502 链式调用类题目（2026-02-05）
 * 类似 add().firstSleep().delete().sleep() 的链式 API 设计与实现
 */

// ==================== 1. 基础链式：add / sleep / sleepFirst / delete ====================
// 题目：实现 LazyMan('Tom') 或 chain().add().sleep(ms).delete().sleepFirst(ms)，按顺序执行，sleep 为延迟。

class LazyChain {
  constructor(name = '') {
    this.name = name;
    this.tasks = [];
    const fn = () => {
      if (name) console.log(`Hi I am ${this.name}`);
      this._next();
    };
    this.tasks.push(fn);
    setTimeout(() => this._next(), 0);
  }

  _next() {
    if (!this.tasks.length) return;
    const fn = this.tasks.shift();
    fn();
  }

  add(name) {
    this.tasks.push(() => {
      console.log(`add: ${name}`);
      this._next();
    });
    return this;
  }

  delete(key) {
    this.tasks.push(() => {
      console.log(`delete: ${key}`);
      this._next();
    });
    return this;
  }

  sleep(ms) {
    this.tasks.push(() => {
      setTimeout(() => {
        console.log(`sleep ${ms}ms`);
        this._next();
      }, ms);
    });
    return this;
  }

  sleepFirst(ms) {
    this.tasks.push(() => {
      setTimeout(() => {
        console.log(`sleepFirst ${ms}ms`);
        this._next();
      }, ms);
    });
    this.tasks.unshift(this.tasks.pop());
    return this;
  }
}

// 使用：new LazyChain('Tom').add('task1').sleep(1000).delete('key').sleepFirst(500);
// 输出顺序：sleepFirst 500ms → Hi I am Tom → add: task1 → sleep 1000ms → delete: key


// ==================== 2. Promise 版链式：支持 await 风格 ====================
// 题目：chain().add().sleep(100).delete().sleep(200).execute() 按序执行并返回 Promise。

function createChain() {
  const queue = [];
  const chain = {
    add(fn) {
      queue.push({ type: 'add', fn: typeof fn === 'function' ? fn : () => console.log('add', fn) });
      return chain;
    },
    delete(key) {
      queue.push({ type: 'delete', fn: () => console.log('delete', key) });
      return chain;
    },
    sleep(ms) {
      queue.push({ type: 'sleep', ms });
      return chain;
    },
    sleepFirst(ms) {
      queue.unshift({ type: 'sleep', ms });
      return chain;
    },
    async execute() {
      for (const item of queue) {
        if (item.type === 'sleep') {
          await new Promise(r => setTimeout(r, item.ms));
        } else {
          await Promise.resolve(item.fn());
        }
      }
      return chain;
    },
  };
  return chain;
}

// 使用：await createChain().add('a').sleep(100).delete('x').sleepFirst(50).execute();


// ==================== 3. 带存储的链式：add/delete 操作内部数据 ====================
// 题目：obj.add(1).add(2).sleep(100).delete(1).sleep(200).print()，add/delete 操作内部数组，print 输出当前值。

class ChainStore {
  constructor() {
    this.data = [];
    this.tasks = [];
    this._schedule();
  }

  _schedule() {
    setTimeout(() => this._run(), 0);
  }

  _run() {
    if (!this.tasks.length) return this;
    const { fn } = this.tasks.shift();
    const result = fn();
    if (result && typeof result.then === 'function') {
      result.then(() => this._run());
    } else {
      this._run();
    }
    return this;
  }

  add(val) {
    this.tasks.push({
      fn: () => {
        this.data.push(val);
        console.log('add', val, this.data);
      },
    });
    return this;
  }

  delete(val) {
    this.tasks.push({
      fn: () => {
        const i = this.data.indexOf(val);
        if (i > -1) this.data.splice(i, 1);
        console.log('delete', val, this.data);
      },
    });
    return this;
  }

  sleep(ms) {
    this.tasks.push({
      fn: () => new Promise(r => setTimeout(r, ms)),
    });
    return this;
  }

  sleepFirst(ms) {
    this.tasks.unshift({
      fn: () => new Promise(r => setTimeout(r, ms)),
    });
    return this;
  }

  print() {
    this.tasks.push({
      fn: () => console.log('print', this.data),
    });
    return this;
  }
}

// 使用：new ChainStore().add(1).add(2).sleep(100).delete(1).print();


// ==================== 4. 链式调用输出题：问执行顺序 ====================
// 问：以下输出顺序？
/*
const o = {
  log: console.log,
  add(v) { this.log('add', v); return this; },
  sleep(ms) {
    return new Promise(resolve => setTimeout(() => { this.log('sleep', ms); resolve(this); }, ms));
  },
  delete(k) { this.log('delete', k); return this; },
};
o.add(1).sleep(100).then(() => o.delete('x'));  // 注意：sleep 返回 Promise，链会断
*/
// 答：add 1 → (100ms后) sleep 100 → delete x
// 若改为 o.add(1).sleep(100).then(() => o.delete('x'))，则 add 1 → sleep 100 → delete x


// ==================== 5. 实现支持链式 + sleep 的 Scheduler ====================
// 题目：scheduler.add(fn1).sleep(100).add(fn2).start()，按序执行，sleep 表示下一步延迟执行。

function createScheduler() {
  const fns = [];
  return {
    add(fn) {
      fns.push({ type: 'fn', fn });
      return this;
    },
    sleep(ms) {
      fns.push({ type: 'sleep', ms });
      return this;
    },
    async start() {
      for (const item of fns) {
        if (item.type === 'sleep') {
          await new Promise(r => setTimeout(r, item.ms));
        } else {
          await Promise.resolve(item.fn());
        }
      }
    },
  };
}


// ==================== 6. 链式表单校验 ====================
// 题目：validator.add(name).required().minLen(2).add(age).isNumber().run()，链式校验，run 返回 { valid, errors }。

function createValidator() {
  const rules = [];
  const values = {};
  return {
    add(field) {
      rules.push({ field, checks: [] });
      return {
        required() {
          rules[rules.length - 1].checks.push(v => v != null && String(v).trim() !== '');
          return this;
        },
        minLen(n) {
          rules[rules.length - 1].checks.push(v => (v == null ? 0 : String(v).length) >= n);
          return this;
        },
        isNumber() {
          rules[rules.length - 1].checks.push(v => !isNaN(Number(v)) && v !== '');
          return this;
        },
      };
    },
    setValues(v) {
      Object.assign(values, v);
      return this;
    },
    run() {
      const errors = [];
      for (const { field, checks } of rules) {
        const v = values[field];
        for (const check of checks) {
          if (!check(v)) {
            errors.push(field);
            break;
          }
        }
      }
      return { valid: errors.length === 0, errors };
    },
  };
}

// 使用：createValidator().add('name').required().minLen(2).add('age').isNumber(); 需配合 setValues 与 run


// ==================== 7. 简版 LazyMan（经典题） ====================
// 题目：LazyMan('Tom').eat('lunch').sleep(2).eat('dinner').sleepFirst(1)，sleepFirst 最先执行。

function LazyMan(name) {
  const queue = [];
  const run = () => {
    if (queue.length === 0) return;
    const fn = queue.shift();
    fn(run);
  };
  queue.push(next => {
    console.log(`I am ${name}`);
    next();
  });
  setTimeout(run, 0);

  return {
    eat(food) {
      queue.push(next => {
        console.log(`eat ${food}`);
        next();
      });
      return this;
    },
    sleep(sec) {
      queue.push(next => setTimeout(() => { console.log(`sleep ${sec}s`); next(); }, sec * 1000));
      return this;
    },
    sleepFirst(sec) {
      queue.unshift(next => setTimeout(() => { console.log(`sleepFirst ${sec}s`); next(); }, sec * 1000));
      return this;
    },
  };
}

// LazyMan('Tom').eat('lunch').sleep(2).eat('dinner').sleepFirst(1);
// 输出：sleepFirst 1s → I am Tom → eat lunch → sleep 2s → eat dinner
