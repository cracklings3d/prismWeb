import {type Mat4, vec3d, type Vec3d} from "wgpu-matrix";
import {mat4} from "wgpu-matrix";
import {Sim} from "./Sim.ts";
import type {World} from "./World.ts";


class SimView extends Sim {
  private _isDirty: boolean = true;

  // Camera properties
  private _eyePosition: Vec3d;
  private _viewTarget: Vec3d;
  private _worldUp: Vec3d;

  // Projection properties
  private _fovInRadian: number = Math.PI / 2;
  private _aspect: number = 16 / 9;
  private _near: number = 0.01;
  private _far: number = 10000;

  private _viewMatrixCache: Mat4 = mat4.identity();
  private _projectionMatrixCache: Mat4 = mat4.identity();

  constructor(world: World) {
    super(world);

    this._eyePosition = vec3d.create(0, 0, 2);
    this._viewTarget = vec3d.create(0, 0, 0);
    this._worldUp = vec3d.create(0, 1, 0);
  }

  // Lazy evaluation on view and projection matrices
  public setEyePosition(position: Vec3d) {
    this._isDirty = true;
    this._eyePosition = position;
  }

  public lookAt(target: Vec3d) {
    this._isDirty = true;
    this._viewTarget = target;
  }

  public setFoV(fovInDegree: number) {
    this._isDirty = true;
    this._fovInRadian = fovInDegree;
  }

  public setAspect(aspect: number) {
    this._isDirty = true;
    this._aspect = aspect;
  }

  public getViewMatrix() {
    if (this._isDirty) {
      this._viewMatrixCache = mat4.lookAt(this._eyePosition, this._viewTarget, this._worldUp);
      this._projectionMatrixCache = mat4.perspective(this._fovInRadian, this._aspect, this._near, this._far);
      this._isDirty = false;
    }
    return this._viewMatrixCache;
  }

  public getProjectionMatrix() {
    if (this._isDirty) {
      this._viewMatrixCache = mat4.lookAt(this._eyePosition, this._viewTarget, this._worldUp);
      this._projectionMatrixCache = mat4.perspective(this._fovInRadian, this._aspect, this._near, this._far);
      this._isDirty = false;
    }
    return this._projectionMatrixCache;
  }

  public getViewProjectionMatrix() {
    return mat4.mul(this.getProjectionMatrix(), this.getViewMatrix());
  }
}

export {SimView}