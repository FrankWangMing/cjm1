import { IRiskItem } from '@/domain/valley';
/**
 *
 */
interface VillageRiskCountProps {
  riskLevel: string;
  villageCount: number;
}
/**
 *  获取每个风险等级的数量
 */
const getVillageRiskCount = (list: IRiskItem[]) => {
  let tempCountList: VillageRiskCountProps[] = [
    { riskLevel: '1', villageCount: 0 },
    { riskLevel: '2', villageCount: 0 },
    { riskLevel: '3', villageCount: 0 },
    { riskLevel: '0', villageCount: 0 }
  ];
  if (list && list.length > 0) {
    list.map(item => {
      switch (item.riskLevel) {
        case 1:
          tempCountList[0].villageCount++;
          break;
        case 2:
          tempCountList[1].villageCount++;
          break;
        case 3:
          tempCountList[2].villageCount++;
          break;
        case 0:
          tempCountList[3].villageCount++;
          break;
      }
    });
  }
  return tempCountList;
};
/**
 * 根据风险等级对村庄进行排序
 * @param list
 * @returns
 */
const getSortedVillage = (list: IRiskItem[]) => {
  let tempList: Array<IRiskItem> = [];
  if (list && list.length > 0) {
    let risk1List = list.filter(item => {
      return item.riskLevel === 1;
    });
    let risk2List = list.filter(item => {
      return item.riskLevel === 2;
    });
    let risk3List = list.filter(item => {
      return item.riskLevel === 3;
    });
    let risk0List = list.filter(item => {
      return item.riskLevel === 0;
    });
    tempList = risk1List.concat(risk2List).concat(risk3List).concat(risk0List);
  }
  return tempList;
};

export { getSortedVillage, getVillageRiskCount, VillageRiskCountProps };
