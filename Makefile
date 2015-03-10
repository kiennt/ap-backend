SRC = $(wildcard src/*.js)
DIST = $(SRC:src/%.js=dist/%.js)

dist: $(DIST)
dist/%.js: src/%.js
	mkdir -p $(@D)
	babel $< -o $@
