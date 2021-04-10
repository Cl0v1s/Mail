# build-front:
#	cd frontend && npx webpack

build-back: 
	mkdir -p build
	rm -rf build/MyApp.app
	cd build && cmake .. && cmake --build . --config Release

build: build-back

run: 
	build/MyApp.app/Contents/MacOS/MyApp

test-back:
	node test/test.js

.PHONY: build