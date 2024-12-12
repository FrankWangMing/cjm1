import { observer } from 'mobx-react-lite';
import { useMount } from 'ahooks';
import { MonitorServer } from '@/service';
import { Table } from 'antd';
import { ColorBar } from '@/components/LegendCom/ColorBar';
import { PHYSICAL_KEYWORDS } from '@/utils/const';

export default observer(() => {
  const getAllCameras = async () => {
    const data = await MonitorServer.getAllCameras();
    console.log(data);
  };
  const color_map_render = {
    bgColor: {
      [PHYSICAL_KEYWORDS.水深]:
        'linear-gradient(180deg, #0000ff 0%, #0000cd 31%, #1e90ff 65%, #6aadec 100%)',
      [PHYSICAL_KEYWORDS.流速]:
        // #0001ff #07c0ff #ffea05 #fa5252 #ff0400
        // 0 0.75 1.5 2.25 3
        // 'linear-gradient(180deg,#fbdb14 0%,#fa1f0e 31%,#060b8d 65%,#0495fd 100%)',
        'linear-gradient(180deg,#ff0400 20%,#fa5252 40%,#ffea05 60%,#03ffe2 80%,#0017ff 100%)',
      // 'linear-gradient(180deg,#ff2900 10%,#c92a2a 20%,#e67700 50%,#4dabf7 75%,#1971c2 100%)',
      [PHYSICAL_KEYWORDS.最大水深]:
        'linear-gradient(180deg, #004DCC 0%, #004DCC 20%,#2673F2 20%, #2673F2 40%,#5980FF 40%, #5980FF 60%,#8099FF 60%,#8099FF 80%,#b3ccff 80%,#b3ccff 100%)',
      [PHYSICAL_KEYWORDS.历时]:
        'linear-gradient(180deg,#7a5a0d 0%,#7a5a0d 16.7%,#997819 16.7%,#997819 33.4%,#c3a046 33.4%,#c3a046 50.1%,#e0cc85 50.1%,#e0cc85 66.8%,#f2e0b3 66.8%,#f2e0b3 83.5%,#fff3bf 83.5%,#fff3bf 100%)'
    },
    valList: {
      [PHYSICAL_KEYWORDS.水深]: ['300', '200', '100', '50', '0'],
      [PHYSICAL_KEYWORDS.流速]: ['3', '2', '1', '0'],
      [PHYSICAL_KEYWORDS.最大水深]: ['∞', '300', '200', '100', '50', '0'],
      [PHYSICAL_KEYWORDS.历时]: ['24', '12', '6', '3', '2', '1', '0.5', '0']
    },
    unit: {
      [PHYSICAL_KEYWORDS.水深]: 'cm',
      [PHYSICAL_KEYWORDS.流速]: 'm/s',
      [PHYSICAL_KEYWORDS.最大水深]: 'cm',
      [PHYSICAL_KEYWORDS.历时]: 'h'
    }
  };

  useMount(() => {
    // getAllCameras();
  });
  return (
    <div style={{ background: '#000', width: '120rem' }}>
      <ColorBar
        unit="天"
        numList={['>7', '7', '3', '2', '1', '0.5', '0']}
        lineBgColor={color_map_render.bgColor[PHYSICAL_KEYWORDS.历时]}
        handleTypeChange={() => {}}
        keyValList={[]}
      />
    </div>
  );
});
