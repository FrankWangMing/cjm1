import { ShowServer } from '@/service/show';
import { downloadFile } from '@/utils';
import { MomentFormatStr } from '@/utils/const';
import { useSafeState } from 'ahooks';
import { Checkbox, DatePicker, Form, Popover, Radio, message } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import moment from 'moment';
import { SyncOutlined } from '@ant-design/icons';

interface DownloadBtnProps {
  case_type: '雨情统计' | '水情统计';
}

const DownloadBtn: React.FC<DownloadBtnProps> = ({ case_type }) => {
  /**
   * 添加下载功能 相关逻辑
   */
  /**
   * 下载入口
   */
  const [downloadLoading, setDownloadLoading] = useSafeState<boolean>(false);
  const handleDownLoad_Rain = async () => {
    let reqParam = {
      startTime: '',
      endTime: ''
    };
    form
      .validateFields()
      .then(async res => {
        // 雨情统计
        message.info('雨情统计--下载');
        // console.log('下载时统计时间', res);
        if (res.shijianduan) {
          // 选中的是时间段
          reqParam = {
            startTime: moment()
              .subtract(res.shijianduan, 'hours')
              .format(MomentFormatStr),
            endTime: moment().format(MomentFormatStr)
          };
        } else {
          // 选中的是时间选择框
          reqParam = {
            startTime: moment(res.shijian[0]).format(MomentFormatStr),
            endTime: moment(res.shijian[1]).format(MomentFormatStr)
          };
        }
        setDownloadLoading(true);
        const { filePath } = await ShowServer.download.rainStatistic(reqParam);
        await downloadFile(
          filePath,
          reqParam.startTime + '至' + reqParam.endTime + '雨情统计.xlsx'
        );
        setDownloadLoading(false);
      })
      .catch(() => {
        message.error('请正确选择时间');
        return;
      });
  };

  const handleDownLoad_Water = async () => {
    let reqParam = {
      startTime: '',
      endTime: '',
      type: 0
    };
    form
      .validateFields()
      .then(async res => {
        // 雨情统计
        message.info('雨情统计--下载');
        // console.log('下载时统计时间', res);
        if (res.shijianduan) {
          // 选中的是时间段
          reqParam = {
            startTime: moment()
              .subtract(res.shijianduan, 'hours')
              .format(MomentFormatStr),
            endTime: moment().format(MomentFormatStr),
            type: res.waterType.length > 1 ? 0 : res.waterType[0]
          };
        } else {
          // 选中的是时间选择框
          reqParam = {
            startTime: moment(res.shijian[0]).format(MomentFormatStr),
            endTime: moment(res.shijian[1]).format(MomentFormatStr),
            type: res.waterType.length > 1 ? 0 : res.waterType[0]
          };
        }
        setDownloadLoading(true);
        const { filePath } = await ShowServer.download.waterStatistic(reqParam);
        await downloadFile(
          filePath,
          reqParam.startTime + '至' + reqParam.endTime + '水情统计.xlsx'
        );
        setDownloadLoading(false);
      })
      .catch(() => {
        message.error('请正确选择时间、类型不能为空');
        return;
      });
  };

  /**
   * 处理时间改变
   * @param e
   */
  const [form] = Form.useForm();
  const [isShowMoreTime, setIsShowMoreTime] = useSafeState(false);
  const handleTimeRadioChange = () => {
    let shijianduan = form.getFieldValue('shijianduan');
    setIsShowMoreTime(shijianduan == -1);
  };

  /**
   * Target: 实现日期选择框最多选择3个月的时间;
   * disabledDate & onCalendarChange & from表单 配合使用
   * @param current
   * @returns
   */
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    let curr_shijian_temp = form.getFieldValue('shijian_temp');
    if (curr_shijian_temp) {
      let startTime = curr_shijian_temp[0];
      let endTime = curr_shijian_temp[1];
      return (
        current < moment(endTime).subtract(3, 'M') ||
        (current && current > moment().endOf('day')) ||
        (current && current > moment(startTime).add(3, 'M'))
      );
    } else {
      return current && current > moment().endOf('day');
    }
  };
  const onCalendarChange = list => {
    form.setFieldValue('shijian_temp', list);
  };
  const { RangePicker } = DatePicker;

  return (
    <div id={case_type + 'download_btn'} className="common-header-operation">
      {downloadLoading ? (
        <SyncOutlined spin />
      ) : (
        <Popover
          getPopupContainer={() =>
            document.getElementById(case_type + 'download_btn')!
          }
          placement="bottomRight"
          title={false}
          onOpenChange={() => {
            form.setFieldValue('shijianduan', 24);
          }}
          content={
            <div className="common-header-operation-time-select-outer">
              <Form
                className="_content "
                form={form}
                onChange={handleTimeRadioChange}>
                {isShowMoreTime ? (
                  <>
                    <Form.Item
                      name="shijian"
                      rules={[
                        {
                          required: true,
                          message: '请选择时间范围'
                        }
                      ]}>
                      <RangePicker
                        disabledDate={disabledDate}
                        onCalendarChange={onCalendarChange}
                      />
                    </Form.Item>
                  </>
                ) : (
                  <Form.Item name="shijianduan" style={{ marginBottom: 0 }}>
                    <Radio.Group name="radiogroup">
                      <Radio value={24}>
                        近24小时
                        <div className="lianjie-line line1"></div>
                      </Radio>
                      <Radio value={48}>
                        近48小时
                        {/* <div className="lianjie-line line2"></div> */}
                      </Radio>
                      <Radio value={72}>
                        近72小时
                        {/* <div className="lianjie-line line3"></div> */}
                      </Radio>
                      <Radio value={-1}>更多</Radio>
                    </Radio.Group>
                  </Form.Item>
                )}
                <div className="_operation ">
                  {case_type == '水情统计' && (
                    // 0：所有水库站+河道站，1：所有水库站，2：所有河道站
                    <Form.Item
                      name="waterType"
                      rules={[
                        {
                          required: true,
                          message: ''
                        }
                      ]}
                      style={{ display: 'inline-block', margin: '0' }}>
                      <Checkbox.Group defaultValue={[1, 2]}>
                        <Checkbox value={2}>河道站</Checkbox>
                        <Checkbox value={1}>水库站</Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                  )}
                  {isShowMoreTime && (
                    <span
                      className="back2select"
                      onClick={() => {
                        setIsShowMoreTime(false);
                        form.setFieldValue('shijianduan', 24);
                      }}>
                      返回
                    </span>
                  )}
                  <div
                    className="search-btn"
                    onClick={
                      case_type == '水情统计'
                        ? handleDownLoad_Water
                        : handleDownLoad_Rain
                    }>
                    下载
                  </div>
                </div>
              </Form>
            </div>
          }
          trigger="click">
          <img src="/images/icons/download.png" alt="" />
        </Popover>
      )}
    </div>
  );
};
export { DownloadBtn };
