export * from './Left';
export * from './Right';
export * from './ModalContent';

/**
 * 分 转换成 XX小时xx分
 * @param tempMin
 * @returns
 */
const minFormatterStr = (tempMin: number): string => {
  return tempMin > 60
    ? `${Math.floor(tempMin / 60)}小时${tempMin % 60}分钟`
    : `${tempMin % 60}分钟`;
};
export { minFormatterStr };
