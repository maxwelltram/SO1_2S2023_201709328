package main

import (
	"context"
	"database/sql"
	"fmt"
	pb "golangSocket/grpc-server"
	"log"
	"net"

	_ "github.com/go-sql-driver/mysql"
	"google.golang.org/grpc"
)

var ctx = context.Background()
var db *sql.DB

type server struct {
	pb.UnimplementedGetInfoServer
}

//Corre en puerto 3001
const (
	port = ":3001"
)

//Struct tipo alumno, para recibir datos
type Alumno struct{
	Carnet int32
	Nombre string
	Curso string
	Nota int32
	Semestre string
	Anio int32
}

func mysqlConnect() {
	// Credenciales para acceder a la BD
	dsn := "root:Olakeas123**@tcp(35.245.80.91:3306)/alumno"

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalln(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Conexión a MySQL exitosa")
}

func (s *server) ReturnInfo(ctx context.Context, in *pb.Calificacion) (*pb.ReplyInfo, error) {
	fmt.Println("Recibí de alumno: ", in.GetNombre())
	data := Alumno{
		Carnet: in.GetCarnet(),
		Nombre: in.GetNombre(),
		Curso:  in.GetCurso(),
		Nota:   in.GetNota(),
		Semestre: in.GetSemestre(),
		Anio: in.GetAnio(),
	}
	insertMySQL(data)
	return &pb.ReplyInfo{Info: "Hola alumno, recibí el comentario"}, nil
}

func insertMySQL(rank Alumno) {
	// Prepara la consulta SQL para la inserción en MySQL
	query := "INSERT INTO calificacion (carnet, nombre, curso, nota, semestre,anio) VALUES (?,?,?, ?, ?, ?)"
	_, err := db.ExecContext(ctx, query, rank.Carnet, rank.Nombre, rank.Curso, rank.Nota, rank.Semestre, rank.Anio)
	if err != nil {
		log.Println("Error al insertar en MySQL:", err)
	}
}

func main() {
	listen, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGetInfoServer(s, &server{})

	mysqlConnect()

	if err := s.Serve(listen); err != nil {
		log.Fatalln(err)
	}
}
