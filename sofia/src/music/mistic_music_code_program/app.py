from flask import Flask, render_template, request
from datetime import datetime

app = Flask(__name__)
musicas = []

@app.route("/", methods=["GET", "POST"])
def criar_musica():
    if request.method == "POST":
        titulo = request.form["titulo"]
        letra = request.form["letra"]
        clima = request.form["clima"]
        data = datetime.now().strftime("%d/%m/%Y %H:%M")

        musicas.append({
            "titulo": titulo,
            "letra": letra,
            "clima": clima,
            "data": data
        })

    return render_template("musicas.html", musicas=musicas)

if __name__ == "__main__":
    app.run(debug=True)
# app.py