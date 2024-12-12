import { PanelHeader } from '@/components/Header';
import { useMount, useSafeState, useUpdateEffect } from 'ahooks';
import { DatePicker, Form, Radio, Tooltip } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { RADIO_FORECAST_TIME_DAY, RADIO_FORECAST_TIME_WEEK } from '../const';
import { CalendarOutlined } from '@ant-design/icons';
import GlobalStore from '@/store';
import moment, { Moment } from 'moment';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { RangePickerProps } from 'antd/lib/date-picker';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { IMG_PATH, MomentFormatStr } from '@/utils/const';
import { WeatherServer } from '@/service/weather';
import {
  CustomRadio,
  CustomRadioGroup
} from '@/components/AntdComponents/CustomRadio';
export default observer(
  (props: {
    handleValChanged: Function;
    isRenderLoading: boolean;
    defaultForecastTime: number;
    periodType: string;
    handleBacktrack?: Function;
    currBackTrack?: Moment | null;
  }) => {
    const [form] = Form.useForm();
    const HLYBStore = useStore();
    const [forecastValue, setForecastValue] = useSafeState<number>();
    const handleRadioChange = (e: number) => {
      if (!props.isRenderLoading) {
        setForecastValue(e);
        props.handleValChanged(e);
      }
    };
    const [labelData, setLabelData] = useSafeState<
      { label: string; value: number }[]
    >([]);

    useEffect(() => {
      setForecastValue(props.defaultForecastTime);
    }, [props.defaultForecastTime]);

    useEffect(() => {
      if (props.periodType == 'day') {
        setLabelData(RADIO_FORECAST_TIME_DAY);
      } else {
        setLabelData(RADIO_FORECAST_TIME_WEEK);
        setIsBackTrack(false);
      }
    }, [props.periodType]);

    const [isBackTrack, setIsBackTrack] = useSafeState(false);

    useUpdateEffect(() => {
      HLYBStore.backTrackCalc = isBackTrack;
      HLYBStore.backTrackTime = null;
      form.setFieldsValue({
        date: undefined
      });
    }, [isBackTrack]);

    /**
     * Target: 实现日期选择框最多选择3个月的时间;
     * disabledDate & onCalendarChange & from表单 配合使用
     * @param current
     * @returns
     */
    const disabledDate: RangePickerProps['disabledDate'] = current => {
      return current && current > moment().endOf('day');
    };

    useMount(() => {
      getHistoryRain();
    });

    const [historyTime, setHistoryTime] = useState<string[]>([]);

    const getHistoryRain = async () => {
      let endTime = moment().format(MomentFormatStr);
      let startTime = moment().subtract(0.5, 'year').format(MomentFormatStr);
      const { list } = await WeatherServer.historyByTime(
        startTime,
        endTime,
        'day'
      );
      let asd = list
        .filter(item => {
          return item.rainValue != 0;
        })
        .map(item => moment(item.time).format('YYYYMMDD'));
      setHistoryTime(asd);
    };
    const dateRender = (currentDate, today) => {
      let isRain = historyTime.includes(currentDate.format('YYYYMMDD'));
      return (
        <>
          {isRain ? (
            <div
              className="ant-picker-cell-inner"
              style={{
                backgroundImage: `url(${IMG_PATH.icon.rain})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%'
              }}>
              {currentDate.format('D')}
            </div>
          ) : (
            <div className="ant-picker-cell-inner">
              {currentDate.format('D')}
            </div>
          )}
        </>
      );
    };
    return (
      <div className="forecast-period-outer">
        <div className="common-header-outer" id="common-header-outer">
          <PanelHeader
            title={isBackTrack ? '回溯日期' : '洪水预见期'}
            // OperationFc={
            //   !GlobalStore.isShowMode && props.periodType == 'day' ? (
            //     <Fragment>
            //       {isBackTrack ? (
            //         <span
            //           className="forecast-period-operation"
            //           style={{ fontSize: '18rem' }}
            //           onClick={() => {
            //             props.handleBacktrack && props.handleBacktrack(null);
            //             setIsBackTrack(false);
            //           }}>
            //           返回
            //         </span>
            //       ) : (
            //         <Tooltip
            //           placement="top"
            //           title="回溯"
            //           getPopupContainer={() =>
            //             document.getElementById('common-header-outer')!
            //           }>
            //           <CalendarOutlined
            //             className="forecast-period-operation"
            //             onClick={() => {
            //               setIsBackTrack(true);
            //             }}
            //           />
            //         </Tooltip>
            //       )}
            //     </Fragment>
            //   ) : null
            // }
          />
        </div>
        {!isBackTrack && (
          <div
            className="forecast-period-content"
            style={{ padding: '10rem 20rem' }}>
            {/* 预见期选择选择样式 */}
            {/* <Radio.Group
              className="radio-list"
              disabled={props.isRenderLoading}
              value={forecastValue}>
              {labelData.map((item, index) => {
                return (
                  <div className="radio-item-outer" key={index}>
                    <Radio
                      value={item.value}
                      onClick={() => {
                        handleRadioChange(item.value);
                      }}></Radio>
                    {index < labelData.length - 1 && (
                      <div className="splice-line"></div>
                    )}
                  </div>
                );
              })}
            </Radio.Group> */}
            <CustomRadioGroup
              className="radio-list"
              disabled={props.isRenderLoading}
              value={forecastValue}>
              {labelData.map((item, index) => {
                return (
                  <div className="radio-item-outer" key={index}>
                    <CustomRadio
                      width={50}
                      innerIcon={IMG_PATH.icon.radioIcon}
                      checkedInnerIcon={IMG_PATH.icon.radioInner}
                      value={item.value}
                      onClick={() => {
                        handleRadioChange(item.value);
                      }}></CustomRadio>
                    {index < labelData.length - 1 && (
                      <div className="splice-line"></div>
                    )}
                  </div>
                );
              })}
            </CustomRadioGroup>
            {/* 预见期选择 - 汉字描述 */}
            <div className="label-list">
              {labelData.map((item, index) => {
                return (
                  <span
                    style={{
                      cursor: !props.isRenderLoading ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => {
                      handleRadioChange(item.value);
                    }}
                    key={index}>
                    {item.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        {isBackTrack && (
          <div className="forecast-period-content">
            <Form form={form} className="flex-center">
              <Form.Item name="date">
                <DatePicker
                  locale={locale}
                  disabledDate={disabledDate}
                  // @ts-ignore
                  dateRender={dateRender}
                  showToday={false}
                />
              </Form.Item>
            </Form>
            <div className="forecast-confirm-outer">
              <div
                className="btn"
                onClick={() => {
                  props.handleBacktrack && props.handleBacktrack(null);
                  setIsBackTrack(false);
                }}>
                取消
              </div>
              <div
                className="btn"
                onClick={() => {
                  let asd = form.getFieldsValue();
                  props.handleBacktrack &&
                    props.handleBacktrack(
                      moment(asd.date.format(`YYYY-MM-DD 23:59:00`))
                    );
                }}>
                确定
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
