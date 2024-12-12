import { HLYBLeftWrapper } from './style';
import { useMount, useSafeState, useUnmount } from 'ahooks';
import { GlobalLayoutWrapper } from '@/style';
import {
  CenterModalCom,
  RightCom,
  SwitchType,
  CenterBottom,
  CenterTop,
  BottomProcess,
  SideDecoratorLine,
  CenterContentLoading,
  LeftCom
} from '@/components/LayoutsCom';
import { HLYBLeftCom, HLYBProcess, HLYBRightCom } from './components';
import { LAYER_LIST, OPERATION_LIST } from './const';
import { Provider, useStore } from './store';
import { observer } from 'mobx-react-lite';
import GlobalStore from '@/store';
import ProcessBar from '@/components/ProcessBar/index';
import { SectionServer, ShenjiServer, VillageServer } from '@/service';
import { HLYBVillageModalContent } from './components/modalContent/VillageModal';
import { HLYBSectionModalContent } from './components/modalContent';
import { useUpdateEffect } from '@umijs/hooks';
import { Fragment, useEffect } from 'react';
import { LegendComRight } from '@/components/LegendCom';
import {
  IMG_PATH,
  MomentFormatStr,
  PHYSICAL_KEYWORDS,
  ShowModeProjectId,
  ShowModeTime,
  ShowModeUITime
} from '@/utils/const';
import { message } from 'antd';
import moment from 'moment';
import { history } from 'umi';

const Component = observer(() => {
  const HLYBStore = useStore();
  const [mapLoading, setMapLoading] = useSafeState(true);
  // 图层控制发生变化
  const handleLayerTypeChange = () => {
    HLYBStore.currModalObj.type = null;
    HLYBStore.addMarker();
    // 结果文件图层展示隐藏控制;
    let isShowLayer = HLYBStore.currLayers.includes('risk');
    HLYBStore.handleTypeChange(PHYSICAL_KEYWORDS.水深);
    HLYBStore.currLayerId = PHYSICAL_KEYWORDS.水深;
    HLYBStore.simAnimation?.goto(0);
    if (isShowLayer) {
      HLYBStore.simAnimation?.show(true);
    }
  };

  /**
   * 清除相关数据
   */
  useUnmount(() => {
    GlobalStore.leaveCurrPage();
  });

  /**
   * 获取弹窗内村庄的数据;
   */
  const getVillageInfo = async () => {
    HLYBStore.currModalObj.loading = true;
    let startTime = '',
      endTime = '',
      projectId = 0,
      simulationType = 1;

    if (GlobalStore.isShowMode) {
      // 演示模式
      projectId = ShowModeProjectId;
      startTime = ShowModeTime.format(MomentFormatStr);
      endTime = moment(startTime)
        .add('h', HLYBStore.currCase.forecastTime)
        .format(MomentFormatStr);
      simulationType = 4;
    } else {
      projectId = HLYBStore.currCase.caseId;
      startTime = HLYBStore.currCase.period.startTime!.format(MomentFormatStr);
      endTime = HLYBStore.currCase.period.endTime!.format(MomentFormatStr);
    }
    const res = await VillageServer.detailById(
      HLYBStore.currModalObj.id,
      [projectId],
      startTime,
      endTime,
      simulationType
    );
    if (HLYBStore.currModalObj.type === 'village') {
      HLYBStore.currModalObj.title = res.villageDetails[0].info.name || '';
      HLYBStore.currModalObj.content = (
        <HLYBVillageModalContent
          data={res.villageDetails[0]}
          villageId={HLYBStore.currModalObj.id}
        />
      );
    }
    HLYBStore.currModalObj.loading = false;
  };

  // useMount(() => {
  //   console.log('开始加载');
  //   let pathName = history.location.pathname.split('/')[1];
  //   // ShenjiServer.sendAuditLog(pathName);
  // });

  /**
   * 点击断面获取断面的数据
   */
  const getSectionInfo = async () => {
    HLYBStore.currModalObj.loading = true;
    let startTime = '',
      endTime = '',
      projectId = 0,
      simulationType = 1;

    if (GlobalStore.isShowMode) {
      // 演示模式
      projectId = ShowModeProjectId;
      startTime = ShowModeTime.format(MomentFormatStr);
      endTime = moment(startTime)
        .add('h', HLYBStore.currCase.forecastTime)
        .format(MomentFormatStr);
      simulationType = 4;
    } else {
      projectId = HLYBStore.currCase.caseId;
      startTime = HLYBStore.currCase.period.startTime!.format(MomentFormatStr);
      endTime = HLYBStore.currCase.period.endTime!.format(MomentFormatStr);
    }
    // 根据id获取section对应的数据
    let { crossSections: sectionData } = await SectionServer.infoById(
      [projectId],
      HLYBStore.currModalObj.id,
      startTime,
      endTime,
      simulationType
    );
    if (HLYBStore.currModalObj.type === 'section') {
      HLYBStore.currModalObj.title = sectionData[0].name;
      if (sectionData[0].data.length > 0) {
        HLYBStore.currModalObj.content = (
          <HLYBSectionModalContent
            data={sectionData[0]}
            forecastTime={HLYBStore.currCase.forecastTime}
            prepareTransfer={sectionData[0].prepareTransfer || 0} // 准备转移水位
            immediateTransfer={sectionData[0].immediateTransfer || 0} // 立即转移水位
            forecastFlows={sectionData[0].forecastFlows || []} // 预测流量
            dikeAltitude={sectionData[0].dikeAltitude || 0} // 堤防高程
          />
        );
      } else {
        message.error('断面数据有问题！');
      }
    }
    HLYBStore.currModalObj.loading = false;
  };

  const handleMarkerClick = () => {
    HLYBStore.currModalObj.title = '';
    HLYBStore.currModalObj.content = null;
    switch (HLYBStore.currModalObj.type) {
      case 'village':
        getVillageInfo();
        break;
      case 'section':
        // 断面数据
        getSectionInfo();
        break;
    }
  };

  useUpdateEffect(() => {
    if (HLYBStore.currModalObj.id != -1 && HLYBStore.currModalObj.id != 0) {
      handleMarkerClick();
    }
  }, [HLYBStore.currModalObj.id]);

  // useUpdateEffect(() => {
  //   HLYBStore.addMarker();
  // }, [GlobalStore.isShow3dTile, GlobalStore.currZoom]);

  useUpdateEffect(() => {
    HLYBStore.addMarker();
  }, [GlobalStore.isShow3dTile]);

  useUpdateEffect(() => {
    handleLayerTypeChange();
    if (HLYBStore.currCase.NFrames > 0) {
      HLYBStore.handleTypeChange(PHYSICAL_KEYWORDS.水深);
    }
  }, [HLYBStore.currLayers]);

  useEffect(() => {
    if (!GlobalStore.map) {
      return;
    }
    GlobalStore.map_resetDefaultView();
    setMapLoading(false);
  }, [GlobalStore.map]);

  return (
    <HLYBLeftWrapper>
      <GlobalLayoutWrapper>
        {/* 左侧栏目 */}
        <LeftCom
          children={<HLYBLeftCom periodType={HLYBStore.periodType} />}
          isHiddenSideBar={!HLYBStore.currCase.isResultRenderDone}
        />
        {/* 右侧栏目 */}
        <RightCom
          children={<HLYBRightCom />}
          legendCom={
            HLYBStore.currLayers.includes('risk') &&
            HLYBStore.currModalObj.type == null ? (
              <LegendComRight
                handleLayersChange={HLYBStore.handleTypeChange}
                currType={HLYBStore.currLayerId}
                dateType={HLYBStore.periodType}
              />
            ) : null
          }
          isExpand={HLYBStore.currCase.isResultRenderDone}
          isHideAll={
            !HLYBStore.currCase.isResultRenderDone ||
            HLYBStore.currCase.NFrames == 0
          }
        />
        {/* 中间栏目 */}
        {/* {!GlobalStore.isShowMode && (
          <CenterTop
            children={
              <SwitchType
                operationList={OPERATION_LIST}
                handlePeriodTypeChange={e => {
                  HLYBStore.periodType = e;
                }}
              />
            }
          />
        )} */}
        {/* 中间弹窗部分！！！ */}
        <CenterModalCom
          TitleDesc={<>{HLYBStore.currModalObj.title}</>}
          // TitleRightOpt={
          //   GlobalStore.isHaveRoleToEdit &&
          //   HLYBStore.currModalObj.type == 'village' ? (
          //     <div style={{ marginRight: '20rem', transition: 'all 300ms' }}>
          //       {GlobalStore.isEditVillageInfo ? (
          //         <Fragment>
          //           <img
          //             style={{
          //               marginRight: '10rem',
          //               cursor: 'pointer',
          //               transition: 'all 300ms'
          //             }}
          //             src={IMG_PATH.icon.confirm}
          //             onClick={() => {
          //               GlobalStore.isSubmitVillageInfoChange = Math.random();
          //               GlobalStore.isEditVillageInfo = false;
          //             }}
          //           />
          //           <img
          //             style={{ cursor: 'pointer', transition: 'all 300ms' }}
          //             src={IMG_PATH.icon.cancel}
          //             onClick={() => {
          //               GlobalStore.isEditVillageInfo = false;
          //             }}
          //           />
          //         </Fragment>
          //       ) : (
          //         <img
          //           src={IMG_PATH.icon.edit}
          //           style={{ cursor: 'pointer', transition: 'all 300ms' }}
          //           onClick={() => {
          //             GlobalStore.isEditVillageInfo =
          //               !GlobalStore.isEditVillageInfo;
          //           }}
          //         />
          //       )}
          //     </div>
          //   ) : null
          // }
          TitleRightOpt={null}
          ContentDiv={HLYBStore.currModalObj.content || <>这个项目还没上</>}
          open={HLYBStore.currModalObj.type}
          size={'large'}
          closeModal={() => {
            HLYBStore.currModalObj.type = null;
          }}
          loading={HLYBStore.currModalObj.loading}
        />
        {/* 结果文件加载进度 */}
        {(!HLYBStore.currCase.isResultRenderDone || mapLoading) && (
          <CenterContentLoading
            title={
              mapLoading
                ? '正在加载地图数据...'
                : '加载进度：' + HLYBStore.loadNumPercent
            }
          />
        )}
        {/* 底部进度条 */}
        {HLYBStore.isShowProcess && (
          <BottomProcess
            children={
              HLYBStore.currCase.NFrames == 0 ? (
                <HLYBProcess />
              ) : (
                <ProcessBar
                  simAnimation={GlobalStore.mapboxLayer!.water!}
                  forecastTime={HLYBStore.currCase.forecastTime}
                  currentTime={
                    GlobalStore.isShowMode
                      ? {
                          start: ShowModeUITime,
                          end: moment(ShowModeUITime).add(
                            'h',
                            HLYBStore.currCase.forecastTime
                          )
                        }
                      : {
                          start: HLYBStore.currCase.period.startTime!,
                          end: HLYBStore.currCase.period.endTime!
                        }
                  }
                  isSimAnimationChange={HLYBStore.isSimAnimationChange}
                />
              )
            }
          />
        )}
        {/* 中间底部，图层控制样式 */}
        <CenterBottom
          handleActiveChange={e => {
            HLYBStore.currLayers = e;
          }}
          selectedMenu={HLYBStore.currLayers}
          layerList={LAYER_LIST}
          loadingStatusObj={{
            village:
              !mapLoading &&
              HLYBStore.currCase.isResultRenderDone &&
              GlobalStore.villageList.length > 0
                ? 'success'
                : 'loading',
            section:
              !mapLoading &&
              HLYBStore.currCase.isResultRenderDone &&
              GlobalStore.sectionMarkerList.length > 0
                ? 'success'
                : 'loading',
            risk: HLYBStore.currCase.isResultRenderDone ? 'success' : 'loading'
          }}
          isMutex={false}
          isShowProcess={false}
          // isShowProcess={HLYBStore.isShowProcess}
        />
        {/* 周边的背景颜色条 */}
        <SideDecoratorLine />
      </GlobalLayoutWrapper>
    </HLYBLeftWrapper>
  );
});
export default function HLYB() {
  return (
    <Provider>
      <Component />
    </Provider>
  );
}
