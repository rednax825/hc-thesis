#version 330 compatibility

uniform float uAmbient;
uniform float uSpec;
uniform float uShine;
uniform float uDiffuse;

in vec3 vNormal;
in vec3 vLight;
in vec3 vEye;

void main()
{
	vec3 normal = normalize(vNormal);
	vec3 light = normalize(vLight);
	vec3 eye = normalize(vEye);

	// ambient
	vec4 ambient = vec4(uAmbient);

	// diffuse
	float d = max(dot(normal, light), 0.);
	vec4 diffuse = vec4(uDiffuse) * d;

	float s = 0.;
	if(dot(normal, light) > 0.)
	{
		vec3 ref = normalize(2. * normal * dot(normal, light) - light);
		s = pow(max(dot(eye, ref), 0.), uShine);
	}

	vec4 spec = s * vec4(uSpec);

	vec4 color = spec + diffuse + ambient;

	gl_FragColor = vec4(color.rbg, 1.);
}