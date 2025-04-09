package auth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
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

func (e *encrypter) Encrypt(plain []byte) ([]byte, error) {
	nonce := make([]byte, e.gcm.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return nil, err
	}

	return e.gcm.Seal(nonce, nonce, plain, nil), nil
}

func (e *encrypter) Decrypt(encrypted []byte) ([]byte, error) {
	nonceSize := e.gcm.NonceSize()
	if len(encrypted) < nonceSize {
		return nil, fmt.Errorf("ciphertext too short")
	}

	nonce, ciphertextBytes := encrypted[:nonceSize], encrypted[nonceSize:]
	plain, err := e.gcm.Open(nil, nonce, ciphertextBytes, nil)
	if err != nil {
		return nil, err
	}

	return plain, nil
}
