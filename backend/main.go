package main

import (
	"log"
	"net/http"

	"personal-docs-backend/handlers"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	// Define API routes
	r.HandleFunc("/docs/java", handlers.FetchAndConvertDoc).Methods("GET")

	// Start the server
	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
