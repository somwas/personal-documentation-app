package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"personal-docs-backend/services"
)

// DocResponse represents the response format
type DocResponse struct {
	HTML string `json:"html"`
}

// GetAvailableDocs returns a list of available documentation topics
func GetAvailableDocs(w http.ResponseWriter, r *http.Request) {
	// Define available documentation topics
	topics := []string{
		"new-joiner-guide",
		"python",
		"java",
		"react",
		"system-design",
	}

	// Set response headers
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string][]string{"topics": topics})
}

// FetchDoc retrieves and converts a specific document
func FetchDoc(w http.ResponseWriter, r *http.Request) {
	// Get the doc name from the URL parameters
	docName := r.URL.Query().Get("name")
	if docName == "" {
		http.Error(w, "Missing document name", http.StatusBadRequest)
		return
	}

	// Fetch markdown content for the specified doc
	mdContent, err := services.FetchMarkdown(docName)
	if err != nil {
		http.Error(w, "Failed to fetch markdown", http.StatusInternalServerError)
		return
	}

	// Convert markdown to HTML
	htmlContent := services.ConvertMarkdownToHTML(mdContent)

	// Set response headers
	w.Header().Set("Content-Type", "application/json")

	// Return JSON response with HTML content
	response := DocResponse{
		HTML: htmlContent,
	}

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

// FetchAndConvertDoc is kept for backward compatibility
func FetchAndConvertDoc(w http.ResponseWriter, r *http.Request) {
	// Step 1: Fetch markdown content
	mdContent, err := services.FetchMarkdown("new-joiner-guide") // Default to new-joiner-guide
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
