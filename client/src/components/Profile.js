import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavComponent from "./NavComponent";

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  // const [repliedThreads, setRepliedThreads] = useState([]);
  // const [likedThreads, setLikedThreads] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:4000/api/user/${userId}/profile`)
        .then((res) => res.json())
        .then((data) => {
          if (data.userId) {
            setProfile(data);
          } else {
            console.error("User profile not found");
          }
        })
        .catch((err) => console.error(err));

    //   fetch(`http://localhost:4000/api/user/${userId}/replied-threads`)
    //     .then((res) => res.json())
    //     .then((data) => {
    //       if (data.repliedThreads) {
    //         setRepliedThreads(data.repliedThreads);
    //       } else {
    //         console.error("Error fetching replied threads");
    //       }
    //     })
    //     .catch((err) => console.error(err));

    //   fetch(`http://localhost:4000/api/user/${userId}/liked-threads`)
    //     .then((res) => res.json())
    //     .then((data) => {
    //       if (data.likedThreads) {
    //         setLikedThreads(data.likedThreads);
    //       } else {
    //         console.error("Error fetching liked threads");
    //       }
    //     })
    //     .catch((err) => console.error(err));
  }
  }, [userId]);

  return (
    <>
      <NavComponent />
      <main className="profile">
        <h2 className="profileTitle">Profile Page</h2>
        {profile && (
          <div className="profile__container">
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
