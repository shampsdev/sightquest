package framework

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/shampsdev/sightquest/server/pkg/domain"
)

func (fw *Framework) RegisterUser(username string) (string, error) {
	creds := &domain.UserCredentials{
		Username: username,
		Password: "password",
		Email:    username,
	}

	b, err := json.Marshal(creds)
	if err != nil {
		return "", fmt.Errorf("failed to marshal user: %w", err)
	}

	resp, err := fw.HTTPCli.Post(fmt.Sprintf("%s/auth/register", fw.APIHost), "application/json", bytes.NewReader(b))
	if err != nil {
		return "", fmt.Errorf("failed to post user: %w", err)
	}

	respUser := struct {
		Token string `json:"token"`
	}{}
	err = json.NewDecoder(resp.Body).Decode(&respUser)
	if err != nil {
		return "", fmt.Errorf("failed to decode user: %w", err)
	}

	return respUser.Token, nil
}

func (c *Client) MustCreateGame() *domain.Game {
	game, err := c.CreateGame()
	if err != nil {
		panic(err)
	}
	return game
}

func (c *Client) CreateGame() (*domain.Game, error) {
	u, err := url.Parse(fmt.Sprintf("%s/game?seed=shampiniony", c.FW.APIHost))
	if err != nil {
		return nil, fmt.Errorf("failed to parse url: %w", err)
	}
	req := http.Request{
		Method: "POST",
		URL:    u,
		Header: http.Header{
			"X-Api-Token":  []string{c.Token},
			"Content-Type": []string{"application/json"},
		},
	}
	resp, err := c.FW.HTTPCli.Do(&req)
	if err != nil {
		return nil, fmt.Errorf("failed to post game: %w", err)
	}

	game := &domain.Game{}
	err = json.NewDecoder(resp.Body).Decode(game)
	if err != nil {
		return nil, fmt.Errorf("failed to decode game: %w", err)
	}
	return game, nil
}
