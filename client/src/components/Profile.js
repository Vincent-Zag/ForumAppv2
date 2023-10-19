import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavComponent from "./NavComponent";

const Profile = (props) => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [repliedThreads, setRepliedThreads] = useState([]);
  const [likedThreads, setLikedThreads] = useState([]);


  useEffect(() => {
    // Check if the user is authenticated
    fetch("http://localhost:4000/api/user/authenticated", {
      method: "GET",
      credentials: "include", 
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        console.log("Is authenticated:", data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:4000/api/user/${userId}/profile`,{
        method: "GET",
        credentials: "include", 
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.userId) {
            setProfile(data);
          } else {
            console.error("User profile not found");
          }
        })
        .catch((err) => console.error(err));

      // fetch(`/api/user/${userId}/replies`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.repliedThreads) {
      //       setRepliedThreads(data.repliedThreads);
      //     } else {
      //       console.error("Error fetching replied threads");
      //     }
      //   })
      //   .catch((err) => console.error(err));

    
      // fetch(`/api/user/${userId}/likes`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.likedThreads) {
      //       setLikedThreads(data.likedThreads);
      //     } else {
      //       console.error("Error fetching liked threads");
      //     }
      //   })
      //   .catch((err) => console.error(err));
      }
  }, [userId]);

  return (
    <>
      <NavComponent setUserId = {props.setUserId} userId = {props.userId}/>
      <main className="profile">
        <h2 className="profileTitle">Profile Page</h2>
        {profile && (
          <div className="profile__container">
            <h3>UserID: {profile.userId}</h3>
            <h3>Username: {profile.username}</h3>
            <h3>Email: {profile.email}</h3>
            {/* <h3>Number of Replies: {repliedThreads.length}</h3>
            <h3>Number of Likes: {likedThreads.length}</h3> */}
          </div>
        )}
      </main>
    </>
  );
};

export default Profile;
