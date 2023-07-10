.PHONY: test watch integration-test server bin/server setup

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

tmp/JMdict: tmp/JMdict.gz
	cd tmp/ ; gzip -dk JMdict.gz

tmp/JMdict.gz:
	cd tmp/ ; curl -L -R -O http://ftp.edrdg.org/pub/Nihongo/JMdict.gz

setup:
	yarn 2&>1 > /dev/null || npm install -g yarn
	yarn install
