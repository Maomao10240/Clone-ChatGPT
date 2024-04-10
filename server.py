from flask import Flask, jsonify
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
@app.route("/api/home", methods=['GET'])
def return_home():
	return jsonify({
			'message': "Hello world"
		})


if __name__ == "__main__":
	app.run(debug=True)