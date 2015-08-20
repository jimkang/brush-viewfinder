run:
	wzrd index.js

test:
	node tests/basictests.js

D3SRC = node_modules/d3/src

D3_LIBRARY_FILES = \
	$(D3SRC)/start.js \
	$(D3SRC)/compat/index.js \
	$(D3SRC)/selection/selection.js \
	$(D3SRC)/arrays/range.js \
	$(D3SRC)/transition/index.js \
	$(D3SRC)/event/mouse.js \
	$(D3SRC)/end.js

smash: $(D3_LIBRARY_FILES)
	node_modules/.bin/smash $(D3_LIBRARY_FILES) | \
	node_modules/.bin/uglifyjs - -c -m -o lib/d3-small.js

smash-debug: $(D3_LIBRARY_FILES)
	node_modules/.bin/smash $(D3_LIBRARY_FILES) > lib/d3-small.js

run:
	wzrd index.js -- \
		-d \
		-x idmaker \
		-x lodash

pch: smash # smash-debug
	node_modules/.bin/browserify \
		lib/d3-small.js \
		-r idmaker \
		-r lodash \
		-o pch.js

pushall:
	git push origin master && git push origin gh-pages

ifndef PROJECTNAME
init-project:
	$(error PROJECTNAME is not set. Usage: make init-project PROJECTNAME=your-name)
else
init-project:
	rm -rf .git
	find . -type f -print0 | xargs -0 sed -i '' 's/brush-viewfinder/$(PROJECTNAME)/g'
	git init
endif
