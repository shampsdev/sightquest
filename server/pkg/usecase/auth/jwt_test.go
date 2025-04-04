package auth

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestJWT(t *testing.T) {
	signer := newJWTSigner("secret")

	token, err := signer.GenerateToken("user1")
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	userID, err := signer.ParseToken(token)
	assert.NoError(t, err)
	assert.Equal(t, "user1", userID)

	otherSigher := newJWTSigner("othersecret")
	_, err = otherSigher.ParseToken(token)
	assert.Error(t, err)
}
