import random
import json

alumnos=[{
  "carnet": "202324789",
  "nombre": "Clio Kenafaque"
}, {
  "carnet": "202203530",
  "nombre": "Ban Hearl"
}, {
  "carnet": "201014233",
  "nombre": "Lola Langer"
}, {
  "carnet": "201618995",
  "nombre": "Christean Lomaz"
}, {
  "carnet": "201604997",
  "nombre": "Gaylene Kearey"
}, {
  "carnet": "201403498",
  "nombre": "Marlee Beswetherick"
}, {
  "carnet": "201828877",
  "nombre": "Bendix Ashbolt"
}, {
  "carnet": "201813301",
  "nombre": "Warner Sparkwell"
}, {
  "carnet": "201800137",
  "nombre": "Cory Culvey"
}, {
  "carnet": "201100696",
  "nombre": "Jacquie Binny"
}, {
  "carnet": "202212213",
  "nombre": "Tobey Pagin"
}, {
  "carnet": "202020130",
  "nombre": "Kris Auletta"
}, {
  "carnet": "202325964",
  "nombre": "Daveta Pitrollo"
}, {
  "carnet": "202118637",
  "nombre": "Sol McCarver"
}, {
  "carnet": "201812552",
  "nombre": "Archer Bysaker"
}, {
  "carnet": "201511891",
  "nombre": "Teodor Cheevers"
}, {
  "carnet": "201509229",
  "nombre": "Cristina Coviello"
}, {
  "carnet": "202200057",
  "nombre": "Candide McKune"
}, {
  "carnet": "201204437",
  "nombre": "Joshuah Grumbridge"
}, {
  "carnet": "202207965",
  "nombre": "Clotilda Plinck"
}]

cursos=["SO1","BD1","LFP","SA","AYD1"]

semestres=["1S","2S"]

notas=[50,60,70,80,90,100]

archivo=[]

for i in range(10):
    x=random.randint(0,len(alumnos)-1)
    carnet=int(alumnos[x]['carnet'])
    nombre=alumnos[x]['nombre']

    x=random.randint(0,len(cursos)-1)
    curso=cursos[x]

    x=random.randint(0,len(semestres)-1)
    semestre=semestres[x]

    x=random.randint(0,len(notas)-1)
    nota=notas[x]

    nuevo={"carnet":str(carnet),"nombre":nombre,"curso":curso,"nota":str(nota),"semestre":semestre,"year":"2023"}

    archivo.append(nuevo)

json_string = json.dumps(archivo)

with open('CARGA-MASIVA.json', 'w') as outfile:
    json.dump(archivo, outfile)
