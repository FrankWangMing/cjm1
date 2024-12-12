import React, { useState } from 'react';
import { PanelHeader } from '@/components/Header';
import { QSYYFPLeftWrapper } from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import DesignScene from '@/pages/YYFP/components/QSYYFPLeftCom/DesignScene/DesignScene';
import SceneSelector from '@/pages/YYFP/components/QSYYFPLeftCom/SceneSelector';
import CustomScene from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/CustomScene';
import List from '@/pages/YYFP/components/QSYYFPLeftCom/List/List';
import { observer } from 'mobx-react-lite';
import { ForecastServer, SectionServer } from '@/service';
import {
  getForecastTime,
  MomentFormatStr,
  PHYSICAL_KEYWORDS
} from '@/utils/const';
import GlobalStore from '@/store';
import { message } from 'antd';
import { useStore } from '@/pages/YYFP/store';
import moment from 'moment/moment';

export interface QSYYFPLeftContextContent {
  sceneType?: 'design' | 'custom' | 'list';
  setSceneType: React.Dispatch<any>;
  setShowList: React.Dispatch<boolean>;
  handlePreviewResult?: (
    startTime: string,
    endTime: string,
    projectId: number,
    simulationType?: number
  ) => Promise<void>;
}

export const QSYYFPLeftContext = React.createContext<QSYYFPLeftContextContent>({
  setSceneType: () => {},
  setShowList: () => {}
});

function QSYYFPLeftCom() {
  const [sceneType, setSceneType] =
    useState<QSYYFPLeftContextContent['sceneType']>('design');
  const [showList, setShowList] = useState<boolean>(false);

  const YYFPStore = useStore();

  const setFloodArea = (param: { min: number; max: number }) => {
    YYFPStore.floodArea = param;
  };

  const setFloodAreaLoading = (param: any) =>
    (YYFPStore.floodAreaLoading = param);

  const getFloodAreaData = async (
    startTime: string,
    endTime: string,
    projectId: any,
    simulationType: number
  ) => {
    setFloodAreaLoading(true);
    const { startTime: start, endTime: end } = getForecastTime(
      moment(),
      YYFPStore.currCase.forecastTime,
      'h'
    );
    if (GlobalStore.isShowMode) {
      // 演示模式
      // projectId = ShowModeProjectId;
      simulationType = 4;
    } else {
      projectId = YYFPStore.currCase.caseId;
    }
    projectId = YYFPStore.currCase.caseId;
    if (YYFPStore.backTrackTime) {
      startTime = YYFPStore.currCase.period.startTime!.format(MomentFormatStr);
      endTime = moment(startTime)
        .add(YYFPStore.currCase.forecastTime, 'h')
        .format(MomentFormatStr);
    }
    const res = await ForecastServer.floodArea(
      startTime,
      endTime,
      projectId,
      simulationType
    );
    setFloodArea({
      min: res.minFloodArea,
      max: res.maxFloodArea
    });
    setFloodAreaLoading(false);
  };

  // todo 加载各种数据
  const handlePreviewResult = async (
    startTime: string,
    endTime: string,
    projectId: number,
    simulationType?: number
  ) => {
    YYFPStore.resultLoading = true;
    YYFPStore.currCase.isResultRenderDone = false;
    YYFPStore.currCase.forecastTime = moment(endTime).diff(startTime, 'hours');

    const calType = simulationType || 5;

    // console.log('开始计算');
    const data = await ForecastServer.calcStart(startTime, endTime, projectId);
    // 更新当前项目id
    YYFPStore.currCase.caseId = data.projectId;
    // 开始时间结束时间
    // console.log('开始时间', startTime, endTime);
    YYFPStore.currCase.period.startTime = moment(startTime);
    YYFPStore.currCase.period.endTime = moment(endTime);

    // 断面数据
    // todo 缺少riskLevel属性 无法判断安全危险
    const allSectionsInfo = await SectionServer.getAllInfo({
      projectId: data?.projectId || 0,
      endTime,
      simulationType: calType,
      startTime
    });

    const { path: jsonPath } = await ForecastServer.cloudQuery({
      startTime,
      endTime,
      projectId: data.projectId,
      calType
    });
    // console.log('获取结果文件结束', jsonPath);

    YYFPStore.currCase.NFrames = data.nFrameList.length + 2;
    let tempResultList: string[] = [];
    // TODO
    // let currPath = data.path.split('8311')[1];
    let currPath = data.path;
    data.nFrameList.map(item => {
      // tempResultList.push(data.path + item + '.json.gz');
      tempResultList.push(currPath + item + '.json.gz');
    });
    if (GlobalStore.mapboxLayer == null) {
      await GlobalStore.createMapboxLayer();
    }
    // 加载结果文件并重新赋值给simAnimation
    let tempMap = {};
    tempMap['animateCloud'] =
      await GlobalStore.mapboxLayer?.loadResultSimAnimation({
        renderDataType: PHYSICAL_KEYWORDS.水深,
        colorTheme: PHYSICAL_KEYWORDS.水深,
        resultPathList: tempResultList,
        handleLoadedNum: e => {
          YYFPStore.currCase.loadedNum = e;
        },
        _sumFrames: data.nFrameList.length
      });
    tempMap['staticCloud'] =
      await GlobalStore.mapboxLayer?.loadResultSimAnimation({
        renderDataType: PHYSICAL_KEYWORDS.最大水深,
        colorTheme: PHYSICAL_KEYWORDS.最大水深,
        resultPathList: [jsonPath],
        // resultPathList: [jsonPath.split('8311')[1]],
        handleLoadedNum: e => {
          YYFPStore.currCase.loadedNum++;
        },
        _sumFrames: 1,
        maxValue: {
          [PHYSICAL_KEYWORDS.历时]:
            YYFPStore.periodType == 'day' ? 12 * 60 : 24 * 60 * 7
        }
      }); // 加载最大水深&淹没历时云图
    //添加到map中
    GlobalStore.map?.addLayer(GlobalStore.mapboxLayer as mapboxgl.AnyLayer);
    // console.log('加载云图文件结束', tempMap);

    YYFPStore.allSectionsInfo = allSectionsInfo;
    YYFPStore.setSimAnimationMap(tempMap);

    YYFPStore.currCase.villageRiskList = data.riskList;
    YYFPStore.markerList.village = GlobalStore.getVillageMarkerList(
      data.riskList
    ); // 村庄点位基础数据
    YYFPStore.markerList.section = GlobalStore.sectionMarkerList;
    getFloodAreaData(startTime, endTime, projectId, calType);
    YYFPStore.currLayers = ['village', 'risk'];
    YYFPStore.handleTypeChange(PHYSICAL_KEYWORDS.水深);
    YYFPStore.addMarker();
    YYFPStore.currCase.isResultRenderDone = true; // 渲染结束
    YYFPStore.resultLoading = false;
    message.success('渲染完成');
  };

  const Scene = () => {
    return (
      <>
        <SceneSelector />
        {sceneType === 'design' && <DesignScene />}

        {sceneType === 'custom' && <CustomScene />}
      </>
    );
  };

  return (
    <QSYYFPLeftContext.Provider
      value={{
        sceneType: sceneType,
        setSceneType: setSceneType,
        setShowList: setShowList,
        handlePreviewResult: handlePreviewResult
      }}>
      <QSYYFPLeftWrapper>
        <div className="common-header-outer">
          <PanelHeader title={'情景设置'} />
        </div>
        <div className="operation-outer bg-content-area-alpha">
          {!showList && <Scene />}
          {showList && <List setShowList={() => setShowList(false)} />}
        </div>
      </QSYYFPLeftWrapper>
    </QSYYFPLeftContext.Provider>
  );
}

export default observer(QSYYFPLeftCom);
