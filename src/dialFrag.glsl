#extension GL_OES_standard_derivatives : enable

precision mediump float;

varying vec2 vUv;

uniform sampler2D uMap;
uniform float uRadius;
uniform float uInnerRadius;
uniform float uThetaStart;   // −π to +π
uniform float uThetaEnd;   // −π to +π
uniform float uThetaMid;   // −π to +π
uniform vec3 uWedgeColor;
uniform vec3 uRingBackgroundColor;
uniform vec3 uBackgroundColor;

void main() {
    const vec2 center = vec2(0.5, 0.5);

    vec2 diff = vUv - center;
    float theta = atan(diff.x, diff.y);
    float radius = length(diff);
#ifdef GL_OES_standard_derivatives
    float linearEdge = length(vec2(dFdx(vUv.x), dFdy(vUv.y)));
    float radialEdge = linearEdge / max(radius, 0.03);
#else
    float linearEdge = 0.005 * gl_FragCoord.z / gl_FragCoord.w;
    float radialEdge = linearEdge / max(radius, 0.03);
#endif
    vec3 ringColor = uThetaStart == uThetaEnd ?
        uBackgroundColor :
        mix(uWedgeColor, uRingBackgroundColor,
            smoothstep(-radialEdge, +radialEdge, theta < uThetaMid ? uThetaStart - theta :  theta - uThetaEnd));

    vec3 dynamicColor = mix(uBackgroundColor, ringColor, smoothstep(-linearEdge, +linearEdge, radius - uInnerRadius));

    vec4 diskColor = vec4(dynamicColor, 1.0);

    vec4 texel = texture2D(uMap, vUv);
    gl_FragColor = radius < uRadius ? mix(diskColor, texel, texel.a) : texel;
}
