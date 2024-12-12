import { IAllSceneResItem } from '@/service/preview';

/**
 * 场景类型 - 高水位分析 还是 短时暴雨
 */
export const SCENES_TYPE_LIST: Array<{ value: string; label: string }> = [
  {
    value: '2',
    label: '高水位分析'
  },
  {
    value: '3',
    label: '短时暴雨'
  }
];

export const REHEARSAL_TIME_LIST: {
  2: ISelectOptions[];
  3: ISelectOptions[];
} = {
  2: [{ value: 24, label: '24小时' }],
  3: [{ value: 3, label: '3小时' }]
};

/**
 * 图层控制器列表
 */
export const LAYER_LIST: { key: string; title: string }[] = [
  {
    title: '防洪控制断面',
    key: 'section'
  },
  {
    title: '重要防洪对象',
    key: 'village'
  },
  {
    title: '洪水风险图',
    key: 'risk'
  }
];

/**
 * TEMP_DATA开头的数据将会被删除
 */
/**
 * 弹窗下面的tabList
 */
const MODAL_MENU_LIST = [
  {
    key: 'risk',
    title: '最高风险'
  },
  {
    key: 'WATER DEPTH',
    title: '最大水深'
  },
  {
    key: 'SCALAR VELOCITY',
    title: '最大流速'
  }
];

/**
 * 提取出我们需要的select数据
 */
const formatDataOfSelect = (
  list: IAllSceneResItem[]
): {
  type: ISelectOptions[];
  duration: ISelectOptions[];
  intensity: ISelectOptions[];
} => {
  let tempType: string[] = [];
  let tempDuration: string[] = [];
  let tempIntensity: string[] = [];
  list.map(item => {
    tempType.push(item.type);
    tempDuration.push(item.duration);
    tempIntensity.push(item.intensity);
  });
  return {
    type: util_labelValue(tempType),
    duration: util_labelValue(tempDuration, '小时'),
    intensity: util_labelValue(tempIntensity)
  };
};

export interface ISelectOptions {
  label: string;
  value: string | number;
}
/**
 * 工具 - 数组去重并返回label-value数据集合
 * @param list
 * @returns
 */
const util_labelValue = (list: string[], type?: string): ISelectOptions[] => {
  let tempResult: ISelectOptions[] = [];
  let tempList: string[] = Array.from(new Set(list));
  tempList.map((item: string) => {
    tempResult.push({
      label: item + (type || ''),
      value: item
    });
  });
  return tempResult;
};

/**
 * 获取所有的水位线数据
 * @param currWaterLine 当前水位线
 * @returns {relevant: 相关水位线,all: 所有水位线}
 */
export const getAllWaterLine = (
  currWaterLine: string
): { relevant: [string, string]; all: [string, string, string] } => {
  let tempListOfWaterLine: number[] = [];
  let currWaterLineNum = Number(currWaterLine);
  if (currWaterLineNum < 108.3) {
    tempListOfWaterLine.push(
      currWaterLineNum,
      currWaterLineNum + 0.3,
      currWaterLineNum + 0.6
    );
  } else if (currWaterLineNum > 108.7) {
    tempListOfWaterLine.push(
      currWaterLineNum,
      currWaterLineNum - 0.3,
      currWaterLineNum - 0.6
    );
  } else {
    tempListOfWaterLine.push(
      currWaterLineNum - 0.3,
      currWaterLineNum,
      currWaterLineNum + 0.3
    );
  }
  let resultListOfWaterLine = tempListOfWaterLine.map(item => {
    return item.toFixed(1);
  });
  let resultRelevantList = tempListOfWaterLine.filter(item => {
    return item.toFixed(1) != currWaterLine;
  });
  return {
    relevant: [
      resultRelevantList[0].toFixed(1),
      resultRelevantList[1].toFixed(1)
    ],
    all: [
      resultListOfWaterLine[0],
      resultListOfWaterLine[1],
      resultListOfWaterLine[2]
    ]
  };
};

/**
 * 获取工况id
 */
/**
 *
 * @param allSceneData
 * @param formData
 * @param waterLine
 * @returns
 */
const getProjectIdByParam = (
  allSceneData: IAllSceneResItem[],
  formData: {},
  waterLine: string
): number => {
  let tempObj = allSceneData.filter((item: IAllSceneResItem) => {
    return (
      item.duration == formData['duration'] &&
      item.type == formData['type'] &&
      item.intensity == formData['intensity'] &&
      item.waterLevel == waterLine
    );
  });
  return tempObj[0]?.sceneId;
};

export { MODAL_MENU_LIST, formatDataOfSelect, getProjectIdByParam };
