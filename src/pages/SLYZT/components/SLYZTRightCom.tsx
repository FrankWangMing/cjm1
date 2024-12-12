import { PanelHeader, TextHeader } from '@/components/Header';
import { ShowServer } from '@/service/show';
import { useMount, useSafeState } from 'ahooks';
import { Badge, Select, message } from 'antd';
import { Fragment, useEffect } from 'react';
import { DamDescCom } from './DamDesc';
import GlobalStore from '@/store';
import { spliceArrBySize } from '@/utils';
import { TableCssCom } from '@/components/TableCssCom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { STATUS_COLOR_MAP_Reservoir, STATUS_COLOR_MAP_River } from '../const';
import { DownloadBtn } from './DownloadBtn';

const SLYZTRightCom = observer(() => {
  const SLYZTStore = useStore();
  const [thousandIslandLake, setThousandIslandLake] = useSafeState<number>(0);
  /**
   * 千岛湖水位查询
   * @param id
   */
  const getReservoirInfoById = async () => {
    let data = await ShowServer.statistic.waterLine(
      GlobalStore.thousandOfLakeId
    );
    setThousandIslandLake(data.realWaterLevel);
  };

  const [reservoirList, setReservoirList] = useSafeState<any[]>([]);
  /**
   * 根据类型查询水库
   * @param type 5: 小型 4：中大型
   */
  const getReservoirListByType = async (type: number) => {
    const data = await ShowServer.reservoirStation.listByType(type);
    let tempData: any[] = [];
    if (type == 4) {
      // 中型水库
      tempData = data.ReservoirTypeStations.filter(item => {
        return item.name == '霞源水库';
      });
      // 后端没问题的情况下，这里只会返回一个值，以防万一，这里做一个小小的校验。(毕竟已经出过问题了！)
      tempData = tempData.length > 1 ? [] : tempData;
    } else {
      // 小型水库1
      tempData = spliceArrBySize(data.ReservoirTypeStations, 4);
    }
    // console.log('水利一张图 - 水库站', tempData);
    setReservoirList(tempData);
  };

  const [riverStations, setRiverStations] = useSafeState<any[]>([]);
  /**
   * 获取所有河道站数据;
   */
  const getRiverStationData = async () => {
    const data = await ShowServer.riverStation.listOfAll();
    let tempData = spliceArrBySize(data.riverStations, 7);
    // console.log('水利一张图-河道站', tempData);
    setRiverStations(tempData);
  };

  // 4 中型 | 5 小型
  const [currReservoirType, setCurrReservoirType] = useSafeState<4 | 5>(4);

  useMount(() => {
    getReservoirInfoById();
    getRiverStationData();
  });
  useEffect(() => {
    getReservoirListByType(currReservoirType);
  }, [currReservoirType]);

  const handleBigReservoirClick = e => {
    if (currReservoirType == 4) {
      SLYZTStore.isJustCssActive_bottomLayer = true;
      SLYZTStore.selectBottomMenus = ['GAUGING_STATION'];
      SLYZTStore.handleMapFlyByClick(
        e.longitude,
        e.latitude,
        undefined,
        'GAUGING_STATION',
        true
      );
    }
  };

  return (
    <Fragment>
      <div className="slyzt-outer hydrologic-statistics">
        <div className="common-header-outer">
          <PanelHeader
            title={'水情统计'}
            OperationFc={<DownloadBtn case_type="水情统计" />}
          />
        </div>
        <div className="hydrologic-statistics-content bg-content-area-alpha">
          {/* 千岛湖水位 */}
          <p className="water-level">
            千岛湖水位：<span>{thousandIslandLake} </span>m
          </p>
          {/* 标题 */}
          <TextHeader title="水库站" fontSize="18rem" lineHeight="50rem" />
          {/* 水库相关 */}
          <div className="reservoir-outer">
            <div className="reservoir-title">
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleBigReservoirClick(reservoirList[0]);
                }}>
                {reservoirList.length > 1 ? '其他水库' : reservoirList[0]?.name}
              </span>
              <Badge
                dot
                count={
                  SLYZTStore.reservoirOverflow.middle.num +
                  SLYZTStore.reservoirOverflow.small.num
                }
                size="small"
                offset={[-8, 10]}>
                <Select
                  value={currReservoirType}
                  onChange={e => {
                    setCurrReservoirType(e);
                    getReservoirListByType(e);
                  }}>
                  <Select.Option value={4} className="relative-outer">
                    中型
                    {currReservoirType != 4 &&
                      SLYZTStore.reservoirOverflow.middle.num > 0 && (
                        <div className="dots"></div>
                      )}
                  </Select.Option>
                  <Select.Option value={5} className="relative-outer">
                    小型
                    {currReservoirType != 5 &&
                      SLYZTStore.reservoirOverflow.small.num > 0 && (
                        <div className="dots"></div>
                      )}
                  </Select.Option>
                </Select>
              </Badge>
            </div>
            <div
              className="reservoir-content"
              style={{
                boxShadow:
                  SLYZTStore.reservoirOverflow.middle.num > 0 &&
                  currReservoirType == 4
                    ? ' rgba(255, 0, 0) 0px 3px 6px, rgba(255, 0, 0) 0px 3px 6px'
                    : '',
                transition: 'all 200ms'
              }}>
              {reservoirList.length > 1 ? (
                <TableCssCom
                  colorInfoObj={STATUS_COLOR_MAP_Reservoir}
                  TitleList={[
                    <Fragment>测站名称</Fragment>,
                    <Fragment>当前(m)</Fragment>,
                    <Fragment>汛限(m)</Fragment>,
                    <Fragment>库容(万m³)</Fragment>
                  ]}
                  typeList={[
                    'name',
                    'realWaterLevel',
                    'floodLimitWaterLevel',
                    'reservoirVolume'
                  ]}
                  handleItemClick={async item => {
                    SLYZTStore.isJustCssActive_bottomLayer = true;
                    SLYZTStore.selectBottomMenus = ['GAUGING_STATION'];
                    SLYZTStore.handleMapFlyByClick(
                      item.longitude,
                      item.latitude,
                      undefined,
                      'GAUGING_STATION',
                      true
                    );
                  }}
                  valList={reservoirList}
                  carouselPageHeight="270rem"
                />
              ) : (
                <Fragment>
                  <div className="content-top">
                    当前水位<span>{reservoirList[0]?.realWaterLevel}</span> m
                    <div></div>
                    汛限水位
                    <span>{reservoirList[0]?.floodLimitWaterLevel}</span> m
                  </div>
                  <div className="content-bottom">
                    <DamDescCom
                      size="small"
                      rightData={formatSmallDam(reservoirList[0])}
                    />
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          {/* 河道站 */}
          <TextHeader title="河道站" fontSize="18rem" lineHeight="50rem" />
          <div className="river-road-outer">
            <TableCssCom
              colorInfoObj={STATUS_COLOR_MAP_River}
              TitleList={[
                <Fragment>测站名称</Fragment>,
                <Fragment>当前(m)</Fragment>,
                <Fragment>警戒(m)</Fragment>,
                <Fragment>保证(m)</Fragment>
              ]}
              typeList={[
                'name',
                'realWaterLevel',
                'alarmWaterLevel',
                'guaranteeWaterLevel'
              ]}
              valList={riverStations}
              handleItemClick={async item => {
                SLYZTStore.isJustCssActive_bottomLayer = true;
                SLYZTStore.selectBottomMenus = ['GAUGING_STATION'];
                SLYZTStore.handleMapFlyByClick(
                  item.longitude,
                  item.latitude,
                  undefined,
                  'GAUGING_STATION',
                  true
                );
              }}
              carouselPageHeight="350rem"
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
});

const formatSmallDam = obj => {
  let resultList: { title: string; value: number; unit: string }[] = [
    { title: '校核洪水位', value: 0, unit: 'm' },
    { title: '设计洪水位', value: 0, unit: 'm' },
    { title: '防洪高水位', value: 0, unit: 'm' },
    { title: '死水位', value: 0, unit: 'm' }
  ];
  if (obj) {
    resultList[0].value = obj.checkWaterLevel?.toFixed(2) || '-';
    resultList[1].value = obj.DesignWaterLevel?.toFixed(2) || '-';
    resultList[2].value = obj.highWaterLevel?.toFixed(2) || '-';
    resultList[3].value = obj.deadWaterLevel?.toFixed(2) || '-';
  }
  return resultList;
};

export { SLYZTRightCom };
