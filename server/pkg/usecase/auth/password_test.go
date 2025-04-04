package auth

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPassword(t *testing.T) {
	password := "password"
	hash, err := generateFromPassword(password, defaultArgonParams)
	assert.NoError(t, err)

	ok, err := comparePasswordAndHash(password, hash)
	assert.NoError(t, err)
	assert.True(t, ok)

	ok, err = comparePasswordAndHash("password1", hash)
	assert.NoError(t, err)
	assert.False(t, ok)
}
