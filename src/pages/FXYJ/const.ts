import { PHYSICAL_KEYWORDS } from '@/utils/const';
import html2canvas from 'html2canvas';
import { IMG_PATH } from '@/utils/const';

// 截图并组成二进制文件
async function exportImage(
  el: HTMLElement,
  name: string
): Promise<{ url: string; imgFormData: FormData | null; file: File }> {
  const rect = el.getBoundingClientRect();
  const canvas = await html2canvas(el, {
    backgroundColor: '#00000090',
    useCORS: true, //允许跨域
    allowTaint: true, //允许跨域数据污染'被污染'的canvas
    width: rect.width,
    removeContainer: false,
    height: rect.height + 10
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

const MAP_IMG_NAME_TYPE = {
  [PHYSICAL_KEYWORDS.最大水深]: '洪水淹没水深图',
  [PHYSICAL_KEYWORDS.历时]: '洪水淹没历时图'
};

async function downloadImg(link, filename) {
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
export const ICON_MAP = {
  RAINFALL_STATION: {
    0: IMG_PATH.markerIcon.RAINFALL_STATION,
    1: IMG_PATH.markerIcon.RAINFALL_STATION_1Level,
    2: IMG_PATH.markerIcon.RAINFALL_STATION_2Level,
    3: IMG_PATH.markerIcon.RAINFALL_STATION_3Level
    // 根据状态修正（0：0，1：0-30mm，2：30-50mm，3：>50mm）
  },
  //水位站
  GAUGING_STATION: {
    0: IMG_PATH.markerIcon.GAUGING_STATION_RIVER,
    1: IMG_PATH.markerIcon.GAUGING_STATION_RIVER_1Level
  },
  GAUGING_STATION_RIVER: {
    0: IMG_PATH.markerIcon.GAUGING_STATION_RIVER,
    1: IMG_PATH.markerIcon.GAUGING_STATION_RIVER_1Level,
    2: IMG_PATH.markerIcon.GAUGING_STATION_RIVER_2Level,
    3: IMG_PATH.markerIcon.GAUGING_STATION_RIVER_3Level
    // 水位站状态（0：正常，1：超警戒，2：超保证，3：超汛限）
  },
  GAUGING_STATION_RESERVOIR: {
    0: IMG_PATH.markerIcon.GAUGING_STATION_RESERVOIR,
    1: IMG_PATH.markerIcon.GAUGING_STATION_RESERVOIR_1Level,
    2: IMG_PATH.markerIcon.GAUGING_STATION_RESERVOIR_2Level,
    3: IMG_PATH.markerIcon.GAUGING_STATION_RESERVOIR_3Level
    // 水位站状态（0：正常，1：超警戒，2：超保证，3：超汛限）
  },
  IMPORTANT_VILLAGE: {
    0: IMG_PATH.markerIcon.IMPORTANT_VILLAGE
  }
};
export { exportImage, MAP_IMG_NAME_TYPE, downloadImg };
