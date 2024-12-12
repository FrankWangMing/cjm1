import * as THREE from "three";
import GUI from "lil-gui";

import { MapModelTransform, utils } from "@ys/dte";

export interface LayerParams {
  id: string;
  map: mapboxgl.Map;
  center: [number, number];
  dom?: HTMLElement;
  gui?: GUI;
}

export abstract class MapLayerBase implements mapboxgl.CustomLayerInterface {
  id = "3d-model";
  type: "custom" = "custom";
  renderingMode?: "2d" | "3d" = "3d";

  map!: mapboxgl.Map;
  gui?: GUI;
  camera = new THREE.PerspectiveCamera();
  scene = new THREE.Scene();
  renderer!: THREE.WebGLRenderer;

  center: THREE.Vector2 = new THREE.Vector2(120, 30);
  dom?: HTMLElement;

  setResize = this.resize.bind(this);
  modelAsMercatorCoordinate: mapboxgl.MercatorCoordinate =
    mapboxgl.MercatorCoordinate.fromLngLat([120, 30], 0);
  sceneMercator!: mapboxgl.MercatorCoordinate;

  constructor(params: LayerParams) {
    this.id = params.id;
    this.map = params.map;
    this.dom = params.dom;
    this.gui = params.gui;
    this.initTransform(params.center);
  }

  onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.renderer = new THREE.WebGL1Renderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: false,
      // preserveDrawingBuffer: false,
    });

    this.renderer.setClearColor(new THREE.Color("#ccc"), 0);
    this.renderer.autoClear = false;
    this.renderer.autoClearColor = false;

    this.init();

    map.on("wheel", (ev: mapboxgl.MapEventType) => {
      this.mapWheel(ev);
    });
    map.on("mouseup", (ev: mapboxgl.MapEventType) => {
      this.mapMouseup(ev);
    });
  }
  abstract mapWheel(ev: mapboxgl.MapEventType): any;
  abstract mapMouseup(ev: mapboxgl.MapEventType): any;

  abstract init(): void;

  centerParams: {
    lng: number;
    lat: number;
    step: number;
  } = {
    lng: 0,
    lat: 0,
    step: 0.0001,
  };

  debugCenter(gui: GUI): void {
    if (!gui) return;
    let folder = gui.addFolder(
      "layer-center-" + Math.floor(Math.random() * 1000)
    );
    this.centerParams.lng = this.center.x;
    this.centerParams.lat = this.center.y;
    folder
      .add(this.centerParams, "lng", 0, 180, this.centerParams.step)
      .onChange(() => {
        this.initTransform([this.centerParams.lng, this.centerParams.lat]);
      });
    folder
      .add(this.centerParams, "lat", 0, 90, this.centerParams.step)
      .onChange(() => {
        this.initTransform([this.centerParams.lng, this.centerParams.lat]);
      });
    folder.add(this.centerParams, "step", 0, 1, 0.000001).onChange(() => {
      for (let i = 0; i < folder.controllers.length; i++) {
        let controller = folder.controllers[i];
        if (controller._name === "lng" || controller._name === "lat") {
          controller.step(this.centerParams.step);
        }
      }
    });
  }

  initTransform(center: [number, number]) {
    this.center.set(center[0], center[1]);
    // parameters to ensure the model is georeferenced correctly on the map
    const modelOrigin: [number, number] = center;

    const modelAltitude = 0;

    const mAMC = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );
    this.modelAsMercatorCoordinate.x = mAMC.x;
    this.modelAsMercatorCoordinate.y = mAMC.y;
    this.modelAsMercatorCoordinate.z = mAMC.z;
    this.sceneMercator = this.modelAsMercatorCoordinate;

    this.setMercator();
  }

  modelTransform: MapModelTransform = {
    rotateX: Math.PI / 2,
    rotateY: 0,
    rotateZ: 0,
    scale: 0,
    rotationX: new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      Math.PI / 2
    ),
    rotationY: new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 1, 0),
      0
    ),
    rotationZ: new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      0
    ),
    makeTranslation: new THREE.Matrix4(),
    mapMatrix: new THREE.Matrix4(),
    makeXYZ: new THREE.Matrix4(),
    l: new THREE.Matrix4(),
  };

  setMercator() {
    // transformation parameters to position, rotate and scale the 3D model onto the map
    const mAMC = this.modelAsMercatorCoordinate;
    this.modelTransform.scale = mAMC.meterInMercatorCoordinateUnits();
    this.modelTransform.makeTranslation.copy(
      new THREE.Matrix4().makeTranslation(mAMC.x, mAMC.y, mAMC.z)
    );
    this.modelTransform.makeXYZ.copy(
      new THREE.Matrix4()
        .multiply(this.modelTransform.rotationX)
        .multiply(this.modelTransform.rotationY)
        .multiply(this.modelTransform.rotationZ)
    );
    const l = this.modelTransform.makeTranslation
      .clone()
      .scale(
        new THREE.Vector3(
          this.modelTransform.scale,
          -this.modelTransform.scale,
          this.modelTransform.scale
        )
      )
      .multiply(this.modelTransform.makeXYZ);
    this.modelTransform.l.copy(l);
  }

  // prerender?(gl: WebGLRenderingContext, matrix: number[]): void {
  //   throw new Error("Method not implemented.");
  // }

  render(gl: WebGLRenderingContext, matrix: number[]): void {
    const m = new THREE.Matrix4().fromArray(matrix);
    // 特殊处理
    // this.modelTransform.mapMatrix.copy(m);
    // this.modelTransform.mapMatrix.multiply(this.modelTransform.makeTranslation);
    // const elements = this.modelTransform.mapMatrix.elements;
    // for (let i = 0; i < elements.length; i++) {
    //   elements[i] = elements[i] * 0.0000002;
    // }
    const l = this.modelTransform.l;
    this.camera.projectionMatrix = m.multiply(l);

    // For [RainEffect], [PlaneWater4]
    const cameraOptions = this.map.getFreeCameraOptions();
    // 转换成米为单位，以便在threejs使用
    let cameraPositionInMeter = [
      (cameraOptions.position.x - this.modelAsMercatorCoordinate.x) /
        this.modelTransform.scale,
      (cameraOptions.position.y - this.modelAsMercatorCoordinate.y) /
        this.modelTransform.scale,
      (cameraOptions.position.z - this.modelAsMercatorCoordinate.z) /
        this.modelTransform.scale,
    ];

    this.renderer.resetState();
    this.mapRender(gl, matrix, l, cameraPositionInMeter);
    // this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint(); // otherwise the renderer result will show in future repaint
  }

  getHeight(height: number): number {
    return (
      (height - this.modelAsMercatorCoordinate.z) / this.modelTransform.scale
    );
  }

  abstract mapRender(
    gl: WebGLRenderingContext,
    matrix: number[],
    l: THREE.Matrix4,
    cameraPositionInMeter: number[]
  ): void;

  abstract resize(): void;

  onRemove(map: mapboxgl.Map, gl: WebGLRenderingContext): void {
    this.camera.clear();
    delete this.camera;
    this.scene.traverse((item) => {
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
    delete this.renderer;
  }
}
