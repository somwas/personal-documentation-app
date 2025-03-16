package services

import (
	"fmt"
	"io"
	"net/http"
)

// Base GitHub raw URL - you'll need to update this to your actual repository
const githubBaseURL = "https://raw.githubusercontent.com/sam301100/personal-docs-content/master"

// FetchMarkdown fetches markdown content for a specific document
func FetchMarkdown(docName string) (string, error) {
	// Construct the URL for the specific document
	url := fmt.Sprintf("%s/%s.md", githubBaseURL, docName)

	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("GitHub returned status: %d for document: %s", resp.StatusCode, docName)
	}

	// Use io.ReadAll() instead of ioutil.ReadAll()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
