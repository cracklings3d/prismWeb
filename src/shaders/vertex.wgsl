struct Uniforms {
  mvp: mat4x4<f32>
};

struct VertexIn {
  @location(0) pos: vec3f,
//  @location(1) color: vec4f,
}

struct VertexOut {
  // Every vertex shader must output a value with @builtin(position)
  @builtin(position) pos: vec4f,

  // Other outputs are given a @location so that they can map to the
  // fragment shader inputs.
//  @location(0) color: vec4f,
}

@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

// Shader entry points can be named whatever you want, and you can have
// as many as you want in a single shader module.
@vertex
fn vertexMain(in: VertexIn) -> VertexOut {
  var out: VertexOut;
//  out.pos = vec4f(in.pos, 1);
  out.pos = uniforms.mvp * vec4<f32>(in.pos, 1.0);
//  out.color = in.color;
  return out;
}