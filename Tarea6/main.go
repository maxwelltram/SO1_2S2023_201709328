package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Album struct {
	Album  string `json:"album"`
	Artist string `json:"artist"`
	Year   string `json:"year"`
}

var albumList []Album

func main() {
	router := mux.NewRouter()

	// Habilita CORS
	handler := cors.Default().Handler(router)

	router.HandleFunc("/sendData", sendData).Methods("POST")
	router.HandleFunc("/getAlbums", getAlbums).Methods("GET")

	fmt.Println("Servidor Go escuchando en el puerto 8080")
	http.ListenAndServe(":8080", handler)
}

func sendData(w http.ResponseWriter, r *http.Request) {
	var newAlbum Album

	err := json.NewDecoder(r.Body).Decode(&newAlbum)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	albumList = append(albumList, newAlbum)

	// Enviar datos al servidor Node.js a través de una solicitud HTTP
	url := "http://localhost:3001/albumData"
	payload, _ := json.Marshal(newAlbum)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(payload))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	w.WriteHeader(http.StatusOK)
}

func getAlbums(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(albumList)
}
