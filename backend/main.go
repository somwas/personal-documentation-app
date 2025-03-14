package main

import (
	"log"
	"net/http"
	"personal-docs-backend/handlers"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Create a new router
	r := mux.NewRouter()

	// API route to fetch and display the markdown file
	r.HandleFunc("/docs", handlers.FetchAndConvertDoc).Methods("GET")

	// Enable CORS for the server
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	// Wrap the router with the CORS handler
	handlerWithCORS := c.Handler(r)

	// Start the server
	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handlerWithCORS))
}
