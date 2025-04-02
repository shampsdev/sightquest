package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

// HelloWorld godoc
// @Summary Get hello world
// @Tags hello
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200
// @Router /hello [get]
func HelloWorld(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Hello, world!"})
	slogx.Info(c, "Hello, world")
}
