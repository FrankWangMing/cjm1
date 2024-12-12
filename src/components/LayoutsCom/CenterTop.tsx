import { useSafeState } from 'ahooks';
// 中间顶部预见期类型选择
const CenterTop = ({ children }) => {
  return <div className="outer-center outer-center_top">{children}</div>;
};

interface SwitchTypeProps {
  operationList: Array<{ key: string; title: string }>;
  handlePeriodTypeChange: Function;
}
/**
 * 中间顶部类型选择模式
 * @returns
 */
const SwitchType: React.FC<SwitchTypeProps> = ({
  operationList,
  handlePeriodTypeChange
}) => {
  const [type, setType] = useSafeState(operationList[0].key);
  /**
   * 一日、一周切换
   * @param e
   */
  const handleMenuClick = e => {
    setType(e);
    handlePeriodTypeChange(e);
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {operationList?.map(item => {
        return (
          <div
            key={item.key}
            onClick={() => {
              handleMenuClick(item.key);
            }}
            className={[
              'center-sub-menu-tab',
              type === item.key ? 'center-sub-menu-tab_active' : ''
            ].join(' ')}>
            {item.title}
          </div>
        );
      })}
    </div>
  );
};

export { CenterTop, SwitchType };
