from flask import Flask
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
api = Api(app)

chat_put_args = reqparse.RequestParser()
chat_put_args.add_argument("message", type= str, help="Message is Empty", required=True)
chat_put_args.add_argument("likes", type= str, help="Message is Empty")

chats = {}

class ChatGPT(Resource):
	def get(self, chat_id):
		return chat_id
		#return chats[chat_id]

	def post(self):
		return {"data": "Data posted"}

	def put(self, chat_id):
		# "message"
		args = chat_put_args.parse_args()
		return {chat_id: args}


api.add_resource(ChatGPT, "/chatgpt/<int:chat_id>")


if __name__ == "__main__":
	app.run(debug=True)