package handlers

import (
	"fmt"
	"net/http"

	"personal-docs-backend/services"

	"github.com/gorilla/mux"
)

func FetchAndConvertDoc(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	repo := vars["repo"]

	// Fetch markdown from GitHub
	mdContent, err := services.FetchMarkdown(repo)
	if err != nil {
		http.Error(w, "Failed to fetch markdown", http.StatusInternalServerError)
		return
	}

	// Convert markdown to HTML
	htmlContent := services.ConvertMarkdownToHTML(mdContent)

	// Return HTML response
	w.Header().Set("Content-Type", "text/html")
	fmt.Fprint(w, htmlContent)
}
