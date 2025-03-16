package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
)

var (
	lastUpdate     time.Time
	lastUpdateLock sync.RWMutex
)

// GetLastUpdate returns the timestamp of the last content update
func GetLastUpdate(w http.ResponseWriter, r *http.Request) {
	lastUpdateLock.RLock()
	defer lastUpdateLock.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	log.Printf("Returning last update time: %v", lastUpdate)
	json.NewEncoder(w).Encode(map[string]time.Time{"lastUpdate": lastUpdate})
}

// WebhookHandler handles GitHub webhook events
func WebhookHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received webhook request")

	// Only accept POST requests
	if r.Method != http.MethodPost {
		log.Println("Method not allowed:", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Read the webhook secret from environment variable
	webhookSecret := os.Getenv("GITHUB_WEBHOOK_SECRET")
	if webhookSecret == "" {
		log.Println("Webhook secret not configured")
		http.Error(w, "Webhook secret not configured", http.StatusInternalServerError)
		return
	}

	// Get the signature from headers
	signature := r.Header.Get("X-Hub-Signature-256")
	if signature == "" {
		log.Println("No signature found in request")
		http.Error(w, "No signature found", http.StatusBadRequest)
		return
	}

	// Read the body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println("Failed to read request body:", err)
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}

	// Verify the signature
	mac := hmac.New(sha256.New, []byte(webhookSecret))
	mac.Write(body)
	expectedMAC := "sha256=" + hex.EncodeToString(mac.Sum(nil))

	if !hmac.Equal([]byte(signature), []byte(expectedMAC)) {
		log.Println("Invalid signature")
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}

	// Parse the webhook payload
	var event struct {
		Ref string `json:"ref"`
	}
	if err := json.Unmarshal(body, &event); err != nil {
		log.Println("Failed to parse webhook payload:", err)
		http.Error(w, "Failed to parse webhook payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received push event for ref: %s", event.Ref)

	// Process push events to the master or navigation-bar-setup branch
	if event.Ref == "refs/heads/master" || event.Ref == "refs/heads/navigation-bar-setup" {
		// Update the last update timestamp
		lastUpdateLock.Lock()
		lastUpdate = time.Now().UTC() // Use UTC for consistency
		log.Printf("Updated timestamp to: %v", lastUpdate)
		lastUpdateLock.Unlock()

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	} else {
		log.Printf("Ignoring push event for ref: %s", event.Ref)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "ignored"})
	}
}
