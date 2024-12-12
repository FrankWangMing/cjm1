import * as THREE from 'three';
import GUI from 'lil-gui';

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
  _id = '';
  get id() {
    return this._id;
  }
  type = 'custom';
  renderingMode = '3d';

  map!: mapboxgl.Map;
  modelTransform!: MapModelTransform;

  camera = new THREE.PerspectiveCamera();
  scene = new THREE.Scene();
  renderer!: THREE.WebGLRenderer;

  center!: [number, number];
  dom!: HTMLElement;
  render3dtileParam?: {
    scaleUP: number;
    offset: number;
    msse: number;
    scaleXY: number;
    disposeEND: boolean;
    threshold?: number;
  };
  tilePath?: string;
  tilePosition?: [number, number, number];

  constructor(
    map: mapboxgl.Map,
    center: [number, number],
    dom: HTMLElement,
    id: string,
    render3dtileParam?: {
      scaleUP: number;
      offset: number;
      msse: number;
      scaleXY: number;
      disposeEND: boolean;
      threshold?: number;
    },
    tilePath?: string,
    tilePosition?: [number, number, number]
  ) {
    this.map = map;
    this.center = center;
    this.dom = dom;
    this.initTransform(center);
    this._id = id;
    this.render3dtileParam = render3dtileParam;
    this.tilePath = tilePath;
    this.tilePosition = tilePosition;
  }

  modelAsMercatorCoordinate!: mapboxgl.MercatorCoordinate;
  initTransform(center: [number, number]) {
    // parameters to ensure the model is georeferenced correctly on the map
    const modelOrigin: [number, number] = center; //[114.350246, 34.779727]; // 淳安
    // const modelOrigin = [119.037488, 30.280660]		 	// 华光潭
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );
    this.modelAsMercatorCoordinate = modelAsMercatorCoordinate;

    // transformation parameters to position, rotate and scale the 3D model onto the map

    this.modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y, // @ts-ignore
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
    this.init();
  }

  abstract init(): void;

  render(gl: WebGLRenderingContext, matrix: number[]): void {
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
      // @ts-ignore
      (cameraOptions.position.x - this.modelTransform.translateX) /
        this.modelTransform.scale,
      // @ts-ignore
      (cameraOptions.position.y - this.modelTransform.translateY) /
        this.modelTransform.scale,
      // @ts-ignore
      (cameraOptions.position.z - this.modelTransform.translateZ) /
        this.modelTransform.scale
    ];

    this.renderer.resetState();
    this.mapRender(gl, matrix, l, cameraPositionInMeter);
    // this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint(); // otherwise the renderer result will show in future repaint
  }

  abstract mapRender(
    gl: WebGLRenderingContext,
    matrix: number[],
    l: THREE.Matrix4,
    cameraPositionInMeter: number[]
  ): void;

  abstract onRemove(map: mapboxgl.Map, gl: WebGLRenderingContext): void;

  centerParams: {
    lng: number;
    lat: number;
    step: number;
  } = {
    lng: 0,
    lat: 0,
    step: 0.0001
  };

  debugCenter(gui: GUI): void {
    if (!gui) return;
    let folder = gui.addFolder(
      'layer-center-' + Math.floor(Math.random() * 1000)
    );
    this.centerParams.lng = this.center[0];
    this.centerParams.lat = this.center[1];
    folder
      .add(this.centerParams, 'lng', 0, 120, this.centerParams.step)
      .onChange(() => {
        this.initTransform([this.centerParams.lng, this.centerParams.lat]);
      });
    folder
      .add(this.centerParams, 'lat', 0, 90, this.centerParams.step)
      .onChange(() => {
        this.initTransform([this.centerParams.lng, this.centerParams.lat]);
      });
    folder.add(this.centerParams, 'step', 0, 1, 0.000001).onChange(() => {
      for (let i = 0; i < folder.controllers.length; i++) {
        let controller = folder.controllers[i];
        if (controller._name === 'lng' || controller._name === 'lat') {
          controller.step(this.centerParams.step);
        }
      }
    });
  }
}
