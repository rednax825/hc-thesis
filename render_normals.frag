#version 330 compatibility

in vec3 vNormal;

void main( )
{
    gl_FragColor = vec4(vNormal, 1.);
}