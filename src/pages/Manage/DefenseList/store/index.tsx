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
      defenseListData: IVillageBase[];
      selectedId: number;
      getVillageInfoData: Function;
      getDefenseListData: Function;
      updateSelectedId: Function;
      addDefenseData: Function;
      editDefenseData: Function;
      editData: {};
      delDefenseData: Function;
      updateDefenseData: Function;
      reqObj: {
        admin_village: string;
        nature_village: string;
        page: number;
        page_size: number;
        town: string;
      };
      pagination: {
        pageSize: number;
        currentPage: number;
      };
      villageName: string;
    } => ({
      loading: false,
      villageTableData: { total: 0, list: [] },
      defenseListData: [],
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
       * 获取防御对象清单
       */
      async getDefenseListData() {
        this.loading = true;
        const res = await AlarmServer.queryAlarmInfluencePeople(
          this.selectedId
        );
        this.defenseListData = res.influencePeople;
        this.loading = false;
      },
      /**
       * 删除防御对象
       */
      async delDefenseData(id: number) {
        const res = await AlarmServer.deleteAlarmInfluencePeople([id]);
        if (res['code'] == 0) {
          message.success('防御对象成功删除');
          this.getDefenseListData();
        }
      },
      /**
       * 新增防御对象
       */
      async addDefenseData(data) {
        let temp = this.villageTableData.list.filter(item => {
          return item.id == this.selectedId;
        });
        let influencePeople = {
          adminVillage: temp[0].administrationVillage,
          duty: '',
          id: 0,
          mobile: data.mobile,
          name: data.name,
          natureVillage: temp[0].natureVillage,
          town: temp[0].town
        };
        const res = await AlarmServer.updateAlarmInfluencePeople([
          influencePeople
        ]);
        if (res['code'] == 0) {
          message.success('新增防御对象成功');
          this.getDefenseListData();
        }
      },
      /**
       * 编辑防御对象
       */
      async editDefenseData(influencePeople) {
        const res = await AlarmServer.updateAlarmInfluencePeople([
          influencePeople
        ]);
        if (res['code'] == 0) {
          message.success('防御对象更新成功');
          this.getDefenseListData();
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
      updateDefenseData(data) {
        for (let item in data) {
          if (data[item]) {
            let temp = this.defenseListData.filter(i => {
              return i[item] == data[item];
            });
            this.defenseListData = temp;
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
