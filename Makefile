develop:
	npx webpack serve

install: 
	npm ci

build:
	NODE_ENV=production npx webpack
	rm -rf dist

lint: 
	npx eslint .
