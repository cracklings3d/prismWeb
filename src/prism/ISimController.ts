import {Sim} from "./Sim";
import type {IInputState} from "./Input";


/** Interface for a controller that can control a Sim */
interface ISimController {
  /**
   * Set the target to be controlled
   * @param sim The target to be controlled
   */
  possess: (sim: Sim) => void;

  /**
   * Tick function
   * @param dt Delta time in seconds
   */
  tick: (dt: number) => void;

  updateInputState: (inputState: IInputState) => void;
}


export type {IInputState, ISimController,}
