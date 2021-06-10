#version 330 compatibility

in vec3 vNormal;

void main( )
{
    vec3 color = (vNormal * 0.5) + vec3(0.5, 0.5, 0.5);
    gl_FragColor = vec4(color, 1.);
}