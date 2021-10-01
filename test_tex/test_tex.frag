#version 330 compatibility

uniform float uDepth;
uniform float uN;
uniform sampler3D uTex;

float correctDepth(float n, float depth) {
	depth *= n;
	depth /= (n + 1.0);
	depth += 0.5 / (n + 1.0);
	return depth;
}

void
main( )
{
	vec2 p = gl_FragCoord.xy - vec2(0.5, 0.5);
	p = p / 512.0;
	vec3 pos = vec3(p.x, p.y, correctDepth(uN, uDepth));
    vec3 color = texture3D(uTex, pos).xyz;
	
    gl_FragColor = vec4(color, 1.);
}