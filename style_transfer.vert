#version 330 compatibility

out	vec3	vN;		// normal vector
out	vec2	vST;	// texture coords
out	vec2	vVC;	// viewport coords

void
main( )
{ 
    vST = gl_MultiTexCoord0.st;
    vec3 vert = gl_Vertex.xyz;

    vN = normalize( gl_NormalMatrix * gl_Normal );	// normal vector

    vN = (vN + vec3(1.0)) / 2.0;

                                                    // to the eye position 
    gl_Position = gl_ModelViewProjectionMatrix * vec4( vert, 1. );

    vec3 ndc = gl_Position.xyz / gl_Position.w;
    vVC = ndc.xy * 0.5 + 0.5;
}
