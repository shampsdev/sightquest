package slogx

import (
	"context"
	"log/slog"
	"os"

	"github.com/gin-gonic/gin"
)

var loggerKey = "slogx_logger"

func NewCtx(ctx context.Context, logger *slog.Logger) context.Context {
	//nolint:all// because fuck gin
	return context.WithValue(ctx, loggerKey, logger)
}

func FromCtx(ctx context.Context) *slog.Logger {
	logger, ok := ctx.Value(loggerKey).(*slog.Logger)
	if !ok {
		return slog.Default()
	}
	return logger
}

func Fatal(logger *slog.Logger, msg string, args ...any) {
	logger.Error(msg, args...)
	os.Exit(1)
}

func Err(err error) slog.Attr {
	return slog.Any("error", err)
}

func WithErr(logger *slog.Logger, err error) *slog.Logger {
	return logger.With(Err(err))
}

func FromCtxWithErr(ctx context.Context, err error) *slog.Logger {
	return FromCtx(ctx).With(Err(err))
}

func Error(ctx context.Context, msg string, args ...any) {
	FromCtx(ctx).Error(msg, args...)
}

func Info(ctx context.Context, msg string, args ...any) {
	FromCtx(ctx).Info(msg, args...)
}

func InjectGin(c *gin.Context, logger *slog.Logger) {
	c.Set(loggerKey, logger)
}
