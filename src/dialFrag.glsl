varying vec2 vUv;

uniform sampler2D uMap;
uniform float uRadius;
uniform vec3 uWedgeColor;

void main() {
    const vec2 center = vec2(0.5, 0.5);
    float radius = distance(center, vUv);

    vec4 wedgeColor = vec4(uWedgeColor.rgb, radius < uRadius ? 1.0 : 0.0);

    vec2 uv = vec2(vUv.x, vUv.y);
    vec4 texel = texture2D(uMap, uv);
    vec4 resultColor = mix(wedgeColor, texel, texel.a);
    if (resultColor.a < 0.5)
        discard;
    gl_FragColor = resultColor;
}
