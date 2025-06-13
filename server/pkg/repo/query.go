package repo

import "context"

func First[
	F any,
	T any,
	R interface {
		Filter(ctx context.Context, filter F) ([]T, error)
	},
](r R) func(ctx context.Context, filter F) (T, error) {
	return func(ctx context.Context, filter F) (T, error) {
		var t T
		ts, err := r.Filter(ctx, filter)
		if err != nil {
			return t, err
		}
		if len(ts) == 0 {
			return t, ErrNotFound
		}
		return ts[0], nil
	}
}
