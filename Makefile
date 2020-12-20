build:
	rm -rf build/MyApp.app
	cd build && cmake .. && cmake --build . --config Release

run: 
	build/MyApp.app/Contents/MacOS/MyApp

.PHONY: build