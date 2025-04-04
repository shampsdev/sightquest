package auth

import (
	"github.com/golang-jwt/jwt/v5"
)

type jwtSigner struct {
	secret string
}

func newJWTSigner(secret string) *jwtSigner {
	return &jwtSigner{secret: secret}
}

func (a *jwtSigner) GenerateToken(userID string) (string, error) {
	payload := jwt.MapClaims{
		"user_id": userID,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)
	return token.SignedString([]byte(a.secret))
}

func (a *jwtSigner) ParseToken(token string) (string, error) {
	parsedToken, err := jwt.Parse(token, func(_ *jwt.Token) (any, error) {
		return []byte(a.secret), nil
	})
	if err != nil {
		return "", err
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok || !parsedToken.Valid {
		return "", jwt.ErrSignatureInvalid
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return "", jwt.ErrInvalidKeyType
	}
	return userID, nil
}
