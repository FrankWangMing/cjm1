import { createStore } from '@/utils/store';
import { useLocalStore } from 'mobx-react-lite';

export function useModel() {
  const store = useLocalStore(
    (): {
      loading: boolean;
      pagination: {
        pageSize: number;
        currentPage: number;
      };
      tableData: [];
    } => ({
      loading: false,
      pagination: {
        pageSize: 10,
        currentPage: 1
      },
      tableData: []
    })
  );
  return store;
}
const store = createStore(useModel);
export const Provider = store.Provider;
export const useStore = store.useStore;
