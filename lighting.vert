#version 330 compatibility

uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

out vec3 vNormal;
out vec3 vLight;
out vec3 vEye;

vec3 lightPos = vec3(uLightX, uLightY, uLightZ);

void main()
{
	vec4 ECpos = gl_ModelViewMatrix * gl_Vertex;

	vNormal = normalize( gl_NormalMatrix * gl_Normal);

	vLight = lightPos - ECpos.xyz;

	vEye = vec3(0, 0, 3) - ECpos.xyz;

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}