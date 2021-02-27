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
    float edge = 0.007 / radius * gl_FragCoord.z / gl_FragCoord.w;
    vec3 dynamicColor = uThetaStart == uThetaEnd ?
        uBackgroundColor :
        mix(uWedgeColor, uBackgroundColor,
            smoothstep(-edge, +edge, theta < uThetaMid ? uThetaStart - theta :  theta - uThetaEnd));

    vec4 diskColor = vec4(dynamicColor, radius < uRadius ? 1.0 : 0.0);

    vec4 texel = texture2D(uMap, vUv);
    vec4 resultColor = mix(diskColor, texel, texel.a);
    if (resultColor.a < 0.5)
        discard;
    gl_FragColor = resultColor;
}
