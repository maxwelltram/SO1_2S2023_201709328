package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Student struct {
	Carnet string `json:"201709328"`
	Name   string `json:"Maxwellt Joel Ramírez Ramazzini"`
}

func getDataHandler(w http.ResponseWriter, r *http.Request) {
	student := Student{
		Carnet: "201709328",
		Name:   "Maxwellt Ramirez",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(student)
}

func main() {
	http.HandleFunc("/data", getDataHandler)
	port := "8080"
	fmt.Printf("Server listening on port %s...\n", port)
	http.ListenAndServe(":"+port, nil)
}
