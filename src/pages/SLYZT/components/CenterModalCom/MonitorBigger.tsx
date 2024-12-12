/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 监控弹窗
 */
import { Fragment, useEffect } from 'react';
import { message } from 'antd';
import styled from 'styled-components';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { MonitorServer } from '@/service';
import { observer, useLocalStore } from 'mobx-react-lite';
import GlobalStore from '@/store';
import { CloseOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

// 视频监控点位
export const MonitorBigger = observer(() => {
  const SLYZTStore = useStore();
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
      /* 摄像头巡航控制 */
      cameraControl: Function;
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
        // .then(
        //   () => {
        //     // message.info('关闭所有实时播放');
        //   },
        //   err => {}
        // )
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
      async cameraControl(index: number, command: string) {
        await MonitorServer.controlCruise(
          Number(SLYZTStore.currModal.id),
          command,
          index
        );
      },
      monitorBaseInfo: [],
      isExpand: true,
      isMonitorAction: false,
      monitorActionDirection: '',
      platformUrl: ''
    })
  );

  const handleExpand = () => {
    store.isExpand = !store.isExpand;
    store.player.JS_Resize();
  };
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
    SLYZTStore.currModal.id = id;
    store.closePlay();
    let currBaseInfo = store.monitorBaseInfo.filter(item => {
      return item.cameraId == id;
    })[0];
    store.currBaseInfo = currBaseInfo;
    const { url } = await MonitorServer.getPreviewUrl(id);
    store.realPlayUrl = url;
    store.play();
  };

  const controlPTZ = async (ptzCmd: string) => {
    let cameraId = SLYZTStore.currModal.id as number;
    await MonitorServer.controlMonitorPTZById(0, cameraId, ptzCmd);
    await MonitorServer.controlMonitorPTZById(1, cameraId, ptzCmd);
  };

  useUpdateEffect(() => {
    if (SLYZTStore.currModal.id && SLYZTStore.currModal.id != -1)
      getMonitorById(SLYZTStore.currModal.id as number);
  }, [SLYZTStore.currModal.id]);

  useMount(async () => {
    await getAllMonitorBaseInfo();
    store.createPlayer('monitor-outer');
    getMonitorById(SLYZTStore.currModal.id as number);
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

  useEffect(() => {
    SLYZTStore.isEnLargeMonitor && store.wholeFullScreen();
  }, [SLYZTStore.isEnLargeMonitor]);

  const ControlImg = {
    top: '/images/monitor_control/top.png',
    bottom: '/images/monitor_control/bottom.png',
    left_top: '/images/monitor_control/left_top.png',
    left_bottom: '/images/monitor_control/left_bottom.png',
    left: '/images/monitor_control/left.png',
    right_bottom: '/images/monitor_control/right_bottom.png',
    right_top: '/images/monitor_control/right_top.png',
    right: '/images/monitor_control/right.png',
    reset: '/images/monitor_control/reset.png',
    enLarge: '/images/monitor_control/enlarge.png',
    enSmall: '/images/monitor_control/enSmall.png'
  };

  return (
    <Fragment>
      <div className="flex-between cus-modal-header">
        <div>{store.currBaseInfo?.districtName}</div>
        <div className="flex-center">
          <div
            style={{
              cursor: 'pointer',
              width: '21rem',
              height: '19rem',
              borderRadius: '1rem',
              border: '2rem solid #FFFFFF',
              marginRight: '15rem'
            }}
            onClick={() => {
              SLYZTStore.isEnLargeMonitor = Math.random();
            }}></div>
          <CloseOutlined
            onClick={() => (SLYZTStore.currModal.id = undefined)}
            alt="关闭"
          />
        </div>
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
                // zIndex: '999',
                padding: '5rem 10rem',
                borderRadius: '5rem',
                color: '#fff',
                backgroundColor: '#13393e'
              }}>
              水尺基准点高程：{store.currBaseInfo?.baseAltitude} m
            </div>
            {store.isPlayOk && (
              <div className="monitor-controls">
                <div
                  className="flex-center"
                  style={{
                    height: '25rem'
                  }}>
                  <img
                    src={ControlImg.top}
                    onClick={() => {
                      controlPTZ('UP');
                    }}
                  />
                </div>
                <div
                  className="flex-between"
                  style={{ width: '70%', marginLeft: '15%' }}>
                  <img
                    src={ControlImg.left_top}
                    onClick={() => {
                      controlPTZ('LEFT_UP');
                    }}
                  />
                  <img
                    src={ControlImg.right_top}
                    onClick={() => {
                      controlPTZ('RIGHT_UP');
                    }}
                  />
                </div>
                <div
                  className="flex-between"
                  style={{
                    width: '90%',
                    marginLeft: '5%',
                    height: '35rem'
                  }}>
                  <img
                    src={ControlImg.left}
                    onClick={() => {
                      controlPTZ('LEFT');
                    }}
                  />
                  <img
                    src={ControlImg.reset}
                    onClick={() => {
                      store.cameraControl(1, 'STOP_CRUISE');
                    }}
                    style={{ width: '38rem', height: '38rem' }}
                  />
                  <img
                    src={ControlImg.right}
                    onClick={() => {
                      controlPTZ('RIGHT');
                    }}
                  />
                </div>
                <div
                  className="flex-between"
                  style={{ width: '70%', marginLeft: '15%', height: '30rem' }}>
                  <img
                    src={ControlImg.left_bottom}
                    onClick={() => {
                      controlPTZ('LEFT_DOWN');
                    }}
                  />
                  <img
                    src={ControlImg.right_bottom}
                    onClick={() => {
                      controlPTZ('RIGHT_DOWN');
                    }}
                  />
                </div>
                <div
                  className="flex-center"
                  style={{
                    height: '5rem'
                  }}>
                  <img
                    src={ControlImg.bottom}
                    onClick={() => {
                      controlPTZ('DOWN');
                    }}
                  />
                </div>
                <div className="flex-center" style={{ marginTop: '20rem' }}>
                  <img
                    src={ControlImg.enLarge}
                    onClick={() => {
                      controlPTZ('ZOOM_IN');
                    }}
                  />
                  <img
                    src={ControlImg.enSmall}
                    style={{ marginLeft: '20rem' }}
                    onClick={() => {
                      controlPTZ('ZOOM_OUT');
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {store.isExpand ? (
            <div className="monitor-content-playlist">
              <div className="border-line"></div>
              <Fragment>
                <div
                  className="monitor-content-playlist-item monitor-content-playlist_header"
                  onClick={handleExpand}>
                  <span>监控点列表</span>
                  <div className="control">
                    <RightOutlined />
                  </div>
                </div>
                <div
                  className="monitor-content-playlist_content"
                  id="monitor-content-playlist_content-id">
                  {store.monitorBaseInfo.map(item => {
                    return (
                      <div
                        key={item.cameraId}
                        onClick={() => {
                          handleMonitorDoubleClick(item);
                        }}
                        className={[
                          'monitor-content-playlist-item',
                          SLYZTStore.currModal.id == item.cameraId
                            ? 'monitor-content-playlist-item_selected'
                            : ''
                        ].join(' ')}>
                        {item.districtName}
                      </div>
                    );
                  })}
                </div>
              </Fragment>
              <div className="border-line"></div>
            </div>
          ) : (
            <div className="flex">
              <div onClick={handleExpand}>
                <div className="control">
                  <LeftOutlined />
                </div>
                <div className="column-text">
                  <p>监</p>
                  <p>控</p>
                  <p>点</p>
                  <p>列</p>
                  <p>表</p>
                </div>
              </div>
              <div className="border-line"></div>
            </div>
          )}
        </div>
        {/* <div className="monitor-operation-outer flex-between">
          <div style={{ display: 'flex' }}>
            <div
              className="monitor-operation-detail-btn"
              onClick={() => {
                store.cameraControl(1, 'START_CRUISE');
              }}>
              上游场景
            </div>
            <div
              className="monitor-operation-detail-btn"
              onClick={() => {
                store.cameraControl(2, 'START_CRUISE');
              }}>
              下游场景
            </div>
            <div
              className="monitor-operation-detail-btn"
              onClick={() => {
                store.cameraControl(3, 'START_CRUISE');
              }}>
              巡航场景
            </div>
            <div
              className="monitor-operation-detail-btn"
              onClick={() => {
                store.cameraControl(1, 'STOP_CRUISE');
              }}>
              水尺场景
            </div>
          </div>
          <div
            className="monitor-operation-btn"
            onClick={() => {
              store.capture();
            }}>
            截屏
          </div>
          <a
            className="platform_url_link"
            href={GlobalStore.videoPlatformUrl}
            target="_blank"
            rel="noreferrer">
            {`智慧水安综合管理平台>>`}
          </a>
        </div> */}
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
    padding: 20rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 438rem;
    .monitor-outer {
      z-index: 99999;
      width: ${props => (props.isExpand ? '620rem' : '780rem')};
      height: 400rem;
    }
    .monitor-controls {
      position: absolute;
      top: 10rem;
      right: 10rem;
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
    .monitor-operation-detail-btn {
      font-size: 16rem;
    }
    .monitor-operation-btn {
      font-size: 20rem;
    }
    .monitor-operation-detail-btn,
    .monitor-operation-btn {
      transition: all 300ms;
      width: 80rem;
      height: 40rem;
      border-radius: 4rem;
      cursor: pointer;
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
    .monitor-operation-detail-btn:nth-child(2n),
    .monitor-operation-btn:nth-child(2n) {
      margin: 0 10rem;
    }
  }
`;
