package services

import (
	"github.com/gomarkdown/markdown"
)

func ConvertMarkdownToHTML(mdContent string) string {
	html := markdown.ToHTML([]byte(mdContent), nil, nil)
	return string(html)
}
