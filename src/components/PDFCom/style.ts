import styled from 'styled-components';
const PDFComWrapper = styled.div`
  .ant-form-item {
    margin: 0 !important;
  }
  .ant-select-single .ant-select-selector .ant-select-selection-item {
    font-family: 'FZXBS' !important;
  }
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: all 600ms;
  .content {
    width: 70%;
    margin-left: 15%;
    padding-bottom: 130rem;
    h1,
    .h1-edit {
      width: 100% !important;
      font-size: 50rem !important;
      color: red !important;
      text-align: center !important;
      margin-top: 120rem !important;
      font-family: 'FZXBS' !important;
      font-weight: bolder !important;
    }
  }

  .border {
    border: 1rem dashed #000;
  }
  .forecast-outer {
    display: inline;
    font-weight: 900 !important;
    span {
      font-weight: 900 !important;
    }
  }

  .sub-title {
    width: 100%;
    margin-top: 50rem;
    div:nth-child(1) {
      padding: 0 5rem;
    }
    .ant-input {
      width: 300rem;
      margin-left: -30rem;
    }
    p,
    .ant-input {
      font-family: 'FS_GB2312';
      font-size: 20rem;
      color: #000;
      span {
        font-family: 'Times New Roman';
      }
    }
    .divide-line {
      background-color: red;
      height: 2rem;
      width: 100%;
      margin-top: 5rem;
    }
  }
  h2,
  .h2-edit {
    width: 100%;
    text-align: center;
    font-family: 'FZXBS';
    font-size: 30rem;
    margin-top: 40rem;
    font-weight: bolder;
  }
  h3,
  .h3-edit {
    width: 100%;
    text-align: left;
    font-family: 'HEITI';
    font-size: 25rem;
    margin-top: 40rem;
    font-weight: 1000;
  }
  h4 {
    font-family: 'KaiTi_GB2312';
    font-size: 20rem;
    padding-left: 10rem;
    margin-top: 10rem;
    font-weight: 900;
  }

  h5 {
    text-indent: 35rem;
    font-family: 'FS_GB2312';
    font-size: 20rem;
    margin: 0;
    font-weight: 900;
  }
  .main-content {
    color: #000;
    textarea.ant-input {
      min-height: 250rem;
      margin-top: 20rem;
    }
    p,
    .ant-input,
    textarea.ant-input {
      font-family: 'FS_GB2312';
      font-size: 20rem;
      line-height: 40rem;
      font-weight: 100;
      span {
        font-family: 'Times New Roman';
      }
    }

    .li {
      text-indent: 0rem;
      padding-left: 60rem !important;
    }

    textarea.ant-input,
    .ant-form-item-control-input-content {
      text-indent: 40rem;
    }

    .img-outer {
      position: relative;
      min-height: 100rem;
      img {
        width: 100%;
        padding: 0 !important;
        margin: 0 !important;
      }
      .scalar {
        min-width: 120rem;
        width: 120rem;
        background-color: rgba(1, 1, 1, 0.5);
        font-family: AlibabaPuHuiTiM;
        border-radius: 4rem;
        height: 210rem;
        position: absolute;
        bottom: 60rem;
        right: 10rem;
      }
      p {
        font-family: 'FS_GB2312';
        font-weight: bolder;
      }
    }
    .img-desc {
      font-family: 'FS_GB2312';
      font-size: 22rem;
      text-align: center;
      margin-top: 10rem !important;
    }
  }
  .main-content:nth-last-child(1) {
    padding-bottom: 150rem;
  }
  .table-outer {
    width: 100%;
    font-family: 'FS_GB2312';
    margin-bottom: 30rem;
    td {
      text-align: center;
      height: 35rem;
      font-size: 18rem;
    }
    tr:nth-child(1) {
      background-color: #e7e6e6;
    }
    .td-risk_1 {
      background-color: red;
    }
    .td-risk_2 {
      background-color: #ed7d32;
    }
    .td-risk_3 {
      background-color: #ffff00;
    }
  }

  .water-rain {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 60%;
    height: 200rem;
  }
  ::-webkit-scrollbar {
    /*整体样式*/
    width: 10rem;
  }
  ::-webkit-scrollbar-thumb {
    /*滚动条小方块*/
    border-radius: 10rem;
    background-color: rgba(154, 167, 186, 0.8);
    /* background-color: #dee7f6; */
  }
`;
export { PDFComWrapper };
