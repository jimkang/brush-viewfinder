run:
	wzrd index.js -- -d

test:
	node tests/time-release-element-group-stream-tests.js

D3SRC = node_modules/d3/src

D3_LIBRARY_FILES = \
	$(D3SRC)/start.js \
	$(D3SRC)/compat/index.js \
	$(D3SRC)/svg/brush.js \
	$(D3SRC)/svg/arc.js \
	$(D3SRC)/svg/axis.js \
	$(D3SRC)/end.js

smash: $(D3_LIBRARY_FILES)
	node_modules/.bin/smash $(D3_LIBRARY_FILES) | \
	node_modules/.bin/uglifyjs - -c -m -o lib/d3-small.js

smash-debug: $(D3_LIBRARY_FILES)
	node_modules/.bin/smash $(D3_LIBRARY_FILES) > lib/d3-small.js

pch: smash-debug # smash
	node_modules/.bin/browserify \
		lib/d3-small.js \
		-r idmaker \
		-r lodash \
		-o pch.js

pushall:
	git push origin master && git push origin gh-pages
