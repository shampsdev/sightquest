package state

type MiddlewareFunc[SIn, SOut any, EIn, EOut any] func(
	c *Context[SIn], event EIn, next HandlerFunc[SOut, EOut]) error

func WithMiddleware[SIn, SOut any, EIn, EOut any](
	middleware MiddlewareFunc[SIn, SOut, EIn, EOut],
	next HandlerFunc[SOut, EOut],
) HandlerFunc[SIn, EIn] {
	return func(c *Context[SIn], event EIn) error {
		return middleware(c, event, next)
	}
}
