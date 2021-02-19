varying vec2 vUv;
uniform sampler2D uMap;

void main() {
    vec2 uv = vec2(vUv.x, vUv.y);
    gl_FragColor = texture2D(uMap, uv);
}
