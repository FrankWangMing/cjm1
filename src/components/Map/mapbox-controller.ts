import * as THREE from 'three';
import { MapboxLayerId } from '@/utils/const';
// 这是一个用于管理mapbox和three.js之间交互的基类
export interface MapModelTransform {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
}

export abstract class mapControllerBase {
  id = MapboxLayerId.resultLayerId;
  type = 'custom';
  renderingMode = '3d';
  modelAsMercatorCoordinate;

  map!: mapboxgl.Map;
  modelTransform!: MapModelTransform;

  camera = new THREE.Camera();
  scene = new THREE.Scene();
  renderer!: THREE.WebGLRenderer;

  constructor(map: mapboxgl.Map, center: [number, number], id: string) {
    this.map = map;
    this.initTransform(center);
    this.id = id;
  }

  initTransform(center: [number, number]) {
    // parameters to ensure the model is georeferenced correctly on the map
    const modelOrigin: [number, number] = center; //[114.350246, 34.779727]; // 淳安
    const modelAltitude = 0; //设定模型的高度
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );
    this.modelAsMercatorCoordinate = modelAsMercatorCoordinate;

    // transformation parameters to position, rotate and scale the 3D model onto the map
    this.modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      /* Since the 3D model is in real world meters, a scale transform needs to be
       * applied since the CustomLayerInterface expects units in MercatorCoordinates.
       * unit: 墨卡托单位长度 / 米
       */
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };
  }
  onAdd(map, gl) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
      preserveDrawingBuffer: false
    });
    this.renderer.autoClear = false;
    // this.callback && this.callback();
  }

  // abstract init(): void;

  render(gl: WebGLRenderingContext, matrix: number[]): void {
    if (!this.renderer) return;
    const rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      this.modelTransform.rotateX
    );
    const rotationY = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 1, 0),
      this.modelTransform.rotateY
    );
    const rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      this.modelTransform.rotateZ
    );

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4()
      .makeTranslation(
        this.modelTransform.translateX,
        this.modelTransform.translateY,
        this.modelTransform.translateZ
      )
      .scale(
        new THREE.Vector3(
          this.modelTransform.scale,
          -this.modelTransform.scale,
          this.modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    this.camera.projectionMatrix = m.multiply(l);

    // For [RainEffect], [PlaneWater4]
    const cameraOptions = this.map.getFreeCameraOptions();
    // 转换成米为单位，以便在threejs使用
    let cameraPositionInMeter = [
      (cameraOptions.position.x - this.modelTransform.translateX) /
        this.modelTransform.scale,
      (cameraOptions.position.y - this.modelTransform.translateY) /
        this.modelTransform.scale,
      (cameraOptions.position.z - this.modelTransform.translateZ) /
        this.modelTransform.scale
    ];

    this.renderer.resetState();
    this.mapRender(gl, matrix, l);
    // this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint(); // otherwise the renderer result will show in future repaint
  }

  abstract mapRender(
    gl: WebGLRenderingContext,
    matrix: number[],
    l: THREE.Matrix4
  ): void;

  abstract dispose(): void;

  callback?: () => void;
}
