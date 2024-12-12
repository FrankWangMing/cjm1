import store from '../store';
import { history } from '@/utils/history';
import GlobalStore from '@/store';
import { DingDingPageRouter } from './const';
((window, store) => {
  let screenRatioByDesign = 16 / 9; // 设计稿宽高比
  let delay = 50; // 防抖延时
  let minWidth = 1200; // 最小宽度
  let minHeight = minWidth / screenRatioByDesign;
  let grids = 1920; // 页面栅格份数
  let tid: ReturnType<typeof setTimeout>;
  let docEle = document.documentElement;

  const setHtmlFontSize = () => {
    let clientWidth =
      docEle.clientWidth > minWidth ? docEle.clientWidth : minWidth;
    let clientHeight =
      docEle.clientHeight > minHeight ? docEle.clientHeight : minHeight;
    console.log(history)
    if (DingDingPageRouter.includes(history?.location.pathname)) {
      clientWidth = docEle.clientWidth;
      clientHeight = docEle.clientHeight;
    }
    let screenRatio = clientWidth / clientHeight;
    let fontSize =
      ((screenRatio >= screenRatioByDesign
        ? screenRatioByDesign / screenRatio
        : 1) *
        clientWidth) /
      grids;
    if (DingDingPageRouter.includes(history?.location.pathname)) {
      fontSize = 1;
    }
    docEle.style.fontSize = fontSize.toFixed(6) + 'px';
    store.updateFontSize(+fontSize.toFixed(6));
  };

  GlobalStore.setHtmlFontSize = setHtmlFontSize;

  const debounce = (delay: number) => {
    tid && clearTimeout(tid);
    tid = setTimeout(() => {
      setHtmlFontSize();
    }, delay);
  };
  setHtmlFontSize();

  window.addEventListener('resize', () => {
    debounce(delay);
  });
  window.addEventListener(
    'pageshow',
    e => {
      if (e.persisted) {
        // 浏览器后退的时候重新计算
        debounce(delay);
      }
    },
    false
  );
})(window, store);
