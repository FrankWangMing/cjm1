/**
 * 防汛专报
 */
import { PanelHeader } from '@/components/Header';
import Loading from '@/components/Loading';
import { BriefPDF } from '@/components/PDFCom';
import { ForecastServer, PdfServer, SolutionServer } from '@/service';
import {
  getForecastTime,
  IMG_PATH,
  PHYSICAL_KEYWORDS,
  ShowModeProjectId,
  ShowModeTime
} from '@/utils/const';
import { WaterResampleAnimation } from '@ys/dte';
import { useUnmount } from 'ahooks';
import { Form, message, Popconfirm, Radio } from 'antd';
import { observer, useLocalStore } from 'mobx-react-lite';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalStore from '@/store';
import { downloadFile, exportImage, sleep } from '@/utils';
import { MAPBOX_DEFAULT_CONFIG, villageNameMarker } from '@/components/Map';

const tempDataForecastTime = [1, 3, 6];
const defaultForecastTime = 3;
const DEFAULT_PDF_NUM = 0;

interface LinkageBriefReportProp {}

const LinkageBriefReport: React.FC<LinkageBriefReportProp> = observer(({}) => {
  const store = useLocalStore(
    (): {
      selectedForecastTime: number;
      calcLoading: boolean;
      riskLevelNum: { 1: number; 2: number; 3: number; 4: number };
      isHaveRiskVillage: boolean;
      loadedNum: number;
      screenShootObj: {
        simAnimation: WaterResampleAnimation | undefined;
        duration: {
          loading: boolean;
          url: string;
        };
        maxDepth: {
          loading: boolean;
          url: string;
        };
      };
      pdfFile: {
        duration: string;
        maxDepth: string;
      };
      briefIsOk: boolean;
      releaseLoading: boolean;
      pdfLink: string[];
      exportLoading: boolean;
      pdfCreateLoading: boolean;
      isEdit: boolean;
      pdfNumber: number;
      type: string;
      dataUrl: string;
    } => ({
      selectedForecastTime: defaultForecastTime,
      calcLoading: true,
      riskLevelNum: {
        1: 0,
        2: 0,
        3: 0,
        4: 0
      },
      isHaveRiskVillage: false,
      screenShootObj: {
        simAnimation: undefined,
        duration: {
          loading: false,
          url: ''
        },
        maxDepth: {
          loading: false,
          url: ''
        }
      },
      pdfFile: {
        duration: '',
        maxDepth: ''
      },
      loadedNum: 0,
      briefIsOk: false,
      releaseLoading: false,
      pdfLink: [],
      exportLoading: false,
      pdfCreateLoading: false,
      isEdit: false,
      pdfNumber: DEFAULT_PDF_NUM,
      type: 'pdfShow',
      dataUrl: ''
    })
  );
  // 统计时段发生变化触发相关事件
  const handleForecastTimeChange = e => {
    store.pdfLink = [];
    store.selectedForecastTime = e.target.value;
    store.pdfNumber = 0;
    // 更新一下重要防灾村落数据
    calcStart();
  };

  useEffect(() => {
    if (!GlobalStore.map) return;
    GlobalStore.map_flyTo({
      pitch: 0,
      zoom: 12,
      center: MAPBOX_DEFAULT_CONFIG.center as [number, number]
    });
    calcStart();
  }, [GlobalStore.map]);

  /**
   * 开始截图
   * @param param0
   * @returns
   */
  const beginGetImage = async ({
    type,
    key
  }: {
    type: string;
    key: string;
  }) => {
    return new Promise(async resolve => {
      store.screenShootObj.simAnimation?.setRenderDataType(type);
      store.screenShootObj.simAnimation?.setColorTheme(type);
      store.screenShootObj.simAnimation?.show(true);
      await sleep(1000);
      requestAnimationFrame(async () => {
        // 加载成功;
        const { url, file } = await exportImage(
          document.getElementById('map')!,
          type
        );
        store.pdfFile[key] = file; // 存储后端需要上传文件，避免后续保存需要再次截图
        store.screenShootObj[key].url = url;
        store.screenShootObj.simAnimation!.show(false);
        store.screenShootObj[key].loading = false;
        resolve('success');
      });
    });
  };
  /**
   * 截图调用接口
   */
  const handleScreenShoot = async () => {
    await beginGetImage({
      type: PHYSICAL_KEYWORDS.最大水深,
      key: 'maxDepth'
    });
    await beginGetImage({ type: PHYSICAL_KEYWORDS.历时, key: 'duration' });
  };

  const getTime = () => {
    let startTime = '',
      endTime = '';

    if (GlobalStore.isShowMode) {
      // 演示模式
      startTime = ShowModeTime.format('YYYY-MM-DD 00:00:00');
      endTime = moment(startTime)
        .add('h', store.selectedForecastTime)
        .format('YYYY-MM-DD HH:00:00');
    } else {
      let { startTime: start, endTime: end } = getForecastTime(
        moment(),
        store.selectedForecastTime,
        'h'
      );
      startTime = start.format('YYYY-MM-DD HH:00:00');
      endTime = end.format('YYYY-MM-DD HH:00:00');
    }
    return {
      startTime,
      endTime
    };
  };

  /**
   * 重新加载
   */
  const calcStart = async () => {
    store.calcLoading = true;
    store.loadedNum = 0;
    store.briefIsOk = false;
    let projectId = 0,
      calType = 1;

    if (GlobalStore.isShowMode) {
      projectId = ShowModeProjectId;
      calType = 4;
    }

    const time = getTime();
    try {
      const data = await SolutionServer.queryRiskVillage(
        time.startTime,
        time.endTime,
        projectId
      );

      // console.log('数据加载完成', data);
      if (location.pathname == '/ldya') {
        let { isHaveRiskVillage, tempObj } = utilFormatRiskMap(data.riskList);
        store.riskLevelNum = tempObj;
        store.isHaveRiskVillage = isHaveRiskVillage;
        // 请求云图结果
        if (store.isHaveRiskVillage) {
          // 加载结果云图
          const { path } = await ForecastServer.cloudQuery({
            ...time,
            projectId: data.projectId,
            calType
          });
          if (GlobalStore.mapboxLayer == null) {
            await GlobalStore.createMapboxLayer();
          }
          store.screenShootObj.simAnimation =
            await GlobalStore.mapboxLayer?.loadResultSimAnimation({
              renderDataType: PHYSICAL_KEYWORDS.最大水深,
              colorTheme: PHYSICAL_KEYWORDS.最大水深,
              resultPathList: [path],
              // resultPathList: [path.split('8311')[1]],
              handleLoadedNum: e => {
                store.loadedNum++;
              },
              _sumFrames: 1
            });
          GlobalStore.map?.addLayer(
            GlobalStore.mapboxLayer as mapboxgl.AnyLayer
          );
          console.log('云图加载结束');
          await handleScreenShoot();
        } else {
          store.briefIsOk = true;
        }
        store.calcLoading = false;
      }
    } catch {
    } finally {
      // 接口请求出错也能获取pdf内容
      store.calcLoading = false;
    }
  };

  /**
   * 发布信息
   */
  const handleRelease = async () => {
    store.releaseLoading = true;
    try {
      await getPdfLink(1);
    } catch (e) {
      message.error('发送失败');
    } finally {
      store.releaseLoading = false;
    }
  };

  /**
   * 导出按钮响应事件
   */
  const handleExport = async () => {
    store.exportLoading = true;

    try {
      // const resPdfPath = await SolutionServer.downloadBriefReport({
      //   pdfNumber: [GlobalStore.briefDataStash?.id]
      // });
      // store.pdfLink = resPdfPath.path;
      // await Promise.all(
      //   store.pdfLink.map(v => {
      //     return new Promise(async (resolve, reject) =>
      //       resolve(await downloadFile(v, v.split('/').reverse()[0]))
      //     );
      //   })
      // );
      // todo 导出文件等待替换接口
      const pdfLink =
        store.pdfNumber === 1
          ? '/api/resource/dynamicDir/pdf/%E6%B2%81%E6%B0%B4%E5%8E%BF%E6%B2%81%E6%B2%B3%E6%B5%81%E5%9F%9F%E8%B0%83%E5%BA%A6%E9%A2%84%E6%A1%88-20230101V0.1.pdf'
          : '/api/resource/dynamicDir/pdf/%E6%B2%81%E6%B0%B4%E5%8E%BF%E6%B2%81%E6%B2%B3%E6%B5%81%E5%9F%9F%E8%B0%83%E5%BA%A6%E9%A2%84%E6%A1%88-20240815V0.1.pdf';
      await downloadFile(pdfLink, `调度预案${store.pdfNumber}`);
    } catch (error) {
    } finally {
      store.exportLoading = false;
    }
  };

  /**
   * 开始截图 --截带有色条的图片
   */
  const getPdfLink = async (operateType: number): Promise<void> => {
    let projectId = 0;
    if (GlobalStore.isShowMode) {
      projectId = ShowModeProjectId;
    }

    // 有无风险村庄
    if (store.isHaveRiskVillage) {
      try {
        store.pdfCreateLoading = true;
        console.log(GlobalStore.briefDataStash?.floodDepthPictureLink);

        // 是否已经截图并上传后端  主要用于初次加载的pdf
        if (
          GlobalStore.briefDataStash &&
          !GlobalStore.briefDataStash?.floodDepthPictureLink
        ) {
          const maxDepthFormData = new FormData();
          maxDepthFormData.set('images', store.pdfFile.duration);
          // 传给后端，生成截图文件
          const { imagePath: maxDepthPath } = await PdfServer.UploadBriefImage(
            maxDepthFormData
          );
          GlobalStore.briefDataStash.floodDepthPictureLink = maxDepthPath;
        }

        if (
          GlobalStore.briefDataStash &&
          !GlobalStore.briefDataStash?.floodDurationPictureLink
        ) {
          const formData = new FormData();
          formData.set('images', store.pdfFile.duration);
          const { imagePath: durationFilePath } =
            await PdfServer.UploadBriefImage(formData);
          GlobalStore.briefDataStash.floodDurationPictureLink =
            durationFilePath;
        }
      } catch (error) {
        message.error('导出失败');
      } finally {
        store.pdfCreateLoading = false;
      }
    }
    // 发布
    if (operateType === 1) {
      await updatePdf2Server(true, projectId.toString());
    }

    // 编辑保存
    if (operateType === 2) {
      await updatePdf2Server(false, projectId.toString());
    }
  };

  useEffect(() => {
    let villageLength = GlobalStore.villageList.length;
    let map = GlobalStore.map;
    if (!map || villageLength == 0) return;
    // GlobalStore.setIsShow3DTile(false);
    villageNameMarker();
  }, [GlobalStore.map, GlobalStore.villageList]);

  useUnmount(() => {
    event?.preventDefault();
    event?.stopPropagation();
    GlobalStore.leaveCurrPage();
  });

  const [form] = Form.useForm();
  const handleIsEditChange = (isEdit: boolean) => {
    if (isEdit) {
      console.log('修改之后', form.getFieldsValue());
      // 如果打开编辑的话要给form表单赋值。
    } else {
      let asd = form.getFieldsValue();
      console.log('pdf', asd);
    }
    console.log('修改之后', form.getFieldsValue());
    store.isEdit = isEdit;
  };

  /**
   * 保存编辑
   */
  const handleSaveEdit = () => {
    form
      .validateFields()
      .then(async res => {
        // 判断是否可以保存;
        store.isEdit = false;

        GlobalStore.briefDataStash = {
          ...GlobalStore.briefDataStash,
          ...form.getFieldsValue(),
          ...{
            waterRainStatistic: {
              title: form.getFieldValue('waterRainStatistic_title')
            }
          }
        };
        await getPdfLink(2);
      })
      .catch(e => {
        message.error(`数据未正确填充 => ${e.errorFields[0].errors[0]}`);
      });
  };

  /**
   * 放弃编辑
   */
  const handleNotSaveEdit = () => {
    store.isEdit = false;
    form.setFieldsValue(GlobalStore.briefDataStash);
  };

  /**
   * 本地编辑的内容上传到服务器上
   */
  const updatePdf2Server = async (
    isPublish?: Boolean,
    projectId?: string
  ): Promise<number> => {
    // todo 保存数据
    let body: any = {
      ...GlobalStore.briefDataStash,
      prepSuggest: GlobalStore.briefDataStash?.prepSuggest.split('\n'),
      immeSuggest: GlobalStore.briefDataStash?.immeSuggest.split('\n'),
      villageRiskList: GlobalStore.briefDataStash?.villageRiskList.map(item => {
        return {
          ...item,
          villageId: GlobalStore.villageList.find(
            _ => _.natureVillage === item.villageName
          )?.id,
          area: '山西省'
        };
      })
    };

    //第一次保存，泄洪曲线图需要上传图片
    // console.log('dataUrl', store.dataUrl);
    let formData = new FormData();
    formData.append('images', store.dataUrl);
    const { imagePath } = await SolutionServer.uploadImg(formData);
    // console.log(imagePath);

    body = {
      ...body,
      // rainPicture: imagePath,
      isPublish: isPublish,
      forecastTim: store.selectedForecastTime
    };
    if (GlobalStore.isShowMode) {
      body.projectId = projectId;
    }
    // todo '等待接口，解开注释'
    // const data = await PdfServer.editBriefReport(body);
    // getList(1, 10); // 刷新列表
    // store.pdfNumber = data.pdfNumber;
    // return data.pdfNumber;
  };

  const [listData, setListData] = useState<{
    count: number;
    list: {
      createdAt: string;
      foresight: number;
      id: number;
      pdfName: string;
    }[];
  }>();

  const getList = async (pageIndex: number, pageSize: number) => {
    // todo，分页效果写死
    if (pageIndex === 1) {
      setListData({
        count: 12,
        list: reportList.list?.slice(0, 10)
      });
    }
    if (pageIndex === 2) {
      setListData({
        count: 12,
        list: reportList.list.slice(10, 12)
      });
    }
    try {
      const data = await SolutionServer.queryReportList({
        foresight: 0,
        pageNum: pageIndex,
        pageSize: pageSize,
        pdfType: GlobalStore.isShowMode ? 2 : 1
      });
      setListData(data);
    } catch (error) {}
  };

  useEffect(() => {
    getList(1, 10);
  }, []);

  return (
    <LinkageBriefReportWrapper className="animate__animated animate__fadeIn">
      <div className="flex-between">
        {store.type === 'pdfShow' ? (
          <>
            <div className="half-item">
              {/* 统计时段 */}
              <div className="content-inner-header">
                <PanelHeader title="统计时段" size="superLarge" />
              </div>
              <div className="statics-period-outer bg-content-area-alpha flex column flex-center">
                <div>
                  <Radio.Group
                    disabled={store.calcLoading || !store.briefIsOk}
                    value={store.selectedForecastTime}
                    onChange={handleForecastTimeChange}>
                    {tempDataForecastTime.map(item => {
                      return (
                        <Radio.Button value={item} key={item}>
                          近{item}小时
                        </Radio.Button>
                      );
                    })}
                  </Radio.Group>
                </div>
                <p>
                  &nbsp;
                  {!store.calcLoading && (
                    <Fragment>
                      重要防灾村落： 一级风险
                      {store.riskLevelNum[1]}
                      个，二级风险
                      {store.riskLevelNum[2]}个， 三级风险
                      {store.riskLevelNum[3]}个， 四级风险
                      {store.riskLevelNum[4]}个
                    </Fragment>
                  )}
                  <Loading loadingFlag={store.calcLoading} color="#fff" />
                </p>
              </div>
              {/* 专报列表 */}
              <div className="content-inner-header">
                <PanelHeader title="预案列表" size="superLarge" />
              </div>
              <ReportList
                listData={listData}
                forecastTime={store.selectedForecastTime}
                getList={(pageIndex: number, pageSize: number) => {
                  getList(pageIndex, pageSize);
                }}
                onPreview={(pdfNumber: number) => {
                  store.pdfNumber = pdfNumber;
                }}
                changeType={(type: string) => (store.type = type)}
              />
            </div>
            {/* 防汛专报 */}
            <div className="half-item">
              <div className="content-inner-header">
                <PanelHeader
                  title="调度预案"
                  size="superLarge"
                  OperationFc={
                    store.briefIsOk && !store.calcLoading ? (
                      <EditBrief
                        isEdit={store.isEdit}
                        isDisabled={
                          store.screenShootObj.duration.loading ||
                          store.exportLoading ||
                          store.pdfCreateLoading
                          // !store.pdfNumber
                        }
                        handleIsEditChange={handleIsEditChange}
                        handleSaveEdit={handleSaveEdit}
                        handleNotSaveEdit={handleNotSaveEdit}
                      />
                    ) : null
                  }
                />
              </div>
              <div className="flood-brief-outer bg-content-area-alpha">
                <div className="pdf-content-outer">
                  {store.calcLoading && (
                    <Loading loadingFlag={store.calcLoading} color="#fff" />
                  )}
                  {!store.calcLoading ? (
                    <BriefPDF
                      form={form}
                      isEdit={store.isEdit}
                      url={{
                        duration: store.screenShootObj.duration.url,
                        maxDepth: store.screenShootObj.maxDepth.url
                      }}
                      loading={{
                        duration: store.screenShootObj.duration.loading,
                        maxDepth: store.screenShootObj.maxDepth.loading
                      }}
                      isHaveRiskVillage={store.isHaveRiskVillage}
                      forecastTime={store.selectedForecastTime}
                      handleBriefIsOk={() => {
                        store.briefIsOk = true;
                      }}
                      handleSaveChart={data => (store.dataUrl = data)}
                      pdfNumber={store.pdfNumber}
                    />
                  ) : null}
                </div>
                {store.briefIsOk && !store.calcLoading && (
                  <div className="operation-btn-outer">
                    <BottomBtn
                      disabled={
                        store.screenShootObj.duration.loading ||
                        store.screenShootObj.duration.loading ||
                        store.releaseLoading ||
                        store.pdfCreateLoading ||
                        store.isEdit
                      }
                      onClick={handleRelease}
                      loading={
                        store.screenShootObj.duration.loading ||
                        store.screenShootObj.duration.loading ||
                        store.releaseLoading
                      }>
                      发布
                    </BottomBtn>
                    <BottomBtn
                      onClick={handleExport}
                      disabled={
                        store.screenShootObj.duration.loading ||
                        store.exportLoading ||
                        store.pdfCreateLoading ||
                        store.isEdit
                      }
                      loading={
                        store.screenShootObj.duration.loading ||
                        store.screenShootObj.duration.loading ||
                        store.exportLoading
                      }>
                      导出
                    </BottomBtn>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <PdfCompare
            changeType={(type: string) => (store.type = type)}
            data={listData!.list}
            forecastTime={store.selectedForecastTime}
            isHaveRiskVillage={store.isHaveRiskVillage}
            loading={{
              duration: store.screenShootObj.duration.loading,
              maxDepth: store.screenShootObj.maxDepth.loading
            }}
            url={{
              duration: store.screenShootObj.duration.url,
              maxDepth: store.screenShootObj.maxDepth.url
            }}
          />
        )}
      </div>
    </LinkageBriefReportWrapper>
  );
});

export { LinkageBriefReport };

interface EditBriefProp {
  isEdit: boolean;
  handleIsEditChange: Function;
  handleSaveEdit: Function;
  handleNotSaveEdit: Function;
  isDisabled?: boolean;
}

// 编辑防汛专报按钮
const EditBrief = ({
  isEdit,
  handleIsEditChange,
  handleSaveEdit,
  handleNotSaveEdit,
  isDisabled
}: EditBriefProp) => {
  return (
    <div
      style={{
        position: 'absolute',
        right: '20rem',
        top: '10rem',
        cursor: 'pointer',
        fontSize: '20rem'
      }}>
      {isEdit ? (
        <Fragment>
          <Popconfirm
            title={'确定保存吗？'}
            onConfirm={() => handleSaveEdit()}
            okText="确定"
            cancelText="取消">
            <img
              src={IMG_PATH.icon.confirm}
              alt=""
              style={{ marginRight: '10rem' }}
            />
          </Popconfirm>
          <Popconfirm
            title={'确定取消吗？'}
            onConfirm={() => handleNotSaveEdit()}
            okText="确定"
            cancelText="取消">
            <img src={IMG_PATH.icon.cancel} alt="" />
          </Popconfirm>
        </Fragment>
      ) : (
        <EditOutlined
          style={{ color: isDisabled ? '#767676' : '#fff' }}
          onClick={() => {
            if (isDisabled) return;
            handleIsEditChange(true);
          }}
        />
      )}
    </div>
  );
};
import { EditOutlined } from '@ant-design/icons';
import ReportList from '@/pages/LDYA/components/cusModule/ReportList/ReportList';
import { reportList } from '../mock';
import PdfCompare from './ReportList/pdfCompare';
import { BottomBtn } from './ReportList/style';

const utilFormatRiskMap = (
  riskList: {
    riskLevel: number;
    riskNum: number;
  }[]
) => {
  let tempObj = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let isHaveRiskVillage = false;
  let riskCount = 0;
  riskList.forEach(item => {
    tempObj[item.riskLevel] = item.riskNum;
    riskCount += item.riskNum;
    item.riskNum > 0 && (isHaveRiskVillage = true);
  });
  tempObj[4] = GlobalStore.villageList.length - riskCount;
  return {
    tempObj,
    isHaveRiskVillage
  };
};

const LinkageBriefReportWrapper = styled.div`
  /* 统计时段内容 */
  .statics-period-outer {
    font-family: AlibabaPuHuiTiR;
    font-size: 20rem;
    color: #ffffff;
    width: 100%;
    height: 150rem;
    margin-bottom: 20rem;

    p {
      position: relative;
    }

    .ant-radio-group {
      width: 100%;
      margin: 0;
      padding: 0;
      margin-bottom: 20rem;
    }

    .ant-radio-button-wrapper {
      border: none;
      background: transparent;
      width: 180rem;
      margin-left: 12rem;
      height: 40rem;
      line-height: 40rem;
      font-family: WeiRuanYaHei;
      font-size: 20rem;
      color: #ffffff;
      text-align: center;
      font-weight: 400;
      background-image: url(${IMG_PATH.buttonBg1});
      background-repeat: no-repeat;
      background-size: contain;
    }

    .ant-radio-button-wrapper:not(:first-child)::before {
      width: 0rem !important;
    }

    .ant-radio-button-wrapper-checked {
      background-image: url(${IMG_PATH.selectedButton3});
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

  div {
    transition: all 300ms;
  }

  /* 信息联动部门 */

  .message-linkage-apartment-outer {
    width: 100%;
    position: relative;
    padding: 20rem;
    height: 547rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;

    .apartment-outer {
      cursor: pointer;
      width: 32%;
      height: 234rem;
      background: rgba(0, 2, 7, 0.2);
      box-shadow: inset 0rem -1rem 0rem 0rem rgba(61, 70, 92, 1);
      margin-bottom: 20rem;

      img {
        width: 160rem;
        height: 160rem;
        border-radius: 50%;
        background-color: #fff;
      }

      .ant-checkbox-wrapper {
        font-size: 24rem !important;
      }

      .ant-checkbox-wrapper span:nth-child(1) {
        font-size: 0 !important;
      }

      span {
        font-family: AlibabaPuHuiTiR;
        background-color: rgba(1, 1, 1, 0) !important;
        font-size: 24rem;
        color: #ffffff;
      }
    }

    .apartment-outer:nth-child(3),
    .apartment-outer:nth-child(6) {
      margin-right: 0;
    }

    .apartment-outer:hover {
      background: rgba(149, 174, 255, 0.2);
    }

    .apartment-outer_selected {
      background: #2c51b3 !important;
    }
  }
`;
