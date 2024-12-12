/**
 * 左侧可以抽拉的图例
 */
import styled from 'styled-components';
import { IMG_PATH } from '@/utils/const';
interface LegendComLeftProp {
  width?: number;
  title: string;
}
const LegendComLeft = ({ title }: LegendComLeftProp) => {
  const RAINFALL_STATION = {
    0: IMG_PATH.markerIcon.RAINFALL_STATION,
    1: IMG_PATH.markerIcon.RAINFALL_STATION_1Level,
    2: IMG_PATH.markerIcon.RAINFALL_STATION_2Level,
    3: IMG_PATH.markerIcon.RAINFALL_STATION_3Level
    // 根据状态修正（0：0，1：0-30mm，2：30-50mm，3：>50mm）
  };
  return (
    <LegendComWrapper>
      {title === '雨情图例' ? (
        // <img
        //   src="/images/rainfall-legend.png"
        //   alt=""
        //   style={{ width: '162rem', height: '248rem' }}
        <div className="lengendBag">
          <span className="title">降雨量（mm）</span>
          <div>
            <div className="lengendItem">
              <img src={RAINFALL_STATION['0']}></img>
              <span>{'0'}</span>
            </div>
            <div className="lengendItem">
              <img src={RAINFALL_STATION['2']}></img>
              <span>{'0-50'}</span>
            </div>
            <div className="lengendItem">
              <img src={RAINFALL_STATION['3']}></img>
              <span>{'>50'}</span>
            </div>
          </div>
        </div>
      ) : (
        <img
          src="/images/river-legend.png"
          alt=""
          style={{ width: '162rem', height: '354rem' }}
        />
      )}
    </LegendComWrapper>
  );
};

const LegendComWrapper = styled.div`
  .lengendBag {
    padding: 10rem 10rem 10rem 20rem;
    height: 260rem;
    width: 172rem;
    background-image: url('/images/lengend_bg.svg');
    .title {
      margin-bottom: 10rem;
    }
    .lengendItem {
      margin: 12rem 0rem;
      img {
        margin-left: 10rem;
        margin-right: 20rem;
      }
    }
  }
  h1,
  span {
    font-family: AlibabaPuHuiTiB;
    font-size: 20rem;
    color: #ffffff;
  }
  .legend-icon_item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 40rem;
    .icon {
      width: 40rem;
      height: 40rem;
      /* margin-right: 5rem; */
    }
    margin-top: 10rem;
  }
`;

export { LegendComLeft, LegendComLeftProp };
