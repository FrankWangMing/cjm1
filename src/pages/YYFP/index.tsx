import {
  CenterBottom,
  CenterContentLoading,
  CenterModalCom,
  LeftCom,
  RightCom,
  SideDecoratorLine
} from '@/components/LayoutsCom';
import { BottomProcess } from '@/components/LayoutsCom';
import { GlobalLayoutWrapper } from '@/style';
import { observer } from 'mobx-react-lite';
import QSYYFPLeftCom from './components/QSYYFPLeftCom';
import ProcessBar from '@/components/ProcessBar/index';
import { message } from 'antd';
import { useSafeState, useUnmount, useUpdateEffect } from 'ahooks';
import GlobalStore from '@/store';
import { LAYER_LIST } from './const';
import { SectionServer, ShenjiServer, VillageServer } from '@/service';
import { MarkerObj } from '@/components/Map';
import { useEffect } from 'react';
import { LegendComRight } from '@/components/LegendCom';
import {
  HLYBSectionModalContent,
  HLYBVillageModalContent
} from '../HLYB/components/modalContent';
import {
  MomentFormatStr,
  ShowModeProjectId,
  ShowModeTime,
  ShowModeUITime
} from '@/utils/const';
import { Provider, useStore } from './store';
import { history } from '@umijs/max';
import { YYFPRightCom } from './components/QSYYFPRightCom';
import moment from 'moment';

/**
 * 预警发布
 */
const Component = observer(() => {
  const YYFPStore = useStore();
  useUnmount(() => {
    MarkerObj.remove(); // 销毁所有点位
    YYFPStore.simAnimation?.dispose(); // simAnimation重置
    GlobalStore.mapboxLayer?.dispose();
    GlobalStore.mapboxLayer = null;
    YYFPStore.dispose();
  });

  /**
   * 获取弹窗内村庄的数据;
   */
  const getVillageInfo = async () => {
    YYFPStore.currModalObj.loading = true;
    let startTime = '',
      endTime = '',
      projectId = 0,
      simulationType = 1;
    // if (GlobalStore.isShowMode) {
    //   // 演示模式
    //   projectId = ShowModeProjectId;
    //   startTime = ShowModeTime.format(MomentFormatStr);
    //   endTime = moment(startTime).add('h', 24).format(MomentFormatStr);
    //   simulationType = 4;
    // } else {
    //   projectId = YYFPStore.currCase.caseId;
    //   startTime =
    //     YYFPStore.currCase.period.startTime!.format(MomentFormatStr);
    //   endTime = YYFPStore.currCase.period.endTime!.format(MomentFormatStr);
    // }

    //沉浸预演 不区分演示模式和非演示模式 而是根据具体工况的id和时间
    projectId = YYFPStore.currCase.caseId;
    startTime = YYFPStore.currCase.period.startTime!.format(MomentFormatStr);
    endTime = YYFPStore.currCase.period.endTime!.format(MomentFormatStr);

    const res = await VillageServer.detailById(
      YYFPStore.currModalObj.id,
      [projectId],
      startTime,
      endTime,
      simulationType
    );
    if (YYFPStore.currModalObj.type === 'village') {
      YYFPStore.currModalObj.title = res.villageDetails[0].info.name || '';
      YYFPStore.currModalObj.content = (
        <HLYBVillageModalContent
          data={res.villageDetails[0]}
          villageId={YYFPStore.currModalObj.id}
        />
      );
    }
    YYFPStore.currModalObj.loading = false;
  };

  /**
   * 点击断面获取断面的数据
   */
  const getSectionInfo = async () => {
    YYFPStore.currModalObj.loading = true;
    let startTime = '',
      endTime = '',
      projectId = 0,
      simulationType = 1;

    if (GlobalStore.isShowMode) {
      // 演示模式
      projectId = ShowModeProjectId;
      startTime = ShowModeTime.format(MomentFormatStr);
      endTime = moment(startTime)
        .add('h', YYFPStore.currCase.forecastTime)
        .format(MomentFormatStr);
      simulationType = 4;
    } else {
      projectId = YYFPStore.currCase.caseId;
      startTime = YYFPStore.currCase.period.startTime!.format(MomentFormatStr);
      endTime = YYFPStore.currCase.period.endTime!.format(MomentFormatStr);
    }
    // 根据id获取section对应的数据
    let {
      crossSections: sectionData
      // peakFlow,
      // peakTime
    } = await SectionServer.infoById(
      [projectId],
      YYFPStore.currModalObj.id,
      startTime,
      endTime,
      simulationType
    );
    if (YYFPStore.currModalObj.type === 'section') {
      YYFPStore.currModalObj.title = sectionData[0].name;
      if (sectionData[0].data.length > 0) {
        YYFPStore.currModalObj.content = (
          <HLYBSectionModalContent
            data={sectionData[0]}
            forecastTime={YYFPStore.currCase.forecastTime}
            prepareTransfer={sectionData[0].prepareTransfer || 0} // 准备转移水位
            immediateTransfer={sectionData[0].immediateTransfer || 0} // 立即转移水位
            forecastFlows={sectionData[0].forecastFlows || []} // 预测流量
            dikeAltitude={sectionData[0].dikeAltitude || 0} // 堤防高程
            // peakTime={peakTime || 0} // 预测峰值时间
            // peakFlow={peakFlow || 0} // 预测峰值流量
          />
        );
      } else {
        message.error('断面数据有问题！');
      }
    }
    YYFPStore.currModalObj.loading = false;
  };

  const handleMarkerClick = () => {
    YYFPStore.currModalObj.title = '';
    YYFPStore.currModalObj.content = null;

    switch (YYFPStore.currModalObj.type) {
      case 'village':
        getVillageInfo();
        break;
      case 'section':
        // 断面数据
        getSectionInfo();
        break;
    }
  };

  /**
   * 点击村庄或者断面，镜头飞向那个地方
   */
  useUpdateEffect(() => {
    if (
      YYFPStore.currModalObj.id != -1 &&
      YYFPStore.currModalObj.id != 0 &&
      !!YYFPStore.currModalObj.type
    ) {
      handleMarkerClick();
    }
  }, [YYFPStore.currModalObj.id, YYFPStore.currModalObj.type]);

  // 图层控制发生变化
  const handleLayerTypeChange = () => {
    YYFPStore.currModalObj.type = null;
    YYFPStore.addMarker();
    // 结果文件图层展示隐藏控制;
    let isShowLayer = YYFPStore.currLayers.includes('risk');
    YYFPStore.simAnimation?.goto(0);
    YYFPStore.simAnimation?.show(isShowLayer);
  };

  useUpdateEffect(() => {
    handleLayerTypeChange();
  }, [YYFPStore.currLayers]);

  const [mapLoading, setMapLoading] = useSafeState(true);
  useEffect(() => {
    let pathName = history.location.pathname.split('/')[1];
    ShenjiServer.sendAuditLog(pathName);
    if (!GlobalStore.map) return;
    GlobalStore.map_resetDefaultView();
    setMapLoading(false);
  }, [GlobalStore.map]);

  useUpdateEffect(() => {
    YYFPStore.addMarker();
  }, [GlobalStore.isShow3dTile, GlobalStore.currZoom]);

  return (
    <GlobalLayoutWrapper>
      {/* 左侧栏目 */}
      <LeftCom children={<QSYYFPLeftCom />} legendComWidth={140} />
      {/* 右侧栏目 */}
      <RightCom
        children={<YYFPRightCom />}
        legendCom={
          YYFPStore.currLayers.includes('risk') &&
          YYFPStore.currModalObj.type == null ? (
            <LegendComRight
              handleLayersChange={YYFPStore.handleTypeChange}
              currType={YYFPStore.currLayerId}
              dateType={YYFPStore.periodType}
            />
          ) : null
        }
        isExpand={YYFPStore.currCase.isResultRenderDone}
        isHideAll={
          !YYFPStore.currCase.isResultRenderDone ||
          YYFPStore.currCase.NFrames == 0
        }
      />
      {/* {mapLoading && <CenterContentLoading title="地图数据加载中..." />} */}
      {YYFPStore.resultLoading && (
        <CenterContentLoading
          title={
            mapLoading
              ? '正在加载地图数据...'
              : '加载进度：' + YYFPStore.loadNumPercent
          }
        />
      )}
      {/* 中间底部，图层控制样式 */}
      {YYFPStore.currCase.isResultRenderDone && (
        <CenterBottom
          handleActiveChange={e => {
            YYFPStore.currLayers = e;
          }}
          selectedMenu={YYFPStore.currLayers}
          layerList={LAYER_LIST}
          loadingStatusObj={{
            village:
              !mapLoading &&
              YYFPStore.currCase.isResultRenderDone &&
              GlobalStore.villageList.length > 0
                ? 'success'
                : 'loading',
            section:
              !mapLoading &&
              YYFPStore.currCase.isResultRenderDone &&
              GlobalStore.sectionMarkerList.length > 0
                ? 'success'
                : 'loading',
            risk: YYFPStore.currCase.isResultRenderDone ? 'success' : 'loading'
          }}
          isMutex={false}
          isShowProcess={false}
          // isShowProcess={HLYBStore.isShowProcess}
        />
      )}
      <CenterModalCom
        TitleDesc={<>{YYFPStore.currModalObj.title}</>}
        TitleRightOpt={null}
        ContentDiv={YYFPStore.currModalObj.content || <>这个项目还没上</>}
        open={YYFPStore.currModalObj.type}
        size={'large'}
        closeModal={() => {
          YYFPStore.currModalObj.type = null;
        }}
        loading={YYFPStore.currModalObj.loading}
      />
      {/* 底部进度条 */}
      {YYFPStore.isShowProcess && (
        <BottomProcess
          children={
            <ProcessBar
              type={'time'}
              title={''}
              simAnimation={GlobalStore.mapboxLayer!.water!}
              forecastTime={YYFPStore.currCase.forecastTime}
              currentTime={
                GlobalStore.isShowMode
                  ? {
                      start: ShowModeUITime,
                      end: moment(ShowModeUITime).add(
                        'h',
                        YYFPStore.currCase.forecastTime
                      )
                    }
                  : {
                      start: YYFPStore.currCase.period.startTime!,
                      end: YYFPStore.currCase.period.endTime!
                    }
              }
              isSimAnimationChange={YYFPStore.isSimAnimationChange}
            />
          }
        />
      )}
      {/* 周边的背景颜色条 */}
      <SideDecoratorLine />
    </GlobalLayoutWrapper>
  );
});

export default function YYFP() {
  return (
    <Provider>
      <Component />
    </Provider>
  );
}
