import { MonitorServer } from '@/service';
import { createStore } from '@/utils/store';
import { useLocalStore } from 'mobx-react-lite';

export function useModel() {
  const store = useLocalStore(
    (): {
      loading: boolean;
      currModalId: number;
      camerasTableData: MonitorAllInfo[];
      selectedId: number;
      getAllCameras: Function;
      updateSelectedId: Function;
      pagination: {
        pageSize: number;
        currentPage: number;
      };
    } => ({
      loading: false,
      currModalId: -1,
      camerasTableData: [],
      selectedId: -1,
      pagination: {
        pageSize: 10,
        currentPage: 1
      },
      /**
       * 获取摄像头列表
       */
      async getAllCameras() {
        this.loading = true;
        const data = await MonitorServer.getAllCameras();
        this.camerasTableData = data.cameras;
        this.pagination.currentPage = 1;
        this.loading = false;
      },
      /**
       * 更新选中摄像头ID
       * @param data 选中摄像头ID
       */
      updateSelectedId(data: number) {
        this.selectedId = data;
      }
    })
  );
  return store;
}
const store = createStore(useModel);
export const Provider = store.Provider;
export const useStore = store.useStore;
