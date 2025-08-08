from flask import request, jsonify, json, render_template
from flask import Flask
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
from parser import *
import os
import json 

load_dotenv()
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config['MYSQL_HOST'] = "localhost"
app.config['MYSQL_USER'] = "python"
app.config['MYSQL_PASSWORD'] = os.getenv('PASS')
app.config['MYSQL_DB'] = os.getenv('DB')
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

@app.route("/booksSearchDB/<string:NAME>/<int:userID>", methods=["GET"])
def get_books(NAME, userID):
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT * FROM ksiazki WHERE nazwa LIKE '%{NAME}%';")
    temp = cursor.fetchall()
    cursor.close()
    return jsonify({"ksiazki" : temp}), 200

@app.route("/booksSearchGoodReads/<string:NAME>/<int:userID>", methods=["GET"])
def get_books_parse(NAME, userID):
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT * FROM zaleznosci JOIN ksiazki ON ksiazki.ID=bookID WHERE userID={userID};")
    temp = cursor.fetchall()
    url = urlFromTitle(NAME)
    data = parseURL(url)
    for datum in data:
        for book in temp:
            if book["tytul"]==datum["Title"]:
                datum["InDataBase"] = True
    return jsonify({"ksiazki" : data}), 201

@app.route("/register", methods=["POST"])
def register():
    login = request.json.get("login")
    haslo = request.json.get("haslo")
    haslo = bcrypt.generate_password_hash(haslo).decode('utf-8')
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT login FROM uzytkownicy WHERE login='{login}';")
    temp = cursor.fetchall()
    if len(temp) > 0:
        cursor.close()
        return jsonify({"message" : "Dany użytkownik już istnieje!"}), 401
    else:
        cursor.execute(f'INSERT INTO uzytkownicy (login, haslo) VALUES ("{login}", "{haslo}");')
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message" : "Dodano uzytkownika do bazy!"}), 202

@app.route("/login", methods=["POST"])
def login():
    login = request.json.get("login")
    haslo = request.json.get("haslo")
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT id, login, haslo FROM uzytkownicy WHERE login='{login}';")
    temp = cursor.fetchall()
    cursor.close()
    if len(temp) ==0:
        return jsonify({"message" : "Dany użytkownik nie istnieje!"}), 402
    else:
        password = temp[0]['haslo']
        if not bcrypt.check_password_hash(password, haslo):
            return jsonify({"message" : "Błędne hasło!"}), 410
        else:
            return jsonify({"dane" : temp[0]['id']}), 203

def addBookToUser(userID, bookID):
    cursor = mysql.connection.cursor()
    cursor.execute(f"INSERT INTO zaleznosci (userID, bookID, status) VALUES ({userID}, {bookID}, 1)")
    mysql.connection.commit()
    return cursor.rowcount

@app.route("/addNewBookFromScratch/<int:userID>", methods=["POST"])
def addNewBookFromScratch(userID):
    data = request.json.get("data")
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT ID FROM ksiazki WHERE tytul='{data['Title']}'")
    res = cursor.fetchall()
    if len(res)==0:
        # Nie ma danych w bazie
        print('''INSERT INTO ksiazki (tytul, autorzy, obraz, grayText) VALUES (%s, "%s", %s, %s);''' % (data['Title'], data['Authors'], data['Cover'], data['Info']))
        cursor.execute('''INSERT INTO ksiazki (tytul, autorzy, obraz, grayText) VALUES (%s, "%s", %s, %s);''', (data['Title'], data['Authors'], data['Cover'], data['Info']))
        mysql.connection.commit()

        if addBookToUser(userID, cursor.lastrowid):
            cursor.close()
            return jsonify({"message": "Udało się dodać książkę!"}), 204
        else:
            cursor.close()
            return jsonify({"message": "Coś poszło nie tak."}), 411
    else:
        if addBookToUser(userID, res[0]["ID"]):
            cursor.close()
            return jsonify({"message": "Udało się dodać książkę!"}), 205
        else:
            cursor.close()
            return jsonify({"message": "Coś poszło nie tak."}), 412
        

@app.route("/getBooks/<int:userID>")
def getBooks(userID):
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT * FROM zaleznosci JOIN ksiazki ON bookID = ksiazki.ID WHERE userID={userID} ORDER BY tytul;")
    res = cursor.fetchall()
    return jsonify({"books": res}), 206

@app.route("/readBook/<int:bookID>", methods=["PATCH"])
def readBook(bookID):
    cursor = mysql.connection.cursor()
    cursor.execute(f"UPDATE zaleznosci SET status=2 WHERE ID={bookID}")
    mysql.connection.commit()
    return jsonify({"message": "Aktualizacja się udała."}), 207

@app.route("/finishBook/<int:bookID>", methods=["PATCH"])
def finishBook(bookID):
    cursor = mysql.connection.cursor()
    cursor.execute(f"UPDATE zaleznosci SET status=3 WHERE ID={bookID}")
    mysql.connection.commit()
    return jsonify({"message": "Aktualizacja się udała."}), 207

@app.route("/holdBook/<int:bookID>", methods=["PATCH"])
def holdBook(bookID):
    cursor = mysql.connection.cursor()
    cursor.execute(f"UPDATE zaleznosci SET status=4 WHERE ID={bookID}")
    mysql.connection.commit()
    return jsonify({"message": "Aktualizacja się udała."}), 207

@app.route("/removeBook/<int:bookID>", methods=["DELETE"])
def removeBook(bookID):
    cursor = mysql.connection.cursor()
    cursor.execute(f"DELETE FROM zaleznosci WHERE ID={bookID}")
    mysql.connection.commit()
    return jsonify({"message": "Aktualizacja się udała."}), 207

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=8000)