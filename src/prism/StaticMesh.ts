class StaticMesh {
  // public getVertexData = () => new Float32Array([
  //   // @formatter:off
  //   // X,  Y, Z     R, G, B, A,
  //      0,  1, 1,    1, 0, 0, 1,
  //     -1, -1, 1,    0, 1, 0, 1,
  //      1, -1, 1,    0, 0, 1, 1,
  //   // @formatter:on
  // ]);

  public getVertexData = () => new Float32Array([
    // @formatter:off
    // // X,  Y, Z
    //    0,  1, 1,
    //   -1, -1, 1,
    //    1, -1, 1,


    // Face 1: v0, v1, v2
    0.0, 0.0, 0.0,    // v0
    1.0, 0.0, 0.0,    // v1
    0.5, 0.866025, 0.0,  // v2

    // Face 2: v0, v1, v3
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.5, 0.288675, 0.816497, // v3

    // Face 3: v1, v2, v3
    1.0, 0.0, 0.0,
    0.5, 0.866025, 0.0,
    0.5, 0.288675, 0.816497,

    // Face 4: v2, v0, v3
    0.5, 0.866025, 0.0,
    0.0, 0.0, 0.0,
    0.5, 0.288675, 0.816497
    // @formatter:on
  ]);

  public getVertexDataByteLength = () =>
      this.getVertexData().byteLength;

}

export {StaticMesh};