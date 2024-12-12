import React from 'react';

// 四周装饰条样式组件
const SideDecoratorLine = () => {
  return (
    <React.Fragment>
      <div className="side-decorator-line side-decorator-line_right"></div>
      <div className="side-decorator-line side-decorator-line_bottom"></div>
      <div className="side-decorator-line side-decorator-line_left"></div>
    </React.Fragment>
  );
};
export { SideDecoratorLine };
