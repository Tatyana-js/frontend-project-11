install: 
	npm ci

lint: 
	npx eslint .
	
publish: 
	npm publish --dry-run