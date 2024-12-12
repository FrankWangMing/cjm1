/**
 * 村庄倾斜摄影图层
 */
// 倾斜摄影
import { MapFlyTo, Render3dtile, TerrainUtil, helpers, utils } from '@ys/dte';
import { mapControllerBase } from './3dtile-mapbox-controller';
import * as THREE from 'three';
import GUI from 'lil-gui';
import { DEPTH_AMPLITUDE } from '@/utils/const';
// ;
export default class VillageTilePhotoGraph extends mapControllerBase {
  mapCamera!: THREE.PerspectiveCamera;
  render3dtile!: Render3dtile;
  constructor(
    map: mapboxgl.Map,
    center: [number, number],
    dom: HTMLElement,
    id: string,
    render3dtileParam: {
      scaleUP: number;
      offset: number;
      msse: number;
      scaleXY: number;
      disposeEND: boolean;
    },
    tilePath: string,
    tilePosition: [number, number, number]
  ) {
    super(map, center, dom, id, render3dtileParam, tilePath, tilePosition);
  }

  async init(): Promise<void> {
    let info = MapFlyTo.getCameraInfo(this.map);
    const { clientWidth, clientHeight } = this.dom;
    this.mapCamera = new THREE.PerspectiveCamera(
      info.fov! * 2,
      clientWidth / clientHeight,
      1,
      10000
    );
    this.render3dtile = new Render3dtile(
      this.dom,
      this.scene,
      this.mapCamera,
      '/draco/'
    );
    this.render3dtile.setParams({ ...this.render3dtileParam });
    this.render3dtile.loadTileset(this.tilePath!, 4);
    this.render3dtile.setMSSE(5);
    this.render3dtile.group.position.set(...this.tilePosition!);
    // if (this.id == 'chunan-3dtile-all') {
    //   this.debugCenter(new GUI()); // 调试倾斜摄影位置使用
    //   helpers.createBaseGUI(this.render3dtile.group, new GUI());
    // }

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
    const { clientHeight } = this.dom;
    this.render3dtile.resize(clientHeight);
  }

  mapRender(
    gl: WebGLRenderingContext,
    matrix: number[],
    l: THREE.Matrix4,
    cameraInMeter: number[]
  ): void {
    let info = MapFlyTo.getCameraInfo(this.map);
    const list = TerrainUtil.coordinateTransformXY(
      info.center[0],
      info.center[1],
      this.modelAsMercatorCoordinate
    );
    let altitude =
      this.map.queryTerrainElevation(
        new mapboxgl.LngLat(info.center[0], info.center[1]),
        {
          exaggerated: false
        }
      ) || 0;

    altitude = altitude * DEPTH_AMPLITUDE.tile_exaggeration;
    this.mapCamera.position.set(
      cameraInMeter[0],
      cameraInMeter[2],
      cameraInMeter[1]
    );
    this.mapCamera.lookAt(list[0], altitude, list[1]);
    this.renderer.render(this.scene, this.camera);
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
