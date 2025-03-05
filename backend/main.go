package main

import (
	"log"
	"net/http"

	"personal-docs-backend/handlers"

	"github.com/gorilla/mux"
)

func main() {
	// Create a new router
	r := mux.NewRouter()

	// API route to fetch and display the markdown file
	r.HandleFunc("/docs", handlers.FetchAndConvertDoc).Methods("GET")

	// Start the server
	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
