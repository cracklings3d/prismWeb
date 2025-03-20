/**
 * @enum EInputStateDeviceType
 * @description Type of input device
 */
enum EInputStateDeviceType {
  KEYBOARD,
  MOUSE,
}

/**
 * @class AtomicInputState
 * @description An atomic input event. It consists of a key and a scale.
 * The key is a string that separates pressing 'a' on the keyboard from pressing 's' or 'd',
 * and the scale is a number that represents the strength of the input event.
 * Keyboard state scales are binary, whereas other devices like mouse pointers or game pads
 * could have continuous values.
 */
class AtomicInputState {
  public key: string;
  public scale: number;
}

// class AtomicInputAction {
//   public key: string;
//   public scale: number;
// }

/**
 * @interface IInputState
 * @description Interface for low level input state. Every state consists of two parts: the Key and the Scale.
 * The Key is a string that separates one input event from another, and the Scale is a number that represents the
 *     strength of the input event.
 */
interface IInputState {
  getDeviceType: () => EInputStateDeviceType;

  getStates: () => Array<AtomicInputState>
}

/**
 * @class KeyboardState
 * @description Low level input state for a generic keyboard. It is an __immutable__ collection of AtomicInputState.
 * @implements IInputState
 */
class KeyboardState implements IInputState {
  constructor(states: Array<AtomicInputState>) {
    this.states = states;
  }

  /** Implement the IInputState interface */
  getDeviceType(): EInputStateDeviceType {
    return EInputStateDeviceType.KEYBOARD;
  }

  getStates(): Array<AtomicInputState> {
    return this.states;
  }

  // No setter. The states are immutable

  private states: Array<AtomicInputState> = [];
}

/** Process the low level input events, and update the high level input state */
class InputProcessor {
  /** Tick function. Input events are processed here, and the high level input state is updated */
  public tick(dt: number) {

  }


  /** Delegates for the low level input events */
  public onKeyDown: (event: KeyboardEvent) => void;
  public onKeyUp: (event: KeyboardEvent) => void;
  public onMouseEvent: (event: MouseEvent) => void;

  /** Cache for last input state */
  private lastInputStates: Map<EInputStateDeviceType, IInputState>
}

/** Interpret the high level input events. Some engines call this input mapping */
class InputInterpreter {
  public tick(dt: number) {
  }
}

export {EInputStateDeviceType, KeyboardState, InputProcessor, InputInterpreter};
export type {IInputState}
