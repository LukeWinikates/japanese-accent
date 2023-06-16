package handlers

import (
	"github.com/LukeWinikates/japanese-accent/internal/app/database"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func MakeRefreshMetricsPOST(db gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		err := database.RecalculateAllClipPriorities(db)
		if err != nil {
			context.Status(500)
			return
		}
		context.Status(200)
	}
}
