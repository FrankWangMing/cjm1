/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { IMG_PATH } from '@/utils/const';
import styled from 'styled-components';
interface TextHeaderProp {
  title: string;
  width?: string;
  fontSize?: string;
  lineHeight?: string;
}
const TextHeader: React.FC<TextHeaderProp> = ({
  title,
  width,
  fontSize,
  lineHeight
}) => {
  return (
    <TextHeaderWrapper
      width={width}
      fontSize={fontSize}
      lineHeight={lineHeight}>
      <p>{title}</p>
      <img src={IMG_PATH.icon.textTitle} alt="" draggable={false} />
    </TextHeaderWrapper>
  );
};

const TextHeaderWrapper = styled.div<{
  width: string;
  fontSize: string;
  lineHeight: string;
}>`
  width: 100%;
  height: 30rem;
  margin-bottom: 20rem;
  margin-top: 10rem;
  position: relative;
  p {
    font-family: AlibabaPuHuiTiB;
    font-size: ${props => {
      return props.fontSize || '24rem';
    }};
    line-height: ${props => {
      return props.lineHeight || '24rem';
    }};
    color: #ffffff;
    text-align: center;
  }
  img {
    width: 100%;
    position: absolute;
    bottom: 0;
  }
`;
export { TextHeader };
