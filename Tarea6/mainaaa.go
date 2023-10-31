package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Album representa la estructura de datos para un álbum de música.
type Album struct {
	Album  string `json:"album"`
	Artist string `json:"artist"`
	Year   string `json:"year"`
}

var albums []Album

func main() {
	// Configurar enrutador
	r := mux.NewRouter()

	// Rutas de la API
	r.HandleFunc("/agregar-album", AgregarAlbum).Methods("POST")

	// Iniciar el servidor en el puerto 8080
	log.Println("Servidor Go escuchando en el puerto 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

// AgregarAlbum permite agregar un nuevo álbum a la lista.
func AgregarAlbum(w http.ResponseWriter, r *http.Request) {
	var album Album
	decoder := json.NewDecoder(r.Body)

	// Decodificar el cuerpo JSON de la solicitud
	err := decoder.Decode(&album)
	if err != nil {
		http.Error(w, "Error al decodificar JSON", http.StatusBadRequest)
		return
	}

	// Agregar el álbum a la lista
	albums = append(albums, album)

	// Enviar el álbum al servidor Node.js (cambiar la dirección y el puerto según corresponda)
	_, err = http.Post("http://localhost:3001/agregar-album", "application/json", r.Body)
	if err != nil {
		http.Error(w, "Error al enviar el álbum al servidor Node.js", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
