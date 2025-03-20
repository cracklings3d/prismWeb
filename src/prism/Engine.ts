import { Renderer } from './Renderer.ts'
import { mat4, vec3d } from 'wgpu-matrix'
// import {OrbitController} from "./OrbitController.ts";
import { StaticMesh } from './StaticMesh'
import { World } from './World.ts'
import { StaticMeshSim } from './StaticMeshSim.ts'
import { Check } from './Util.ts'

class Engine {
  public get world(): World {
    return this._world
  }

  public get device(): GPUDevice {
    return this._device
  }

  private _device!: GPUDevice

  private _canvas: HTMLCanvasElement
  private _canvasResizeObserver?: ResizeObserver

  private _context: GPUCanvasContext

  private _renderer!: Renderer

  // private _simController: OrbitController | null = null;
  private _world: World = new World(this)

  public constructor(Canvas: HTMLCanvasElement) {
    this._canvas = Check(Canvas, 'Invalid canvas element')

    this._context = Check(
      this._canvas.getContext('webgpu'),
      'WebGPU is not supported in this canvas'
    )

    this.init().then(() => {
      this.setupWorld()
      this.renderLoop()
    })
  }

  private async requestDevice() {
    const gpu = Check(navigator.gpu, 'This browser does not support WebGPU.')
    const adapter = Check(await gpu.requestAdapter(), 'No adapter found.')

    const device = Check(
      await adapter.requestDevice({
        requiredFeatures: [],
        requiredLimits: {},
        defaultQueue: {},
        label: 'Prism Device'
      }),
      'No device found.'
    )

    return device
  }

  private async init() {
    this._device = await this.requestDevice()

    const contextConfig: GPUCanvasConfiguration = {
      device: this._device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'premultiplied',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
    }

    this._canvasResizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
          let canvas = entry.target as HTMLCanvasElement

          // Get the device pixel ratio
          const dpr = window.devicePixelRatio || 1

          // Calculate physical size (what the GPU needs)
          const width = Math.floor(entry.contentBoxSize[0].inlineSize * dpr)
          const height = Math.floor(entry.contentBoxSize[0].blockSize * dpr)

          // Set canvas size in physical pixels
          canvas.width = width
          canvas.height = height

          this._context.configure(contextConfig)
        }
      }
    )

    this._context.configure(contextConfig)

    this._canvasResizeObserver.observe(this._canvas)

    this._renderer = new Renderer(this._device, this._context, this._world)
  }

  // TODO: Load world from file
  private setupWorld() {
    const staticMeshSim = new StaticMeshSim(this._world)
    staticMeshSim.setMesh(new StaticMesh())
    this._world.add(staticMeshSim)
    this._renderer.loadWorld()

    // this._simController = new OrbitController();
    // this._simController.possess(this._world.view);

    // // this._canvas.addEventListener('click', console.log);
    // this._canvas.addEventListener('mousedown', this._simController.OnDragBegin.bind(this._simController));
    // this._canvas.addEventListener('mouseup', this._simController.OnDragEnd.bind(this._simController));
    // this._canvas.addEventListener('mousemove', this._simController.OnMoveEvent.bind(this._simController));

    // this.setupInputListeners();

    // this._device.queue.writeBuffer(this._gameObjectMvpBuffer, 0, this.
  }

  public async tick() {
    const view = Check(this._world.view, 'No view found')

    view.setEyePosition(vec3d.create(0, 0, 5))
    view.lookAt(vec3d.zero())

    this._world.renderables.forEach(renderable => {
      const sim = renderable as StaticMeshSim

      // TODO: Casting to StaticMeshSim is obviously wrong
      const staticMeshMvp = mat4.mul(
        view.getViewProjectionMatrix(),
        sim.worldTransform
      )

      this._renderer.updateStaticMeshMvp(staticMeshMvp)
    })

    await this._device.queue.onSubmittedWorkDone()
    const commandBuffer = this._renderer.render()
    this._device.queue.submit([commandBuffer])
  }

  private renderLoop() {
    const renderFrame = () => {
      this.tick()
      requestAnimationFrame(renderFrame)
    }
    requestAnimationFrame(renderFrame)
  }
}

export { Engine }
