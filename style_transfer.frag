#version 330 compatibility

uniform sampler2D uNoiseTex;
uniform sampler2D uLookupTex;
uniform sampler2D uNormalMap;
uniform sampler3D uExemplarTex;
uniform sampler2D uLightLevel;
uniform int uLevels;
uniform float uThreshold;
uniform float uNoiseMult;

const float DIMENSION = 512.0;

float sum(vec3 a) 
{
	return a.x + a.y + a.z;
}

vec3 get_normal_map(vec2 uv)
{
	return texture2D(uNormalMap, (uv + vec2(0.5, 0.5)) / DIMENSION).xyz;
}

vec3 get_pixel(sampler2D tex, vec2 uv)
{
	return texture2D(tex, (uv + vec2(0.5, 0.5)) / DIMENSION).xyz;
}

vec3 get_pixel3d(sampler3D tex, vec2 uv, float depth)
{
	vec2 pos = (uv + vec2(0.5, 0.5)) / DIMENSION;
	vec3 pos3d = vec3(pos.x, pos.y, depth);
	return texture3D(tex, pos3d).xyz;
}

vec2 lookup(vec3 target)
{
	return vec2(target.xy) * DIMENSION;
}

// p = pixel coord, h = seed spacing
vec2 seed_point(vec2 p, float h)
{
	vec2 b = floor((p / h));
	vec2 j = get_pixel(uNoiseTex, b).xy * uNoiseMult;
	return floor(h * (b + j));
}

// p = pixel coord, h = seed spacing
vec2 nearest_seed(vec2 p, float h)
{
	float d = 1.0 / 0.0; // infinity
	vec2 s;

	for(int x = -1; x <= 1; x++)
	{
		for(int y = -1; y <= 1; y++)
		{
			vec2 temp_s = seed_point(p + (h * vec2(float(x), float(y))), h);
			float temp_d = length(temp_s - p);
			if (temp_d < d)
			{
				s = temp_s;
				d = temp_d;
			}
		}
	}
	return s;
}

// p = pixel coord, l = number of levels
vec3 stylize(vec2 p, int l)
{
	vec2 o = lookup(get_normal_map(p));
	
	for(int i = l; i > 0; i--)
	{
		vec2 q = nearest_seed(p, pow(2.0, i));
		vec2 u = lookup(get_normal_map(q));

		float err = sum(abs( get_normal_map(p) - get_pixel(uLookupTex, u+(p-q)) ));

		if(err < uThreshold)
		{
			o = u+(p-q);
			break;
		}
	}

	float brightness = get_pixel(uLightLevel, p).x;
	brightness = 1. - ((floor(brightness * 8.) / 9.) + 0.0625);
	return get_pixel3d(uExemplarTex, o, brightness).xyz;
}

void main( )
{
	// get range from 0.0 to 1.0 in xy
	vec2 p = gl_FragCoord.xy - vec2(0.5, 0.5);

	vec3 myColor = vec3(0.0, 0.0, 0.0);

	myColor = stylize(p, uLevels);

	gl_FragColor = vec4( myColor,  1. );
}
