/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { PanelHeader } from '@/components/Header';
import Loading from '@/components/Loading';
import { IMG_PATH } from '@/utils/const';
import { httpPdf } from '@/utils/http';
import { useSafeState } from 'ahooks';
import { Button, Checkbox, DatePicker, Form, Input, Radio } from 'antd';
import { useEffect } from 'react';
import styled from 'styled-components';
interface LinkageFloodAlarmProp {}
const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 }
};
const LinkageFloodAlarm: React.FC<LinkageFloodAlarmProp> = ({}) => {
  const [pdfLoading, setPdfLoading] = useSafeState(true);
  const getFloodBrief = async () => {
    setPdfLoading(true);
    await previewPdf(
      '/resource/dynamicDir/pdf/洪水黄色预警（淳安）.pdf',
      'pdf-preview-outer',
      'pdf-preview'
    );
    setPdfLoading(false);
  };
  const LinkageMessageApartment = [
    { key: '1', label: '应急管理局', url: IMG_PATH.icon.emergencyManage },
    { key: '2', label: '气象局', url: IMG_PATH.icon.weatherManage },
    { key: '3', label: '城市管理局', url: IMG_PATH.icon.cityManage },
    { key: '4', label: '交通运输局', url: IMG_PATH.icon.transManage }
  ];

  const [selectedApartment, setSelectedApartment] = useSafeState<string[]>([]);

  useEffect(() => {
    getFloodBrief();
  }, []);
  return (
    <LinkageFloodAlarmWrapper className="animate__animated animate__fadeIn">
      <div className="flex-between">
        <div className="half-item">
          <div className="content-inner-header">
            <PanelHeader title="填报设置" size="superLarge" />
          </div>
          <Form
            {...layout}
            className="flood-form-outer bg-content-area-alpha flex-center column">
            <Form.Item label="填报期数">
              <Input placeholder="示例：02" allowClear />
            </Form.Item>
            <Form.Item label="填报时间">
              <DatePicker onChange={e => {}} />
              <Button className="flood-form-btn">当前时间</Button>
            </Form.Item>
            <Form.Item label="填报水位">
              <Input placeholder="请输入" allowClear />
              <Button className="flood-form-btn">当前水位</Button>
            </Form.Item>
            <Form.Item label="洪水预警等级">
              <Radio.Group onChange={() => {}} defaultValue="a">
                <Radio.Button value="a">红色</Radio.Button>
                <Radio.Button value="b">橙色</Radio.Button>
                <Radio.Button value="c">黄色</Radio.Button>
                <Radio.Button value="d">蓝色</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
          <div className="content-inner-header">
            <PanelHeader title="信息联动部门" size="superLarge" />
          </div>
          <Checkbox.Group
            className="apart-item-outer bg-content-area-alpha"
            value={selectedApartment}>
            {LinkageMessageApartment.map(item => {
              return (
                <div
                  className={[
                    'apart-item flex-between column',
                    selectedApartment.includes(item.key)
                      ? 'apart-item_active'
                      : ''
                  ].join(' ')}
                  onClick={() => {
                    if (selectedApartment.includes(item.key)) {
                      let tempArr = [...selectedApartment];
                      let resArr = tempArr.filter(subitem => {
                        return subitem != item.key;
                      });
                      setSelectedApartment(resArr);
                    } else {
                      setSelectedApartment(
                        selectedApartment.concat([item.key])
                      );
                    }
                  }}
                  key={item.key}>
                  <img src={item.url} alt="" />
                  <Checkbox value={item.key}>{item.label}</Checkbox>
                </div>
              );
            })}
          </Checkbox.Group>
        </div>
        <div className="half-item">
          {/* 防汛专报 */}
          <div className="content-inner-header">
            <PanelHeader
              title="防汛专报"
              size="superLarge"
              OperationFc={<p style={{ color: '#fff' }}>编辑</p>}
            />
          </div>
          <div className="flood-brief-outer bg-content-area-alpha">
            <div className="pdf-content-outer">
              {pdfLoading && <Loading loadingFlag={pdfLoading} />}
              <div className="pdf-content" id="pdf-preview-outer"></div>
            </div>
            <div className="operation-btn-outer">
              <div className="operation-btn">发布</div>
              <div className="operation-btn">导出</div>
            </div>
          </div>
        </div>
      </div>
    </LinkageFloodAlarmWrapper>
  );
};

const LinkageFloodAlarmWrapper = styled.div`
  .flood-form-outer {
    width: 100%;
    height: 260rem;
    margin-bottom: 20rem;
    padding: 20rem 0;
  }

  .apart-item-outer {
    width: 100%;
    height: 400rem;
    padding: 20rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .apart-item {
      width: 22%;
      height: 100%;
      cursor: pointer;
      transition: all 300ms;
      padding: 20rem;
      background: rgba(0, 2, 7, 0.2);
      box-shadow: inset 0rem -1rem 0rem 0rem rgba(61, 70, 92, 1);
      img {
        width: 160rem;
        height: 160rem;
        border-radius: 50%;
        margin-top: 60rem;
        background-color: #fff;
      }
    }
    .apart-item:hover {
      background-color: #557ae2;
    }
    .apart-item_active {
      background: #2c51b3 !important;
    }
  }
  .ant-checkbox-wrapper > span {
    font-family: AlibabaPuHuiTiR;
    font-size: 24rem;
    color: #ffffff;
    margin: 0;
    padding: 0;
    background-color: rgba(1, 1, 1, 0) !important;
  }
  .ant-checkbox-wrapper span:nth-child(1) {
    font-size: 0 !important;
    margin-right: 10rem;
  }
  .ant-form-item {
    width: 100%;
    margin-bottom: 20rem;
  }
  .ant-form-item:nth-last-child(1) {
    margin-bottom: 0;
  }
  .ant-form-item-label > label {
    font-family: AlibabaPuHuiTiR;
    font-size: 24rem;
    color: #ffffff;
    text-align: right;
  }
  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
  }
  .ant-input-affix-wrapper,
  .ant-picker {
    width: 360rem;
    height: 40rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1rem solid rgba(155, 179, 241, 0.5);
    border-radius: 2rem;
    padding-left: 20rem;
    font-family: AlibabaPuHuiTiR;
    font-size: 20rem;
    color: #ffffff;
    input,
    span {
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #ffffff;
      background-color: rgba(1, 1, 1, 0);
    }
  }
  .ant-radio-button-wrapper {
    width: 120rem;
    height: 40rem;
    background: rgba(149, 174, 255, 0.28);
    border-radius: 2rem 0rem 0rem 2rem;
    border: 0 !important;
    border-left: 0 !important;
    font-family: AlibabaPuHuiTiR;
    font-size: 20rem;
    color: #ffffff;
    text-align: center;
    text-align: center;
    line-height: 40rem;
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    width: 0;
    border-left: 0 !important;
  }
  .ant-radio-button-wrapper:hover {
    color: #fff !important;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background-color: #2c51b3;
    color: #ffffff;
  }
  input::placeholder {
    font-family: AlibabaPuHuiTiR !important;
    font-size: 20rem !important;
    color: #efeded !important;
  }
  .flood-form-btn {
    width: 110rem;
    height: 40rem;
    background: rgba(149, 174, 255, 0.28);
    border-radius: 2rem;
    margin-left: 10rem;
    font-family: AlibabaPuHuiTiR;
    font-size: 20rem;
    color: #ffffff;
    text-align: center;
  }
`;
export { LinkageFloodAlarm };
const previewPdf = async (url: string, id: string, pdfId: string) => {
  let outerElement = document.getElementById(id);
  if (outerElement) {
    outerElement.innerHTML = '';
    if (!url.length) {
      return;
    }
    let { data: blob } = await httpPdf.get(url, {
      responseType: 'blob'
    });
    blob = new Blob([blob], {
      type: 'application/pdf;chartset=UTF-8'
    });
    let fileURL = URL.createObjectURL(blob);
    var obj = document.createElement('embed');
    obj.setAttribute(
      'src',
      fileURL + '#scrollbar=0&toolbar=0&statusbar=0&view=FitH&scrollbar=false'
    );
    obj.setAttribute('type', 'application/pdf');
    obj.setAttribute('width', '100%');
    obj.setAttribute('height', '100%');
    obj.setAttribute('id', pdfId);
    obj.setAttribute('internalinstanceid', '81');
    outerElement.appendChild(obj);
  }
};
