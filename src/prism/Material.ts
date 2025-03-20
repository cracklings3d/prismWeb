import vertexShader from '../shaders/vertex.wgsl?raw';
import fragmentShader from '../shaders/fragment.wgsl?raw';
// import {World} from "./World.ts";


class VertexLayout {
  public arrayStride: number;
  public attributes: GPUVertexAttribute[];

  constructor(stride: number, attributes: GPUVertexAttribute[]) {
    this.arrayStride = stride;
    this.attributes = attributes;
  }
}

class ShaderModuleWithEntryPoint {
  public module: GPUShaderModule;
  public entryPoint: string;

  constructor(module: GPUShaderModule, entryPoint: string) {
    this.module = module
    this.entryPoint = entryPoint
  }
}

// TODO: IMaterial
class Material {
  _device: GPUDevice;

  _vertexShaderModule: GPUShaderModule;
  _fragmentShaderModule: GPUShaderModule;

  _uniformBindGroupLayout: GPUBindGroupLayout;

  constructor(device: GPUDevice) {
    if (!device) throw new Error("Invalid device");

    this._device = device;

    this._uniformBindGroupLayout = this._device.createBindGroupLayout({
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {type: 'uniform'}
      }]
    });

    this._vertexShaderModule = this._device.createShaderModule({
      code: vertexShader
    });

    this._fragmentShaderModule = this._device.createShaderModule({
      code: fragmentShader
    });
  }

  public vertexModule() {
    return new ShaderModuleWithEntryPoint(this._vertexShaderModule, "vertexMain");
  }

  public fragmentModule() {
    return new ShaderModuleWithEntryPoint(this._fragmentShaderModule, "fragmentMain");
  }

  public getVertexLayout = () =>
      new VertexLayout(12, [
        {
          shaderLocation: 0,
          offset: 0,
          format: 'float32x3'
        }
        // {
        //   shaderLocation: 1,
        //   offset: 12,
        //   format: 'float32x4'
        // }
      ]);

  public createPipeline(targetFormat: GPUTextureFormat) {
    const vertexShaderModule = this.vertexModule();
    const fragmentShaderModule = this.fragmentModule();
    const pipelineLayout
        = this._device.createPipelineLayout({bindGroupLayouts: [this._uniformBindGroupLayout]});

    return this._device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: vertexShaderModule.module,
        entryPoint: vertexShaderModule.entryPoint,
        buffers: [this.getVertexLayout()],
      },
      fragment: {
        module: fragmentShaderModule.module,
        entryPoint: fragmentShaderModule.entryPoint,
        targets: [{format: targetFormat}],
      },
    });
  }

  public getUniformBindGroupLayout() {
    return this._uniformBindGroupLayout;
  }
}

export {Material, VertexLayout}