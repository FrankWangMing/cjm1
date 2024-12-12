import { IVillageBase } from '@/domain/valley';
import { AlarmServer, VillageServer } from '@/service';
import { createStore } from '@/utils/store';
import { useLocalStore } from 'mobx-react-lite';
import { message } from 'antd';

export function useModel() {
  const store = useLocalStore(
    (): {
      loading: boolean;
      villageTableData: { total: number; list: IVillageBase[] };
      alarmOwnersData: IVillageBase[];
      selectedId: number;
      getVillageInfoData: Function;
      getAlarmOwnersData: Function;
      updateSelectedId: Function;
      addAlarmOwner: Function;
      editAlarmOwner: Function;
      editData: {};
      delAlarmOwner: Function;
      updateResponsibleData: Function;
      pagination: {
        pageSize: number;
        currentPage: number;
      };
      reqObj: {
        admin_village: string;
        nature_village: string;
        page: number;
        page_size: number;
        town: string;
      };
      villageName: string;
    } => ({
      loading: false,
      villageTableData: { total: 0, list: [] },
      alarmOwnersData: [],
      selectedId: -1,
      pagination: {
        pageSize: 10,
        currentPage: 1
      },
      editData: {},
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
       * 获取预警责任人清单
       */
      async getAlarmOwnersData() {
        this.loading = true;
        const res = await AlarmServer.queryAlarmOwners(this.selectedId);
        this.alarmOwnersData = res.alarmOwners;
        this.loading = false;
      },
      /**
       * 删除预警责任人
       */
      async delAlarmOwner(id: number) {
        const res = await AlarmServer.deleteAlarmOwners([id]);
        if (res['code'] == 0) {
          message.success('责任人删除成功');
          this.getAlarmOwnersData();
        }
      },
      /**
       * 新增预警责任人
       */
      async addAlarmOwner(data) {
        let alarmOwner = {
          duty: data.duty,
          id: 0,
          mobile: data.mobile,
          name: data.name,
          villageId: this.selectedId
        };
        const res = await AlarmServer.updateAlarmOwners([alarmOwner]);
        if (res['code'] == 0) {
          message.success('新增责任人成功');
          this.getAlarmOwnersData();
        }
      },
      /**
       * 编辑预警责任人
       */
      async editAlarmOwner(data) {
        let reqObj = {
          duty: data.duty,
          id: data.id,
          mobile: data.mobile,
          name: data.name,
          villageId: this.selectedId
        };
        const res = await AlarmServer.updateAlarmOwners([reqObj]);
        if (res['code'] == 0) {
          message.success('责任人更新成功');
          this.getAlarmOwnersData();
        }
      },
      villageName: '',
      /**
       * 更新选中村落ID
       * @param data 选中村落ID
       */ updateSelectedId(data: number) {
        this.selectedId = data;
        if (this.selectedId !== -1) {
          let temp = this.villageTableData.list.filter(item => {
            return item.id == this.selectedId;
          })[0];
          this.villageName =
            temp.town +
            '-' +
            temp.administrationVillage +
            '-' +
            temp.natureVillage;
        }
      },
      /**
       * 责任人筛选
       * @param data 筛选条件
       */
      updateResponsibleData(data) {
        for (let item in data) {
          if (data[item]) {
            let temp = this.alarmOwnersData.filter(i => {
              return i[item] == data[item];
            });
            this.alarmOwnersData = temp;
          }
        }
      }
    })
  );
  return store;
}
const store = createStore(useModel);
export const Provider = store.Provider;
export const useStore = store.useStore;
