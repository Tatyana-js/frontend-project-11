install: 
	npm ci

build:
	NODE_ENV=production npx webpack

lint: 
	npx eslint .
