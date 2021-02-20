import vertexShader from './dialVert.glsl'
import fragmentShader from './dialFrag.glsl'

AFRAME.registerComponent('dial', {
  schema: {
    src: {type: 'map'},
    radius: {default: 0.98},
    thetaStart: {default: 0},
    thetaEnd: {default: 230},
    wedgeColor: {type: 'color', default: 'white'},
  },

  init: function () {
    this.initGeometry();
    this.initShader(this.data);

    const mesh = new THREE.Mesh(this.geometry, this.shader);
    this.el.setObject3D('mesh', mesh);
  },

  initGeometry: function () {
    const geometry = this.geometry = new THREE.BufferGeometry();
    const vertexCoordinateSize = 3; // 3 floats to represent x,y,z coordinates.
    const uvCoordinateSize = 2; // 2 float to represent u,v coordinates.
    const quadSize = 0.8;
    const quadHalfSize = quadSize / 2.0;

    const positions = [
      -quadHalfSize, -quadHalfSize, 0.0, // bottom-left
      quadHalfSize, -quadHalfSize, 0.0, // bottom-right
      -quadHalfSize, quadHalfSize, 0.0, // top-left
      quadHalfSize, quadHalfSize, 0.0  // top-right
    ];

    const uvs = [
      0, 0,
      1, 0,
      0, 1,
      1, 1,
    ];

    // Counter-clockwise triangle winding.
    geometry.setIndex([
      3, 2, 0, // top-left triangle.
      0, 1, 3  // bottom-right triangle.
    ]);

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, vertexCoordinateSize));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, uvCoordinateSize));
  },

  initShader: function (data) {
    this.uniforms = {
      uMap: {type: 't', value: null},
      uRadius: {type: 'f', value: data.radius / 2},
      uWedgeColor: {type: 'v3', value: new THREE.Color(data.wedgeColor)},
    };
    const shader = this.shader = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(data.src.currentSrc, texture => {
      shader.uniforms.uMap.value = texture;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.magFilfer = THREE.LinearFilter;
    });
  },

  update: function () {
    this.uniforms.uRadius.value = this.data.radius / 2;
    this.uniforms.uWedgeColor.value = new THREE.Color(this.data.wedgeColor);
  },

});
