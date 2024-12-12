import * as THREE from 'three';
import GUI from 'lil-gui';

import {
  MapFlyTo,
  Render3dtile,
  helpers,
  utils,
  TerrainUtil,
  LineSingle
} from '@ys/dte';

import { MapLayerBase, LayerParams } from './3dtile-commom-controller';

export interface TileParams extends LayerParams {
  url: string;
  position: THREE.Vector3;
}

export default class TileCommonLayer extends MapLayerBase {
  // id = "render";
  mapCamera!: THREE.PerspectiveCamera;
  render3dtile!: Render3dtile;
  // testBOX = new THREE.Mesh(new THREE.BoxGeometry(20, 2000, 20));
  params: TileParams;
  constructor(params: TileParams) {
    super(params);
    this.params = params;
  }
  async mapMouseup(ev: mapboxgl.MapEventType) {}
  async mapWheel(ev: mapboxgl.MapEventType) {}

  async init(): Promise<void> {
    let info = MapFlyTo.getCameraInfo(this.map);

    const { clientWidth, clientHeight } = this.dom;

    this.mapCamera = new THREE.PerspectiveCamera(
      info.fov,
      clientWidth / clientHeight,
      1,
      8000
    );

    this.render3dtile = new Render3dtile(
      this.dom,
      this.scene,
      this.mapCamera,
      '/draco/'
    );
    this.render3dtile.setParams({
      msse: 25,
      disposeEND: false,
      // scaleXY: 1.01,
      // encoding: THREE.sRGBEncoding,
      threshold: 0.8,
      intensity: 1.1
    });

    this.render3dtile.loadTileset(this.params.url, 3);
    // this.render3dtile.group.position.set(0, 313, 0);
    this.render3dtile.group.position.copy(this.params.position);

    this.debugCenter(this.params.gui);
    helpers.createBaseGUI(this.render3dtile.group, this.params.gui);
    // this.render3dtile.createGUI(this.gui);
    this.resize();
    window.addEventListener('resize', this.setResize);
    this.camera.updateMatrix = () => {};
    this.camera.updateMatrixWorld = () => {};
    this.camera.updateProjectionMatrix = () => {};
  }

  lineList: LineSingle[] = [];

  resize() {
    const { clientWidth, clientHeight } = this.dom;
    this.render3dtile.resize(clientWidth);
    this.lineList.forEach(item => {
      item.resize(clientWidth, clientHeight);
    });
  }

  mapRender(
    gl: WebGLRenderingContext,
    matrix: number[],
    l: THREE.Matrix4,
    cameraInMeter: number[]
  ): void {
    if (!this.renderer) return;

    gl.disable(gl.POLYGON_OFFSET_FILL);

    let info = MapFlyTo.getCameraInfo(this.map);

    const list = TerrainUtil.coordinateTransformXY(
      info.center[0],
      info.center[1],
      this.modelAsMercatorCoordinate
    );
    let altitude = this.map.queryTerrainElevation(
      new mapboxgl.LngLat(info.center[0], info.center[1]),
      {
        exaggerated: false
      }
    );

    altitude = altitude * 1;

    this.mapCamera.position.set(
      cameraInMeter[0],
      cameraInMeter[2],
      cameraInMeter[1]
    );
    this.camera.position.set(
      cameraInMeter[0],
      cameraInMeter[2],
      cameraInMeter[1]
    );
    this.mapCamera.lookAt(list[0], altitude, list[1]);
    // this.testBOX.position.set(list[0], altitude, list[1]);

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
