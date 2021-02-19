import vertexShader from './dialVert.glsl'
import fragmentShader from './dialFrag.glsl'

AFRAME.registerComponent('dial', {
  schema: {
    src: {type: 'map'},
    thetaStart: {default: '45'},
    thetaEnd: {default: '270'},
    color: {type: 'color', default: 'white'},
  },

  init: function (data) {
    var mesh;
    this.initGeometry();
    this.initShader(this.data);

    mesh = new THREE.Mesh(this.geometry, this.shader);
    this.el.setObject3D('mesh', mesh);
  },

  initGeometry: function () {
    var geometry = this.geometry = new THREE.BufferGeometry();
    var vertexCoordinateSize = 3; // 3 floats to represent x,y,z coordinates.
    var uvCoordinateSize = 2; // 2 float to represent u,v coordinates.
    var quadSize = 0.8;
    var quadHalfSize = quadSize / 2.0;

    var positions = [
      -quadHalfSize, -quadHalfSize, 0.0, // bottom-left
      quadHalfSize, -quadHalfSize, 0.0, // bottom-right
      -quadHalfSize, quadHalfSize, 0.0, // top-left
      quadHalfSize, quadHalfSize, 0.0  // top-right
    ];

    var uvs = [
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

  update: function (data) {
  },

  initShader: function (data) {
    var uniforms = {
      uMap: {type: 't', value: null}
    };
    var shader = this.shader = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load(data.src.currentSrc, function (texture) {
      shader.uniforms.uMap.value = texture;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.magFilfer = THREE.LinearFilter;
    });
  },

});
