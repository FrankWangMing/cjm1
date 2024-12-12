import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';

const CenterContentLoadingWrapper = styled.div`
  position: absolute;
  z-index: 2;
  width: 100vw;
  left: 0;
  height: 100vh;
  display: flex;
  color: #fff;
  align-items: center;
  justify-content: center;
  p {
    font-size: 25rem;
    line-height: 60rem;
    margin-top: 20rem;
    font-family: AlibabaPuHuiTiR;
  }
  .loading-content {
    text-align: center;
  }
`;
// 中间加载中旋转
const CenterContentLoading: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <CenterContentLoadingWrapper>
      <div className="loading-content">
        <LoadingOutlined style={{ fontSize: '50rem' }} />
        <p>{title}</p>
      </div>
    </CenterContentLoadingWrapper>
  );
};
export { CenterContentLoading };
