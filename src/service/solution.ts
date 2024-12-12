/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import http from '@/utils/http';

/**
 * solution相关接口
 */

const SolutionServer = {
  queryReportList: async (params: {
    foresight: number;
    pageNum: number;
    pageSize: number;
    pdfType: number;
  }): Promise<{
    count: number;
    list: {
      createdAt: string;
      foresight: number;
      id: number;
      pdfName: string;
    }[];
  }> => {
    let { data: data } = await http.post('/solution/briefreport/list', params);
    return data;
  },
  /**
   * 统计预报时间段内放在村落个数;
   * @param startTime
   * @param endTime
   * @param projectId
   * @returns
   */
  queryRiskVillage: async (
    startTime: string,
    endTime: string,
    projectId: number
  ): Promise<{
    projectId: number;
    riskList: {
      riskLevel: number;
      riskNum: number;
    }[];
  }> => {
    // todo 增加四级风险
    let { data: data } = await http.post('/solution/query/riskVillages', {
      startTime,
      endTime,
      projectId
    });
    return data;
  },
  /**
   * 导出责任人
   * @param alarmInfoId
   * @param type
   * @returns
   */
  exportContacts: async (alarmInfoId: number, type: string) => {
    let tempData = await http.post('/solution/exportcontacts', {
      alarmInfoId: alarmInfoId,
      type: type
    });
    return tempData;
  },
  /**
   * 预览PDF简报文件
   * @param id
   * @returns
   */
  previewBriefReport: async (id: number): Promise<{ path: string }> => {
    let { data: data } = await http.post('/solution/preview/briefreport', {
      briefReportId: id
    });
    return data;
  },
  /**
   * 多跨联动 - 查询防汛专报数据
   * @returns
   */
  queryForecastRisk: async (
    projectId: number,
    startTime: string,
    endTime: string
  ): Promise<FloodControlBrief> => {
    let { data: data } = await http.post('/solution/query/forecastrisk', {
      startTime,
      projectId,
      endTime
    });
    return data;
  },
  /**
   * 获取信息联动数据
   * @param alarmDay
   * @param riskLevel
   * @returns
   */
  queryUnionAction: async (
    alarmDay: string,
    riskLevel: number
  ): Promise<{ unionActions: IUnionActionsItem[] }> => {
    let { data: data } = await http.post('/solution/query/unionaction', {
      alarmDay: alarmDay,
      riskLevel: riskLevel
    });
    return data;
  },
  /**
   * 简报下载历史记录
   * @param pageNum 当前页码
   * @param pageSize 每页展示数量
   * @returns
   */
  recordOfDownloadBrief: async (
    pageNum: number,
    pageSize: number
  ): Promise<{ count: number; records: IRecordOfBrief[] }> => {
    let { data: data } = await http.post('/solution/record/downloadbrief', {
      pageNum: pageNum,
      pageSize: pageSize
    });
    return data;
  },
  /**
   * 临界雨量预警指标
   */
  rainAlarmIndex: async ({
    pageNum,
    pageSize
  }: {
    pageNum: number;
    pageSize: number;
  }): Promise<{
    indexCount: number;
    villageIndexes: ResultRainAlarmIndex[];
  }> => {
    let { data: data } = await http.get('/solution/query/rainalarmindex', {
      params: {
        pageSize,
        pageNum
      }
    });
    return data;
  },
  /**
   * 追踪闭环 - 查看信息发布清单
   * @param param0 type 通知类型 (1:风险预警，2：洪水预警，3：防汛专报)
   * @returns
   */
  queryNoticeDetails: async ({
    type,
    status = 0,
    startTime = '',
    endTime = ''
  }: {
    type: number;
    status?: number;
    startTime?: string;
    endTime?: string;
  }): Promise<{ noticeDetail: ResultQueryNoticeDetail[]; total: number }> => {
    const { data: data } = await http.post(
      '/solution/query/querynoticedetails',
      {
        type,
        status,
        startTime,
        endTime
      }
    );
    return data;
  },
  /**
   * 图片上传
   */
  uploadImg: async (formData: FormData): Promise<{ imagePath: string }> => {
    // /solution/action/uploadImage
    let { data: data } = await http.post(
      '/solution/action/uploadImage',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return data;
  },
  /**
   * 发布通知到浙政钉
   */
  sendNotice: async (body: SendNoticeProp) => {
    const data = await http.post('/solution/action/sendNotice', body);
    return data;
  },
  /**
   * 查询联动部门列表
   */
  queryUnionActionDepartment: async (): Promise<{
    departments: {
      departmentCode: string;
      departmentName: string;
      reportAccountIds: number[];
      responseAccountIds: number[];
    }[];
  }> => {
    const { data: data } = await http.get(
      '/solution/query/unionactiondepartment'
    );
    return data;
  },
  /**
   * 用户对于通知响应回执
   */
  actionCallBack: async (body: {
    accountId: number;
    actionType: number;
    deptName: string;
    noticeId: number;
    statusDetail: string;
    time: string;
    ownerOnDuty?: number;
    transferTotal?: number;
    sosNum?: number;
    safeHouse?: number;
  }): Promise<string> => {
    let { data: data } = await http.post('/solution/action/callback', body);
    return data.status;
  },
  /**
   * 根据通知ID查询防汛处置状态
   */
  queryNoticeResponse: async (
    noticeId: number
  ): Promise<QueryNoticeResponseRES> => {
    let { data: data } = await http.get('/solution/query/queryNoticeResponse', {
      params: { noticeId }
    });
    return data;
  },
  /**
   * 编辑通知响应
   */
  updateNoticeResponse: async (body: UpdateNoticeResponseProp) => {
    let { data: data } = await http.post(
      '/solution/query/updateNoticeResponse',
      body
    );
  },
  departmentMember: {
    /**
     * 添加信息联动部门成员
     * @param param0
     * @returns
     */
    add: async (body: {
      deptCode: 'string';
      name: 'string';
      phone: 'string';
    }) => {
      const { data } = await http.post('/solution/departmentMember/add', body);
      return data;
    },
    /**
     * 删除信息联动部门成员
     * @param param0
     * @returns
     */
    delete: async (body: { deptCode: 'string'; memberId: number }) => {
      const { data } = await http.post(
        '/solution/departmentMember/delete',
        body
      );
      return data;
    },
    /**
     * 添加信息联动部门成员
     * @param param0
     * @returns
     */
    list: async (): Promise<{
      list: {
        Name: string;
        code: string;
        members: {
          id: number;
          name: string;
          phone: string;
        }[];
      }[];
    }> => {
      const { data } = await http.get('/solution/departmentMember/list');
      return data;
    },
    /**
     * 编辑信息联动部门成员
     * @param body
     * @returns
     */
    edit: async (body: { id: number; name: string; phone: string }) => {
      const { data } = await http.post('/solution/departmentMember/edit', body);
      return data;
    }
  },
  /**
   * 批量删除
   */
  deleteBriefReport: async ({ briefReportId }: { briefReportId: number[] }) => {
    let { data: data } = await http.post('/solution/delete/briefreport', {
      briefReportId
    });
    return data;
  },
  /**
   * 下载PDF
   */
  downloadBriefReport: async ({ pdfNumber }: { pdfNumber: number[] }) => {
    let { data: data } = await http.post('/solution/download/briefreport', {
      pdfNumber
    });
    return data;
  }
};
interface UpdateNoticeResponseProp {
  noticeDeptResponses: {
    actionDetail: string;
    actionTime: string;
    closeDetail: string;
    closeTime: string;
    department: string;
    noticeId: number;
    responseDecision: string;
    status: number;
  }[];
  noticeId: number;
  ownerOnDuty: number;
  safeHouse: number;
  sosNum: number;
  transferTotal: number;
}

interface QueryNoticeResponseRES {
  noticeDeptResponses: {
    actionDetail: string;
    actionTime: string;
    closeDetail: string;
    closeTime: string;
    department: string;
    noticeId: number;
    responseDecision: string;
    status: number;
  }[];
  ownerOnDuty: number;
  safeHouse: number;
  sosNum: number;
  transferTotal: number;
}

/**
 * 发布通知到浙政钉参数说明
 * @param content 发送文字内容
 * @param departments 接收部门Code
 * @param imagePath 图片路径
 * @param linkPath 超链接路径
 * @param linkTitle 超链接文字描述
 * @param receivers 接收人的手机号码
 * @param type 通知类型(1:风险预警，2：洪水预警，3：防汛专报)
 */
interface SendNoticeProp {
  content: string; // 发送文字内容
  departments: string[]; // 接收部门Code
  imagePath: string; //图片路径
  linkPath: string; // 超链接路径
  linkTitle: string; // 超链接文字描述
  receivers: {
    accountInfos: {
      deptName: string;
      accountIds: number[];
      deptCode: string;
    }[];
    mobiles: string[];
    type: number;
  }; // 接收人的手机号码
  type: number; // 通知类型(1:风险预警，2：洪水预警，3：防汛专报)
}

/**
 * 追踪闭环 - 查看信息发布清单 返回值格式
 */
interface ResultQueryNoticeDetail {
  noticeDeptResponses: {
    actionDetail: string;
    actionTime: string;
    closeDetail: string;
    closeTime: string;
    department: string;
    responseDecision: string;
    status: number;
  }[];
  noticeId: number;
  ownerOnDuty: number;
  readNum: number;
  safeHouse: number;
  sendNum: number;
  sendTime: string;
  sosNum: number;
  transferTotal: number;
}

/**
 * 临界雨量预警指标返回值格式
 */
type ResultRainAlarmIndex = {
  adminVillage: string;
  alarmIndexes: {
    forecast: number;
    iTransfer: number;
    rTransfer: number;
    soilWater: string;
  }[];
  dangerImage: string;
  natureVillage: string;
  region: string;
};

interface IRecordOfBrief {
  author: string;
  briefReportId: number;
  riskList: {
    riskInfos: {
      riskLevel: number;
      villageNum: number;
    }[];
  };
  time: string;
}

interface IUnionActionsItem {
  alarmTime: string;
  confirmVillage: string[];
  forecast: number;
  funnelData: {
    count: number;
    data: { name: string; value: number }[];
  };
  noCloseLoop: string[];
  noReceipt: string[];
  riskLevel: number;
}
interface FloodControlBrief {
  forecastEnd: string;
  forecastStart: string;
  riskForecast: string;
  riskList: [
    {
      administrativeVillage: string;
      area: string;
      riskLevel: number;
      villageId: number;
      villageName: string;
    }
  ];
  suggest: string;
  waterRainStatistic: {
    rainAlarm: string;
    reservoirAlarm: string;
    riverAlarm: string;
    title: string;
  };
}

export {
  SolutionServer,
  IUnionActionsItem,
  IRecordOfBrief,
  FloodControlBrief,
  ResultRainAlarmIndex,
  ResultQueryNoticeDetail,
  QueryNoticeResponseRES
};
