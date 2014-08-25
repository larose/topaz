JSHINT ?= jshint
MOCHA ?= ./node_modules/mocha/bin/mocha

all: pack

lint:
	find $(CURDIR)/lib $(CURDIR)/test -name "*.js" -exec $(JSHINT) '{}' \;

pack:
	rm -f README.md~
	npm pack

test:
	$(MOCHA)


.PHONY: all lint pack test
