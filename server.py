from flask import Flask, jsonify, Response, request, session
from flask_cors import CORS
from openai import OpenAI




client = OpenAI()

app = Flask(__name__)
CORS(app)

app.secret_key = 'my_secret_key'  # Set a secret key for session management

@app.route("/")
def index():
	return jsonify({
		"message": "openai"
	})

@app.route("/api/home", methods=['POST'])
def receive_data():
	data = request.json  # Get the JSON data sent from the frontend
	#session['data'] = data
	print("Data received from frontend:", data)

    # Process the data and return a response
	response_generator = generate(data['message'])
	response_data = jsonify(response_generator)
	return response_data

def generate(inputString):
	response_data = []
	stream = client.chat.completions.create(
		model="gpt-3.5-turbo",
		messages=[{"role":"user", "content": inputString}], 
		stream=True)
	for chunk in stream:
		if chunk.choices[0].delta.content is not None:
			response_data.append(chunk.choices[0].delta.content)
	return response_data
if __name__ == "__main__":
	app.run(debug=True, port=8080)