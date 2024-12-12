/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 堤防弹窗 & 山塘弹窗
 */
import { Fragment, useEffect } from 'react';
import { useSafeState } from 'ahooks';
import Loading from '@/components/Loading';

import { ShowServer } from '@/service/show';
import { CloseOutlined } from '@ant-design/icons';
import { EmbankmentModalWrapper, PondsModalWrapper } from '../../style';

export { EmbankmentModal, PondsModal };
/**
 * 堤防弹窗
 */
interface IEmbankmentModal {
  id: number;
  handleClose: Function;
}
const EmbankmentModal: React.FC<IEmbankmentModal> = ({ id, handleClose }) => {
  const [loading, setLoading] = useSafeState(false);
  const [data, setData] = useSafeState<IEmbankmentStationDetail>();
  const getEmbankmentDetailById = async () => {
    setLoading(true);
    const data = await ShowServer.embankmentStation.getById(id);
    setData(data);
    setLoading(false);
  };
  useEffect(() => {
    id != -1 && getEmbankmentDetailById();
  }, [id]);
  return (
    <Fragment>
      <div className="cus-modal-header">
        <div>{`${data?.name}`}</div>
        <CloseOutlined onClick={() => handleClose()} alt="关闭" />
      </div>
      <EmbankmentModalWrapper>
        {loading ? (
          <Loading loadingFlag={loading} />
        ) : (
          <Fragment>
            <p>堤防类型：{data?.type}</p>
            <p>堤防级别：{data?.level} 级</p>
            <p>堤段长度：{data?.length}（m）</p>
            <p>防洪标准：{data?.floodStandard} 年一遇</p>
            <p>堤防型式：{data?.pattern}</p>
          </Fragment>
        )}
      </EmbankmentModalWrapper>
    </Fragment>
  );
};

/**
 * 山塘弹窗
 */
interface IPondsModal {
  id: number;
  handleClose: Function;
}
const PondsModal: React.FC<IPondsModal> = ({ id, handleClose }) => {
  const [data, setData] = useSafeState<IPondsStationDetail>();
  const [loading, setLoading] = useSafeState(false);
  const getPondsDetailById = async () => {
    setLoading(true);
    const data = await ShowServer.pondStation.getById(id);
    setData(data);
    setLoading(false);
  };
  useEffect(() => {
    id != -1 && getPondsDetailById();
  }, [id]);
  return (
    <Fragment>
      <div className="cus-modal-header">
        <div>{data?.name}</div>
        <CloseOutlined onClick={() => handleClose()} alt="关闭" />
      </div>
      <PondsModalWrapper>
        {loading ? (
          <Loading loadingFlag={loading} />
        ) : (
          <Fragment>
            <div className="side-outer">
              <p>位置：{data?.location}</p>
              <p>类别：{data?.type}</p>
              {/* <p>主要功能：{contentObj.mainFunction}</p>供水、灌溉 */}
              <p>主要功能：供水、灌溉</p>
              <p>集雨面积：{data?.rcdsArea} km²</p>
              {/* <p>总容积：{contentObj.totalVol} 万m³</p> */}
            </div>
            <div>
              <p>主流长度：{data?.mainRiverLen} km</p>
              <p>影响区域：{data?.affeArea} km²</p>
              <p>影响人口：{data?.affePopu} 人</p>
              <p>灌溉面积：{data?.irrigArea} 亩</p>
            </div>
          </Fragment>
        )}
      </PondsModalWrapper>
    </Fragment>
  );
};
