from flask import Flask, request, jsonify
from flask_cors import CORS
from ai import generate_study_content
from transcript import process_transcript

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.json
    result = generate_study_content(data)
    return jsonify(result)

@app.route('/api/transcript', methods=['POST'])
def transcript():
    data = request.json
    result = process_transcript(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
