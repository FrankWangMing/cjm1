import { Carousel } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { Fragment, useRef } from 'react';
import styled from 'styled-components';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { useSafeState } from 'ahooks';
import { WarningOutlined } from '@ant-design/icons';

interface Props {
  TitleList: any;
  typeList: string[];
  valList: any[];
  carouselPageHeight: string;
  colorInfoObj: {};
  handleItemClick?: Function;
  unit?: string;
}
const TableCssCom: React.FC<Props> = ({
  TitleList,
  typeList,
  valList,
  carouselPageHeight,
  handleItemClick,
  colorInfoObj,
  unit = ''
}) => {
  const ref = useRef<CarouselRef | null>(null);
  const [isShowOperation, setIsShowOperation] = useSafeState(false);
  return (
    <TableCssComWrapper
      carouselPageHeight={carouselPageHeight}
      typeListLength={typeList.length}>
      <div
        className="table-cus-outer"
        onMouseLeave={() => {
          isShowOperation && setIsShowOperation(false);
        }}
        onMouseOver={() => {
          !isShowOperation && setIsShowOperation(true);
        }}>
        {/* 跑马灯操作div */}
        <Fragment>
          <div
            className={[
              'carousel-operation-btn carousel-operation-btn_left animate__animated animate__faster',
              !isShowOperation ? 'animate__fadeOut' : 'animate__fadeIn'
            ].join(' ')}
            onClick={() => {
              ref.current?.prev();
            }}>
            <DoubleLeftOutlined />
          </div>
          <div
            className={[
              'carousel-operation-btn carousel-operation-btn_right animate__animated animate__faster',
              !isShowOperation ? 'animate__fadeOut' : 'animate__fadeIn'
            ].join(' ')}
            onClick={() => {
              ref.current?.next();
            }}>
            <DoubleRightOutlined />
          </div>
        </Fragment>
        {/* 表格头部 */}
        <div
          className="table-cus-header"
          style={{ height: TitleList.length == 2 ? '48rem' : '' }}>
          {TitleList.map((item, index) => {
            return (
              <div key={index} className="th">
                {item}
              </div>
            );
          })}
        </div>
        {/* 表格内容，跑马灯翻滚 */}
        <div className="table-cus-content">
          <Carousel
            ref={ref}
            autoplay={true}
            dots={false}
            autoplaySpeed={5000}
            dotPosition="right">
            {valList.map((subList, index) => {
              return (
                <div className="carousel-page " key={index}>
                  {subList.map((item, key) => {
                    return (
                      <div
                        className={['content-tr', 'relative-outer'].join(' ')}
                        style={{
                          background: colorInfoObj[item['status']]?.icon
                            ? colorInfoObj[item['status']]?.bgColor
                            : '',
                          width: '100%'
                        }}
                        key={key}
                        onClick={() => {
                          handleItemClick && handleItemClick(item);
                        }}>
                        {typeList.map((tdItem, tdIndex) => {
                          return (
                            <div className="td" key={tdIndex}>
                              {typeof item[tdItem] == 'number' ? (
                                Math.round(item[tdItem] * 100) / 100 == -1 ? (
                                  '--'
                                ) : (
                                  Math.round(item[tdItem] * 100) / 100 + unit
                                )
                              ) : (
                                <div
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                  }}>
                                  <span>{item[tdItem]}</span>
                                  {colorInfoObj[item['status']] && (
                                    <Fragment>
                                      {typeList.length > 2 ? (
                                        <WarningOutlined
                                          style={{
                                            width: '20rem',
                                            height: '20rem',
                                            position: 'absolute',
                                            left: '24.5%',
                                            top: '33%',
                                            zIndex: 999,
                                            fontSize: '13rem',
                                            color: 'rgba(255,77,86)',
                                            fontWeight: '700'
                                          }}
                                        />
                                      ) : (
                                        <WarningOutlined
                                          style={{
                                            width: '20rem',
                                            height: '20rem',
                                            zIndex: 999,
                                            fontSize: '16rem',
                                            marginLeft: '5rem',
                                            color: 'rgba(255,77,86)',
                                            fontWeight: '700'
                                          }}
                                        />
                                      )}
                                    </Fragment>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </TableCssComWrapper>
  );
};

export { TableCssCom };

const TableCssComWrapper = styled.div<{
  carouselPageHeight: string;
  typeListLength: number;
}>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  .table-cus-outer {
    position: relative;
    --animate-delay: 0.3s;
    .table-cus-header {
      background: rgba(149, 174, 255, 0.28);
      height: 70rem;
      display: flex;
      align-items: center;
      text-align: center;
      .th {
        font-family: AlibabaPuHuiTiB;
        font-size: 16rem;
        color: #ffffff;
        width: ${props => 100 / props.typeListLength + '% !important'};
      }
      .th:nth-child(1) {
        min-width: 35% !important;
        max-width: 40%;
      }
    }
    .table-cus-content {
      height: calc(100% - 70rem);
      .carousel-page {
        width: 100%;
        height: ${props => props.carouselPageHeight};
      }
      .content-tr:hover {
        background-color: #2c51b3 !important;
        cursor: pointer;
        .td {
          color: #ffffff;
        }
      }
      .content-tr {
        display: flex;
        height: 40rem;
        margin-top: 10rem;
        background: rgba(201, 214, 255, 0.24);
        .td {
          width: ${props => 100 / props.typeListLength + '%'};
          text-align: center;
          line-height: 40rem;
          font-family: AlibabaPuHuiTiM;
          font-size: 16rem;
          color: rgba(255, 255, 255, 0.8);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .td:nth-child(1) {
          min-width: 35%;
          max-width: 40%;
        }
        transition: all 200ms;
      }
      .content-tr:nth-child(odd) {
        background: rgba(255, 255, 255, 0.08);
      }
    }
  }
  .carousel-operation-btn {
    position: absolute;
    z-index: 99;
    background: #d5ebe1;
    width: 40rem;
    height: 40rem;
    border-radius: 50%;
    top: 50%;
    cursor: pointer;
    transition: all 200ms;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      color: #1864ab;
    }
  }
  .carousel-operation-btn:hover {
    background-color: #228be6;
    span {
      color: #ffffff !important;
    }
  }
  .carousel-operation-btn:active {
    background-color: #1864ab;
    span {
      color: #ffffff !important;
    }
  }
  .carousel-operation-btn_left {
    left: 10rem;
  }
  .carousel-operation-btn_right {
    right: 10rem;
  }
`;
