const chartImage =
  'data:image/png;base64,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';

export const reportList = {
  count: 12,
  list: [
    {
      id: 1,
      foresight: 3,
      pdfName: '调度预案1',
      createdAt: '2023-10-05 12:00:00'
    },
    {
      id: 2,
      foresight: 3,
      pdfName: '调度预案2',
      createdAt: '2024-08-15 12:00:00'
    },
    {
      id: 3,
      foresight: 3,
      pdfName: '调度预案3',
      createdAt: '2024-10-25 12:00:00'
    },
    {
      id: 4,
      foresight: 3,
      pdfName: '调度预案4',
      createdAt: '2024-10-21 12:00:00'
    },
    {
      id: 5,
      foresight: 3,
      pdfName: '调度预案5',
      createdAt: '2024-10-12 12:00:00'
    },
    {
      id: 6,
      foresight: 3,
      pdfName: '调度预案6',
      createdAt: '2024-09-27 12:00:00'
    },
    {
      id: 7,
      foresight: 3,
      pdfName: '调度预案7',
      createdAt: '2024-09-25 12:00:00'
    },
    {
      id: 8,
      foresight: 3,
      pdfName: '调度预案8',
      createdAt: '2024-09-21 12:00:00'
    },
    {
      id: 9,
      foresight: 3,
      pdfName: '调度预案9',
      createdAt: '2024-09-12 12:00:00'
    },
    {
      id: 10,
      foresight: 3,
      pdfName: '调度预案10',
      createdAt: '2024-09-07 12:00:00'
    },
    {
      id: 11,
      foresight: 3,
      pdfName: '调度预案11',
      createdAt: '2024-09-05 12:00:00'
    },
    {
      id: 12,
      foresight: 3,
      pdfName: '调度预案12',
      createdAt: '2024-09-01 12:00:00'
    }
  ]
};

export const pdfData = {
  id: 1,
  foresight: 3,
  subject: '沁水县沁河流域调度预案',
  organization: '沁水县水务局',
  date: '2023年10月05日',
  summary: '洪涝态势综述',
  riskForecast:
    '根据泄洪方案，张峰水库共计泄洪12个小时，洪峰出现在第 3小时，洪峰流量为 45m³/s，总泄洪量为 205m³。  \n ',
  riskListDesc:
    '根据泄洪方案仿真推演计算:预计开闸泄洪后，张峰水库下游共有5个河道控制断面超危险水位，存在洪涝风险的商铺/村落共计10个，其中一级风险4个，二级风险5个，三级风险1个 。\n',
  crossSectionRiskList: [
    {
      crossSectionName: '龙港镇杏园社区沟门口',
      area: '龙港镇',
      riskLevel: '危险水位'
    },
    {
      crossSectionName: '龙港镇河渚村柳家湾',
      area: '龙港镇',
      riskLevel: '危险水位'
    }
  ],
  villageRiskList: [
    {
      villageId: 25,
      villageName: '河渚村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 2
    },
    {
      villageId: 25,
      villageName: '梁庄村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 2
    },
    {
      villageId: 25,
      villageName: '西石堂村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 2
    },
    {
      villageId: 25,
      villageName: '东石堂村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 2
    },
    {
      villageId: 25,
      villageName: '青龙村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 2
    },
    {
      villageId: 21,
      villageName: '沟门口村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 1
    },
    {
      villageId: 20,
      villageName: '柳家湾村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 1
    },
    {
      villageId: 21,
      villageName: '南贾庄村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 1
    },
    {
      villageId: 20,
      villageName: '北贾庄村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 1
    },
    {
      villageId: 22,
      villageName: '东村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 3
    }
  ],
  rainPicture: '',
  floodDepthPictureLink: '',
  floodDurationPictureLink: '',
  waterRainStatistic: {
    title: '',
    rainAlarm: '',
    reservoirAlarm: '',
    riverAlarm: ''
  },
  floodSuggestionTitle:
    '根据张峰水库泄洪情况、水库概况和下游冲淹情况，依据《张峰水库防御洪水方案》，相关部门按以下防汛处置建议采取相应的转移疏散救援措施。',
  immeSuggest: ['无村落需要立即转移'],
  prepSuggest: [
    '较大洪水已到允许壅高水位830.90m，低于校核洪水位835.40m。',
    '（1） 水库下泄流量已达到110m3/s时，向下游河道沿线镇街发出预警。在水库已达到允许壅高水位830.90m，市防指发出转移警报，及时组织下游群众转移。',
    '（2） 转移路线按照“安全、就近、就快”的原则；',
    '（3） 水库大坝下游的有关乡镇也要迅速召开会议，重点解决以下几个问题：\n ',
    '• 各级政府要求各村各单位根据按照制定的转移方案，明确在特殊情况下的联络方法和警报信号，包括转移的路线、地点、安置措施、交通工具等；',
    '• 要逐步传达到群众，通过加大宣传力度和发传单的方式，使人人都知道，为出现险情时的临险转移打下基础；',
    '• 按下游所在单位的人口多少和所在区域的实际状况，由当地政府和防汛部门，配备好转移前所需物资，并张榜公示，做到家喻户晓，人人明白。'
  ]
};

export const pdfData2 = {
  id: 2,
  foresight: 3,
  subject: '沁水县沁河流域调度预案',
  organization: '沁水县水务局',
  date: '2024年08月15日',
  summary: '洪涝态势综述',
  riskForecast:
    '根据泄洪方案，云首水库共计泄洪8个小时，洪峰出现在,1 小时，洪峰流量为 25m³/s，总泄洪量为 67m³。  \n ',
  riskListDesc:
    '根据泄洪方案仿真推演计算：预计开闸泄洪后，云首水库下游共有3个河道控制断面超危险水位，存在洪涝风险的商铺/村落共计4个，其中一级风险1个，二级风险3个，三级风险0个、无风险7个\n',
  crossSectionRiskList: [
    {
      crossSectionName: '龙港镇西石堂村',
      area: '龙港镇',
      riskLevel: '危险水位'
    },
    {
      crossSectionName: '龙港镇东石堂村',
      area: '龙港镇',
      riskLevel: '危险水位'
    }
  ],
  villageRiskList: [
    {
      villageId: 25,
      villageName: '北贾庄村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 2
    },
    {
      villageId: 25,
      villageName: '河渚村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 2
    },
    {
      villageId: 25,
      villageName: '梁庄村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 2
    },
    // {
    //   villageId: 21,
    //   villageName: '沟门口村',
    //   administrativeVillage: '龙港镇',
    //   area: '山西省',
    //   riskLevel: 1
    // },
    {
      villageId: 20,
      villageName: '柳家湾村',
      administrativeVillage: '龙港镇',
      area: '山西省',
      riskLevel: 1
    }
    // {
    //   villageId: 21,
    //   villageName: '南贾庄村',
    //   administrativeVillage: '龙港镇',
    //   area: '山西省',
    //   riskLevel: 1
    // }
    // {
    //   villageId: 22,
    //   villageName: '西石堂村',
    //   administrativeVillage: '龙港镇',
    //   area: '山西省',
    //   riskLevel: 3
    // }
  ],
  // rainPicture: chartImage,
  rainPicture: '',
  floodDepthPictureLink: '',
  floodDurationPictureLink: '',
  waterRainStatistic: {
    title: '',
    rainAlarm: '',
    reservoirAlarm: '',
    riverAlarm: ''
  },
  floodSuggestionTitle:
    '根据云首水库泄洪情况、水库概况和下游冲淹情况，依据《云首水库防御洪水方案》，相关部门按以下防汛处置建议采取相应的转移疏散救援措施。',
  immeSuggest: ['无村落需要立即转移'],
  prepSuggest: [
    '（1） 云首水库下游河道实际安全流量已达允许壅高水位对应的下泄流量，水位已达汛限水位786.70m，此时按照下游安全泄量要求，采用控制泄洪方式，允许最高水位793.87m，最大泄洪量小于69.8m3/s，保证洪水在河道中正常行洪，下游村庄、街道、交通干线、耕地不受任何损失。',
    '（2） 预计下泄流量将超过河道安全泄量69.8m3/s时，晋城市城乡水务局发布洪水预警，并通知沁水县管委会做好洪水危险区群众转移与安置。'
  ]
};
