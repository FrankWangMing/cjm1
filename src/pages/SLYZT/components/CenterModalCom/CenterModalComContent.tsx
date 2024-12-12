import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { useStore } from '../../store';
import { EmbankmentModal, PondsModal } from './LittleModal';
import { ReservoirModal } from './ReservoirModal';
import { RainfallStationModal } from './RainfallStationModal';
import { GaugingStationModal } from './GaugingStationModal';
import { MonitorBigger } from './MonitorBigger';
import { FlowStationModal } from './FlowStationModal';
import { VillageModal } from './VillageModal';

const CenterModalComContent = observer(() => {
  const SLYZTStore = useStore();
  return (
    <Fragment>
      {/* 视频监控 */}
      {SLYZTStore.currModal.type === 'MONITOR_STATION' ? (
        <MonitorBigger />
      ) : (
        <div>
          {/* 雨量站 */}
          {SLYZTStore.currModal.type === 'RAINFALL_STATION' && (
            <RainfallStationModal
              id={SLYZTStore.currModal.id}
              handleCloseModal={() => {
                SLYZTStore.currModal.id = undefined;
              }}
            />
          )}
          {/* 重点村落 */}
          {SLYZTStore.currModal.type === 'IMPORTANT_VILLAGE' && (
            <VillageModal
              id={Number(SLYZTStore.currModal.id)}
              handleCloseModal={() => {
                SLYZTStore.currModal.id = undefined;
              }}
            />
          )}
          {/* 水位站 - 河道站 */}
          {SLYZTStore.currModal.type === 'GAUGING_STATION_RIVER' && (
            <GaugingStationModal
              id={SLYZTStore.currModal.id}
              type="GAUGING_STATION_RIVER"
              handleClose={() => (SLYZTStore.currModal.id = undefined)}
            />
          )}
          {/* 水位站 - 水库站 */}
          {SLYZTStore.currModal.type === 'GAUGING_STATION_RESERVOIR' && (
            <GaugingStationModal
              type="GAUGING_STATION_RESERVOIR"
              id={SLYZTStore.currModal.id}
              handleClose={() => (SLYZTStore.currModal.id = undefined)}
            />
          )}
          {/* 水库 */}
          {SLYZTStore.currModal.type === 'RESERVOIR_STATION' && (
            <ReservoirModal
              id={Number(SLYZTStore.currModal.id) || -1}
              handleClose={() => {
                SLYZTStore.currModal.id = undefined;
              }}
            />
          )}
          {/* 堤防 */}
          {SLYZTStore.currModal.type === 'EMBANKMENT_STATION' && (
            <EmbankmentModal
              id={Number(SLYZTStore.currModal.id) || -1}
              handleClose={() => {
                SLYZTStore.currModal.id = undefined;
              }}
            />
          )}
          {/* 山塘 */}
          {SLYZTStore.currModal.type === 'PONDS_STATION' && (
            <PondsModal
              id={Number(SLYZTStore.currModal.id) || -1}
              handleClose={() => {
                SLYZTStore.currModal.id = undefined;
              }}
            />
          )}
          {/* 流量站 */}
          {SLYZTStore.currModal.type === 'FLOW_STATION' && (
            <FlowStationModal
              id={Number(SLYZTStore.currModal.id) || -1}
              handleClose={() => {
                SLYZTStore.currModal.id = undefined;
              }}
            />
          )}
        </div>
      )}
    </Fragment>
  );
});

export { CenterModalComContent };
