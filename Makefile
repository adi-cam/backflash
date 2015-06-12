.PHONY: all build server

all: build

build:
	bundle exec middleman build

server:
	bundle exec middleman server