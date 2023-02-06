#! /bin/bash

go get gorm.io/gorm@latest
go get gorm.io/driver/sqlite@latest
go get github.com/prometheus/client_golang@latest
go get github.com/gin-gonic/gin@latest
go get github.com/u2takey/ffmpeg-go@latest
go get github.com/stretchr/testify@latest
go mod tidy

git diff --exit-code go.mod go.sum
