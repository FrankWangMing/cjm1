import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import { useMount } from 'ahooks';
import Left from '@/pages/UnitTest/Left';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { number } from 'echarts';

interface CenterBottomProps {
  layerList: { key: string; title: string }[]; // 底部MenuItem的数据
  isShowProcess: boolean; // 是否有进度条
  selectedMenu: string[]; // 当前选中的底部导航数据;
  loadingStatusObj: {}; // 'loading'|'success'|'自定义字符串',// 加载中 | 载入成功 | 加载失败 里面type来自于LayerList中的string
  isMutex: boolean; // 是否是互斥事件。
  isCanNull?: boolean; // 是否可以不选。
  handleActiveChange: Function; // 处理MenuItem的点击事件
  disable?: boolean;
  isJustCssSelected?: boolean;
  left?: number;
  type?: string;
  number?: number;
}
const CenterBottom: React.FC<CenterBottomProps> = ({
  layerList,
  isShowProcess = false,
  loadingStatusObj,
  selectedMenu,
  isMutex,
  handleActiveChange,
  isCanNull = true,
  disable = false,
  isJustCssSelected = false,
  left,
  type,
  number
}) => {
  useEffect(() => {
    console.log('选中的tab center', selectedMenu);
  }, []);
  return (
    <div
      className="outer-center outer-center_bottom"
      id="centerBottom"
      style={{ bottom: isShowProcess ? '120rem' : '10rem', left: left }}>
      <SubTitleCom
        layerList={layerList}
        loadingStatusObj={loadingStatusObj}
        selectedMenu={selectedMenu}
        isMutex={isMutex}
        handleActiveChange={handleActiveChange}
        isShowProcess={isShowProcess}
        isCanNull={isCanNull}
        disable={disable}
        isJustCssSelected={isJustCssSelected}
        type={type}
        number={number}
      />
    </div>
  );
};

const SubTitleCom: React.FC<CenterBottomProps> = observer(
  ({
    layerList,
    loadingStatusObj,
    selectedMenu,
    isMutex,
    handleActiveChange,
    isCanNull,
    disable = false,
    isJustCssSelected = false,
    type,
    number = 0
  }) => {
    const store = useLocalStore(
      (): { currActiveItems: string[]; setCurrActiveItems: Function } => ({
        currActiveItems: [],
        setCurrActiveItems(e: string[]) {
          this.currActiveItems = e;
        }
      })
    );

    /**
     * 图层控制器的点击事件 -- 会修正点击之后剩下选中的点位Key <string []>。
     * @param type 选中的类型
     */
    const handleMenuClick = type => {
      console.log('选中的tab center', type);

      let tempCurrActiveItems: string[] = [...store.currActiveItems];
      if (isMutex) {
        // 互斥事件
        let isVisibleCurr = store.currActiveItems[0] == type; // 是否点击的是选中的那个
        if (isVisibleCurr) {
          // 清楚所有点位
          isCanNull && (tempCurrActiveItems = []);
        } else {
          tempCurrActiveItems = [type];
        }
      } else {
        // 非互斥事件
        let indexOfCurrClick = store.currActiveItems.indexOf(type); // 是否点击的是选中的那个
        if (indexOfCurrClick != -1) {
          tempCurrActiveItems.splice(indexOfCurrClick, 1);
        } else {
          tempCurrActiveItems.push(type);
        }
      }
      store.setCurrActiveItems(tempCurrActiveItems);
      !isJustCssSelected && handleActiveChange(store.currActiveItems, type);
    };

    useEffect(() => {
      selectedMenu.length > 0 && store.setCurrActiveItems(selectedMenu);
    }, [selectedMenu]);

    return type === 'warp' ? (
      <>
        <div
          className="center-bottom-outer"
          style={{ marginBottom: 24 + 'rem' }}>
          {layerList.slice(0, number).map(item => {
            return (
              <div
                style={{
                  cursor:
                    !disable && loadingStatusObj[item.key!] == 'success'
                      ? 'pointer'
                      : 'not-allowed',
                  color:
                    !disable && loadingStatusObj[item.key!] == 'success'
                      ? '#ffffff'
                      : '#c3c3c3'
                }}
                key={item.key}
                className={[
                  'center-bottom-item',
                  store.currActiveItems.indexOf(item.key!) != -1
                    ? 'center-bottom-item_active'
                    : ''
                ].join(' ')}
                onClick={() => {
                  !disable &&
                    loadingStatusObj[item.key!] == 'success' &&
                    handleMenuClick(item.key);
                }}>
                {item.title}
                {(disable || loadingStatusObj[item.key!] != 'success') &&
                  (disable || loadingStatusObj[item.key!] == 'loading') && (
                    <LoadingOutlined
                      style={{ marginLeft: '10rem', marginTop: '8rem' }}
                    />
                  )}
              </div>
            );
          })}
        </div>
        <div className="center-bottom-outer">
          {layerList.slice(number, layerList.length).map(item => {
            return (
              <div
                style={{
                  cursor:
                    !disable && loadingStatusObj[item.key!] == 'success'
                      ? 'pointer'
                      : 'not-allowed',
                  color:
                    !disable && loadingStatusObj[item.key!] == 'success'
                      ? '#ffffff'
                      : '#c3c3c3'
                }}
                key={item.key}
                className={[
                  'center-bottom-item',
                  store.currActiveItems.indexOf(item.key!) != -1
                    ? 'center-bottom-item_active'
                    : ''
                ].join(' ')}
                onClick={() => {
                  !disable &&
                    loadingStatusObj[item.key!] == 'success' &&
                    handleMenuClick(item.key);
                }}>
                {item.title}
                {(disable || loadingStatusObj[item.key!] != 'success') &&
                  (disable || loadingStatusObj[item.key!] == 'loading') && (
                    <LoadingOutlined
                      style={{ marginLeft: '10rem', marginTop: '8rem' }}
                    />
                  )}
              </div>
            );
          })}
        </div>
      </>
    ) : (
      <div className="center-bottom-outer">
        {layerList.map(item => {
          return (
            <div
              style={{
                cursor:
                  !disable && loadingStatusObj[item.key!] == 'success'
                    ? 'pointer'
                    : 'not-allowed',
                color:
                  !disable && loadingStatusObj[item.key!] == 'success'
                    ? '#ffffff'
                    : '#c3c3c3'
              }}
              key={item.key}
              className={[
                'center-bottom-item',
                store.currActiveItems.indexOf(item.key!) != -1
                  ? 'center-bottom-item_active'
                  : ''
              ].join(' ')}
              onClick={() => {
                !disable &&
                  loadingStatusObj[item.key!] == 'success' &&
                  handleMenuClick(item.key);
              }}>
              {item.title}
              {(disable || loadingStatusObj[item.key!] != 'success') &&
                (disable || loadingStatusObj[item.key!] == 'loading') && (
                  <LoadingOutlined
                    style={{ marginLeft: '10rem', marginTop: '8rem' }}
                  />
                )}
            </div>
          );
        })}
      </div>
    );
  }
);

export { CenterBottom, CenterBottomProps, SubTitleCom };
