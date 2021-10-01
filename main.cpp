#include <cstdio>
#include <cstdlib>
#include <dirent.h>
#include <string>

// bmp dimensions
#define WIDTH 512 
#define HEIGHT 512 
#define DIRPATH "layers"

typedef struct {
	unsigned char r, g, b;
} Pixel;

// buffer holds most recently read bmp data
unsigned char* buffer;

void readFile(const char*);
Pixel getPixel(int, int);
void writeTexture();
int numFiles();

int main()
{
	writeTexture();
	return 0;
}

// reads a specified bmp into the buffer
void readFile(std::string path)
{
	// create file pointer
	FILE* f = std::fopen(path.c_str(), "rb");
	if(!f)
	{
		std::perror("could not open file");
	}
	// init buffer
	buffer = new unsigned char[WIDTH * HEIGHT * 3];
	// skip bmp header
	std::fseek(f, 122, SEEK_SET);
	// read data into buffer
	std::fread(buffer, WIDTH*HEIGHT*3, 1, f);
	// close the file
	std::fclose(f);
}

Pixel getPixel(int x, int y) 
{
	x *= 3;
	y *= 3;
	int offset = y * WIDTH + x;
	Pixel p;
	p.b = buffer[offset];
	p.g = buffer[offset + 1];
	p.r = buffer[offset + 2];
	return p;
}

void writeTexture() {
	int nums = WIDTH;
	int numt = HEIGHT;
	int nump = numFiles();
	FILE* fp = fopen("output.tex", "wb");
	fwrite(&nums, 4, 1, fp);
	fwrite(&numt, 4, 1, fp);
	fwrite(&nump, 4, 1, fp);

	DIR* d;
	struct dirent* dir;
	d = opendir(DIRPATH);
	if(d) {
		int i = 0;
		while ((dir = readdir(d)) != NULL) {
			if(i >= 2) {
				printf("%s\n", dir->d_name);
				std::string path = DIRPATH;
				std::string p2 = dir->d_name;
				path += "/";
				path += p2;
				readFile(path);
				for(int t = 0; t < numt; t++) {
					for(int s = 0; s < nums; s++) {
						Pixel p = getPixel(s, t);
						unsigned char a = 255;
						fwrite(&(p.r), 1, 1, fp);
						fwrite(&(p.g), 1, 1, fp);
						fwrite(&(p.b), 1, 1, fp);
						fwrite(&a, 1, 1, fp);
					}
				}
			}
			i++;
		}
		closedir(d);
	}

	fclose(fp);
}

int numFiles() {
	DIR* d;
	struct dirent* dir;
	d = opendir(DIRPATH);
	int i = 0;
	if(d) {
		while ((dir = readdir(d)) != NULL) {
			i++;
		}
		closedir(d);
	}
	return i - 2;
}

