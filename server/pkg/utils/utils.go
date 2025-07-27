package utils

import (
	"math/rand/v2"
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

	r := rand.N(total)
	for i, w := range weigths {
		r -= w
		if r < 0 {
			return choices[i]
		}
	}
	panic("unreachable")
}

func NRandomLetters(n int) string {
	letters := []rune("abcdefghijklmnopqrstuvwxyz")
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.N(len(letters))]
	}
	return string(b)
}
