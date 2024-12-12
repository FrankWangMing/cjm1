import { Checkbox, Collapse } from 'antd';
import { useStoreLeft } from './store';
import { observer } from 'mobx-react-lite';
import { useMount, useSafeState } from 'ahooks';
import { ShowServer } from '@/service/show';
import GlobalStore from '@/store';

const SelectWaterCom = observer(() => {
  const { Panel } = Collapse;
  const leftStore = useStoreLeft();
  const [waterLineActiveKey, setWaterLineActiveKey] = useSafeState<string>('1');
  const [qianDaoLakeWaterLine, setQianDaoLakeWaterLine] = useSafeState<{
    realWaterLevel: number;
    time: string;
  }>({
    realWaterLevel: 0,
    time: ''
  });
  /**
   * 千岛湖水位查询
   */
  const getQianDaoWaterLine = async () => {
    let { realWaterLevel = 0.0, time = undefined } =
      await ShowServer.statistic.waterLine(GlobalStore.thousandOfLakeId);
    setQianDaoLakeWaterLine({
      realWaterLevel,
      time
    });
  };
  useMount(() => {
    getQianDaoWaterLine();
  });

  return (
    <>
      <Collapse
        className="water-line-outer"
        activeKey={waterLineActiveKey}
        expandIconPosition="end"
        accordion
        // @ts-ignore
        onChange={e => setWaterLineActiveKey(e)}
        ghost>
        <Panel
          header={
            <div style={{ paddingLeft: '5rem', border: 'unset' }}>
              水位线选择（m）
              <span style={{ fontSize: '18rem' }}></span>
            </div>
          }
          key="1">
          {/* 高水位 - 水位线选择 */}
          <div className="water-line-select">
            <div className="water-line-select-content">
              <img
                src="/images/dam_bg_height.png"
                draggable={false}
                alt="水位线选择"
              />
              <div className="form-outer">
                <Checkbox.Group
                  value={leftStore.selectedWaterLine}
                  onChange={e => {
                    leftStore.selectedWaterLine = e;
                  }}>
                  {leftStore.options[2].waterLine.map(item => {
                    return (
                      <Checkbox
                        key={item.value}
                        value={item.value}
                        disabled={
                          leftStore.selectedWaterLine.length == 2 &&
                          !leftStore.selectedWaterLine.includes(item.value)
                        }>
                        <div
                          className="flex-between"
                          style={{ width: '145rem' }}>
                          <div>{item.label}</div>
                          <div>{item.value}m</div>
                        </div>
                      </Checkbox>
                    );
                  })}
                </Checkbox.Group>
              </div>
            </div>
          </div>
          {/* 千岛湖水位相关 */}
          <div className="water-line">
            <p>
              千岛湖实时水位：<span>{qianDaoLakeWaterLine.realWaterLevel}</span>{' '}
              m
            </p>
            <p className="desc">数据采集时间：{qianDaoLakeWaterLine.time}</p>
          </div>
          {/* 分割线 */}
          <div className="divider border"></div>
        </Panel>
      </Collapse>
    </>
  );
});
export { SelectWaterCom };
