import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavComponent from "./NavComponent";
import Likes from "../utils/Likes";
import Comments from "../utils/Comments";
import "../styles/Home.css";

const Home = () => {
  const [thread, setThread] = useState("");
  const [threadList, setThreadList] = useState([]);
  const [authenticated, setAuthenticated] = useState(false); // Add authenticated state
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      fetch("http://localhost:4000/api/all/threads")
        .then((res) => res.json())
        .then((data) => {
          console.log("Received data:", data);
          setThreadList(data.threads || []);
        })
        .catch((err) => console.error(err));
    };

    checkUser();

    // Check if the user is authenticated
    fetch("http://localhost:4000/api/user/authenticated", {
      method: "GET",
      credentials: "include", // Include credentials for the session
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  const createThread = () => {
    fetch("http://localhost:4000/api/create/thread", {
      method: "POST",
      body: JSON.stringify({
        thread,
        userId: localStorage.getItem("userId"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setThreadList([...threadList, data.thread]); 
          setThread("");
        }
        alert("Thread created successfully!");
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (authenticated) {
      createThread();
      setThread("");
    } else {
      alert("You need to be authenticated to create a thread.");

    }
  };

  return (
    <>
      <NavComponent />
      <main className="home">
        <h2 className="homeTitle">Create a Thread</h2>
        <form className="homeForm" onSubmit={handleSubmit}>
          <div className="home__container">
            <label htmlFor="thread">Title / Description</label>
            <input
              type="text"
              name="thread"
              required
              value={thread}
              onChange={(e) => setThread(e.target.value)}
            />
          </div>
          <button className="homeBtn">CREATE THREAD</button>
        </form>

        <h3>Threads</h3>
        <p></p>

        <div className="thread__container">
          {threadList.map((thread) => (
            <div className="thread__item" key={thread._id}>
              <p>{thread.title}</p>
              <div className="react__container">
                {thread.likes && (
                  <Likes numberOfLikes={thread.likes.length} threadId={thread._id} />
                )}
                {thread.replies && (
                  <Comments
                    numberOfComments={thread.replies.length}
                    threadId={thread._id}
                    title={thread.title}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
