import type {Sim} from "./Sim.ts";
import type {Engine} from "./Engine.ts";
import {type IRenderable, isIRenderable} from "./IRenderable.ts";
import {SimView} from "./SimView.ts";


class World {
  private _engine: Engine;

  private _roots: Array<Sim> = [];

  private _view: SimView;

  public constructor(engine: Engine) {
    this._engine = engine;
    this._view = new SimView(this);
  }

  public add(sim: Sim) {
    this._roots.push(sim);
  }

  public remove(sim: Sim) {
    const index = this._roots.indexOf(sim);
    if (index > -1) {
      this._roots.splice(index, 1);
    }
  }

  public get renderables(): Array<IRenderable> {
    // TODO: When we have a scene graph, we should traverse the graph to get all renderables
    return this._roots.filter((sim: Sim) => {
      return isIRenderable(sim);
    });
  }

  public get engine() {
    return this._engine;
  }

  public get view() {
    return this._view;
  }
}

export {World};