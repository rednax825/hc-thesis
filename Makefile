TARGET := compose_texture 
CFLAGS := -std=c++11 -g
HEADERS := $(wildcard *.hpp)
SRC := $(wildcard *.cpp)
OBJS := $(patsubst %.cpp,%.o,$(SRC))
LIBS := -lstdc++

all: $(TARGET)

clean:
	rm -f $(OBJS)
	rm -f $(TARGET)

%.o: %.cpp $(HEADERS)
	g++ $(LIBS) $(CFLAGS) $< -c -o $@

$(TARGET): $(OBJS) | $(HEADERS)
	g++ $(CFLAGS) $^ -o $@
