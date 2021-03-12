server:
	go build -o bin/server cmd/server/cmd.go

.PHONY: test

test:
	go test -v ./... -short