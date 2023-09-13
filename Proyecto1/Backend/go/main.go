package main

import (
    "fmt"
    "io/ioutil"
    "strings"
)

func main() {
    data, err := ioutil.ReadFile("/proc/ram_201709328")
    if err != nil {
        fmt.Println("Error al leer el archivo:", err)
        return
    }

    lines := strings.Split(string(data), "\n")
    for _, line := range lines {
        fmt.Println(line)
    }
}