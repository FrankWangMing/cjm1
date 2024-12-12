/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 水利一张图 - 最近3小时风险情况
 */
import { ShowServer } from '@/service/show';
import { IMG_PATH } from '@/utils/const';
import { useMount, useSafeState } from 'ahooks';
import styled from 'styled-components';
const Wrapper = styled.div`
  /* width: calc(100vw - 980rem) !important; */
  /* 隐藏村庄淹没数据 */
  width: calc(100vw - 1100rem) !important;
  margin-left: 110rem;
  height: 82rem;
  display: flex;
  justify-content: center;
  .outer {
    /* min-width: 940rem; */
    padding: 0 20rem;
    /* position: absolute; */
    /* top: 15rem; */
    height: 82rem;
    background: linear-gradient(
      180deg,
      rgba(37, 56, 96, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    border-radius: 0rem 0rem 4rem 4rem;
    border: 1rem solid rgba(208, 242, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10rem;
  }
  .outer_img_outer {
    background: linear-gradient(
      180deg,
      rgba(37, 56, 96, 0.5) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
  .outer img {
    height: 57rem;
  }
  .outer .time {
    width: 154rem;
    text-align: center;
    line-height: 82rem;
    font-size: 20rem;
    font-family: AlibabaPuHuiTiM;
    color: #ffffff;
    border-right: 1rem solid rgba(255, 255, 255, 0.28);
  }
  .outer .risk-sum {
    width: 160rem;
    height: 100%;
    line-height: 82rem;
    font-size: 16rem;
    font-family: AlibabaPuHuiTiM;
    color: #ffffff;
    text-align: center;
    border-right: 1rem solid rgba(255, 255, 255, 0.28);
    span {
      font-size: 32rem;
      font-family: DIN-BlackItalic;
      line-height: 16rem;
      color: #ffffff;
    }
  }
  .outer .risk-split-num {
    /* width: 370rem; */
    padding: 0 20rem;
    height: 82rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16rem;
    font-family: AlibabaPuHuiTiR;
    color: #ffffff;
    /* border-right: 1rem solid rgba(255, 255, 255, 0.28); */
    img {
      width: 43rem;
      height: 38rem;
      margin-right: 10rem;
    }
  }
  .num-desc {
    line-height: 92rem;
    span {
      font-size: 32rem;
      line-height: 82rem;
      font-family: DIN-BlackItalic;
      color: #ffffff;
      margin-right: 3rem;
    }
    margin-right: 20rem;
  }
  .num-desc:nth-last-child(1) {
    margin-right: 0;
  }
  .disaster-outer {
    width: 260rem;
    height: 82rem;
    line-height: 92rem;
    display: flex;
    justify-content: center;
    font-size: 16rem;
    font-family: AlibabaPuHuiTiM;
    color: #ffffff;
    span {
      font-size: 32rem;
      line-height: 80rem;
      font-family: DIN-BlackItalic;
      color: #ffffff;
      margin-left: 12rem;
      margin-right: 3rem;
    }
  }
`;
const CurrRiskDesc = () => {
  const [loading, setLoading] = useSafeState(false);
  const [currRisk, setCurrRisk] = useSafeState<{
    riskVillageNum: {
      1: number;
      2: number;
      3: number;
    };
    disaster: {
      huCount: number;
      peopleCount: number;
    };
  }>({
    riskVillageNum: {
      1: 0,
      2: 0,
      3: 0
    },
    disaster: {
      huCount: 0,
      peopleCount: 0
    }
  });
  /**
   * 查看当前预报风险
   */
  const getCurrCaseOptions = async () => {
    setLoading(true);
    const data = await ShowServer.forecastRisk();
    console.log('3小时的风险情况', data);
    setCurrRisk({
      riskVillageNum: {
        1: data.riskList.filter(item => item.riskLevel == 1)[0].riskNum || 0,
        2: data.riskList.filter(item => item.riskLevel == 2)[0].riskNum || 0,
        3: data.riskList.filter(item => item.riskLevel == 3)[0].riskNum || 0
      },
      disaster: {
        huCount: data.household,
        peopleCount: data.people
      }
    });
    setLoading(false);
  };
  useMount(() => {
    getCurrCaseOptions();
  });

  return (
    <Wrapper>
      {!loading && (
        <div className="outer outer_img_outer">
          <div className="time">未来3小时</div>
          <div className="risk-sum">
            预计风险
            <span>
              {' ' +
                (currRisk.riskVillageNum[1] +
                  currRisk.riskVillageNum[2] +
                  currRisk.riskVillageNum[3]) +
                ' '}
            </span>
            村
          </div>
          <div className="risk-split-num">
            <img src={IMG_PATH.riskLevel[1]} alt="" />
            <div className="flex num-desc">
              <span>{currRisk.riskVillageNum[1]}</span>村
            </div>
            <img src={IMG_PATH.riskLevel[2]} alt="" />
            <div className="flex num-desc">
              <span>{currRisk.riskVillageNum[2]}</span>村
            </div>
            <img src={IMG_PATH.riskLevel[3]} alt="" />
            <div className="flex num-desc">
              <span>{currRisk.riskVillageNum[3]}</span>村
            </div>
          </div>
          {/* <div className="disaster-outer">
              预计受灾 <span>{currRisk.disaster.huCount}</span>户
              <span>{currRisk.disaster.peopleCount}</span>人
            </div> */}
        </div>
      )}
    </Wrapper>
  );
};
export { CurrRiskDesc };
