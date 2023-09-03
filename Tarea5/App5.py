from flask import Flask
import os
from flask_cors import CORS

App5 = Flask(__name__)
CORS(App5)

@App5.route('/')
def hello():
    return f'Hola Mundo <201709328>'

if __name__ == '__main__':
    App5.run(host='0.0.0.0')



