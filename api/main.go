package main

import (
	"net/http"

	"github.com/labstack/echo"
	//"github.com/icrowley/fake"
	"github.com/icrowley/fake"
	"github.com/labstack/echo/middleware"
)

type Book struct {
	ID  int `json:"id"`
	Title string `json:"title"`
}

const (
	limit = 20
)

func main() {
	e := echo.New()
	e.Debug = true

	e.Use(ServerHeader, middleware.Logger())

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	e.GET("/users", func(c echo.Context) error {
		users := make([]Book, limit)
		for i := 0; i < limit; i++ {
			users[i] = Book{
				ID: i + 1,
				Title: fake.Title(),
			}
		}
		return c.JSON(http.StatusOK, users)
	})

	e.Logger.Fatal(e.Start(":8080"))
}

func ServerHeader(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		auth := c.Request().Header.Get(echo.HeaderAuthorization)
		c.Logger().Debugf("Authorization: %s", auth)
		return next(c)
	}
}
