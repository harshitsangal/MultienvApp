from flask import Flask,jsonify ,render_template, request, redirect, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  
# Use MONGO_URI from the .env file
app.config['MONGO_URI'] = os.getenv('MONGO_URI')

# Initialize MongoDB client
mongo = PyMongo(app)

@app.route('/')
def index(): 
    todos = mongo.db.todos.find().sort('created_at', -1)
    return render_template('index.html', todos=todos)

@app.route('/add', methods=['POST'])
def add():
    title = request.form.get('title')
    description = request.form.get('description')
    if title:
        todo = {
            'title': title,
            'description': description,
            'completed': False,
            'created_at': datetime.utcnow()
        }
        mongo.db.todos.insert_one(todo)
    return redirect(url_for('index'))

@app.route('/complete/<id>')
def complete(id):
    todo = mongo.db.todos.find_one({'_id': ObjectId(id)})
    if todo:
        mongo.db.todos.update_one(
            {'_id': ObjectId(id)},
            {'$set': {'completed': not todo.get('completed', False)}}
        )
    return redirect(url_for('index'))

@app.route('/delete/<id>')
def delete(id):
    mongo.db.todos.delete_one({'_id': ObjectId(id)})
    return redirect(url_for('index'))

@app.route('/api/tickets', methods=['GET', 'POST'])
def tickets_api():
    """List or create development environment tickets (JSON API)."""
    if request.method == 'GET':
        todos = list(
            mongo.db.todos.find(
                {}, {"_id": 0, "title": 1, "description": 1, "completed": 1, "created_at": 1}
            )
        )
        for todo in todos:
            todo["created_at"] = (
                todo["created_at"].isoformat() if "created_at" in todo else None
            )
        return jsonify({"tasks": todos, "environment": "Development"})

    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip() or None
    if not title:
        return jsonify({"error": "title is required"}), 400

    doc = {
        "title": title,
        "description": description,
        "completed": False,
        "created_at": datetime.utcnow(),
    }
    result = mongo.db.todos.insert_one(doc)
    created = mongo.db.todos.find_one(
        {"_id": result.inserted_id},
        {"_id": 0, "title": 1, "description": 1, "completed": 1, "created_at": 1},
    )
    created["created_at"] = (
        created["created_at"].isoformat() if created.get("created_at") else None
    )
    return jsonify({"task": created, "environment": "Development"}), 201

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3001 , debug=True)
