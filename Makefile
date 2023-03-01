.PHONY: test watch integration-test server bin/server

server: bin/server

bin/server:
	go build -o bin/server cmd/server/cmd.go

integration-test:
	go test ./... --tags=integration

test:
	go test -v ./... -short

watch:
	rm bin/server
	~/go/bin/air

setup:
	npm install -g yarn
	yarn install