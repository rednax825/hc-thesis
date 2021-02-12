#version 330 compatibility

uniform sampler2D Noise2;
uniform sampler2D uLookupTex;
uniform sampler2D uNormalMap;
uniform sampler2D uExemplarTex;
uniform int uLevels;
uniform float uThreshold;

in  vec2	vST;	// texture coords
in  vec3	vN;		// normal vector
in	vec2	vVC;	// viewport coords


float sum(vec3 a) 
{
	return a.x + a.y + a.z;
}

vec3 get_normal_map(vec2 uv)
{
	return texture2D(uNormalMap, (uv + vec2(0.5)) / 1024.0).xyz;
}

vec3 get_pixel(sampler2D tex, vec2 uv)
{
	return texture2D(tex, (uv + vec2(0.5)) / 512.0).xyz;
}

vec2 lookup(vec3 normal)
{
	return normal.xy * 512.0;
}


// p = pixel coord, h = seed spacing
vec2 seed_point(vec2 p, float h)
{
	vec2 b = floor((p / h));
	vec2 j = get_pixel(Noise2, b).xy * 0.7;
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
	
	for(int i = l; i > 1; i--)
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

	return get_pixel(uExemplarTex, o).xyz;
}

void main( )
{
	vec2 p = gl_FragCoord.xy - vec2(0.5);

	vec3 myColor = vec3(0.0, 0.0, 0.0);

	myColor = stylize(p, uLevels);

	//myColor = get_normal_map(p);

	//myColor = texture2D(uExemplarTex, gl_FragCoord.xy / 512.0).rgb;

	//vec2 nearest = nearest_seed(p, 64);
	//myColor = get_pixel(uNoiseTex, nearest).rgb;
	//if( length(p-nearest) < 2) myColor = vec3(1.0, 0, 0);

	gl_FragColor = vec4( myColor,  1. );
}
