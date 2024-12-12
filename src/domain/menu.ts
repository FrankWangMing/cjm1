/**
 * 菜单栏目数据结构
 */
export interface MenuListProp {
  title: string;
  routerPath: string;
  isHaveColorBar: boolean;
  position: 'left' | 'right';
}
