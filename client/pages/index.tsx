import React, { ChangeEvent, useEffect, useState } from "react";
// import * as firebase from "firebase/app";
import { MouseEventHandler } from "react";

import { FirebaseApp, initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//config
const fireApp: FirebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDogrrubQi6SFXiYvddOtMw1kHBArYaX9c",
  authDomain: "clone-chatgpt-4128e.firebaseapp.com",
  projectId: "clone-chatgpt-4128e",
  storageBucket: "clone-chatgpt-4128e.appspot.com",
  messagingSenderId: "507980076071",
  appId: "1:507980076071:web:549d6b9488bbc53fcb2a02",
  measurementId: "G-Z7QLSCSZSC",
});

//define Message and ChatRoom
const auth = getAuth();
const firestore = firebase.firestore();
interface Message {
  id: string;
  user: string;
  text: string;
  createdAt: firebase.firestore.FieldValue;
}

interface ChatRoom {
  id: string;
  name: string;
  messages: Message[];
  createAt: firebase.firestore.FieldValue;
}

//Main function
function index() {
  return (
    <div className="flex  h-screen">
      <div className="w-1/5 flex-1 bg-gray-200 ">
        <ChatRooms />
      </div>
      <div className="w-4/5 bg-white flex-col overflow-y-scroll">
        {/* <ChatRoom {}/> */}
      </div>
    </div>
  );
}

function ChatRooms() {
  const [roomhistory, setroomhistory] = useState<ChatRoom[]>([]);
  const [newRoom, setNewRoom] = useState<ChatRoom>();

  const chatRoomsRef = firestore.collection("chatRooms");
  const [newChat, setNewChat] = useState(false);
  const getChatRooms = async () => {
    try {
      const data = await getDocs(chatRoomsRef);
      const history = data.docs.map((doc) => {
        const chatRoomData = doc.data();
        return {
          id: doc.id,
          name: chatRoomData.name,
          messages: chatRoomData.messages,
          createdAt: chatRoomData.timecreated,
        };
      });
      setroomhistory(history);
      console.log("what");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getChatRooms();
  }, []);

  const onClickHandler: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      const chatRoomRef = firebase.firestore().collection("chatRooms");
      const cnt = (await chatRoomRef.get()).size;
      const chatRoomName = `Chat ${cnt + 1}`;
      const newChatRoom: ChatRoom = {
        id: "",
        name: chatRoomName,
        messages: [],
        createAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      const newRoomRef = await chatRoomRef.add(newChatRoom);
      const newRoomId = newRoomRef.id;
      setNewRoom({ ...newChatRoom, id: newRoomId });
      console.log("New chat room created:", newChatRoom);
      setNewChat(true);
      getChatRooms();
    } catch (err) {
      console.log(err);
    }
  };
  const handleChatClose = () => {
    setNewChat(false);
  };
  return (
    <div>
      <div className="p-4">
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={onClickHandler}
        >
          Start New Chat
        </button>
      </div>
      <div className=" leading-8 mx-4">
        {" ChatRooms: "}
        {roomhistory &&
          roomhistory.map((room) => (
            <ChatRoomLayout
              newChat={newChat}
              setNewChat={setNewChat}
              chatRoom={room}
            />
          ))}
      </div>
      <div>
        {newChat && (
          <div>
            <div className="fixed right-0 top-0 h-full w-4/5 bg-white shadow-lg">
              <div className="text-blue-300"> New chat</div>
              <ChatRoom
                newChat={newChat}
                setNewChat={setNewChat}
                chatRoom={newRoom}
              />
            </div>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}

//For each individaul room
function ChatRoom({ newChat, setNewChat, chatRoom, ...props }) {
  const [chathistory, setChathistory] = useState<Message[]>([]);

  const getChatList = async () => {
    try {
      const messagesSnapshot = await firestore
        .collection("chatRooms")
        .doc(chatRoom.id)
        .get();

      const chatRoomData = messagesSnapshot.data();
      const chatMessages = chatRoomData.messages;

      const chatRoomsRef = firestore.collection("chatRooms").doc(chatRoom.id);
      if (chatMessages.length != 0)
        await chatRoomsRef.update({ name: chatMessages[0].text });
      setChathistory(chatMessages);
      console.log(chatMessages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChatList();
  }, [chatRoom.id]);

  const [formData, setFormData] = useState({
    input: "",
  });
  const [responseData, setResponseData] = useState("responseData");
  //Destructure
  const { input } = formData;

  //onChange
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //onsubmit
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("onSubmit triggered");
    try {
      const response = await fetch("http://localhost:8080/api/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: formData.input,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send data");
      }

      const responseData0 = await response.json();
      console.log("POST response:", responseData0);
      const messagesSnapshot = await firestore
        .collection("chatRooms")
        .doc(chatRoom.id)
        .get();
      // console.log(messagesSnapshot);

      const chatRoomData = messagesSnapshot.data();
      const chatMessages = chatRoomData.messages || [];

      const newMessage = {
        id: "Input",
        text: input,
        user: "You",
        createdAt: new Date(),
      };
      const newResponse = {
        id: "Hello",
        text: responseData0,
        user: "ChatGPT",
        createdAt: new Date(),
      };
      //firestore.FieldValue.serverTimestamp() is not allowed to use inside array

      const updateMessages = [...chatMessages, newMessage, newResponse];
      const chatRoomsRef = firestore.collection("chatRooms").doc(chatRoom.id);

      await chatRoomsRef.update({ messages: updateMessages });

      getChatList();
      setResponseData(responseData0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <div className="h-4/5 flex-1 py-2">
          <div className="flex flex-col mb-2">
            {chathistory && chathistory.map((msg) => <ChatMessage {...msg} />)}
          </div>
        </div>
        <div className="h-1/5 fixed bottom-0 right-0 left-80">
          <form
            className="w-full rounded px-2 py-1 mr-2 focus:outline-none focus:ring focus:border-blue-300 "
            onSubmit={onSubmitHandler}
          >
            <div>
              <input
                type="text"
                name="input"
                value={input}
                className="mt-auto w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none"
                placeholder="Type your message..."
                onChange={onChangeInput}
              />
              <button
                className="w-1/3 bg-blue-500 text-white px-4 py-2 rounded-lg ml-4"
                type="submit"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ChatMessage(props: Message) {
  return (
    <>
      <div className=" p-2 rounded mb-2 leading-5">
        <span
          className="font-bold"
          style={{ color: props.user === "You" ? "blue" : "black" }}
        >
          {props.user}:{" "}
        </span>

        <span
          className="font-normal"
          style={{ color: props.user === "You" ? "blue" : "black" }}
        >
          {props.text}
        </span>
      </div>
    </>
  );
}
function ChatRoomLayout({ newChat, setNewChat, chatRoom, ...props }) {
  const [clicked, setClicked] = useState(false);
  const onClickHandler: MouseEventHandler<HTMLAnchorElement> = async () => {
    console.log(chatRoom.name);
    setNewChat(false);
    setClicked(true);
  };
  return (
    <>
      <div>
        <a
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-yellow-100 rounded cursor-pointer"
          onClick={onClickHandler}
        >
          {chatRoom.name}
        </a>
        <div>
          {clicked && (
            <div className="fixed right-0 top-0 h-full w-4/5 bg-white shadow-lg">
              <ChatRoom
                newChat={clicked}
                setNewChat={setClicked}
                chatRoom={chatRoom}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default index;
