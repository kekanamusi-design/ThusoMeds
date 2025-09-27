from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/submit_form", methods=["POST"])
def submit_form():
    data = request.json
    # Generate random ticket number
    ticket_number = f"TKT-{random.randint(1000,9999)}"
    return jsonify({"status": "success", "ticket_number": ticket_number})

if __name__ == "__main__":
    app.run(debug=True)
