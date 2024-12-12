/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 监控弹窗
 */
import { Fragment } from 'react';
import { message } from 'antd';
import styled from 'styled-components';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { MonitorServer } from '@/service';
import { observer, useLocalStore } from 'mobx-react-lite';
import GlobalStore from '@/store';
import { useStore } from '../store';

// 视频监控点位
export const MonitorBigger = observer(() => {
  const DevicesStore = useStore();
  const store = useLocalStore(
    (): {
      currBaseInfo: MonitorAllInfo | undefined;
      createPlayer: Function;
      // @ts-ignore
      player: window.JSPlugin | undefined;
      realPlayUrl: string;
      play: Function;
      closePlay: Function;
      wholeFullScreen: Function;
      /* 放大 */
      enlarge: Function;
      /* 缩小 */
      enlargeClose: Function;
      /* 截屏 */
      capture: Function;
      monitorBaseInfo: MonitorAllInfo[];
      isExpand: boolean;
      isMonitorAction: boolean;
      monitorActionDirection: string;
      isPlayOk: boolean;
      platformUrl: string;
    } => ({
      currBaseInfo: undefined,
      player: undefined,
      realPlayUrl: '',
      createPlayer(id: string) {
        // @ts-ignore
        this.player = new window.JSPlugin({
          szId: id, // /需要英文字母开头 必填
          szBasePath: '/h5player/', // 必填,引用H5player.min.js的js相对路径
          iMaxSplit: 4, // 分屏播放，默认最大分屏 4*4
          iCurrentSplit: 1, // 当前分屏数量1，
          openDebug: false, // 是否打开debug调试窗口
          // 样式
          oStyle: {
            border: '#343434',
            borderSelect: '#FFCC00',
            background: '#000'
          }
        });
        // 事件回调绑定
        this.player.JS_SetWindowControlCallback({
          // 选中窗口回调时间
          windowEventSelect: function (iWndIndex) {
            console.log('windowSelect callback: ', iWndIndex);
          },
          pluginErrorHandler: function (iWndIndex, iErrorCode, oError) {
            //插件错误回调
            store.closePlay();
            console.log(
              'pluginError callback: ',
              iWndIndex,
              iErrorCode,
              oError
            );
          },
          windowEventOver: function (iWndIndex) {
            //鼠标移过回调
            //console.log(iWndIndex);
          },
          windowEventOut: function (iWndIndex) {
            //鼠标移出回调
            //console.log(iWndIndex);
          },
          windowEventUp: function (iWndIndex) {
            //鼠标mouseup事件回调
            //console.log(iWndIndex);
          },
          windowFullCcreenChange: function (bFull) {
            //全屏切换回调
            console.log('fullScreen callback: ', bFull);
          },
          firstFrameDisplay: function (iWndIndex, iWidth, iHeight) {
            //首帧显示回调
            console.log(
              'firstFrame loaded callback: ',
              iWndIndex,
              iWidth,
              iHeight
            );
          },
          performanceLack() {
            //性能不足回调
            store.closePlay();
            console.log('performanceLack callback: ');
          }
        });
      },
      isPlayOk: false,
      play() {
        let index = this.player.currentWindowIndex;
        let mode = 0; // 0:普通模式 1:高级模式
        this.player
          .JS_Play(this.realPlayUrl, { playURL: this.realPlayUrl, mode }, index)
          .then(
            () => {
              message.success('开始播放');
              this.isPlayOk = true;
            },
            e => {
              this.isPlayOk = false;
              console.error(e);
              message.error('开始播放失败');
            }
          );
      },
      closePlay() {
        this.isPlayOk = false;
        this.player?.JS_StopRealPlayAll();
      },
      wholeFullScreen() {
        this.player?.JS_FullScreenDisplay(true).then(
          () => {
            console.log(`wholeFullScreen success`);
          },
          e => {
            console.error(e);
          }
        );
      },
      enlarge() {},
      enlargeClose() {},
      capture(imageType = 'JPEG') {
        let player = this.player,
          index = player.currentWindowIndex;
        player.JS_CapturePicture(index, 'img', imageType).then(
          () => {
            console.log('capture success', imageType);
          },
          e => {
            console.error(e);
          }
        );
      },
      monitorBaseInfo: [],
      isExpand: true,
      isMonitorAction: false,
      monitorActionDirection: '',
      platformUrl: ''
    })
  );

  /**
   * 获取所有视频监控的基本信息
   */
  const getAllMonitorBaseInfo = async () => {
    const data = await MonitorServer.getAllCameras();
    console.log('视频监控 - 所有图片相关数据', data);
    store.monitorBaseInfo = data.cameras;
  };

  /**
   * 当前播放的内容相关
   */
  const getMonitorById = async (id: number) => {
    DevicesStore.selectedId = id;
    store.closePlay();
    let currBaseInfo = store.monitorBaseInfo.filter(item => {
      return item.cameraId == id;
    })[0];
    store.currBaseInfo = currBaseInfo;
    const { url } = await MonitorServer.getPreviewUrl(id);
    store.realPlayUrl = url;
    store.play();
  };

  useUpdateEffect(() => {
    if (DevicesStore.selectedId && DevicesStore.selectedId != -1)
      getMonitorById(DevicesStore.selectedId as number);
  }, [DevicesStore.selectedId]);

  useMount(async () => {
    await getAllMonitorBaseInfo();
    store.createPlayer('monitor-outer');
    getMonitorById(DevicesStore.selectedId as number);
    window.addEventListener('resize', () => {
      store.player.JS_Resize();
    });
    store.closePlay(); // 关闭所有播放；
  });
  useUnmount(() => {
    store.closePlay();
  });
  /**
   * 双击视频监控，定位到某个监控点位
   * @param item
   */
  const handleMonitorDoubleClick = item => {
    getMonitorById(item.cameraId);
    GlobalStore.map_flyTo({
      center: [item.longitude, item.latitude],
      zoom: 16,
      pitch: 65
    });
  };

  return (
    <Fragment>
      <div className="flex-between cus-modal-header">
        <div>{store.currBaseInfo?.districtName}</div>
      </div>
      <MonitorBiggerWrapper isExpand={store.isExpand}>
        <div className="monitor-content-outer" id="monitor-content-outer">
          <div style={{ position: 'relative' }}>
            <div id="monitor-outer" className="monitor-outer"></div>
            <div
              style={{
                position: 'absolute',
                bottom: '10rem',
                left: '10rem',
                padding: '5rem 10rem',
                borderRadius: '5rem',
                color: '#fff',
                backgroundColor: '#13393e'
              }}>
              水尺基准点高程：{store.currBaseInfo?.baseAltitude} m
            </div>
          </div>
        </div>
      </MonitorBiggerWrapper>
    </Fragment>
  );
});

const MonitorBiggerWrapper = styled.div<{ isExpand: boolean }>`
  width: 100%;
  height: 500rem;
  position: relative;
  img {
    width: 100%;
  }
  .monitor-content-outer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 438rem;
    .monitor-outer {
      z-index: 99999;
      width: ${props => (props.isExpand ? '620rem' : '780rem')};
      height: 400rem;
    }
    .monitor-controls {
      position: absolute;
      top: 0;
      right: 0;
      width: 130rem;
      height: 130rem;
      z-index: 999;
      color: #2c51b3;
      font-size: 30rem;
      background-image: url('/images/monitor_control/monitor_operation-outer.png');
      background-size: 100%;
      img {
        cursor: pointer;
        width: 22rem;
        height: 22rem;
      }
    }
    .monitor-content-playlist {
      width: 200rem;
      height: 400rem;
      position: relative;
      display: flex;
      .monitor-content-playlist-item {
        width: 100%;
        height: 38rem;
        line-height: 38rem;
        text-align: center;
        font-size: 16rem;
        font-family: AlibabaPuHuiTiM;
        color: #ffffff;
        background-color: pink;
        background: rgba(149, 174, 255, 0.24);
        cursor: pointer;
      }
      .monitor-content-playlist-item_selected,
      .monitor-content-playlist-item:hover {
        background-color: #228be6 !important;
      }
      .monitor-content-playlist-item:nth-child(2n + 1) {
        background: rgba(149, 174, 255, 0.08);
      }
      .monitor-content-playlist_content {
        width: 100%;
        height: calc(100% - 38rem);
        margin-top: 38rem;
        overflow-y: scroll;
      }
      .monitor-content-playlist_header {
        position: absolute;
        top: 0;
        display: flex;
        justify-content: space-between;
        background: rgba(149, 174, 255, 0.24);
        padding-left: 10rem;
      }
      .monitor-content-playlist_header:hover {
        background: rgba(149, 174, 255, 0.24) !important;
      }
    }
    .border-line {
      width: 1rem;
      height: 400rem;
      background: linear-gradient(
        180deg,
        rgba(188, 224, 255, 0.1) 0%,
        #b9d1ff 51%,
        rgba(188, 224, 255, 0.1) 100%
      );
    }
    .control {
      width: 38rem;
      height: 38rem;
      background: #2c51b3;
      cursor: pointer;
      font-size: 25rem;
      color: #fff;
      text-align: center;
    }
    .column-text {
      width: 38rem;
      font-size: 18rem;
      font-family: AlibabaPuHuiTiM;
      color: #ffffff;
      line-height: 22rem;
      margin-top: 10rem;
      p {
        text-align: center;
      }
    }
  }
  .monitor-operation-outer {
    justify-content: space-between !important;
    position: absolute;
    padding: 0 20rem;
    bottom: 0;
    width: 100%;
    height: 64rem;
    background: linear-gradient(180deg, rgba(0, 5, 17, 0.5) 0%, #282c35 100%);
    border-radius: 0rem 0rem 4rem 4rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .platform_url_link {
      color: #fff;
      cursor: pointer;
    }
    .platform_url_link:hover {
      color: #2c51b3;
    }
    .monitor-operation-btn {
      transition: all 300ms;
      width: 80rem;
      height: 40rem;
      border-radius: 4rem;
      cursor: pointer;
      font-size: 20rem;
      font-family: AlibabaPuHuiTiR;
      color: #333333;
      background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
      opacity: 0.8;
      border: 1px solid #93b6e6;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
    }
    .monitor-operation-btn:hover,
    monitor-operation-btn:active {
      opacity: unset;
    }
    .monitor-operation-btn:nth-child(2n) {
      margin: 0 10rem;
    }
  }
`;
