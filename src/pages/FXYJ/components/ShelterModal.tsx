import { AlarmServer } from '@/service';
import { useSafeState } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { useStore } from '../store';
import { IShelterDetail } from '@/domain/marker';
import Loading from '@/components/Loading';
/**
 * 安置场所弹窗
 */
interface Props {
  id: number;
}
const ShelterModal = observer(({ id }: Props) => {
  const store = useStore();
  const [data, setData] = useSafeState<IShelterDetail>();
  const [loading, setLoading] = useSafeState(false);
  const getData = async () => {
    setLoading(true);
    const data = await AlarmServer.shelter.detail(id);
    store.modalData.title = data.name;
    store.modalData.style = {
      width: '600rem',
      left: 'calc(50vw - 300rem)',
      top: '200rem'
    };
    setData(data);
    setLoading(false);
  };
  useEffect(() => {
    if (id != -1 && store.modalData.type === 'shelter') {
      getData();
    }
  }, [id]);
  return (
    <Wrapper>
      {loading ? (
        <Loading loadingFlag={loading} />
      ) : (
        <Fragment>
          <div>场所名称：{data?.name}</div>
          <div>场所地址：{data?.address}</div>
          <div>场所面积：{data?.area}</div>
          <div>容纳人数：{data?.capacity}</div>
          <div>房屋竣工时间：{data?.completionTime}</div>
          <div>房屋结构：{data?.structure}</div>
          <div>是否使用预制板：{data?.isPrefabricated}</div>
          <div>房屋是否鉴定：{data?.isAppraised}</div>
          <div>房屋鉴定报告：{data?.appraisalReport}</div>
        </Fragment>
      )}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  min-height: 300rem;
  border-radius: 4rem;
  padding: 10rem;
  div {
    width: 100%;
    height: 42rem;
    line-height: 42rem;
    padding-left: 10rem;
    font-size: 18rem;
    font-family: WeiRuanYaHei;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.24);
    margin-bottom: 4rem;
  }
  div:nth-child(odd) {
    background: rgba(255, 255, 255, 0.08);
  }
`;
export { ShelterModal };
