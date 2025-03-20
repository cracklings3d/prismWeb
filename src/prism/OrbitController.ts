import {Sim} from "./Sim.ts";
import {mat4, quatd, vec3} from "wgpu-matrix";
import type {Vec3, Mat4} from "wgpu-matrix";


class OrbitController {
  private _mouseSensitivity: number = 0.01;

  private _sim: Sim | null = null;

  private _dragging: boolean = false;

  private _viewMatrix: Mat4 = mat4.identity();

  constructor() {
  }

  public possess(sim: Sim) {
    this._sim = sim;
  }

  public tick(dt: number) {
  }

  public Orbit(dx: number, dy: number) {
    if (this._sim) {
      // Orbit the camera around the origin
      const simTransform: Mat4 = this._sim.getWorldTransform();

      // get spherical coordinates
      const radius = vec3.len(mat4.getTranslation(this._sim.getWorldTransform()));
      console.log(radius)
    }
  }

  public OnDragBegin(e: MouseEvent) {
    this._dragging = true;
  }

  public OnDragEnd(e: MouseEvent) {
    this._dragging = false;
  }

  public OnMoveEvent(e: MouseEvent) {
    if (this._dragging) {
      this.Orbit(e.movementX, e.movementY);
    }
  }


}

export {OrbitController}