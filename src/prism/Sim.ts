import type {Mat4, Quat, Vec3} from "wgpu-matrix";
import {mat4} from "wgpu-matrix";
import type {World} from "./World.ts";

interface ISim {
  readonly world: World;
  readonly worldTransform: Mat4;
}

class Sim implements ISim {
  public get world() {
    return this._world;
  }
  public get worldTransform() {
    return this._worldTransform;
  }

  private readonly _world: World;

  private _worldTransform: Mat4 = mat4.identity();

  public constructor(world: World) {
    if (!world) {
      throw new Error("Sim must live in a world");
    }
    this._world = world;
  }

  // TODO
  public frame() {
  }

  public ResetTransform() {
    this._worldTransform = mat4.identity();
  }

  public MoveBy(vec3: Vec3) {
    this._worldTransform = mat4.translate(this._worldTransform, vec3);
  }

  public rotateBy(rot: Quat) {
    this._worldTransform = mat4.mul(mat4.fromQuat(rot), this._worldTransform);
  }

  public scaleBy(vec3: Vec3) {
    this._worldTransform = mat4.scale(this._worldTransform, vec3);
  }

  public setWorldTransform(matrix: Mat4) {
    this._worldTransform = matrix;
  }

  public getWorldTransform() {
    return this._worldTransform;
  }
}

export {Sim}