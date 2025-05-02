from flask import Flask, request, jsonify
from flask_cors import CORS
from backend import process_query
from flask_cognito import CognitoAuth, cognito_auth_required
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# Complete Cognito Configuration
load_dotenv()

app.config['COGNITO_REGION'] = os.getenv('COGNITO_REGION')
app.config['COGNITO_USERPOOL_ID'] = os.getenv('COGNITO_USERPOOL_ID')
app.config['COGNITO_APP_CLIENT_ID'] = os.getenv('COGNITO_APP_CLIENT_ID')
app.config['COGNITO_CHECK_TOKEN_EXPIRATION'] = os.getenv('COGNITO_CHECK_TOKEN_EXPIRATION')
app.config['COGNITO_JWT_HEADER_NAME'] = os.getenv('COGNITO_JWT_HEADER_NAME')
app.config['COGNITO_JWT_HEADER_PREFIX'] = os.getenv('COGNITO_JWT_HEADER_PREFIX')

cognito = CognitoAuth(app)

# API route to handle POST request
@app.route('/process-query', methods=['POST'])
@cognito_auth_required
def process_query_api():
    data = request.get_json()
    query = data.get('query')
    
    if query:
        result = process_query(query)
        return jsonify({'response': result}), 200
    else:
        return jsonify({'error': 'Query is required'}), 400

@app.route('/', methods=['GET'])
def home():
    result = process_query("I just got diagnosed with cancer, and I feel overwhelmed. What are the first steps I should take?")
    return jsonify({'response': result}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)