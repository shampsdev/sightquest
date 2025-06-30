package image

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/sightquest/server/pkg/repo/s3"
	"github.com/shampsdev/sightquest/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases *usecase.Cases, cfg *config.Config) {
	storage, err := s3.NewStorage(cfg.S3)
	if err != nil {
		panic(err)
	}

	imageGroup := r.Group("images")
	imageGroup.Use(middlewares.Auth(cases.Auth))

	imageGroup.POST("upload/by_file", UploadByFile(storage, cfg))
}
