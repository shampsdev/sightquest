package auth

import "github.com/gin-gonic/gin"

func Setup(r *gin.RouterGroup) {
	r.GET("/hello", HelloWorld)
}
