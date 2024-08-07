import vertexShader from './dialVert.glsl'
import fragmentShader from './dialFrag.glsl'

AFRAME.registerComponent('dial', {
  schema: {
    size: {default: 0.25, min: 0.01},
    src: {type: 'map'},
    radius: {default: 0.98, min: 0},
    innerRadius: {default: 0, min: 0},
    thetaStart: {default: 0},
    thetaEnd: {default: 230},
    wedgeColor: {type: 'color', default: 'black'},
    backgroundColor: {type: 'color', default: 'white'}
  },

  init: function () {
    this.initGeometry(this.data.size);
    this.initShader(this.data);

    const mesh = new THREE.Mesh(this.geometry, this.shaderMaterial);
    this.el.setObject3D('mesh', mesh);
  },

  initGeometry: function (size) {
    const geometry = this.geometry = new THREE.BufferGeometry();
    const vertexCoordinateSize = 3; // 3 floats to represent x,y,z coordinates.
    const uvCoordinateSize = 2; // 2 float to represent u,v coordinates.
    const quadSize = size;
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
    const webGL1Context = this.el.sceneEl.canvas.getContext('webgl');
    if (webGL1Context) {
      webGL1Context.getExtension('OES_standard_derivatives');
    }

    this.uniforms = {
      uMap: {type: 't'},
      uRadius: {type: 'f'},
      uInnerRadius: {type: 'f'},
      uThetaStart: {type: 'f'},
      uThetaEnd: {type: 'f'},
      uThetaMid: {type: 'f'},
      uWedgeColor: {type: 'v3'},
      uRingBackgroundColor: {type: 'v3'},
      uBackgroundColor: {type: 'v3'},
    };
    this.shaderMaterial = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    });

    this.textureLoader = new THREE.TextureLoader();
  },

  update: function (oldData) {
    this.uniforms.uRadius.value = this.data.radius / 2;
    this.uniforms.uInnerRadius.value = Math.min(this.data.innerRadius / 2, this.uniforms.uRadius.value - 0.01);

    let thetaStart = this.data.thetaStart;   // avoids modifying the attributes
    let thetaEnd = this.data.thetaEnd;
    let wedgeColor = this.data.wedgeColor;
    let ringBackgroundColor = this.data.backgroundColor;
    if (thetaEnd - thetaStart >= 360) {
      thetaStart = -180;
      thetaEnd = +180;
    }
    while (thetaStart < -180) {
      thetaStart += 360;
    }
    while (thetaStart > 180) {
      thetaStart -= 360;
    }
    while (thetaEnd < -180) {
      thetaEnd += 360;
    }
    while (thetaEnd > 180) {
      thetaEnd -= 360;
    }
    if (thetaEnd < thetaStart) {
      const temp = thetaEnd;
      thetaEnd = thetaStart;
      thetaStart = temp;
      wedgeColor = this.data.backgroundColor;
      ringBackgroundColor = this.data.wedgeColor
    }
    this.uniforms.uThetaStart.value = thetaStart * Math.PI / 180;
    this.uniforms.uThetaEnd.value = thetaEnd * Math.PI / 180;
    this.uniforms.uThetaMid.value = (this.uniforms.uThetaStart.value + this.uniforms.uThetaEnd.value) / 2;
    this.uniforms.uWedgeColor.value = new THREE.Color(wedgeColor);
    this.uniforms.uRingBackgroundColor.value = new THREE.Color(ringBackgroundColor);

    this.uniforms.uBackgroundColor.value = new THREE.Color(this.data.backgroundColor);

    // console.log("θ start:", this.uniforms.uThetaStart, "   θ end", this.uniforms.uThetaEnd)

    if (this.data.src !== oldData.src) {
      this.textureLoader.load(this.data.src.currentSrc, texture => {
        this.shaderMaterial.uniforms.uMap.value?.dispose();
        this.shaderMaterial.uniforms.uMap.value = texture;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.magFilfer = THREE.LinearFilter;
      });
    }
  },

});
