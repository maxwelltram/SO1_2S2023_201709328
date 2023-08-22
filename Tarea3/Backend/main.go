package main


import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

var conexion = ConexionMysql()

func ConexionMysql() *sql.DB {
	
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	connString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)

	
	conexion, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Conexion con MySQL Correcta")
	}
	return conexion
}

type Data struct {
	Artista 	string 	`json:"artista"`
	Titulo	  	string  `json:"titulo"`
	Anio    	int  `json:"anio"`
	Genero    	string  `json:"genero"`
}


func indexRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to my api")
}

func guardaRegistro(response http.ResponseWriter, request *http.Request){
	response.Header().Add("content-type", "application/json")
	var dat Data
	
	
	json.NewDecoder((request.Body)).Decode(&dat)

	query := `INSERT INTO DiscosMusicales(Artista, Titulo, Anio, genero) VALUES (?,?,?,?);`
	result, err := conexion.Exec(query, dat.Artista, dat.Titulo, dat.Anio, dat.Genero)
	
	if err != nil {
		fmt.Println(err,"  ERROR")
	}
	fmt.Println(result, " FUNCIONA")
	json.NewEncoder(response).Encode(dat)
}

func getRegistro(response http.ResponseWriter, request *http.Request){
	response.Header().Add("content-type", "application/json")
	var lista []Data
	query := "select * from DiscosMusicales;"
	result, err := conexion.Query(query)
	if err != nil {
		fmt.Println(err)
	}

	for result.Next() {
		var logc Data

		err = result.Scan( &logc.Artista, &logc.Titulo, &logc.Anio,&logc.Genero)
		if err != nil {
			fmt.Println(err)
		}
		lista = append(lista, logc)
	}
	json.NewEncoder(response).Encode(lista)
}

func main(){
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", indexRoute)
	router.HandleFunc("/reg", guardaRegistro).Methods("POST")
	router.HandleFunc("/Registros", getRegistro).Methods("GET")

	fmt.Println("Server on port", 8000)
	handler := cors.Default().Handler(router)
	log.Fatal((http.ListenAndServe(":8000", handler)))
	http.Handle("/", router)
}