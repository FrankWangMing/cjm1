/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import Loading from '@/components/Loading';
import { LoginService, SolutionServer } from '@/service';
import { httpPdf } from '@/utils/http';
import { useSafeState } from 'ahooks';
import dd from 'gdt-jsapi';
import { Fragment, useEffect } from 'react';
import Pdfh5 from 'pdfh5';
import 'pdfh5/css/pdfh5.css';
import './index.less';
import { message } from 'antd';
import moment from 'moment';
import { downloadFile, getParamObj } from '@/utils';
import { observer, useLocalStore } from 'mobx-react-lite';
import { useMount } from '@umijs/hooks';
import { MomentFormatStr } from '@/utils/const';

const PDFPreview = observer(() => {
  const store = useLocalStore(() => ({
    fileUrl: '',
    noticeId: -1,
    fileName: ''
  }));

  const [isPdfLoaded, setIsPdfLoaded] = useSafeState(false);
  // 创建pdf预览代码
  const previewPdf = async () => {
    let { data: blob } = await httpPdf.get(store.fileUrl, {
      responseType: 'blob'
    });
    blob = new Blob([blob], {
      type: 'application/pdf;chartset=UTF-8'
    });

    let fileBlobURL = URL.createObjectURL(blob);
    let pdfh5 = new Pdfh5(`#pdf-preview-outer`, {
      pdfurl: fileBlobURL,
      pageNum: false,
      zoomEnable: false,
      backTop: false
    });
    //监听完成事件
    pdfh5.on('complete', function (status, msg, time) {
      setIsPdfLoaded(status == 'error' ? false : true);
    });
  };
  const [pdfLoading, setPdfLoading] = useSafeState(true);
  const getFloodBrief = async () => {
    setPdfLoading(true);
    await previewPdf();
    setPdfLoading(false);
  };
  /**
   * 处理已读事件
   * @param code
   */
  const handleIsRead = async (code: string) => {
    const data = await LoginService.dingtalklogin(code!);
    await SolutionServer.actionCallBack({
      accountId: data.accountId,
      actionType: 1,
      deptName: data.orgName,
      noticeId: Number(store.noticeId),
      statusDetail: '',
      time: moment().format(MomentFormatStr)
    });
    message.success('已读');
  };

  const [errMsg, setErrMsg] = useSafeState('');
  useMount(() => {
    try {
      let paramObj = getParamObj(window.location.href);
      let params = paramObj['params'].split(',');
      store.fileUrl = params[0];
      store.fileName = params[1];
      store.noticeId = params[2];
      dd.getAuthCode({})
        .then(res => {
          if (res.code != undefined || res.auth_code != undefined) {
            let code = res.code || res.auth_code;
            handleIsRead(code!);
            getFloodBrief();
          }
        })
        .catch(err => {
          message.error(err);
          setErrMsg(err);
        });
    } catch (e) {
      setErrMsg('链接异常');
    }
  });

  /**
   * 处理下载事件
   */
  const handleExport = () => {
    downloadFile(store.fileUrl, store.fileName);
  };

  return (
    <Fragment>
      {errMsg != '' && <h1>{errMsg}</h1>}
      <Loading loadingFlag={pdfLoading && errMsg == ''} />
      <div id="pdf-preview-outer" className="pdf-preview-outer"></div>
      {/* {isPdfLoaded && (
        <div className="operation-outer" onClick={handleExport}>
          专报下载
        </div>
      )} */}
    </Fragment>
  );
});
export default PDFPreview;
