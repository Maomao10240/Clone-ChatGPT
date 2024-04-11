import React, { ChangeEvent, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  //config
  apiKey: "AIzaSyDogrrubQi6SFXiYvddOtMw1kHBArYaX9c",
  authDomain: "clone-chatgpt-4128e.firebaseapp.com",
  projectId: "clone-chatgpt-4128e",
  storageBucket: "clone-chatgpt-4128e.appspot.com",
  messagingSenderId: "507980076071",
  appId: "1:507980076071:web:549d6b9488bbc53fcb2a02",
  measurementId: "G-Z7QLSCSZSC",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function index() {
  const [message, setMessage] = useState("Loading");
  const [people, setPeople] = useState([]);

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
      setResponseData(responseData0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <div>{message}</div>
    <div>
      <div className="flex bg-gray-100 h-screen">
        <div className="flex-1 bg-gray-200 ">
          <div className="p-4">
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        </div>
        <div className="w-4/5 bg-white">
          <div className="p-4">
            <div className="flex items-end mb-2">
              <div className="bg-blue-500 text-white rounded-lg p-2 max-w-xs">
                <p>{input}</p>
              </div>
            </div>
            <div className="flex items-end justify-end mb-2">
              <div className="bg-gray-300 rounded-lg p-2 max-w-xs">
                <p>{responseData}</p>
              </div>
            </div>
          </div>
          <div className="w-2/3 bg-gray-200"></div>
          <form className="p-4 flex flex-col h-full" onSubmit={onSubmitHandler}>
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
                className="w-1/3 bg-blue-500 text-white px-4 py-2 rounded-lg"
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

export default index;
