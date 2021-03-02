#extension GL_OES_standard_derivatives : enable

precision mediump float;

varying vec2 vUv;

uniform sampler2D uMap;
uniform float uRadius;
uniform float uThetaStart;   // −π to +π
uniform float uThetaEnd;   // −π to +π
uniform float uThetaMid;   // −π to +π
uniform vec3 uWedgeColor;
uniform vec3 uBackgroundColor;

void main() {
    const vec2 center = vec2(0.5, 0.5);

    vec2 diff = vUv - center;
    float theta = atan(diff.x, diff.y);
    float radius = length(diff);
#ifdef GL_OES_standard_derivatives
    float edge = length(vec2(dFdx(vUv.x), dFdy(vUv.y))) * 0.70710678118654757 / radius;
#else
    float edge = 0.005 / max(radius, 0.03) * gl_FragCoord.z / gl_FragCoord.w;
#endif
    vec3 dynamicColor = uThetaStart == uThetaEnd ?
        uBackgroundColor :
        mix(uWedgeColor, uBackgroundColor,
            smoothstep(-edge, +edge, theta < uThetaMid ? uThetaStart - theta :  theta - uThetaEnd));
    vec4 diskColor = vec4(dynamicColor, 1.0);

    vec4 texel = texture2D(uMap, vUv);
    gl_FragColor = radius < uRadius ? mix(diskColor, texel, texel.a) : texel;
}
