export type ConfigType = 'all' | 'difference';

export type RiverType =
  | '沁河'
  | '获泽河'
  | '县河'
  | '梅河'
  | '端氏河'
  | '柿庄河'
  | '续鲁峪河(中村段)'
  | '胡底河'
  | '土沃河'
  | '龙渠河'
  | '樊村河'
  | '石漕河(东峪河)'
  | '里河'
  | '郑村河'
  | '芦苇河(张村河)'
  | '上河'
  | '苏庄河'
  | '山泽河'
  | '杨庄河'
  | '固村河';

export const riverOption = [
  '沁河',
  '获泽河',
  '县河',
  '梅河',
  '端氏河',
  '柿庄河',
  '续鲁峪河(中村段)',
  '胡底河',
  '土沃河',
  '龙渠河',
  '樊村河',
  '石漕河(东峪河)',
  '里河',
  '郑村河',
  '芦苇河(张村河)',
  '上河',
  '苏庄河',
  '山泽河',
  '杨庄河',
  '固村河'
].map(v => ({
  label: v,
  value: v
}));

export const riverRainInitData: Record<RiverType, number[]> = {
  沁河: [0, 0, 0],
  获泽河: [0, 0, 0],
  县河: [0, 0, 0],
  梅河: [0, 0, 0],
  端氏河: [0, 0, 0],
  柿庄河: [0, 0, 0],
  '续鲁峪河(中村段)': [0, 0, 0],
  胡底河: [0, 0, 0],
  土沃河: [0, 0, 0],
  龙渠河: [0, 0, 0],
  樊村河: [0, 0, 0],
  '石漕河(东峪河)': [0, 0, 0],
  里河: [0, 0, 0],
  郑村河: [0, 0, 0],
  '芦苇河(张村河)': [0, 0, 0],
  上河: [0, 0, 0],
  苏庄河: [0, 0, 0],
  山泽河: [0, 0, 0],
  杨庄河: [0, 0, 0],
  固村河: [0, 0, 0]
};