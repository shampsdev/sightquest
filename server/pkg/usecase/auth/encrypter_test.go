package auth

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestEncrypter(t *testing.T) {
	encrypter, err := newEncrypter("0123456789abcdef0123456789abcdef")
	assert.NoError(t, err)

	plaintext := "hello world"
	encrypted, err := encrypter.Encrypt([]byte(plaintext))
	assert.NoError(t, err)
	assert.NotEqual(t, plaintext, encrypted)

	decrypted, err := encrypter.Decrypt(encrypted)
	assert.NoError(t, err)
	assert.Equal(t, plaintext, string(decrypted))
}
