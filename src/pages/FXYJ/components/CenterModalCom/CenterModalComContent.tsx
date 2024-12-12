import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { useStore } from '../../store';
import { RainfallStationModal } from './RainfallStationModal';
import { GaugingStationModal } from './GaugingStationModal';
import { MonitorBigger } from '../MonitorBigger';
import { FlowStationModal } from './FlowStationModal';

const CenterModalComContent = observer(() => {
  const FXYJStore = useStore();
  return (
    <Fragment>
      {/* 视频监控 */}
      {FXYJStore.modalData.type === 'monitor' ? (
        <MonitorBigger />
      ) : (
        <div>
          {/* 雨量站 */}
          {FXYJStore.modalData.type === 'RAINFALL_STATION' && (
            <RainfallStationModal
              id={FXYJStore.modalData.id}
              handleCloseModal={() => {
                FXYJStore.modalData.type = '';
                FXYJStore.modalData.isVisible = false;
                FXYJStore.modalData.style = null;
              }}
            />
          )}
          {/* 水位站 - 河道站 */}
          {FXYJStore.modalData.type === 'GAUGING_STATION_RIVER' && (
            <GaugingStationModal
              id={FXYJStore.modalData.id}
              type="GAUGING_STATION_RIVER"
              handleClose={() => {
                FXYJStore.modalData.type = '';
                FXYJStore.modalData.isVisible = false;
                FXYJStore.modalData.style = null;
              }}
            />
          )}
          {/* 水位站 - 水库站 */}
          {FXYJStore.modalData.type === 'GAUGING_STATION_RESERVOIR' && (
            <GaugingStationModal
              type="GAUGING_STATION_RESERVOIR"
              id={FXYJStore.modalData.id}
              handleClose={() => {
                FXYJStore.modalData.type = '';
                FXYJStore.modalData.isVisible = false;
                FXYJStore.modalData.style = null;
              }}
            />
          )}
          {/* 流量站 */}
          {FXYJStore.modalData.type === 'FLOW_STATION' && (
            <FlowStationModal
              id={Number(FXYJStore.modalData.id) || -1}
              handleClose={() => {
                FXYJStore.modalData.type = '';
                FXYJStore.modalData.isVisible = false;
                FXYJStore.modalData.style = null;
              }}
            />
          )}
        </div>
      )}
    </Fragment>
  );
});

export { CenterModalComContent };
