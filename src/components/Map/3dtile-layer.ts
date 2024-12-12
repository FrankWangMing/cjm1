/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
// 无用-倾斜摄影
import * as THREE from 'three';
import {
  MapFlyTo,
  Render3dtile,
  utils,
  TerrainUtil,
  Label2D,
  LineSingle,
  core,
  Water5,
  helpers,
  PolygonColor
} from '@ys/dte';
import GlobalStore from '@/store';
import { mapControllerBase } from './3dtile-mapbox-controller';
import { lngLat2Xyz } from '.';
import GUI from 'lil-gui';
import { DEPTH_AMPLITUDE, MapboxLayerId } from '@/utils/const';

export default class RenderLayer extends mapControllerBase {
  mapCamera!: THREE.PerspectiveCamera;
  render3dtile!: Render3dtile;
  label2d!: Label2D;
  waterUpStream!: Water5;
  gui = new GUI().show(false);
  constructor(map: mapboxgl.Map, center: [number, number], dom: HTMLElement) {
    super(map, center, dom, MapboxLayerId.tileId);
  }

  polygonColor!: PolygonColor;
  myLine: LineSingle[] = [];
  villageLngLatObj: {
    color?: string;
    intensity?: number;
    points: number[][];
  }[] = [];
  points: [number, number][] = [
    [118.55, 29.444],
    [118.544, 29.444],
    [118.544, 29.45],
    [118.55, 29.45]
  ];
  isRenderDone = false; // 是否加载完成
  /**
   * 在倾斜摄影中画横线
   * @param allLineData
   */
  drawLine(allLineData: { start: [number, number]; end: [number, number] }[]) {
    if (this.myLine.length == 0) {
      allLineData.map(item => {
        let currLine = new LineSingle(
          [
            lngLat2Xyz({
              lng: item.start[0],
              lat: item.start[1]
            }) as [number, number, number],
            lngLat2Xyz({
              lng: item.end[0],
              lat: item.end[1]
            }) as [number, number, number]
          ],
          {
            color: 'rgba(0, 255, 255,0.5)',
            linewidth: 20,
            worldUnits: false,
            bottomAmplitude: 5
          }
        );
        this.myLine.push(currLine);
      });
    }
    const directionalLight = new core.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 1000, 1000);
    this.scene?.add(directionalLight);
    this.myLine.map(item => {
      this.scene?.add(item);
    });
    this.resize();
  }

  /**
   * 划折线
   * @param allPoint
   */
  drawBrokeLine(
    allPoint: [number, number, number][],
    isClosed: boolean = false
  ) {
    // this.removeLine();
    let currLine = new LineSingle(allPoint, {
      color: '#ff0000',
      linewidth: 5,
      worldUnits: false,
      sceneMercator: this.modelAsMercatorCoordinate,
      bottomAmplitude: -1,
      map: GlobalStore.map,
      isClosed
    });
    this.myLine.push(currLine);
    const directionalLight = new core.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 1000, 1000);
    this.scene?.add(directionalLight);
    this.myLine.map(item => {
      this.scene?.add(item);
    });
    this.resize();
  }

  /**
   * 移除3dtile里面的横线;
   */
  removeLine() {
    this.myLine?.map(item => {
      this.scene?.remove(item);
      item.dispose();
    });
    this.myLine = [];
    // this.map.setPointer();
  }

  async init(): Promise<void> {
    let info = MapFlyTo.getCameraInfo(this.map);
    const { clientWidth, clientHeight } = this.dom;
    this.mapCamera = new THREE.PerspectiveCamera(
      info.fov! * 1.7,
      clientWidth / clientHeight,
      1,
      50000
    );
    this.render3dtile = new Render3dtile(
      this.dom,
      this.scene,
      this.mapCamera,
      '/draco/'
      // this.updatePolygon.bind(this)
    );
    this.render3dtile.setParams({
      scaleUP: DEPTH_AMPLITUDE['3dTile'],
      // offset: 2,
      msse: 5
    });
    let _this = this;
    this.render3dtile.updateCallback = () => {
      _this.isRenderDone = false;
    };
    this.polygonColor = new PolygonColor(
      {
        map: this.map,
        sceneMercator: this.modelAsMercatorCoordinate,
        strUP: 'xz'
      },
      this.render3dtile.group
    );
    this.label2d = new Label2D(this.camera, document.getElementById('map')!);
    GlobalStore.render3dtile = this.render3dtile;
    this.render3dtile.loadTileset(
      'http://10.0.4.131:4001/qinshuiCounty/3dtiles/tileset.json',
      3
    );

    this.render3dtile.setMSSE(5);
    // 1.5 880 1 650
    this.render3dtile.group.position.set(-25, 60, -108);
    // @ts-ignore
    this.label2d.scene.position.set(0, 10, 0);
    // this.render3dtile.group.scale.y = 1;
    // this.render3dtile.createGUI(new GUI());
    // this.debugCenter(new GUI()); // 调试倾斜摄影位置使用
    // helpers.createBaseGUI(this.render3dtile.group, new GUI());
    window.addEventListener('resize', async () => {
      await this.map?.once('idle');
      this.resize();
    });
  }
  // 判断是否展示倾斜摄影
  // 隐藏倾斜摄影
  dispose() {
    this.render3dtile.dispose();
  }

  resize() {
    const { clientWidth, clientHeight } = this.dom;
    this.render3dtile.resize(clientHeight);
    this.label2d.resize(clientWidth, clientHeight);
    this.myLine.forEach(item => {
      item.resize(clientWidth, clientHeight);
    });
    // this.map.setPointer();
  }

  mapRender(
    gl: WebGLRenderingContext,
    matrix: number[],
    l: THREE.Matrix4,
    cameraInMeter: number[]
  ): void {
    // let info = MapFlyTo.getCameraInfo(this.map);
    // const list = TerrainUtil.coordinateTransformXY(
    //   info.center[0],
    //   info.center[1],
    //   this.modelAsMercatorCoordinate
    // );
    // let altitude =
    //   this.map.queryTerrainElevation(
    //     new mapboxgl.LngLat(info.center[0], info.center[1]),
    //     {
    //       exaggerated: false
    //     }
    //   ) || 0;

    // altitude = altitude * DEPTH_AMPLITUDE.map_exaggeration;
    // this.mapCamera.position.set(
    //   cameraInMeter[0],
    //   cameraInMeter[2],
    //   cameraInMeter[1]
    // );
    // this.mapCamera.lookAt(list[0], altitude, list[1]);
    // this.renderer.render(this.scene, this.camera);
    // gl.disable(gl.POLYGON_OFFSET_FILL);
    let info = MapFlyTo.getCameraInfo(this.map);
    let list = TerrainUtil.coordinateTransform(
      {
        longitude: info.center[0],
        latitude: info.center[1],
        altitude: 0
      },
      this.modelAsMercatorCoordinate
    );
    this.mapCamera.position.set(
      cameraInMeter[0],
      cameraInMeter[2] - 200 + 800,
      cameraInMeter[1]
    );
    this.mapCamera.lookAt(list[0], -800, -list[1]);
    this.label2d.render();

    // gl.enable(gl.POLYGON_OFFSET_FILL);
    this.renderer.render(this.scene, this.camera);
    // gl.disable(gl.POLYGON_OFFSET_FILL);
  }

  onRemove(map: mapboxgl.Map, gl: WebGLRenderingContext): void {
    this.render3dtile.dispose();
    this.camera.clear();
    delete this.camera;
    this.mapCamera.clear();
    delete this.mapCamera;
    this.scene.traverse(item => {
      if ((item as THREE.Mesh).material) {
        utils.materialForEach(item as THREE.Mesh, (m: THREE.Material) => {
          m.dispose();
        });
      }
      if ((item as THREE.Mesh).geometry) {
        (item as THREE.Mesh).geometry.dispose();
      }
    });
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      this.scene.remove(this.scene.children[i]);
    }
    this.scene.clear();
    delete this.scene;
    this.renderer.clear();
    this.renderer.dispose();
  }
}

// /**
//  * 更新村庄高亮点位
//  * @returns
//  */
// updatePolygon() {
//   // this.render3dtile.group.traverse(item => {
//   //   utils.materialForEach(item, material => {
//   //     material.polygonOffset = true;
//   //     material.polygonOffsetFactor = 5;
//   //     material.polygonOffsetUnits = 10;
//   //   });
//   // });

//   this.isRenderDone = true;
//   this.map.setPointer();
//   if (!this.polygonColor) return;
//   let pointsData = [
//     {
//       points: this.points,
//       color: '#fff',
//       intensity: 2,
//       opacity: 1
//     }
//   ];
//   this.polygonColor.setQuadrangleListWithLngLat(pointsData);
// }
// /**
//  * 更新村庄高亮
//  * @param points
//  */
// updatePolygonVillage(points: [number, number][]) {
//   this.points = points;
//   this.updatePolygon();
// }
