package utils

import (
	"math/rand"
)

func PtrTo[T any](t T) *T {
	return &t
}

func RandomChoice[T any](choices []T, weigths []int) T {
	if len(choices) != len(weigths) {
		panic("length of choices and weights must be equal")
	}

	total := 0
	for _, w := range weigths {
		total += w
	}

	r := rand.Intn(total)
	for i, w := range weigths {
		r -= w
		if r < 0 {
			return choices[i]
		}
	}
	panic("unreachable")
}
