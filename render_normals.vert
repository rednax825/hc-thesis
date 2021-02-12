#version 330 compatibility

out vec3 vNormal;

void main( )
{   
	vNormal = normalize( gl_NormalMatrix * gl_Normal );	// normal vector

    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}