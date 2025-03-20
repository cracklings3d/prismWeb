import type {Mat4} from "wgpu-matrix";


interface IRenderCommand {
  readonly vertexData: Float32Array;
  readonly vertexDataByteLength: number;
  readonly pipeline: GPURenderPipeline;
  readonly mvp: Mat4;
}

export type {IRenderCommand};