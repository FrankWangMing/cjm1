import { IVillageDetailRes, VillageServer } from '@/service/village';
import {
  MomentFormatStr,
  ShowModeProjectId,
  ShowModeTime
} from '@/utils/const';
import { useMount, useSafeState } from 'ahooks';
import moment from 'moment';
import { CloseOutlined } from '@ant-design/icons';
import { Fragment, useEffect } from 'react';
import { VillageModalWrapper } from '../../style';
import Loading from '@/components/Loading';

/**
 * 村庄弹窗
 */
interface VillageModalProps {
  id: number;
  handleCloseModal: Function;
}
const VillageModal: React.FC<VillageModalProps> = ({
  id,
  handleCloseModal
}) => {
  const [loading, setLoading] = useSafeState(false);
  const [data, setData] = useSafeState<IVillageDetailRes>();
  const getDetailOfVillage = async () => {
    setLoading(true);
    let startTime = '',
      endTime = '',
      projectId = 0,
      simulationType = 1;
    projectId = ShowModeProjectId;
    startTime = ShowModeTime.format(MomentFormatStr);
    endTime = moment(startTime).add('h', 24).format(MomentFormatStr);
    simulationType = 4;
    const res = await VillageServer.detailById(
      id,
      [projectId],
      startTime,
      endTime,
      simulationType
    );
    let data = res.villageDetails[0];
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    id && getDetailOfVillage();
  }, [id]);

  return (
    <>
      {data && (
        <Fragment>
          <div className="cus-modal-header">
            <div className="flex">{data.info.name}</div>
            <CloseOutlined
              onClick={() => {
                handleCloseModal();
              }}
              alt="关闭"
            />
          </div>
          <VillageModalWrapper>
            {loading ? (
              <Loading loadingFlag={loading} />
            ) : (
              <Fragment>
                <p>
                  辖区面积：{data.info.area ? data.info.area + 'km²' : '--'}
                </p>
                <p>防汛责任人：{data.info.manager || '--'}</p>
                <p>联系人电话：{data.info.managerPhone || '--'}</p>
                <p>户数：{data.info.huNum ? data.info.huNum + '户' : '--'}</p>
                <p>
                  总人数：
                  {data.info.peopleCount ? data.info.peopleCount + '人' : '--'}
                </p>
                <p>风险类型：{data.info.riskType || '--'}</p>
              </Fragment>
            )}
          </VillageModalWrapper>
        </Fragment>
      )}
    </>
  );
};

export { VillageModal };
