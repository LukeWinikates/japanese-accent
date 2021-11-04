bin/server:
	go build -o $@ cmd/server/cmd.go

.PHONY: test watch integration-test

integration-test:
	go test ./... --tags=integration

test:
	go test -v ./... -short

watch:
	~/go/bin/air
