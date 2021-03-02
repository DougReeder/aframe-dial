#version 300 es

precision mediump float;

in vec2 vUv;

uniform sampler2D uMap;
uniform float uRadius;
uniform float uThetaStart;   // −π to +π
uniform float uThetaEnd;   // −π to +π
uniform float uThetaMid;   // −π to +π
uniform vec3 uWedgeColor;
uniform vec3 uBackgroundColor;

out vec4 outColor;

void main() {
    const vec2 center = vec2(0.5, 0.5);

    vec2 diff = vUv - center;
    float theta = atan(diff.x, diff.y);
    float radius = length(diff);
    float edge = length(vec2(dFdx(vUv.x), dFdy(vUv.y))) / max(radius, 0.02);
    vec3 dynamicColor = uThetaStart == uThetaEnd ?
        uBackgroundColor :
        mix(uWedgeColor, uBackgroundColor,
            smoothstep(-edge, +edge, theta < uThetaMid ? uThetaStart - theta :  theta - uThetaEnd));
    vec4 diskColor = vec4(dynamicColor, 1.0);

    vec4 texel = texture(uMap, vUv);
    outColor = radius < uRadius ? mix(diskColor, texel, texel.a) : texel;
}
