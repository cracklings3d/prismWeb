import { Material } from './Material.ts'
import type { Mat4 } from 'wgpu-matrix'
import type { IRenderable } from './IRenderable.ts'
import type { World } from './World.ts'
import { Check } from './Util.ts'

class Renderer {
  private _context: GPUCanvasContext
  private _device: GPUDevice

  // Could use a new one every frame
  private _canvas_format: GPUTextureFormat

  private _renderMap: Map<IRenderable, GPUBuffer> = new Map()

  private _simMvpBuffer: GPUBuffer | null
  private _simMvpBindGroup: GPUBindGroup | null

  // The only material in the renderer for now
  private _world: World
  private _material: Material

  // _vertexData: Float32Array = new Float32Array();
  // _vertexDataByteLength = 0;

  constructor (device: GPUDevice, context: GPUCanvasContext, world: World) {
    this._device = device
    this._context = context
    this._world = world

    this._canvas_format = navigator.gpu.getPreferredCanvasFormat()

    this._simMvpBuffer = null
    this._simMvpBindGroup = null

    this._material = new Material(this._device)
  }

  public destroy () {
    this._simMvpBuffer?.destroy()
  }

  public loadWorld () {
    this._simMvpBuffer = this._device.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    // this._device.queue.writeBuffer(this._gameObjectMvpBuffer, 0, this.

    this._simMvpBindGroup = this._device.createBindGroup({
      layout: this._material.getUniformBindGroupLayout(),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this._simMvpBuffer
          }
        }
      ]
    })

    for (const renderable of this._world.renderables) {
      // load renderable
      this.importRenderable(
        renderable,
        renderable.vertexDataByteLength,
        renderable.vertexData
      )
    }
  }

  public render () {
    const commandEncoder = this._device.createCommandEncoder()
    const currentTexture = this._context.getCurrentTexture()
    const textureView = currentTexture.createView()

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          loadOp: 'clear',
          clearValue: [0.05, 0.05, 0.1, 1],
          storeOp: 'store'
        }
      ]
    })

    renderPass.setBindGroup(0, this._simMvpBindGroup)

    const pipeline = this._material.createPipeline(this._canvas_format)

    renderPass.setPipeline(pipeline)

    for (const [_, vertexBuffer] of this._renderMap) {
      renderPass.setVertexBuffer(0, vertexBuffer)
      renderPass.draw(vertexBuffer.size / 4)
    }

    renderPass.end()

    const commandBuffer = commandEncoder.finish()
    return commandBuffer
  }

  public updateStaticMeshMvp (mvp: Mat4) {
    if (!this._simMvpBuffer) return
    this._device.queue.writeBuffer(this._simMvpBuffer, 0, mvp)
  }

  public importRenderable (
    renderable: IRenderable,
    vertexDataByteLength: number,
    vertexData: Float32Array
  ) {
    const vertexBuffer = this._device.createBuffer({
      size: vertexDataByteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })

    // writeBuffer is the easiest way to TypedArray data into a buffer.
    this._device.queue.writeBuffer(vertexBuffer, 0, vertexData)

    this._renderMap.set(renderable, vertexBuffer)
  }
}

export { Renderer }
