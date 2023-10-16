import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavPro from "./Nav";

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [repliesCount, setRepliesCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:4000/api/user/${userId}/profile`)
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) {
            setProfile(data.profile);
          } else {
            console.error("User profile not found");
          }
        })
        .catch((err) => console.error(err));

      fetch(`http://localhost:4000/api/user/${userId}/replies`)
        .then((res) => res.json())
        .then((data) => {
          if (data.count) {
            setRepliesCount(data.count);
          } else {
            console.error("Error fetching replies count");
          }
        })
        .catch((err) => console.error(err));

      fetch(`http://localhost:4000/api/user/${userId}/likes`)
        .then((res) => res.json())
        .then((data) => {
          if (data.count) {
            setLikesCount(data.count);
          } else {
            console.error("Error fetching likes count");
          }
        })
        .catch((err) => console.error(err));
    }
  }, [userId]);

  return (
    <>
      <NavPro />
      <main className="profile">
        <h2 className="profileTitle">Profile Page</h2>
        {profile && (
          <div className="profile__container">
            <h3>Username: {profile.username}</h3>
            <h3>Email: {profile.email}</h3>
            <h3>Number of Replies: {repliesCount}</h3>
            <h3>Number of Likes: {likesCount}</h3>
          </div>
        )}
      </main>
    </>
  );
};

export default Profile;
