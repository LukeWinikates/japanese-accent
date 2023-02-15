.PHONY: test watch integration-test server

server: bin/server

bin/server:
	go build -o bin/server cmd/server/cmd.go

integration-test:
	go test ./... --tags=integration

test:
	go test -v ./... -short

watch:
	~/go/bin/air

setup:
    brew bundle
    install yarn
    install the node version
    get the go version?