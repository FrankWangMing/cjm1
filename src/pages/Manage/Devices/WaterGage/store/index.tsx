import { ShowServer } from '@/service/show';
import { MomentFormatStr } from '@/utils/const';
import { createStore } from '@/utils/store';
import { useLocalStore } from 'mobx-react-lite';
import moment from 'moment';

export function useModel() {
  const store = useLocalStore(
    (): {
      loading: boolean;
      currModalId: number;
      waterGageTableData: IFlowStationItem[];
      selectedId: number;
      getAllWaterGage: Function;
      updateSelectedId: Function;
      pagination: {
        pageSize: number;
        currentPage: number;
      };
      param: {
        startTime: string;
        endTime: string;
        stationId: number;
        timeGap: number;
      };
    } => ({
      loading: false,
      currModalId: -1,
      waterGageTableData: [],
      selectedId: -1,
      pagination: {
        pageSize: 10,
        currentPage: 1
      },
      param: {
        startTime: moment().subtract(1, 'day').format(MomentFormatStr),
        endTime: moment().format(MomentFormatStr),
        stationId: -1,
        timeGap: 60
      },
      /**
       * 获取流量计列表
       */
      async getAllWaterGage() {
        this.loading = true;
        const data = await ShowServer.flowStation.listOfAll();
        this.waterGageTableData = data.flowStations;
        this.pagination.currentPage = 1;
        this.loading = false;
      },

      /**
       * 更新选中水位计ID
       * @param data 选中水位计ID
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
