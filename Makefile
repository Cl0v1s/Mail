build-front:
	cd frontend && npx webpack

build-back: 
	rm -rf build/MyApp.app
	cd build && cmake .. && cmake --build . --config Release

build: build-front build-back

run: 
	build/MyApp.app/Contents/MacOS/MyApp

.PHONY: build