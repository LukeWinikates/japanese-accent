server:
	go build -o bin/server cmd/server/cmd.go

.PHONY: test watch

test:
	go test -v ./... -short

watch:
	~/go/bin/air
