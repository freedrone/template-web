package main

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"html/template"
	"io"
	"net/http"
	"os"
	"strings"
)

type data struct { }

type Template struct {
	templates *template.Template
}

func (t Template) Render(writer io.Writer, name string, data interface{}, ctx echo.Context) error {
	return t.templates.Execute(writer, data)
}

func main() {
	e := echo.New()
	e.Pre(middleware.HTTPSRedirectWithConfig(middleware.RedirectConfig{
		Skipper: func(ctx echo.Context) bool {
			return !strings.Contains(ctx.Request().Host, "my-host.com")
		},
	}))
	e.Use(middleware.Recover())
	e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
		Level: 5,
	}))

	t := &Template{
		templates: template.Must(template.ParseGlob("public/*.html")),
	}
	e.Renderer = t

	e.GET("/healthy", healthy)

	e.File("/main.js", "public/main.js")
	e.File("/style.css", "public/style.css")
	e.Any("/*", any)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", port)))
}

func any(ctx echo.Context) error {
	return ctx.Render(http.StatusOK, "index.html", data{})
}

func healthy(ctx echo.Context) error {
	return ctx.String(http.StatusOK, "OK")
}
