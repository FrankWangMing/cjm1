// 中间内容区域
const CenterContent: React.FC<{ children }> = ({ children }) => {
  return (
    <div className="outer outer-center-content">
      <div className="content-outer">{children}</div>
    </div>
  );
};

export { CenterContent };
