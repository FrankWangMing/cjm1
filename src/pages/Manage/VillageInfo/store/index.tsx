import { IVillageBase, IVillageInfo } from '@/domain/valley';
import { VillageServer } from '@/service';
import { MomentFormatStr } from '@/utils/const';
import { createStore } from '@/utils/store';
import { useLocalStore } from 'mobx-react-lite';
import { message } from 'antd';
import moment from 'moment';

export function useModel() {
  const store = useLocalStore(
    (): {
      loading: boolean;
      villageTableData: { total: number; list: [] };
      villageDetailData: IVillageInfo;
      selectedId: number;
      reqObj: {
        admin_village: string;
        nature_village: string;
        page: number;
        page_size: number;
        town: string;
      };
      getVillageInfoData: Function;
      getDetailInfoData: Function;
      updateSelectedId: Function;
      updateDetailData: Function;
      pagination: {
        pageSize: number;
        currentPage: number;
      };
    } => ({
      loading: false,
      villageTableData: { total: 0, list: [] },
      selectedId: -1,
      villageDetailData: {
        area: 0,
        huNum: 0,
        manager: '',
        managerPhone: '',
        peopleCount: 0,
        name: '',
        riskType: ''
      },
      pagination: {
        pageSize: 10,
        currentPage: 1
      },
      reqObj: {
        admin_village: '',
        nature_village: '',
        page: 0,
        page_size: 0,
        town: ''
      },
      /**
       * 获取村落信息列表
       */
      async getVillageInfoData() {
        this.loading = true;
        this.reqObj.page = this.pagination.currentPage;
        this.reqObj.page_size = this.pagination.pageSize;
        const data = await VillageServer.villageList(this.reqObj);
        this.villageTableData.list = data.list;
        this.villageTableData.total = data.total;
        this.loading = false;
      },
      /**
       * 获取村落详情信息
       */
      async getDetailInfoData() {
        const res = await VillageServer.detailById(
          this.selectedId,
          [0],
          moment().format(MomentFormatStr),
          moment().format(MomentFormatStr),
          1
        );
        this.villageDetailData = res.villageDetails[0].info;
      },
      /**
       * 更新村落详情信息
       */
      async updateDetailData(formData) {
        let temp = Object.assign(this.villageDetailData, formData);
        const res = await VillageServer.updateInfoBatch([temp]);
        if (res['code'] == 0) message.success(res.data.status);
      },
      /**
       * 更新选中村落ID
       * @param data 选中村落ID
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
