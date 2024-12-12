import { IMG_PATH } from '@/utils/const';
import { WaterResampleAnimation } from '@ys/dte';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { observer, useLocalStore } from 'mobx-react-lite';
import moment from 'moment';
import { Moment } from 'moment';
import { useEffect } from 'react';
import { Wrapper } from './style';
import styled from 'styled-components';
interface IProcessBar {
  simAnimation: WaterResampleAnimation;
  forecastTime: number;
  currentTime: {
    start: Moment;
    end: Moment;
  };
  title?: string;
  type?: string;
  isSimAnimationChange?: number;
}
let interval: any = null;
export default observer(
  ({ title, simAnimation, currentTime, forecastTime, type }: IProcessBar) => {
    const store = useLocalStore(() => ({
      isPlay: false,
      sumFrame: 0,
      left: 0,
      tickList: [''],
      canMove: false,
      circleInitLeft: 0,
      lineWidth: 0,
      isShowHoverPointer: false,
      cursorPointerPercent: 0,
      hoverTitle: '',
      cursorPointerLeft: 0
    }));

    const handlePlayFunc = {
      // 重置事件
      reset() {
        handlePlayFunc.goto(0);
        handlePercentChange(0);
      },
      // 重置事件
      pause() {
        simAnimation.pause();
        store.isPlay = false;
        clearInterval(interval);
      },
      // 开始播放
      play() {
        simAnimation?.play();
        interval = setInterval(() => {
          handleStepChange();
          // GlobalStore.map.setPointer();
        }, 80);
        store.isPlay = true;
      },
      // 前进事件
      forward() {
        simAnimation?.forward();
        handlePlayFunc.pause();
        handleStepChange();
      },
      // 后退事件
      backward() {
        simAnimation?.backward();
        handlePlayFunc.pause();
        handleStepChange();
      },
      // 跳转到某一帧
      goto(frame: number) {
        handlePlayFunc.pause();
        simAnimation?.goto(frame);
      }
    };

    /**
     * 处理播放的事件
     */
    // 步骤发生变化
    const handleStepChange = () => {
      if (simAnimation && simAnimation?._sumFrames > 1) {
        let currFrame = simAnimation.getCurrentFrameIndex(); // 获取当前帧数
        console.log('播放', currFrame, simAnimation?._sumFrames);
        let percent = currFrame / simAnimation?._sumFrames;
        handlePercentChange(percent);
        if (currFrame == simAnimation?._sumFrames - 1) {
          handlePercentChange(1);
          setTimeout(() => {
            handlePlayFunc.reset();
          }, 1500);
        }
      }
    };

    useEffect(() => {
      if (simAnimation) {
        console.log('拖动 的frame', 'simAnimation发生变化', simAnimation);
        handleStepChange();
        store.isPlay = true;
        handlePlayFunc.pause();
      }
    }, [simAnimation]);

    // useUpdateEffect(() => {
    //   if (simAnimation) {
    //     handleStepChange();
    //     store.isPlay = true;
    //     handlePlayFunc.pause();
    //   }
    // }, [isSimAnimationChange]);

    /**
     * 鼠标事件处理
     */
    const mouseEventHandleObj = {
      // 鼠标点击
      down() {
        store.canMove = true;
      },
      // 鼠标松开
      up() {
        if (store.canMove) {
          store.canMove = false;
        }
      },
      move(e: any) {
        if (store.canMove) {
          var mouseMoveX = e.pageX - store.circleInitLeft;
          handleCircleMove(mouseMoveX);
        }
      }
    };

    const handleCircleMove = (mouseMoveX: number) => {
      let tempData = 0;
      let { lineWidth, circleInitLeft } = getLineWidth();
      if (mouseMoveX > lineWidth) {
        tempData = lineWidth;
      } else if (mouseMoveX < 0) {
        tempData = 0;
      } else {
        tempData = mouseMoveX;
      }
      let tempPercent = tempData / lineWidth;
      let gotoFrame = Number(
        (tempPercent * simAnimation?._sumFrames).toFixed(0)
      );
      console.log(
        '拖动 的frame',
        gotoFrame,
        tempPercent,
        simAnimation?._sumFrames,
        simAnimation
      );
      handlePlayFunc.goto(gotoFrame);
      handlePercentChange(tempPercent);
    };

    const handleClickLine = (e: any) => {
      var mouseMoveX = e.pageX - store.circleInitLeft;
      handleCircleMove(mouseMoveX);
    };
    useMount(() => {
      if (simAnimation) {
        document.body.addEventListener('mousemove', mouseEventHandleObj.move);
        document.body.addEventListener('mouseup', mouseEventHandleObj.up);
        let durationMinutes = (forecastTime * 60) / 6;
        store.tickList = [];
        let tempTickList: string[] = [];
        for (let i = 0; i <= 6; i++) {
          let asd = moment(currentTime.start)
            .add(i * durationMinutes, 'minutes')
            .format(type ? 'HH:mm' : 'HH:mm MM/DD');
          tempTickList.push(asd);
        }
        store.tickList = tempTickList;
      } else {
        return;
      }
    });

    useUnmount(() => {
      if (interval) {
        clearInterval(interval);
      }
    });

    const handlePercentChange = percent => {
      if (percent > 1) {
        percent = 1;
      }
      if (percent < 0) {
        percent = 0;
      }
      let percentNew = percent;
      let tempLeft = percentNew * (getLineWidth().lineWidth - 10);
      store.left = tempLeft;
    };

    const getLineWidth = (): { circleInitLeft: number; lineWidth: number } => {
      let tempVal = document.getElementById('line')?.getBoundingClientRect();
      store.circleInitLeft = tempVal?.left || 0;
      store.lineWidth = tempVal?.width || 0;
      return {
        circleInitLeft: tempVal?.left || 0,
        lineWidth: tempVal?.width || 0
      };
    };

    /**
     * 鼠标浮动在line-outer上的处理事件。
     * @param e
     * @returns
     */
    const lineHover = (e: any) => {
      store.isShowHoverPointer = true;
      let { lineWidth, circleInitLeft } = getLineWidth();
      // console.log('lineWidth', e.pageX, circleInitLeft);
      var mouseMoveX = e.pageX - circleInitLeft;
      let tempPercent = mouseMoveX / lineWidth;
      let percent = tempPercent > 1 ? 1 : tempPercent < 0 ? 0 : tempPercent;
      store.cursorPointerPercent = percent;
      // 开始时间和结束时间的间隔
      let durationNum = moment
        .duration(currentTime.end.diff(currentTime.start))
        .as('minutes');
      let hoverTime: string | null = moment(currentTime.start)
        .add('minutes', durationNum * percent)
        .format(type ? 'HH:mm' : 'YYYY/MM/DD HH:mm');
      store.hoverTitle = hoverTime;
      hoverTime = null;
      store.cursorPointerLeft = percent * lineWidth;
    };
    return (
      <Wrapper>
        <div className="operator-outer">
          <div className="operator-btn-outer">
            {store.isPlay ? (
              <div onClick={handlePlayFunc.pause}>
                <img src={IMG_PATH.process.pause} alt="暂停" />
                <p>暂停</p>
              </div>
            ) : (
              <div onClick={handlePlayFunc.play}>
                <img src={IMG_PATH.process.play} alt="播放" />
                <p>播放</p>
              </div>
            )}
          </div>
          <div className="operator-btn-outer" onClick={handlePlayFunc.reset}>
            <img src={IMG_PATH.process.replay} alt="重置" />
            <p>重置</p>
          </div>
          {title && <div className="title">{title}</div>}
        </div>
        <div
          className="outer"
          onClick={handleClickLine}
          onMouseMove={lineHover}
          onMouseLeave={() => {
            setTimeout(() => {
              store.isShowHoverPointer = false;
            }, 100);
          }}>
          <CircleMoveCom
            left={store.left}
            downFunc={mouseEventHandleObj.down}
            isShowHoverPointer={store.isShowHoverPointer}
            cursorPointerLeft={store.cursorPointerLeft}
            hoverTitle={store.hoverTitle}
          />
          <div className="degree-list-outer">
            {store.tickList.map((item, key) => {
              return (
                <div className="degree-item" key={key}>
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="operator-outer without-title">
          <div className="operator-btn-outer" onClick={handlePlayFunc.backward}>
            <img src={IMG_PATH.process.back} alt="后退" />
            <p>后退</p>
          </div>
          <div className="operator-btn-outer" onClick={handlePlayFunc.forward}>
            <img src={IMG_PATH.process.front} alt="前进" />
            <p>前进</p>
          </div>
        </div>
      </Wrapper>
    );
  }
);
interface ICircleMoveComProp {
  left: number;
  downFunc: Function;
  isShowHoverPointer: boolean;
  cursorPointerLeft: number;
  hoverTitle: string;
}
const CircleMoveCom = (props: ICircleMoveComProp) => {
  return (
    <CircleMoveWrapper
      cursorPointerLeft={props.cursorPointerLeft}
      left={props.left}>
      <div className="line" id="line">
        <div
          className="curr-circle"
          onMouseDown={() => {
            props.downFunc();
          }}></div>
        {props.isShowHoverPointer && (
          <div className="hover-pointer">{props.hoverTitle}</div>
        )}
      </div>
    </CircleMoveWrapper>
  );
};

const CircleMoveWrapper = styled.div<{
  left: number;
  cursorPointerLeft: number;
}>`
  .line {
    width: 97%;
    margin-left: 1%;
    cursor: pointer;
    height: 5px;
    background: rgba(255, 255, 255, 0.24);
    /* border-radius: 10px; */
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    position: relative;
    transition: all 200ms;
    .curr-circle {
      position: absolute;
      left: ${props => props.left - 5 + 'px'};
      top: -5px;
      z-index: 5;
      width: 12px;
      height: 12px;
      background-image: linear-gradient(
        0deg,
        rgba(0, 152, 214, 0.9) 0%,
        rgba(11, 72, 99, 0.9) 100%
      );
      border-radius: 50%;
      cursor: pointer;
      border: 1px #fff solid;
    }
    .curr-circle::after {
      content: ' ';
      position: absolute;
      left: ${props => -props.left + 5 + 'px'};
      border-radius: 10px;
      top: 3px;
      width: ${props => props.left - 5 + 'px'};
      height: 5px;
      background-image: linear-gradient(270deg, #49c8ff 0%, #2b75d2 100%);
    }
    .hover-pointer {
      min-width: 50px;
      padding: 0 10px;
      border-radius: 10px;
      height: 30px;
      color: #fff;
      background-color: #0078d495;
      text-align: center;
      line-height: 30px;
      position: absolute;
      top: -40px;
      left: ${props =>
        (props.cursorPointerLeft > 822
          ? props.cursorPointerLeft - 200
          : props.cursorPointerLeft - 80) + 'px'};
    }
  }
`;
