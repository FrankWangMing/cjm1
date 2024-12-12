/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 */

import { createStore } from '@/utils/store';
import { useLocalStore } from 'mobx-react-lite';

export function useModel() {
  const store = useLocalStore(() => ({
    name: 'init',
    setName(e) {
      this.name = e;
    }
  }));
  return store;
}
const store = createStore(useModel);
export const Provider = store.Provider;
export const Context = store.Context;
export const useStore = store.useStore;
