// import {
//   WaterResampleAnimation,
//   JsonLoader,
//   RaycastMap,
//   WaterAnimationParams,
//   utils
// } from '@ys/dte';
import {
  JsonLoader,
  ProgressData,
  RaycastMap,
  utils,
  mapboxgl,
  WaterResampleAnimation
} from 'ys-dte';
import * as THREE from 'three';
import { mapControllerBase } from './mapbox-controller';
import { message } from 'antd';
import {
  DEPTH_AMPLITUDE,
  MapboxLayerId,
  PHYSICAL_KEYWORDS,
  StaticDirUrl
} from '@/utils/const';
import GlobalStore from '@/store';
import GUI from 'lil-gui';
interface loadResultSimAnimationProp {
  renderDataType: string;
  colorTheme: string;
  resultPathList: string[];
  handleLoadedNum: Function;
  _sumFrames: number;
  maxValue?: { [key: string]: number };
  meshUrl?: string;
  geo_caUrl?: string;
}
class MapboxLayer extends mapControllerBase {
  /**
   * 水动力对象
   */
  water: WaterResampleAnimation | null = null;
  /**
   * 网格对象
   */
  mainGeo: THREE.BufferGeometry | null = null;
  /**
   * 射线对象
   */
  raycast: RaycastMap | null = null;

  /**
   * 经纬度校准文件对象
   */
  lngLatFile: THREE.BufferGeometry | null = null;
  // lngLatFile: ProgressEvent | null = null;
  result;
  newDialog: HTMLDivElement | null = null;
  camera = new THREE.Camera();
  scene = new THREE.Scene();
  objWaterParams!: WaterAnimationParams;
  NFrames = 0;
  load = new JsonLoader();
  _timeout;
  _isUpdateBottom: boolean = true;
  setIsUpdateBottom(e: boolean) {
    this._isUpdateBottom = e;
  }

  /**
   * 初始化产生一个SimAnimation
   * @param geometryPathUrl 网格文件路径
   * @param geo_caPathUrl 经纬度校准文件
   * @returns
   */
  async initGeometryByPathUrl(
    geometryPathUrl: string,
    geo_caPathUrl: string
  ): Promise<string> {
    let _this = this;
    return new Promise(async (resolve, reject) => {
      try {
        _this.mainGeo = await _this.load.loadDataMeshAsync(geometryPathUrl);
        for (let i in _this.mainGeo.attributes) {
          if (i.includes('BOTTOM')) {
            _this.mainGeo.setAttribute('BOTTOM', _this.mainGeo.attributes[i]);
          }
        }
        let file = await this.load.loadOneCustomFrameAsync(geo_caPathUrl);
        // @ts-ignore
        _this.lngLatFile = file['geometry'] ? file.geometry : file;
        resolve('success');
      } catch (e) {
        console.error(e);
        message.error('网格文件有问题');
        reject();
      }
    });
  }

  initObjWaterParams({
    renderDataType,
    colorTheme,
    _sumFrames,
    maxValue
  }: {
    renderDataType: string;
    colorTheme: string;
    _sumFrames: number;
    maxValue?: {
      [key: string]: number;
    };
  }) {
    // 周计算、日计算最大值
    let durationMaxValue = 12 * 60;
    if (maxValue) {
      durationMaxValue = maxValue[PHYSICAL_KEYWORDS.历时];
    }
    let tempObjWaterParams: WaterAnimationParams = {
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      // positionX: 10,
      // positionY: -35.6,
      // positionZ: -10,
      rotateY: 0,
      scale: 1,
      scaleY: 1,
      index: 0,
      nFrames: _sumFrames,
      depthAmplitude: 0, // 渲染结果文件是否展示高程
      renderDataType: renderDataType,
      colorTheme: colorTheme,
      objColorTheme: {
        // 淹没范围-流速，
        [PHYSICAL_KEYWORDS.流速]: {
          minValue: 0.01,
          maxValue: 3,
          aryBarColorRGB: [
            0xa5d8ff, 0x0001ff, 0x07c0ff, 0xffea05, 0xc92a2a, 0xff0400
          ],
          // aryBarColorRGB: [0x1971c2, 0x4dabf7, 0xe67700, 0xc92a2a, 0xff2900],
          aryBarColorOpacity: [0.5, 0.8, 0.6, 0.8, 0.9, 1],
          aryBarValue: [0, 0.01, 0.25, 0.5, 0.75, 1]
        },
        // 淹没范围-水深
        [PHYSICAL_KEYWORDS.水深]: {
          maxValue: 4,
          minValue: 0.1,
          aryBarColorRGB: [
            0xedf2ff, 0xb3ccff, 0x8099ff, 0x5980ff, 0x2673f2, 0x004dcc
          ],
          aryBarColorOpacity: [0, 0.5, 0.6, 0.8, 0.9, 1],
          aryBarValue: [0, 0.02, 0.25, 0.5, 0.75, 1.0]
        },
        // 最大淹没历时
        // 2min-1h  1h-3h 3h-6h 6h-12h
        // 1min 1h 3h 6h 12h
        // 2min-12h 12-24h 1-3d 3-7d
        // 2min 12h 24h 24*3h 24*7h
        [PHYSICAL_KEYWORDS.历时]: {
          maxValue: durationMaxValue,
          minValue: 0,
          aryBarColorRGB:
            durationMaxValue == 720
              ? [
                  0x000000, 0xfff3bf, 0xfff3bf, 0xf2e0b3, 0xf2e0b3, 0xe0cc85,
                  0xe0cc85, 0xc3a046, 0xc3a046, 0x997819, 0x997819, 0x7a5a0d
                ]
              : [
                  0x000000, 0xf2e0b3, 0xf2e0b3, 0xe0cc85, 0xe0cc85, 0xc3a046,
                  0xc3a046, 0x997819, 0x997819, 0x7a5a0d
                ],
          aryBarColorOpacity:
            durationMaxValue == 720
              ? [0.5, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7]
              : [0.5, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
          aryBarValue:
            durationMaxValue == 720
              ? [
                  2 / durationMaxValue,
                  2 / durationMaxValue,
                  30 / durationMaxValue,
                  30 / durationMaxValue,
                  60 / durationMaxValue,
                  60 / durationMaxValue,
                  180 / durationMaxValue,
                  180 / durationMaxValue,
                  360 / durationMaxValue,
                  360 / durationMaxValue,
                  1,
                  1
                ]
              : [
                  2 / durationMaxValue,
                  2 / durationMaxValue,
                  720 / durationMaxValue,
                  720 / durationMaxValue,
                  4320 / durationMaxValue,
                  4320 / durationMaxValue,
                  10080 / durationMaxValue,
                  10080 / durationMaxValue,
                  1,
                  1
                ]
        },
        // 最大淹没水深 3
        // 0xb3ccff 0x8099ff 0x5980ff 0x2673f2 0x004dcc
        // 0.2-0.5, 0.5-1.0, 1.0-2.0, 2.0-3.0, >3.0
        // 0.0333-0.1666, 0.1666-0.3333 0.3333-0.6666 0.6666-1.0， >1.0 // 归一处理
        [PHYSICAL_KEYWORDS.最大水深]: {
          maxValue: 3,
          minValue: 0.1,
          aryBarColorRGB: [
            0x000000, 0xb3ccff, 0xb3ccff, 0x8099ff, 0x8099ff, 0x5980ff,
            0x5980ff, 0x2673f2, 0x2673f2, 0x004dcc
          ],
          aryBarColorOpacity: [
            0.5, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8
          ],
          aryBarValue: [
            0.0333, 0.0333, 0.1666, 0.1666, 0.3333, 0.3333, 0.6666, 0.6666, 1, 1
          ] // maxValue 2
        }
      },
      bPlay: false,
      bLoop: false,
      bVisible: false,
      isWater: true,
      isFill: false,
      mixValue: 0,
      interval: 0.08,
      bottomAmplitude: DEPTH_AMPLITUDE.result_bottomAmplitude,
      useBottom: false
    };
    return tempObjWaterParams;
  }
  /**
   * 创建水动力控制对象
   * @returns WaterSimAnimation
   */
  async createWaterSimAnimation({
    renderDataType,
    colorTheme,
    _sumFrames,
    maxValue
  }: {
    renderDataType: string;
    colorTheme: string;
    _sumFrames: number;
    maxValue?: { [key: string]: number };
  }): Promise<WaterResampleAnimation> {
    let tempWaterSimAnimation: WaterResampleAnimation =
      await new WaterResampleAnimation(
        this.scene,
        this.camera,
        // this.renderer,
        this.initObjWaterParams({
          renderDataType,
          colorTheme,
          _sumFrames,
          maxValue
        }),
        this.map
      );
    this.water = tempWaterSimAnimation;
  }
  /**
   * 加载simAnimation以及结果公用方法
   * @param param0
   * @returns 返回一个已经创建好并且结果文件加载完成的水动力对象
   */
  loadResultSimAnimation = async ({
    _sumFrames,
    renderDataType,
    colorTheme,
    resultPathList,
    handleLoadedNum,
    maxValue,
    meshUrl = StaticDirUrl.mesh,
    geo_caUrl = StaticDirUrl.geo_ca
  }: loadResultSimAnimationProp): Promise<WaterResampleAnimation> => {
    let _this = this;
    await _this.initGeometryByPathUrl(meshUrl, geo_caUrl); //初始化产生一个SimAnimation;
    //创建水动力控制对象
    await _this.createWaterSimAnimation({
      renderDataType,
      colorTheme,
      _sumFrames,
      maxValue
    });
    await _this.loadResult(resultPathList, _this.water!, e => {
      handleLoadedNum(e);
    });
    return _this.water;
  };

  /**
   * 更新底部高程数据
   */
  async updateBottomAmplitude() {
    if (this.water) {
      let tempDepthAmplitude = 0;
      switch (this.water.objWaterParams.renderDataType) {
        case PHYSICAL_KEYWORDS.水深:
          tempDepthAmplitude = GlobalStore.isShow3dTile ? 1 : 0;
          break;
        case PHYSICAL_KEYWORDS.流速:
          tempDepthAmplitude = GlobalStore.isShow3dTile ? 2.15 : 0;
          break;
        case PHYSICAL_KEYWORDS.最大水深:
          tempDepthAmplitude = GlobalStore.isShow3dTile ? 1.5 : 0;
          break;
        case PHYSICAL_KEYWORDS.历时:
          tempDepthAmplitude = GlobalStore.isShow3dTile ? 0.03 : 0;
          break;
      }
      this.water.objWaterParams.depthAmplitude = tempDepthAmplitude;
    }
  }

  /**
   * 这个函数不应该放在这里，但是因为这里对MapboxLayer的依赖比较深，就暂时放在这里
   */
  async loadResult(
    resultPathList: string[],
    waterSimAnimation: WaterResampleAnimation,
    handleProcessNum: Function
  ): Promise<WaterResampleAnimation | null | string> {
    let _this = this;
    if (!_this.load) return;
    return new Promise((resolve, reject) => {
      if (resultPathList && resultPathList.length > 0) {
        _this.load!.loadCustomFrame(
          resultPathList,
          async list => {
            try {
              console.log('水动力对象', waterSimAnimation);
              if (!waterSimAnimation) throw new Error();
              // 使用callback函数设置结果文件加载进度
              waterSimAnimation?.addCustomFrame(_this.mainGeo, list);
              waterSimAnimation?.oneLnglatLoaded(_this.lngLatFile);
              waterSimAnimation.updatePositionByLnglat(
                _this.modelAsMercatorCoordinate
              );
              _this.map
                .getCanvas()
                .addEventListener('pointerup', this.debounce, false);
              _this.map
                .getCanvas()
                .addEventListener('wheel', this.debounce, false);
              // waterSimAnimation.createGUI(new GUI());
              // list.length > 0 &&
              //   helpers.createBaseGUI(waterSimAnimation.group, new GUI());
              await _this.updateBottomDebounce();
              _this.addVirtualMeasuringPoint(); //
              resolve('success');
            } catch (e) {
              console.log('加载出错了', e);
              _this.abortLoadFile();
              reject();
              return;
            }
          },
          progress => {
            handleProcessNum(progress.success);
          }
        );
      } else {
        _this.abortLoadFile();
        console.error('加载结果文件中断或者结果文件为空');
        reject();
      }
    });
  }

  /**
   * 图层添加虚拟测点
   */
  addVirtualMeasuringPoint() {
    let _this = this;
    this.raycast = new RaycastMap(this.scene, this.camera, this.map);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // let boxA = new THREE.mesh(new THREE.BoxGeometry(1, 1, 1), material);
    // let boxB = new THREE.mesh(new THREE.BoxGeometry(1, 1, 1), material);
    // let boxC = new THREE.mesh(new THREE.BoxGeometry(1, 1, 1), material);

    // this.scene.add(boxA, boxB, boxC);
    GlobalStore.map?.on('click', e => {
      GlobalStore.popUp?.remove();
      if (!_this.raycast || !_this.water?.group.visible) return;
      clearTimeout(_this._timeout);
      let list = _this.raycast.getIntersection({
        x: e.point.x,
        y: e.point.y
      });
      if (!list.length) return;
      // const _arr = list[0].object.geometry.attributes['position'].array;
      // _arr[list[0].face.a]
      // console.log(
      //   '_arr[list[0].face.a]',
      //   _arr[list[0].face.a],
      //   _arr[list[0].face.b],
      //   _arr[list[0].face.c]
      // );
      // const _arrt = (this.water?.mesh as THREE.Mesh).geometry.attributes[
      //   'lnglat'
      // ].array;
      // [boxA, boxB, boxC]
      // [list[0].face.a, list[0].face.b, list[0].face.c].forEach(_item => {
      //   console.log(
      //     _arrt[_item * 3],
      //     _arrt[_item * 3 + 1],
      //     _arrt[_item * 3 + 2]
      //   );
      //   TerrainUtil.getPositionByLnglat(new mapboxgl.GeoCoordinate(), this.modelAsMercatorCoordinate, this.map,1)
      // });

      _this.result = _this.water?.getFramesByIntersection(
        list[0],
        _this.camera
      );
      if (_this.result) {
        let percentOfAll =
          (_this.water?.getCurrentFrameIndex() || 0) /
          (_this.water?._sumFrames || 1);
        let currNFrame = Math.floor(percentOfAll * _this.result['time'].length);
        currNFrame = currNFrame > 1 ? currNFrame - 1 : 0;
        let colorTheme = _this.water!.objWaterParams.colorTheme;
        let htmlTextContent = '';
        switch (colorTheme) {
          case PHYSICAL_KEYWORDS.流速:
            if (
              _this.result['data'][PHYSICAL_KEYWORDS.流速][currNFrame] > 0.01
            ) {
              htmlTextContent +=
                '<p>计算流速</p><p>' +
                _this.result['data'][PHYSICAL_KEYWORDS.流速][
                  currNFrame
                ].toFixed(3) +
                'm/s' +
                '</p>';
            }
            break;
          case PHYSICAL_KEYWORDS.水深:
            if (
              _this.result['data'][PHYSICAL_KEYWORDS.水深][currNFrame] * 100 >=
              10
            ) {
              htmlTextContent +=
                '<p>计算水深</p><p>' +
                (
                  _this.result['data'][PHYSICAL_KEYWORDS.水深][currNFrame] * 100
                ).toFixed(1) +
                'cm' +
                '</p>';
            }
            break;
          case PHYSICAL_KEYWORDS.最大水深:
            if (
              _this.result['data'][PHYSICAL_KEYWORDS.最大水深] &&
              _this.result['data'][PHYSICAL_KEYWORDS.最大水深][0] * 100 >= 10
            ) {
              htmlTextContent +=
                '<p>计算最大水深</p><p>' +
                (
                  _this.result['data'][PHYSICAL_KEYWORDS.最大水深][0] * 100
                ).toFixed(1) +
                'cm' +
                '</p>';
            }
            break;
          case PHYSICAL_KEYWORDS.历时:
            if (
              _this.result['data'][PHYSICAL_KEYWORDS.历时] &&
              _this.result['data'][PHYSICAL_KEYWORDS.历时][0] > 0
            ) {
              let currData =
                _this.result['data'][PHYSICAL_KEYWORDS.历时][0] / 60;
              let tempStr =
                '<p>计算淹没历时</p><p>' +
                (currData / 24 >= 1 ? (currData / 24).toFixed(0) + '天' : '') +
                (currData % 24 != 0
                  ? (currData % 24).toFixed(1) + '小时'
                  : '') +
                '</p>';
              htmlTextContent += tempStr;
            }
            break;
        }
        if (htmlTextContent != '' && GlobalStore.map) {
          // 地图打点
          GlobalStore.popUp = new mapboxgl.Popup()
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .setHTML('<div class="xvnicedian-p">' + htmlTextContent + '</div>')
            .addTo(GlobalStore.map);
          _this._timeout = setTimeout(() => {
            _this.disposeVirtualPoint();
          }, 3000);
        }
      }
    });
  }

  /**
   * 删除虚拟测点
   */
  disposeVirtualPoint() {
    GlobalStore.popUp?.remove();
  }

  /**
   * 中断结果文件加载过程。
   */
  abortLoadFile() {
    this.load.abort();
    this.load.dispose();
  }

  mapRender(
    gl: WebGLRenderingContext,
    matrix: number[],
    l: THREE.Matrix4
  ): void {
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(-4, -2);
    this.raycast && this.raycast.render(gl, matrix, l);
    this.water?.render(gl, matrix);
    this.renderer.render(this.scene, this.camera);
    gl.disable(gl.POLYGON_OFFSET_FILL);
  }

  pause() {
    this.water?.pause();
  }

  switchWater(
    water: WaterResampleAnimation | undefined | null,
    colorTheme: string,
    renderDataType: string
  ): WaterResampleAnimation {
    this.water?.pause();
    this.water?.show(false);
    let currFrameIndex = this.water?.getCurrentFrameIndex() || 0;
    let gotoStepIndex = water!._sumFrames > currFrameIndex ? currFrameIndex : 0;
    water?.goto(gotoStepIndex);
    water?.setColorTheme(colorTheme);
    water?.setRenderDataType(renderDataType);
    water?.show(true);
    this.water = water;
    return this.water!;
  }

  /**
   * 清除图层
   */
  dispose(): void {
    this.abortLoadFile();
    this.water?.dispose();
    this.water = null;
    if (this.map && this.map.getLayer(MapboxLayerId.resultLayerId)) {
      this.map?.removeLayer(MapboxLayerId.resultLayerId);
    }
  }

  setTime!: NodeJS.Timeout;

  /**
   * 更新地图结果文件贴合地形
   */
  updateBottomDebounce() {
    let _this = this;
    _this.updateBottomAmplitude();
    clearTimeout(_this.setTime);
    // if (_this.water && !GlobalStore.isShow3dTile) {
    if (_this.water) {
      _this.setTime = setTimeout(async () => {
        try {
          if (_this.water) {
            _this.water.objWaterParams.bottomAmplitude = 1;
            // _this.water.objWaterParams.useBottom = true;
            // _this.water.setScale(1, 1);
            if (GlobalStore.isShow3dTile) {
              // @ts-ignore
              _this.water.mesh.position.set(0, 2, 0);
              GlobalStore.update3DtileAndResultLayer();
            } else {
              // @ts-ignore
              _this.water.mesh.position.set(0, 2, 0);
            }
            _this.water.updateBottom();
          }
        } catch (e) {
          console.error(e);
        }
      }, 800 * 1);
    } else {
      // _this.setTime = setTimeout(async () => {
      //   if (_this.water) {
      //     _this.water.objWaterParams.bottomAmplitude = 1.1;
      //     _this.water.mesh.material.uniforms.depthAmplitude.value =
      //       _this.water.objWaterParams.depthAmplitude;
      //     _this.water.objWaterParams.useBottom = true;
      //     // _this.water.updateBottom();
      //     _this.water.updatePositionByLnglat(_this.modelAsMercatorCoordinate);
      //     _this.water &&
      //       _this.water.mesh && // @ts-ignore
      //       _this.water.mesh.position.set(0, -110.5, 0);
      //     // _this.water.objWaterParams.bottomAmplitude = 0;
      //   }
      // }, 800);
    }
  }
  debounce = this.updateBottomDebounce.bind(this);
  /**
   * 删除
   */
  onRemove(): void {
    this.water?.dispose();
    this.water = null;
    if (this.load) this.load.dispose();
    this.camera.clear();
    delete this.camera;
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
    delete this.renderer;
    this.map
      ?.getCanvas()
      .removeEventListener('pointerup', this.debounce, false);
    this.map?.getCanvas().removeEventListener('wheel', this.debounce, false);
  }
}

export { MapboxLayer };
