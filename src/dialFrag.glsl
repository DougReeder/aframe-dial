varying vec2 vUv;

uniform sampler2D uMap;
uniform float uRadius;
uniform float uThetaStart;   // −π to +π
uniform float uThetaEnd;   // −π to +π
uniform vec3 uWedgeColor;
uniform vec3 uBackgroundColor;

void main() {
    const vec2 center = vec2(0.5, 0.5);

    vec2 diff = vUv - center;
    float theta = atan(diff.x, diff.y);
    vec3 dynamicColor = (theta > uThetaStart && theta < uThetaEnd) ? uWedgeColor : uBackgroundColor;

    float radius = length(diff);
    vec4 diskColor = vec4(dynamicColor, radius < uRadius ? 1.0 : 0.0);

    vec4 texel = texture2D(uMap, vUv);
    vec4 resultColor = mix(diskColor, texel, texel.a);
    if (resultColor.a < 0.5)
        discard;
    gl_FragColor = resultColor;
}
