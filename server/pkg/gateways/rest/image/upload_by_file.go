package image

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/sightquest/server/pkg/config"
	"github.com/shampsdev/sightquest/server/pkg/repo"
)

type UploadResponse struct {
	URL string `json:"url"`
}

// UploadByFile godoc
// @Summary Upload file to s3
// @Tags images
// @Accept json
// @Produce json
// @Schemes http https
// @Param file formData file true "Image data"
// @Param dir query string true "Directory in s3 storage"
// @Success 200 {object} UploadResponse "A url to the stored image"
// @Failure 400 "Parsing error"
// @Failure 401 "Unauthorized"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /images/upload/by_file [post]
func UploadByFile(storage repo.ImageStorage, cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		destDir := c.Query("dir")
		if destDir == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "directory is required"})
			return
		}
		destDir = cfg.S3.RootDirectory + "/" + destDir

		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fOpen, err := file.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		defer fOpen.Close()

		url, err := storage.SaveImageByReader(c, fOpen, destDir)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, UploadResponse{URL: url})
	}
}
