from flask import Flask, jsonify, Response
from flask_cors import CORS
from openai import OpenAI




# OpenAI.api_key = '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'

client = OpenAI(api_key = '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')
#client = OpenAI()

app = Flask(__name__)
CORS(app)

@app.route("/api/home", methods=['GET'])
def return_home():
	return jsonify({
			'message': "Hello world",
			'people': ["Jerry", "Helen", "Happy"]
		})

@app.route("/")
def index():
	return jsonify({
		"message": "openai"
	})
@app.route("/answer", methods=["GET", "POST"])
def answer():
	response_generator = generate()
	return jsonify(response_generator)

def generate():
	response_data = []
	stream = client.chat.completions.create(
		model="gpt-3.5-turbo",
		messages=[{"role":"user", "content":"In 100 words, descirbe the flask"}], 
		stream=True)
	for chunk in stream:
		if chunk.choices[0].delta.content is not None:
			response_data.append(chunk.choices[0].delta.content)
	return response_data
if __name__ == "__main__":
	app.run(debug=True, port=8080)