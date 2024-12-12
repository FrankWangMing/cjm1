import { MAPBOX_DEFAULT_CONFIG } from '.';

export default class RenderMap {
  map: mapboxgl.Map | null = null;

  idleTime = now();
  idleInterval = 1000 * 10;

  async initMapInstance({
    container,
    token,
    style,
    center,
    preserveDrawingBuffer = true,
    bearing,
    minZoom,
    pitchWithRotate = true
  }: {
    container: string;
    token: string;
    style: any;
    center: [number, number];
    preserveDrawingBuffer: boolean;
    bearing: number;
    minZoom: number;
    pitchWithRotate: boolean;
  }): Promise<mapboxgl.Map> {
    let _this = this;
    return new Promise(resolve => {
      mapboxgl.accessToken = token;
      _this.map = new mapboxgl.Map({
        container,
        style,
        center,
        preserveDrawingBuffer,
        bearing,
        minZoom,
        maxZoom: MAPBOX_DEFAULT_CONFIG.maxZoom,
        pitchWithRotate,
        maxPitch: 72,
        antialias: false
      });
      // @ts-ignore
      _this.map._myTriggerFrame = _this.map._triggerFrame;
      // @ts-ignore
      _this.map._triggerFrame = (render: boolean) => {
        // @ts-ignore
        _this.map._myTriggerFrame(render);
      };
      // @ts-ignore
      _this.map.setPointer = _this.setPointer;
      _this.addListener();
      _this.map.on('style.load', () => {
        // _this.map?.addSource('mapbox-dem', {
        //   type: 'raster-dem',
        //   url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        //   tileSize: 512,
        //   maxzoom: 14
        //   // maxzoom: 6
        // });
        _this.map?.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
        // @ts-ignore
        _this.map!.removeAllMapMarker = async () => {
          // @ts-ignore
          let allMarkers = _this.map?._markers;
          for (let i = allMarkers.length - 1; i >= 0; i--) {
            allMarkers[i].remove();
          }
        };
        // @ts-ignore
        _this.map!.getAllMarker = () => {
          // @ts-ignore
          return _this.map?._markers;
        };
        resolve(_this.map!);
      });
    });
  }
  setPointer = this.pointerIdle.bind(this);

  addListener() {
    window.addEventListener('pointerdown', this.setPointer, false);
    window.addEventListener('pointerup', this.setPointer, false);
    window.addEventListener('pointerleave', this.setPointer, false);
    window.addEventListener('wheel', this.setPointer, false);
    window.addEventListener('online', this.setPointer, false);
    window.addEventListener('resize', this.setPointer, false);
    window.addEventListener('orientationchange', this.setPointer, false);
    window.addEventListener('webkitfullscreenchange', this.setPointer, false);
  }

  pointerIdle() {
    // this.idleTime = now();
    // if (!this.map.ISRENDER) {
    //   // @ts-ignore
    //   this.map.ISRENDER = true;
    //   this.map.triggerRepaint();
    // }
  }

  removePointerIdle() {
    window.removeEventListener('pointerdown', this.setPointer);
    window.removeEventListener('pointerup', this.setPointer);
    window.removeEventListener('pointerleave', this.setPointer);
    window.removeEventListener('wheel', this.setPointer);
    window.removeEventListener('online', this.setPointer);
    window.removeEventListener('resize', this.setPointer);
    window.removeEventListener('orientationchange', this.setPointer);
    window.removeEventListener('webkitfullscreenchange', this.setPointer);
  }
}

function now() {
  return (typeof performance === 'undefined' ? Date : performance).now(); // see #10732
}
