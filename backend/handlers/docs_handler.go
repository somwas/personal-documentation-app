package handlers

import (
	"fmt"
	"net/http"

	"personal-docs-backend/services"
)

func FetchAndConvertDoc(w http.ResponseWriter, r *http.Request) {
	// Step 1: Fetch markdown content
	mdContent, err := services.FetchMarkdown()
	if err != nil {
		http.Error(w, "Failed to fetch markdown", http.StatusInternalServerError)
		return
	}

	// Step 2: Convert markdown to HTML
	htmlContent := services.ConvertMarkdownToHTML(mdContent)

	// Step 3: Return HTML response
	w.Header().Set("Content-Type", "text/html")
	fmt.Fprint(w, htmlContent)
}
