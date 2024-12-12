import React, { useEffect } from 'react';
import { IRiskItem } from '@/domain/valley';
import { Checkbox, Input, Popover, Row } from 'antd';
import { useSafeState } from 'ahooks';
import {
  getSortedVillage,
  getVillageRiskCount,
  VillageRiskCountProps
} from './util';
import { IMG_PATH, RISK_MAP } from '@/utils/const';
import { VillageListWrapper } from './style';
import { VillageRiskCountCom } from '@/components/VillageListRiskCom';
import { EnvironmentOutlined } from '@ant-design/icons';

/**
 * 村庄列表组件
 * @param villageList 村庄风险列表数据
 * @param clickVillageFunc 点击村庄数据进行村庄定位
 * @param filterByRiskLevel 筛选村庄列表展示地图点位联动
 */
interface IProps {
  villageList: Array<IRiskItem>;
  clickVillageFunc: Function;
  filterByRiskLevel: Function;
  size?: 'small' | 'large';
}

const CheckboxGroup = Checkbox.Group;

export const VillageList: React.FC<IProps> = ({
  villageList,
  clickVillageFunc,
  size
}) => {
  const [villageRiskCount, setVillageRiskCount] = useSafeState<
    Array<VillageRiskCountProps>
  >([]);

  const [showVillageList, setShowVillageList] = useSafeState<Array<IRiskItem>>(
    []
  );

  useEffect(() => {
    setShowVillageList(getSortedVillage(villageList));
    setVillageRiskCount(getVillageRiskCount(villageList));
  }, [villageList]);

  // 是否展开筛选村庄的弹窗
  const [isShowCondition, setIsShowCondition] = useSafeState(false);
  //
  const [checkedCondition, setCheckedCondition] = useSafeState(
    RISK_MAP.VALUE_LIST
  );
  /**
   * 风险等级选中改变相关事件
   * 1. 筛选村庄列表并重新排序
   * 2. 和地图上点位进行联动
   * @param e
   */
  const handleConditionChange = e => {
    // e=> [2,3,0] 可以用来限定地图打点数据
    setCheckedCondition(e);
    let tempData = villageList.filter(subItem => {
      return e.indexOf(subItem.riskLevel) !== -1;
    });
    setShowVillageList(getSortedVillage(tempData));
  };

  return (
    <VillageListWrapper size={size}>
      <VillageRiskCountCom villageRiskCount={villageRiskCount} />
      {/* 村庄列表 */}
      <div className="village-table-outer">
        <div className="village-table-header">
          <th>镇</th>
          <th>行政村</th>
          <th id="risk-shaixuan">
            风险等级
            <Popover
              placement="bottomRight"
              title={null}
              onOpenChange={open => {
                setIsShowCondition(open);
              }}
              open={isShowCondition}
              getPopupContainer={() => {
                return document.getElementById('risk-shaixuan') as HTMLElement;
              }}
              content={
                <CheckboxGroup
                  options={RISK_MAP.SELECT_RISK_LEVEL}
                  value={checkedCondition}
                  onChange={handleConditionChange}
                />
              }
              trigger="click">
              <img
                className="pointer"
                onClick={() => {
                  setIsShowCondition(!isShowCondition);
                }}
                src={IMG_PATH.overview.villageExpand}
                style={{
                  transform: isShowCondition ? '' : 'rotate(-90deg)'
                }}
              />
            </Popover>
          </th>
          <th>位置</th>
        </div>

        {showVillageList?.length > 0 ? (
          <div className="village-table-content">
            {showVillageList.map((item, index) => {
              return (
                <tr
                  className="village-table-content_item"
                  key={index}
                  onClick={() => {
                    clickVillageFunc(item.natureVillageId);
                  }}>
                  <td className="sub-item">
                    <div
                      className="riskType"
                      style={{
                        backgroundColor:
                          RISK_MAP.COLOR_LEVEL[item.riskLevel].bgColor
                      }}></div>
                    <span>{item.region}</span>
                  </td>
                  <td className="sub-item">{item.natureVillageName}</td>
                  <td className="sub-item">
                    <span>{RISK_MAP.COLOR_LEVEL[item.riskLevel].name}</span>
                  </td>
                  <td>
                    <EnvironmentOutlined />
                  </td>
                </tr>
              );
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </VillageListWrapper>
  );
};
