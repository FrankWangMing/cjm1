import http from '@/utils/http';

/**
 * 用户权限校验
 */
const RoleService = {
  /**
   * 权限 - 判断是否有XX的权限
   * @param mobile 待校验人手机号
   * @param role 待校验的角色（1、超级管理员；2、管理员；3、VIP）
   * @returns
   */
  judge: async (): Promise<{ result: boolean }> => {
    const { data } = await http.get('/rbac/judge');
    return data;
  },
  /**
   * 权限 - 查询特定角色权限人员
   * @param role 角色（1: 超级管理员 2:管理员 3: VIP）
   * @returns
   */
  query: async (role: number): Promise<{ accountIds: number[] }> => {
    const { data } = await http.get('/rbac/query', {
      params: {
        role
      }
    });
    return data;
  },
  /**
   * 权限 - 配置人员权限
   * @param rbacList
   * @param mobile 手机号
   * @param name 员工姓名
   * @param role 角色（1: 超级管理员 2:管理员 3: VIP 4: 普通用户 ）
   * @returns
   */
  config: async (
    rbacList: { mobile: string; name: string; role: number }[]
  ) => {
    const { data } = await http.post('/rbac/config', {
      rbac: rbacList
    });
    return data;
  },
  /**
   * 用户列表
   * @returns
   */
  list: async () => {
    const { data } = await http.get('/user/list');
    return data;
  },
  /**
   * 根据id删除用户
   * @param id 用户id
   * @returns
   */
  deleteById: async (user_id: number) => {
    const { data } = await http.post('/user/delete', { user_id });
    return data;
  },
  /**
   * 根据id修改用户信息
   * @param id 用户id
   * @returns
   */
  updateUser: async (body: {
    email?: string;
    phone: string;
    real_name: string;
    role: string;
    user_id: number;
    user_name: string;
  }) => {
    const { data } = await http.post('/user/edit', body);
    return data;
  },
  /**
   * 发送验证码
   */
  sendCode: async (body: { name: string }) => {
    const { data } = await http.post('/sendCode', body);
    return data;
  }
};

export { RoleService };
