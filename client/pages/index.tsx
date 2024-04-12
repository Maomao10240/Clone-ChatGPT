import React, { ChangeEvent, useEffect, useState } from "react";
// import * as firebase from "firebase/app";

import { FirebaseApp, initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const fireApp: FirebaseApp = firebase.initializeApp({
  //config
  apiKey: "AIzaSyDogrrubQi6SFXiYvddOtMw1kHBArYaX9c",
  authDomain: "clone-chatgpt-4128e.firebaseapp.com",
  projectId: "clone-chatgpt-4128e",
  storageBucket: "clone-chatgpt-4128e.appspot.com",
  messagingSenderId: "507980076071",
  appId: "1:507980076071:web:549d6b9488bbc53fcb2a02",
  measurementId: "G-Z7QLSCSZSC",
});

const auth = getAuth();
const firestore = firebase.firestore();
interface Message {
  id: string;
  user: string;
  text: string;
  timecreated: Date;
}

function index() {
  const [message, setMessage] = useState("Loading");
  const [people, setPeople] = useState([]);
  const [chathistory, setChathistory] = useState<Message[]>([]);

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  // const [messages] = useCollectionData(query, { idField: "id" });
  const getChatList = async () => {
    try {
      const data = await getDocs(messagesRef.orderBy("createdAt"));
      const history = data.docs.map((doc) => {
        const messageData = doc.data();
        return {
          id: doc.id,
          user: messageData.user,
          text: messageData.text,
          timecreated: messageData.timecreated,
        };
      });
      setChathistory(history);
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   fetch("http://localhost:8080/api/home")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // console.log(data);
  //       setMessage(data.message);
  //       setPeople(data.people);
  //       console.log(data.people);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  //form data
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
      await messagesRef.add({
        id: "Input",
        text: input,
        user: "Owner",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await messagesRef.add({
        id: "Hello",
        text: responseData0,
        user: "Hellen",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      getChatList();
      setResponseData(responseData0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <div>{message}</div>
    <div>
      <div className="flex bg-gray-100  h-screen">
        <div className="flex-1 bg-gray-200 ">
          <div className="p-4">
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        </div>
        <div className="w-4/5 bg-white flex-col place-items-end overflow-y-scroll">
          <div className="h-4/5 flex-1 py-2">
            <div className="flex items-end mb-2">
              <div>
                <div>
                  {"response: "}
                  {chathistory &&
                    chathistory.map((msg) => <ChatMessage {...msg} />)}
                </div>
              </div>
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
    </div>
  );
}

function ChatMessage(props: Message) {
  return (
    <>
      <div className="shadow-gray-300 p-2 rounded mb-2">
        <p style={{ color: props.user === "Owner" ? "blue" : "black" }}>
          {props.text}
        </p>
      </div>
    </>
  );
}

export default index;
