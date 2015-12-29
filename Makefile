all:

prerender-start: node_modules
	./node_modules/.bin/forever start ./node_modules/.bin/prerender

prerender-stop: node_modules
	./node_modules/.bin/forever stop ./node_modules/.bin/prerender

# file rules

node_modules: package.json
	npm install $(NPM_FLAGS)
	touch $@
