package main

import (
	"context"
	pb "ejemplo_despliegue/grpcClient"
	"fmt"
	"log"
	"strconv"
	"github.com/gofiber/fiber/v2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var ctx = context.Background()

//Struct tipo alumno, para recibir datos
type Alumno struct{
	Carnet int32
	Nombre string
	Curso string
	Nota int32
	Semestre string
	Anio int32
}



func insertData(c *fiber.Ctx) error {
	var data map[string]string
	e := c.BodyParser(&data)
	if e != nil {
		return e
	}


	carnet, err := strconv.ParseInt(data["carnet"], 10, 32)
	if err != nil {
		return err
	}
	nota, err := strconv.ParseInt(data["nota"], 10, 32)
	if err != nil {
		return err
	}
	anio, err := strconv.ParseInt(data["anio"], 10, 32)
	if err != nil {
		return err
	}

	rank := Alumno{
		Carnet:  int32(carnet),
		Nombre:   data["nombre"],
		Curso: data["curso"],
		Nota: int32(nota),
		Semestre: data["semestre"],
		Anio: int32(anio),
	}

	go sendRedisServer(rank)
	go sendMysqlServer(rank)

	return nil
}

func sendRedisServer(rank Alumno) {
	conn, err := grpc.Dial("localhost:3001", grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock())
	if err != nil {
		log.Fatalln(err)
	}

	cl := pb.NewGetInfoClient(conn)
	defer func(conn *grpc.ClientConn) {
		err := conn.Close()
		if err != nil {
			log.Fatalln(err)
		}
	}(conn)

	ret, err := cl.ReturnInfo(ctx, &pb.Calificacion{
		Carnet: rank.Carnet,
		Nombre: rank.Nombre,
		Curso: rank.Curso,
		Nota: rank.Nota,
		Semestre: rank.Semestre,
		Anio: rank.Anio,
	})
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Respuesta del server " + ret.GetInfo())
}

func sendMysqlServer(rank Alumno) {

}

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"res": "todo bien",
		})
	})
	app.Post("/insert", insertData)

	err := app.Listen(":3000")
	if err != nil {
		return
	}
}
