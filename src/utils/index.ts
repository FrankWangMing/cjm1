/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import html2canvas from 'html2canvas';
import Papa from 'papaparse';

export const weekMap = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日'
};

/**
 * 结果文件路径拼接
 * @param num 当前帧数
 * @param length 长度:8
 * @returns
 */
export const padding4 = (num: number, length: number): string => {
  return (Array(length).join('0') + num).slice(-length);
};
/**
 * 将数组分成二维数组
 * @param arr 原数组
 * @param size 分隔条件
 * @returns
 */
export const spliceArrBySize = (arr: any[], size: number) => {
  const arrNum = Math.ceil(arr.length / size); // Math.ceil()向上取整的方法，用来计算拆分后数组的长度
  let index = 0; // 定义初始索引
  let resIndex = 0; // 用来保存每次拆分的长度
  const result: any[] = [];
  while (index < arrNum) {
    result[index] = arr.slice(resIndex, size + resIndex);
    resIndex += size;
    index++;
  }
  return result;
};

/**
 * 节流工具类
 */
export const debounce = (fn, wait) => {
  let timeout: any = null;
  return function () {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, wait);
  };
};
export function getParamObj(e: string) {
  if (!e) return '';
  var t = {},
    r: string[] = [],
    n = '',
    a = '';
  try {
    var i: string[] = [];
    if (
      (e.indexOf('?') >= 0 &&
        (i = e.substring(e.indexOf('?') + 1, e.length).split('&')),
      i.length > 0)
    )
      for (var o in i) (n = (r = i[o].split('='))[0]), (a = r[1]), (t[n] = a);
  } catch (s) {
    t = {};
  }
  return t;
}
/**
 * 截图并组成二进制文件
 * @param el dom节点
 * @param name 文件名称
 * @returns
 */
export async function exportImage(
  el: HTMLElement,
  name: string
): Promise<{ url: string; imgFormData: FormData | null; file: File }> {
  const rect = el.getBoundingClientRect();
  const canvas = await html2canvas(el, {
    backgroundColor: '#00000000',
    useCORS: true, //允许跨域
    allowTaint: true, //允许跨域数据污染'被污染'的canvas
    width: rect.width,
    removeContainer: false,
    height: rect.height
  });
  let base64Url = canvas.toDataURL('image/png');
  let arr = base64Url.split(',');
  let mime = arr[0].match(/:(.*?);/)![1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  let file = new File([u8arr], name + '.png', { type: mime });
  let formData = new FormData();
  formData.append('images', file);
  return {
    url: base64Url,
    imgFormData: formData,
    file: file
  };
}

/**
 * 提取CSV中的数据
 * @param csvFilePath CSV文件路径
 * @returns 每一行作为一个数组返回
 */
export const getCSVData = async (csvFilePath): Promise<[][]> => {
  return new Promise(resolve => {
    Papa.parse(csvFilePath, {
      download: true,
      complete: function (results) {
        resolve(results.data);
      }
    });
  });
};
/**
 * 下载文件
 * @param link
 * @param filename
 */
export async function downloadFile(link, filename) {
  return new Promise(resolve => {
    fetch(link)
      .then(async res => await res.blob())
      .then(blob => {
        // 创建隐藏的可下载链接
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = URL.createObjectURL(blob);
        // 保存下来的文件名
        a.download = filename || 'image.png';
        document.body.appendChild(a);
        a.click();
        // 移除元素
        document.body.removeChild(a);
        resolve('success');
      });
  });
}
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 村庄边界点位csv转成json对象
 * @param linkPath
 * @returns
 */
export async function getCreekData2Obj(linkPath: string): Promise<{
  [key: number]: {
    name: string;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
  };
}> {
  const csvArr = await getCSVData(linkPath);
  let resultObj: {} = {};
  let keys: string[] = csvArr[0];
  csvArr.map((item: string[], index: number) => {
    if (index > 0) {
      let tempObj = {};
      item.map((subItem: string, subIndex: number) => {
        if (subIndex > 0) {
          tempObj[keys[subIndex]] = subIndex > 1 ? Number(subItem) : subItem;
        }
      });
      resultObj[item[0]] = tempObj;
    }
  });
  return resultObj;
}
