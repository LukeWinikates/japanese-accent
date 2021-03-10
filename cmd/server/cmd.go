package main

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/server"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	server.Configure(r)
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
