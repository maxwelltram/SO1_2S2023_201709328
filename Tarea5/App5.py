from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Configura CORS para toda la aplicación
CORS(app, resources={r"/": {"origins": "*"}})

# Rutas de ejemplo
@app.route('/')
def hello_world():
    return jsonify({'message': '¡Hola, mundo!'})

@app.route('/data')
def sample_data():
    data = {'name': 'Ejemplo de datos', 'value': 42}
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)



