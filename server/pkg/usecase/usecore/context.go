package usecore

import "context"

type Context struct {
	context.Context
	UserID string
}

func NewCtx(ctx context.Context, userID string) *Context {
	return &Context{Context: ctx, UserID: userID}
}
