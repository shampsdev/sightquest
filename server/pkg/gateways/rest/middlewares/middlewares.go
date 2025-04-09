package middlewares

import (
	"context"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

func InjectLogger(ctx context.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		log := slogx.FromCtx(ctx)
		slogx.InjectGin(c, log)
	}
}

func AllowOrigin() gin.HandlerFunc {
	return func(c *gin.Context) {
		allowHeaders := "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Api-Token"

		c.Header("Access-Control-Allow-Origin", c.GetHeader("Origin"))
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Headers", allowHeaders)

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		slogx.Info(c, "Request completed",
			slog.Int("status", c.Writer.Status()),
			slog.String("method", c.Request.Method),
			slog.String("path", c.Request.URL.Path),
			slog.String("query", c.Request.URL.RawQuery),
		)
	}
}
