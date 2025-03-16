package main

import (
	"log"
	"net/http"
	"personal-docs-backend/handlers"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Create a new router
	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/docs", handlers.FetchAndConvertDoc).Methods("GET")     // Legacy endpoint
	r.HandleFunc("/api/topics", handlers.GetAvailableDocs).Methods("GET") // Get available topics
	r.HandleFunc("/api/docs", handlers.FetchDoc).Methods("GET")           // Get specific doc

	// Webhook routes
	r.HandleFunc("/api/webhook", handlers.WebhookHandler).Methods("POST")   // GitHub webhook endpoint
	r.HandleFunc("/api/last-update", handlers.GetLastUpdate).Methods("GET") // Get last update timestamp

	_ = godotenv.Load() // Load .env

	// Enable CORS for the server
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "X-Hub-Signature-256"},
		AllowCredentials: true,
	})

	// Wrap the router with the CORS handler
	handlerWithCORS := c.Handler(r)

	// Start the server
	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handlerWithCORS))
}
