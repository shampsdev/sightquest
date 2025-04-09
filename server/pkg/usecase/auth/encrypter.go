package auth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"fmt"
)

type encrypter struct {
	gcm cipher.AEAD
}

const secretLength = 32

func newEncrypter(key string) (*encrypter, error) {
	keyBytes := []byte(key)
	if len(keyBytes) != secretLength {
		return nil, fmt.Errorf("invalid key length, expected %d, got %d", secretLength, len(keyBytes))
	}

	c, err := aes.NewCipher(keyBytes)
	if err != nil {
		fmt.Println(err)
	}

	gcm, err := cipher.NewGCM(c)
	if err != nil {
		fmt.Println(err)
	}

	return &encrypter{gcm: gcm}, nil
}

func (e *encrypter) Encrypt(plaintext string) (string, error) {
	nonce := make([]byte, e.gcm.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return "", err
	}

	ciphertext := e.gcm.Seal(nonce, nonce, []byte(plaintext), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func (e *encrypter) Decrypt(ciphertext string) (string, error) {
	rawData, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", err
	}

	nonceSize := e.gcm.NonceSize()
	if len(rawData) < nonceSize {
		return "", fmt.Errorf("ciphertext too short")
	}

	nonce, ciphertextBytes := rawData[:nonceSize], rawData[nonceSize:]
	plaintext, err := e.gcm.Open(nil, nonce, ciphertextBytes, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
