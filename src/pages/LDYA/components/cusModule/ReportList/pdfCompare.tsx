import { PanelHeader } from '@/components/Header';
import { BriefPDF } from '@/components/PDFCom';
import { useSafeState } from 'ahooks';
import { Form, Select } from 'antd';
import styled from 'styled-components';

interface compareProps {
  changeType: (type: string) => void;
  data: {
    createdAt: string;
    foresight: number;
    id: number;
    pdfName: string;
  }[];
  forecastTime: number;
  isHaveRiskVillage: boolean;
  url: {
    duration: string;
    maxDepth: string;
  };
  loading: {
    duration: boolean;
    maxDepth: boolean;
  };
}

function PdfCompare(props: compareProps) {
  // todo 目前isHaveRiskVillage 共用一个值
  const { changeType, data, forecastTime, isHaveRiskVillage, url, loading } =
    props;

  const Content = ({ defaultValue }) => {
    const [form] = Form.useForm();
    const [pdfNumber, setPdfNymber] = useSafeState(defaultValue);
    return (
      <ContentWrapper>
        <div className="plan-select">
          方案选择:
          <Select
            defaultValue={pdfNumber}
            options={data.map(item => ({
              label: item.pdfName,
              value: item.id
            }))}
            onChange={v => setPdfNymber(v)}
          />
        </div>
        <div className="pdf-content">
          <BriefPDF
            pdfNumber={pdfNumber}
            form={form}
            forecastTime={forecastTime}
            isHaveRiskVillage={isHaveRiskVillage}
            url={url}
            loading={loading}
            handleBriefIsOk={() => {}}
          />
        </div>
      </ContentWrapper>
    );
  };

  return (
    <>
      <div className="half-item">
        <div className="content-inner-header">
          <PanelHeader
            title="调度方案1"
            size="superLarge"
            OperationFc={
              <ImgWrapper
                src="/images/back.svg"
                onClick={() => {
                  changeType('pdfShow');
                }}
              />
            }
          />
        </div>
        <Content defaultValue={data[0].id} />
      </div>
      <div className="half-item">
        <div className="content-inner-header">
          <PanelHeader title="调度方案2" size="superLarge" />
        </div>
        <Content defaultValue={data[1].id} />
      </div>
    </>
  );
}

const ImgWrapper = styled.img`
  width: 24rem;
  height: 24rem;
  z-index: 99;
  position: absolute;
  right: 10rem;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  height: 800rem;
  padding: 10rem 30rem;
  background-image: linear-gradient(
    180deg,
    rgba(0, 13, 17, 0.45) 0%,
    rgba(40, 49, 53, 0.9) 100%
  );
  .plan-select {
    font-family: WeiRuanYaHei;
    font-weight: bold;
    font-size: 14rem;
    color: #ffffff;
    line-height: 19rem;
    text-align: left;
    font-style: normal;
  }

  .pdf-content {
    margin-top: 10rem;
    height: 730rem;
  }
  .ant-select {
    width: 200rem;
    height: 28rem;
    color: rgba(255, 255, 255, 0.8);
    margin-left: 10rem;

    :not(.ant-select-customize-input) .ant-select-selector {
      border: 1px solid rgba(80, 253, 255, 0.5);
    }

    .ant-select-selector {
      height: 28rem !important;
      background: #020623 !important;
    }

    .ant-select-selection-search {
      height: 28rem;
      line-height: 28rem;
    }

    .ant-select-selection-item {
      height: 28rem;
      line-height: 28rem !important;
    }

    .ant-select-arrow {
      color: white;
    }
  }
`;

export default PdfCompare;
