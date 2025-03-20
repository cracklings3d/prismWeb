import {StaticMesh} from './StaticMesh';
import {Sim} from "./Sim.ts";
import type {IRenderable} from "./IRenderable.ts";
// import {Material} from "./Material.ts";
import type {World} from "./World.ts";


class StaticMeshSim extends Sim implements IRenderable {
  private _mesh: StaticMesh | null = null;
  // private _material: Material;

  constructor(world: World) {
    super(world);
  }

  public setMesh(mesh: StaticMesh) {
    this._mesh = mesh;
  }

  public get vertexData() {
    if (this._mesh) {
      return this._mesh.getVertexData();
    }
    return new Float32Array();
  }

  public get vertexDataByteLength() {
    if (this._mesh) {
      return this._mesh.getVertexDataByteLength();
    }
    return 0;
  }

  // public get material() {
  //   return this._material;
  // }
}

export {StaticMeshSim};