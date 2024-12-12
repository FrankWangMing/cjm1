import {
  FloodControlBrief,
  PdfServer,
  QueryFloodPreventPdfRes,
  SolutionServer
} from '@/service';
import {
  getForecastTime,
  MomentFormatStr,
  PHYSICAL_KEYWORDS,
  RISK_MAP,
  ShowModeProjectId,
  ShowModeTime
} from '@/utils/const';
import { useMount, useSafeState } from 'ahooks';
import moment from 'moment';
import { Fragment, useEffect } from 'react';
import { ColorBar } from '../LegendCom/ColorBar';
import Loading from '../Loading';
import { PDFComWrapper } from './style';
import GlobalStore from '@/store';
import { Button, Form, FormInstance, Input, Select, Space } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { MinusSquareOutlined, PlusOutlined } from '@ant-design/icons';
import { pdfData, pdfData2 } from '@/pages/LDYA/components/mock';
import RainLineChart from './LineChart';

interface BriefPDFProp {
  url: {
    duration: string;
    maxDepth: string;
  };
  loading: {
    duration: boolean;
    maxDepth: boolean;
  };
  forecastTime: number;
  isHaveRiskVillage: boolean;
  isEdit: boolean;
  handleBriefIsOk: Function;
  form: FormInstance;
  pdfNumber: number;
  handleSaveChart?: (data: string) => void;
}

export const BriefPDF: React.FC<BriefPDFProp> = ({
  form,
  url,
  loading,
  forecastTime,
  isEdit,
  isHaveRiskVillage,
  handleBriefIsOk,
  pdfNumber,
  handleSaveChart
}) => {
  const [loadingBrief, setLoadingBrief] = useSafeState(false);
  /**
   * 查询防汛简报数据
   */
  const queryBriefData = async () => {
    setLoadingBrief(true);
    let projectId = 0,
      startTime = '',
      endTime = '';
    if (GlobalStore.isShowMode) {
      // 演示模式
      projectId = ShowModeProjectId;
      startTime = ShowModeTime.format('YYYY-MM-DD 00:00:00');
      endTime = moment(startTime)
        .add('h', forecastTime)
        .format(MomentFormatStr);
    } else {
      let { startTime: start, endTime: end } = getForecastTime(
        moment(),
        forecastTime,
        'h'
      );
      startTime = start.format('YYYY-MM-DD HH:00:00');
      endTime = end.format('YYYY-MM-DD HH:00:00');
    }
    // const res = await PdfServer.queryFloodPreventPdf({
    //   projectId,
    //   startTime,
    //   endTime,
    //   pdfNumber
    // });

    const res = pdfNumber === 1 ? pdfData : pdfData2;
    // todo 修改具体briefDataStash对象
    let tempObj = {
      id: res?.id,
      foresight: res?.foresight,
      subject: res?.subject,
      organization: res?.organization,
      date: res?.date,
      summary: res?.summary,
      riskForecast: res?.riskForecast,
      crossSectionRiskList: res?.crossSectionRiskList || [],
      villageRiskList: res?.villageRiskList || [],
      floodDepthPictureLink: res?.floodDepthPictureLink,
      floodDurationPictureLink: res?.floodDurationPictureLink,
      waterRainStatistic: res?.waterRainStatistic,
      floodSuggestionTitle: res?.floodSuggestionTitle,
      immeSuggest: res?.immeSuggest?.join('\n'),
      prepSuggest: res?.prepSuggest?.join('\n'),
      riskListDesc: res?.riskListDesc,
      rainPicture: res.rainPicture
    };
    form.setFieldsValue({ ...tempObj });
    GlobalStore.briefDataStash = tempObj;
    // 加载完成继续其他操作
    handleBriefIsOk();
    // todo 由于没有接口数据，制造加载假象
    setTimeout(() => {
      setLoadingBrief(false);
    }, 200);
  };

  const [natureVillageList, setNatureVillageList] = useSafeState<
    { label: string; value: string }[]
  >([]);
  const riskLevelList = [
    { label: '一级风险', value: 1 },
    { label: '二级风险', value: 2 },
    { label: '三级风险', value: 3 }
    // { label: '四级风险', value: 4 }
  ];

  /** 获取所有的镇列表 */
  const getAllDataList = (
    key: string
  ): { label: string; value: string; town?: string }[] => {
    let temp: string[] = [];
    let res: { label: string; value: string; town?: string }[] = [];
    GlobalStore.villageList.map(item => {
      if (!temp.includes(item[key])) {
        if (key === 'administrativeVillage') {
          res.push({
            label: item[key],
            value: item[key]
          });
        } else {
          res.push({
            label: item[key],
            value: item[key],
            town: item.town
          });
        }

        temp.push(item[key]);
      }
    });
    return res;
  };

  useMount(() => {
    setNatureVillageList(getAllDataList('natureVillage'));
  });

  useEffect(() => {
    if (forecastTime != -1) {
      queryBriefData();
    }
  }, [forecastTime, pdfNumber]);

  return (
    <PDFComWrapper>
      <Loading loadingFlag={loadingBrief} />
      {!loadingBrief && (
        <Form form={form} className="content">
          <Form.Item name="subject">
            {isEdit ? (
              <Input maxLength={15} className="h1-edit" />
            ) : (
              <h1>{form.getFieldValue('subject')}</h1>
            )}
          </Form.Item>
          <div className="sub-title">
            {/* 部门 和 日期 */}
            <div className="flex-between">
              <Form.Item name="organization">
                {isEdit ? (
                  <Input maxLength={15} />
                ) : (
                  <p>{form.getFieldValue('organization')}</p>
                )}
              </Form.Item>
              {/* 2023年04月17日 */}
              <Form.Item name="date">
                {isEdit ? (
                  <Input maxLength={15} style={{ textAlign: 'right' }} />
                ) : (
                  <p>
                    <span> {form.getFieldValue('date')?.substring(0, 4)}</span>
                    年<span>{form.getFieldValue('date')?.substring(5, 7)}</span>
                    月
                    <span>{form.getFieldValue('date')?.substring(8, 10)}</span>
                    日
                  </p>
                )}
              </Form.Item>
            </div>
            <div className="divide-line"></div>
          </div>
          {/* 洪涝态势综述 */}
          <Form.Item name="summary">
            {isEdit ? (
              <Input maxLength={15} className="h2-edit" />
            ) : (
              <h2>{form.getFieldValue('summary')}</h2>
            )}
          </Form.Item>

          <h3>一、 泄洪方案</h3>
          <div className="main-content">
            <Form.Item name="riskForecast">
              {isEdit ? (
                <TextArea maxLength={300} showCount={true} />
              ) : (
                form
                  .getFieldValue('riskForecast')
                  ?.split('\n')
                  .map((item: string, index: number) => {
                    return <p key={index}>{item}</p>;
                  })
              )}
            </Form.Item>
            {!isEdit && (
              <Form.Item>
                <p>泄洪曲线见下图:</p>
                {GlobalStore.briefDataStash?.rainPicture ? (
                  <img
                    className="water-rain"
                    src={GlobalStore.briefDataStash?.rainPicture}
                  />
                ) : (
                  <RainLineChart handleSaveChart={handleSaveChart} />
                )}
              </Form.Item>
            )}
            <Form.Item name="riskListDesc">
              {isEdit ? (
                <TextArea maxLength={300} showCount={true} />
              ) : (
                form
                  .getFieldValue('riskListDesc')
                  ?.split('\n')
                  .map((item: string, index: number) => {
                    return <p key={index}>{item}</p>;
                  })
              )}
            </Form.Item>
            {/* todo */}
            {isHaveRiskVillage && (
              <Fragment>
                <h4>（一）河道水位风险清单</h4>
                {isEdit ? (
                  <Form.List name="crossSectionRiskList">
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map(({ key, name, ...restField }, index) => (
                          <Space style={{ marginBottom: '10rem' }}>
                            <p
                              style={{
                                width: '20rem',
                                textIndent: 'unset',
                                fontWeight: '600'
                              }}>
                              {index + 1}.
                            </p>
                            <Form.Item
                              rules={[{ required: true, message: '地区' }]}
                              style={{ width: '160rem' }}
                              name={[name, 'area']}>
                              <Select
                                options={[
                                  {
                                    label: '龙港镇',
                                    value: '龙港镇'
                                  }
                                ]}
                              />
                            </Form.Item>
                            <Form.Item
                              rules={[{ required: true, message: '断面名称' }]}
                              style={{ width: '160rem' }}
                              name={[name, 'crossSectionName']}>
                              <Input size="small" />
                            </Form.Item>
                            <Form.Item
                              rules={[{ required: true, message: '风险清单' }]}
                              style={{ width: '190rem' }}
                              name={[name, 'riskLevel']}>
                              <Select
                                options={[
                                  {
                                    label: '危险水位',
                                    value: '危险水位'
                                  }
                                ]}
                              />
                            </Form.Item>
                            <MinusSquareOutlined
                              className="minusSquareOut-icon"
                              onClick={() => {
                                remove(name);
                              }}
                            />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            className="operation-add-item"
                            onClick={() => {
                              add();
                            }}
                            block>
                            <PlusOutlined />
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                ) : (
                  form.getFieldValue('crossSectionRiskList')?.length > 0 && (
                    <table className="table-outer" border={1}>
                      <tr>
                        <td>序号</td>
                        <td>地区</td>
                        <td>断面名称</td>
                        <td>风险等级</td>
                      </tr>
                      {form
                        .getFieldValue('crossSectionRiskList')
                        .sort((a, b) => {
                          return a.riskLevel - b.riskLevel;
                        })
                        .map((item, index) => {
                          return (
                            <tr key={item.villageId}>
                              <td>{index + 1}</td>
                              <td>{item.area}</td>
                              <td>{item.crossSectionName}</td>
                              <td className={`td-risk_${item.riskLevel}`}>
                                {item.riskLevel}
                              </td>
                            </tr>
                          );
                        })}
                    </table>
                  )
                )}
              </Fragment>
            )}

            {isHaveRiskVillage && (
              <Fragment>
                <h4>（二）村落风险清单</h4>
                {isEdit ? (
                  <Form.List name="villageRiskList">
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map(({ key, name, ...restField }, index) => (
                          <Space style={{ marginBottom: '10rem' }}>
                            <p
                              style={{
                                width: '20rem',
                                textIndent: 'unset',
                                fontWeight: '600'
                              }}>
                              {index + 1}.
                            </p>
                            <Form.Item
                              rules={[{ required: true, message: '地区' }]}
                              style={{ width: '160rem' }}
                              name={[name, 'administrativeVillage']}>
                              <Select
                                options={[
                                  {
                                    label: '龙港镇',
                                    value: '龙港镇'
                                  }
                                ]}
                              />
                            </Form.Item>
                            <Form.Item
                              rules={[{ required: true, message: '村/社区' }]}
                              style={{ width: '180rem' }}
                              name={[name, 'villageName']}>
                              <Select options={natureVillageList} />
                            </Form.Item>
                            <Form.Item
                              rules={[{ required: true, message: '风险清单' }]}
                              style={{ width: '180rem' }}
                              name={[name, 'riskLevel']}>
                              <Select options={riskLevelList} />
                            </Form.Item>
                            <MinusSquareOutlined
                              className="minusSquareOut-icon"
                              onClick={() => {
                                remove(name);
                              }}
                            />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            className="operation-add-item"
                            onClick={() => {
                              add();
                            }}
                            block>
                            <PlusOutlined />
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                ) : (
                  form.getFieldValue('villageRiskList')?.length > 0 && (
                    <table className="table-outer" border={1}>
                      <tr>
                        <td>序号</td>
                        <td>地区</td>
                        <td>商铺/村落名称</td>
                        <td>风险等级</td>
                      </tr>
                      {form
                        .getFieldValue('villageRiskList')
                        .sort((a, b) => {
                          return a.riskLevel - b.riskLevel;
                        })
                        .map((item, index) => {
                          return (
                            <tr key={item.villageId}>
                              <td>{index + 1}</td>
                              <td>{item.administrativeVillage}</td>
                              <td>{item.villageName}</td>
                              <td className={`td-risk_${item.riskLevel}`}>
                                {RISK_MAP.COLOR_LEVEL[item.riskLevel].name}
                              </td>
                            </tr>
                          );
                        })}
                    </table>
                  )
                )}
              </Fragment>
            )}
            {isHaveRiskVillage && (
              <Fragment>
                <h4>（三）洪水风险图</h4>
                <div className="img-outer">
                  <Loading loadingFlag={loading.maxDepth} />
                  {!loading.maxDepth && (
                    <Fragment>
                      <div id="maxDepth-img-id">
                        <img
                          src={
                            GlobalStore.briefDataStash?.floodDepthPictureLink ||
                            url.maxDepth
                          }
                        />
                        <div className="scalar" style={{ height: '180rem' }}>
                          <ColorBar
                            type={PHYSICAL_KEYWORDS.最大水深}
                            unit="cm"
                            numList={['∞', '300', '200', '100', '50', '0']}
                            lineBgColor="linear-gradient(180deg, #004DCC 0%, #004DCC 20%,#2673F2 20%, #2673F2 40%,#5980FF 40%, #5980FF 60%,#8099FF 60%,#8099FF 80%,#B3CCFF 80%,#B3CCFF 100%)"
                            handleTypeChange={() => {}}
                            keyValList={[
                              {
                                key: '最大水深',
                                value: PHYSICAL_KEYWORDS.最大水深,
                                disable: false
                              }
                            ]}
                          />
                        </div>
                      </div>
                      {/* 全域洪水淹没水深图 */}
                      <p className="img-desc">全域洪水淹没水深图</p>
                    </Fragment>
                  )}
                </div>
                <div className="img-outer">
                  <Loading loadingFlag={loading.duration} />
                  {!loading.duration && (
                    <Fragment>
                      <div id="duration-img-id">
                        <img
                          src={
                            GlobalStore.briefDataStash
                              ?.floodDurationPictureLink || url.duration
                          }
                        />
                        <div className="scalar">
                          <ColorBar
                            type={PHYSICAL_KEYWORDS['历时']}
                            unit="h"
                            numList={[
                              '24',
                              '12',
                              '6',
                              '3',
                              '2',
                              '1',
                              '0.5',
                              '0'
                            ]}
                            lineBgColor="linear-gradient(180deg,#7a5a0d 0%,#7a5a0d 16.7%,#997819 16.7%,#997819 33.4%,#c3a046 33.4%,#c3a046 50.1%,#e0cc85 50.1%,#e0cc85 66.8%,#f2e0b3 66.8%,#f2e0b3 83.5%,#fff3bf 83.5%,#fff3bf 100%)"
                            handleTypeChange={() => {}}
                            keyValList={[
                              {
                                key: '淹没历时',
                                value: PHYSICAL_KEYWORDS.历时,
                                disable: false
                              }
                            ]}
                          />
                        </div>
                      </div>
                      <p className="img-desc">全域洪水淹没历时图</p>
                    </Fragment>
                  )}
                </div>
              </Fragment>
            )}
          </div>
          {/* 标题二 */}
          <h3>二、 水雨情概况</h3>
          <div className="main-content">
            <Form.Item name="waterRainStatistic_title">
              {isEdit ? (
                <TextArea maxLength={100} showCount={true} />
              ) : (
                <p>{form.getFieldValue('waterRainStatistic_title') || ''}</p>
              )}
            </Form.Item>
          </div>
          {/* 标题三 */}
          <h3>三、防汛建议</h3>
          <div className="main-content">
            <Form.Item name="floodSuggestionTitle">
              {isEdit ? (
                <Input maxLength={100} className="h3-edit" />
              ) : (
                <p>
                  {form
                    .getFieldValue('floodSuggestionTitle')
                    ?.split('\n')
                    .map((item: string, index: number) => {
                      return <p key={index}>{item}</p>;
                    })}
                </p>
              )}
            </Form.Item>
          </div>
          <div className="main-content">
            {/* <h4>（一）立即转移</h4>
            <Form.Item name="immeSuggest">
              {isEdit ? (
                <TextArea maxLength={500} className="h3-edit" />
              ) : (
                <div className="main-content">
                  {form
                    .getFieldValue('immeSuggest')
                    ?.split('\n')
                    .map((item: string, index: number) => {
                      return <p key={index}>{item}</p>;
                    })}
                </div>
              )}
            </Form.Item>
            <h4>（二）准备转移</h4> */}
            <Form.Item name="prepSuggest">
              {isEdit ? (
                <TextArea maxLength={500} className="h3-edit" />
              ) : (
                <div className="main-content">
                  {form
                    .getFieldValue('prepSuggest')
                    ?.split('\n')
                    ?.map((item: string, index: number) => {
                      return (
                        <p
                          className={item.includes('•') ? 'li' : ''}
                          key={index}>
                          {item}
                        </p>
                      );
                    })}
                </div>
              )}
            </Form.Item>
          </div>
        </Form>
      )}
    </PDFComWrapper>
  );
};
