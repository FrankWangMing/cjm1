import { RoleService } from '@/service';
import { createStore } from '@/utils/store';
import { message } from 'antd';
import { useLocalStore } from 'mobx-react-lite';

interface IUserBase {
  key: string;
  name: string;
}

export function useModel() {
  const store = useLocalStore(
    (): {
      loading: boolean;
      userTableData: IUserBase[];
      getUserData: Function;
      searchData: Function;
      pagination: {
        pageSize: number;
        currentPage: number;
      };
      /**
       * 根据用户id删除用户
       */
      delUserById: Function;
    } => ({
      loading: false,
      userTableData: [],
      pagination: {
        pageSize: 10,
        currentPage: 1
      },
      async getUserData() {
        this.loading = true;
        const data = await RoleService.list();
        this.userTableData = data.list;
        this.pagination.currentPage = 1;
        this.loading = false;
      },
      searchData(cond) {
        for (let item in cond) {
          if (cond[item]) {
            let temp = this.userTableData.filter(i => {
              return i[item] == cond[item];
            });
            this.userTableData = temp;
          }
        }
      },
      async delUserById(id: number) {
        try {
          await RoleService.deleteById(id);
          message.success('删除成功');
        } catch (e) {}
      }
    })
  );
  return store;
}
const store = createStore(useModel);
export const Provider = store.Provider;
export const useStore = store.useStore;
