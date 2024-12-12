// 视频监控组件
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  RightOutlined,
  LeftOutlined
} from '@ant-design/icons';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useSafeState } from 'ahooks';
import { WeatherServer } from '@/service/index';
import { PanelHeader } from '@/components/Header';
import { Wrapper } from './style';
import { observer, useLocalStore } from 'mobx-react-lite';
import { Carousel } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { useStore } from '@/pages/SLYZT/store';
interface currModalType {
  id: string | number | undefined;
  type: string | undefined;
}
const VideoMonitor: React.FC<{
  handleEnLarge: Function;
  handleCarouselChange: Function;
  handleClickMonitorByIndex: Function;
  currMonitorInfo: monitorBaseInfo | undefined;
  monitorBaseInfo: Array<monitorBaseInfo>;
  currModal: currModalType;
}> = observer(
  ({
    handleEnLarge,
    currMonitorInfo,
    monitorBaseInfo,
    handleCarouselChange,
    handleClickMonitorByIndex,
    currModal
  }) => {
    const ref = useRef<CarouselRef | null>(null);
    return (
      <Wrapper>
        {/* 视频监控 */}
        <div className="video-monitor">
          <div className="common-header-outer">
            <PanelHeader
              title={'视频监控'}
              OperationFc={
                <OperationCom
                  handleEnLarge={handleEnLarge}
                  currModal={currModal}
                />
              }
            />
          </div>
          <div className="video-monitor-content bg-content-area-alpha">
            <div className="flex-between" style={{ display: 'none' }}>
              <p>{currMonitorInfo?.title}</p>
              {/* <div
              className="view-all-btn flex-center"
              onClick={handleEnLarge}>{`查看全部 >>`}</div> */}
            </div>
            <div className="cus-carousel-outer">
              {monitorBaseInfo.length > 0 ? (
                <Fragment>
                  <Carousel
                    dots={false}
                    ref={ref}
                    afterChange={() => {
                      handleCarouselChange;
                    }}>
                    {monitorBaseInfo.map(item => {
                      return (
                        <>
                          {' '}
                          <div className="flex-between">
                            <p>{item.title}</p>
                          </div>
                          <div
                            key={item.id}
                            onClick={() => {
                              handleClickMonitorByIndex;
                            }}>
                            <img src={item.path} alt={item.title} />
                          </div>
                        </>
                      );
                    })}
                  </Carousel>
                  <div
                    className="cur-carousel-operation cur-carousel-operation-left flex-center"
                    onClick={() => {
                      ref.current?.prev();
                    }}>
                    <LeftOutlined />
                  </div>
                  <div
                    className="cur-carousel-operation cur-carousel-operation-right flex-center"
                    onClick={() => {
                      ref.current?.next();
                    }}>
                    <RightOutlined />
                  </div>
                </Fragment>
              ) : (
                <>暂无数据</>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
);
/**
 * 标题栏目的右上角操作栏目
 * @returns
 */

interface OperationComProp {
  handleEnLarge: Function;
  currModal: currModalType;
}
const OperationCom = observer((props: OperationComProp) => {
  return (
    <div
      style={{
        position: 'absolute',
        right: '20rem',
        cursor: 'pointer',
        fontSize: '30rem'
      }}
      onClick={() => {
        props.handleEnLarge();
      }}>
      {props.currModal?.type == 'MONITOR_STATION' ? (
        <FullscreenExitOutlined />
      ) : (
        <FullscreenOutlined />
      )}
    </div>
  );
});
export { VideoMonitor };
