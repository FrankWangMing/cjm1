/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { PHYSICAL_KEYWORDS } from '@/utils/const';
import styled from 'styled-components';
interface ColorBarProp {
  type: string;
  unit: string;
  numList: string[];
  lineBgColor: string;
  handleTypeChange: Function;
  keyValList: {
    key: string;
    value: string;
    disable: boolean;
  }[];
}
const IMG_MAP = {
  [PHYSICAL_KEYWORDS.最大水深]: '/images/legendImg/最大水深1.png',
  [PHYSICAL_KEYWORDS.历时]: '/images/legendImg/历时1.png',
  [PHYSICAL_KEYWORDS.水深]: '/images/legendImg/水深1.png',
  [PHYSICAL_KEYWORDS.流速]: '/images/legendImg/流速1.png',
  历时_周: '/images/legendImg/历时_周1.png'
};

const paddingMap = {
  [PHYSICAL_KEYWORDS.最大水深]: '10rem',
  [PHYSICAL_KEYWORDS.历时]: '10rem',
  [PHYSICAL_KEYWORDS.水深]: '20rem',
  [PHYSICAL_KEYWORDS.流速]: '20rem'
};

const WidthMap = {
  [PHYSICAL_KEYWORDS.最大水深]: '100%!important',
  [PHYSICAL_KEYWORDS.历时]: '100%!important',
  [PHYSICAL_KEYWORDS.水深]: '100%!important',
  [PHYSICAL_KEYWORDS.流速]: '100% !important'
};

const ColorBar: React.FC<ColorBarProp> = ({ type, unit, lineBgColor }) => {
  return (
    <ColorBarWrapper lineBgColor={lineBgColor}>
      {/* 直接上图片！！！ */}
      {unit == '天' ? (
        <img src={IMG_MAP['历时_周']} alt="" width="90%" />
      ) : (
        <img src={IMG_MAP[type]} alt="" width={WidthMap[type]} />
      )}
    </ColorBarWrapper>
  );
};
const ColorBarWrapper = styled.div<{ lineBgColor: string }>`
  width: 100%;
  padding: 15rem;
  position: relative;
  img {
    width: 100% !important;
    height: 100% !important;
  }
`;
export { ColorBar };
