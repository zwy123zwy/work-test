// 简单实现 Redux（TypeScript）

export type Reducer<S = unknown, A extends { type: string } = { type: string }> = (
  state: S | undefined,
  action: A
) => S;

export type Store<S = unknown, A extends { type: string } = { type: string }> = {
  getState: () => S;
  dispatch: (action: A) => A;
  subscribe: (listener: () => void) => () => void;
};

export function createStore<S, A extends { type: string }>(
  reducer: Reducer<S, A>,
  preloadedState?: S
): Store<S, A> {
  let state: S = preloadedState ?? (reducer(undefined!, { type: '' } as A) as S);
  const listeners: (() => void)[] = [];

  function getState(): S {
    return state;
  }

  function dispatch(action: A): A {
    state = reducer(state, action);
    listeners.forEach((fn) => fn());
    return action;
  }

  function subscribe(listener: () => void): () => void {
    listeners.push(listener);
    return () => {
      const i = listeners.indexOf(listener);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  return { getState, dispatch, subscribe };
}

// 合并多个 reducer
export function combineReducers<S extends Record<string, unknown>>(
  reducers: { [K in keyof S]: Reducer<S[K]> }
): Reducer<S> {
  return (state, action) => {
    const next: Partial<S> = {};
    let changed = false;
    for (const key of Object.keys(reducers) as (keyof S)[]) {
      const prev = state?.[key];
      const nextVal = reducers[key](prev, action as any);
      next[key] = nextVal;
      if (nextVal !== prev) changed = true;
    }
    return changed ? (next as S) : (state ?? (next as S));
  };
}

// ========== 使用示例 ==========
type CounterAction = { type: 'INCREMENT' } | { type: 'DECREMENT' };

function counterReducer(state = 0, action: CounterAction): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const store = createStore(counterReducer);
store.subscribe(() => console.log('state:', store.getState()));
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
