from flask import Flask
from flask_cors import CORS
from models import db
from routes import init_routes

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
init_routes(app)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5050)

