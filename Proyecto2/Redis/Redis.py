from flask import Flask, request, jsonify
import simplejson as json
import redis
import time
from flask_socketio import SocketIO
import mysql.connector

# Configura la conexión a la base de datos
config = {
    'user': 'root',
    'password': 'Olakeas123**',
    'host': '35.245.80.91',
    'database': 'alumno',
}



app = Flask(__name__)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

class Alumno:
    def __init__(self, carnet, nombre , curso, nota, semestre, year):
        self.carnet = carnet
        self.nombre = nombre
        self.curso = curso
        self.nota = nota
        self.semestre = semestre
        self.year = year

@app.route('/agregarAlumno', methods=['POST'])
def agregar_alumno():
 
    try:
        data = request.get_json()
        alumno = Alumno(
            data['carnet'],
            data['nombre'], 
            data['curso'], 
            data['nota'], 
            data['semestre'], 
            data['year']
            )
        print(data)
        json_alumno = {
            "carnet": alumno.carnet,
            "nombre": alumno.nombre,
            "curso": alumno.curso,
            "nota": alumno.nota,
            "semestre": alumno.semestre,
            "year": alumno.year
        }

        counter = redis_client.incr('contador_alumnos')
        key = f"alumno:{counter}"
        json_alumno_str = json.dumps(json_alumno)
        redis_client.set(key, json_alumno_str)

        ##redis_client.publish('data_changes', 'data_added')

        print("Alumno agregado exitosamente en Redis", json_alumno)
        ##return f"¡Gracias por votar! ({counter} votos registrados)", 200
    except Exception as e:
        print(f"Error en mysql: {e}")
        return str(e), 500  
    
    print("Datos insertados con éxito en mysql")
    try:
    #Crea una conexión a la base de datos
        cnx = mysql.connector.connect(**config)

        # Crea un cursor para ejecutar consultas
        cursor = cnx.cursor()

        # Define los datos que deseas insertar
        #data_to_insert = {
        #'carnet': alumno.carnet, 
        #'nombre': alumno.nombre,
        #'curso': alumno.curso,
        #'nota': alumno.nota,
        #'semestre': alumno.semestre,
        #'anio': alumno.year
        #}
    
        # Define la consulta SQL para la inserción
        insert_query = "INSERT INTO calificacion (carnet, nombre, curso, nota, semestre,anio) VALUES (%s,%s,%s, %s, %s, %s)"

        data_to_insert= (alumno.carnet, alumno.nombre, alumno.curso, alumno.nota, alumno.semestre, alumno.year) 
        # Ejecuta la consulta con los datos
        cursor.execute(insert_query, data_to_insert)

        # Confirma los cambios en la base de datos
        cnx.commit()

        # Cierra el cursor y la conexión
        cursor.close()
        cnx.close()

        print("Datos insertados con éxito en mysql")  
        return jsonify({"message": "Alumno agregado exitosamente"}), 200
    except Exception as e:
        print(f"Error en mysql: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/cantidadRegistros', methods=['GET'])
def get_data():
    # Consulta datos desde Redis (ajusta esta parte según tus necesidades)
    total_data_count = r.dbsize()
    return jsonify({'total_data_count': total_data_count})


@app.route('/cantidadAlumnosC', methods=['GET'])
def get_data2():
    # Consulta datos desde Redis (ajusta esta parte según tus necesidades)
    data = redis_client.get('data_key')
    if data:
        data = data.decode('utf-8')
        return jsonify({'data': data})
    else:
        return jsonify({'data': []})


def get_total_data_count():
    return r.dbsize()

def track_total_data_count():
    while True:
        total_data_count = get_total_data_count()
        print(f"Número total de datos en Redis: {total_data_count}")
        time.sleep(5)  # Ajusta el intervalo de tiempo según tus necesidades




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3300, debug=True)