import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("http://localhost:8080/answer")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(data);
      });
  }, []);
  return (
    <div>
      <div>{message}</div>
      <div>{"Hello"}</div>
      {/* {people.map((person, index) => (
        <div key={index}>{person}</div>
      ))} */}
    </div>
  );
}

export default index;
