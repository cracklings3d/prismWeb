import type {Material} from "./Material.ts";


interface IRenderable {
  readonly vertexData: Float32Array;
  readonly vertexDataByteLength: number;
  // TODO: Multiple materials should be possible on a single renderable
  // readonly material: Material;
}

function isIRenderable(object: any): object is IRenderable {
  return 'vertexData' in object && 'vertexDataByteLength' in object;
}

export {isIRenderable};
export type {IRenderable};