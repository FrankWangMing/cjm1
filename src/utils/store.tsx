/* Copyright (C) 2016-present, Yuansuan.cn */
import { createContext, useContext } from 'react';
export function createStore<T extends (...args: any) => any>(
  useExternalStore: T
) {
  // @ts-ignore
  const Context = createContext<ReturnType<T>>(null);

  function Provider({ children }) {
    const store = useExternalStore();
    return <Context.Provider value={store}>{children}</Context.Provider>;
  }
  return {
    Provider,
    Context,
    useStore: function useStore() {
      return useContext(Context);
    }
  };
}
