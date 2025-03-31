from flask import Flask, request, jsonify
from flask_cors import CORS
from backend import process_query
import os
app = Flask(__name__)
CORS(app)
# API route to handle POST request
@app.route('/process-query', methods=['POST'])
def process_query_api():
    data = request.get_json()  # Get data from the POST request
    query = data.get('query')
    
    if query:
        result = process_query(query)  # Call your process_query function here
        return jsonify({'response': result}), 200
    else:
        return jsonify({'error': 'Query is required'}), 400

@app.route('/', methods=['GET'])
def home():
    result = process_query("I just got diagnosed with cancer, and I feel overwhelmed. What are the first steps I should take?")
    return jsonify({'response': result}), 200

if __name__ == '__main__':
    app.run(debug=True,port=5000) 
