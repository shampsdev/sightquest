package config

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
	"github.com/lmittmann/tint"
	"github.com/shampsdev/sightquest/server/pkg/utils/slogx"
)

type Config struct {
	Debug  bool `default:"false" envconfig:"DEBUG"`
	Server struct {
		Port uint16 `envconfig:"HTTP_PORT" default:"8000"`
		Host string `envconfig:"HTTP_HOST" default:"0.0.0.0"`
	}
	DB struct {
		User     string `envconfig:"POSTGRES_USER"`
		Password string `envconfig:"POSTGRES_PASSWORD"`
		Host     string `envconfig:"POSTGRES_HOST"`
		Port     uint16 `envconfig:"POSTGRES_PORT"`
		Database string `envconfig:"POSTGRES_DB"`
	}
	Log struct {
		Handler string `envconfig:"LOG_HANDLER" default:"tint"`
	}
	Auth struct {
		PasswordSecret string `envconfig:"AUTH_PASSWORD_SECRET"`
		JWTSecret      string `envconfig:"AUTH_JWT_SECRET"`
	}

	S3 S3Config
}

type S3Config struct {
	AccessKeyID   string `envconfig:"S3_ACCESS_KEY_ID"`
	SecretKey     string `envconfig:"S3_SECRET_KEY"`
	Region        string `envconfig:"S3_REGION"`
	Bucket        string `envconfig:"S3_BUCKET"`
	EndpointURL   string `envconfig:"S3_ENDPOINT_URL"`
	RootDirectory string `envconfig:"S3_ROOT_DIRECTORY"`
}

func Load(envFile string) *Config {
	err := godotenv.Load(envFile)
	if err != nil {
		slog.Info("no .env file, parsed exported variables")
	}
	c := &Config{}
	err = envconfig.Process("", c)
	if err != nil {
		slogx.Fatal(slog.Default(), "can't parse config", slogx.Err(err))
	}
	slog.SetDefault(c.Logger())

	c.Print()
	return c
}

func (c *Config) Print() {
	if c.Debug {
		slog.Info("Launched in debug mode")
		data, _ := json.MarshalIndent(c, "", "\t")
		fmt.Println("=== CONFIG ===")
		fmt.Println(string(data))
		fmt.Println("==============")
	} else {
		slog.Info("Launched in production mode")
	}
}

func (c *Config) DBUrl() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=disable",
		c.DB.User,
		c.DB.Password,
		c.DB.Host,
		c.DB.Port,
		c.DB.Database,
	)
}

func (c *Config) PGXConfig() *pgxpool.Config {
	pgxConfig, err := pgxpool.ParseConfig(c.DBUrl())
	if err != nil {
		slogx.WithErr(slog.Default(), err).Error("can't parse pgx config")
		panic(err)
	}
	return pgxConfig
}

func (c *Config) Logger() *slog.Logger {
	if c.Log.Handler == "tint" {
		return slog.New(tint.NewHandler(os.Stdout, &tint.Options{
			Level:      slog.LevelDebug,
			TimeFormat: time.TimeOnly,
		}))
	}
	if c.Log.Handler == "json" {
		return slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelDebug,
		}))
	}

	panic(fmt.Sprintf("unknown log handler: %s", c.Log.Handler))
}
