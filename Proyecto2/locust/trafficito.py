import json
from locust import HttpUser, between, task

class TrafficGenerator(HttpUser):
    wait_time = between(0.1, 0.9)
    reader = readFile()
    reader.loadFile()

    def on_start(self):
        print("On Start")

    @task
    def simulate_traffic(self):
        # Genera datos aleatorios para enviarlos al Ingress
        import random

        # Datos aleatorios
        carnet = random.randint(100000, 999999)
        nombre = "Alumno " + str(random.randint(1, 10))
        curso = random.choice(["SO1", "BD1", "LFP", "SA", "AYD1"])
        nota = random.randint(50, 100)
        semestre = random.choice(["1S", "2S"])
        year = random.randint(2022, 2023)

        # Realiza una solicitud HTTP al Ingress
        self.client.get(f"/ingress_path?carnet={carnet}&nombre={nombre}&curso={curso}&nota={nota}&semestre={semestre}&year={year}")
