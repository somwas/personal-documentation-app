package services

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

const githubRawURL = "https://raw.githubusercontent.com/sam301100/%s/main/%s.md" //create .md files

func FetchMarkdown(repo string) (string, error) {
	url := fmt.Sprintf(githubRawURL, repo, repo+"_doc")
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("GitHub returned status: %d", resp.StatusCode)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
