package services

import (
	"fmt"
	"io"
	"net/http"
)

// Replace this with your actual GitHub raw URL
const githubRawURL = "https://raw.githubusercontent.com/sam301100/Java-doc-repo/refs/heads/master/java_doc.md"

func FetchMarkdown() (string, error) {
	resp, err := http.Get(githubRawURL)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("GitHub returned status: %d", resp.StatusCode)
	}

	// Use io.ReadAll() instead of ioutil.ReadAll()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
