import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Register from "./Register";
import NavPro from "./Nav2";
import '../styles/Home.css';

const Profile = (() => {
    const { id } = useParams();
    const [profile, setProfile] = useState("");

    const dispProfile = (() => {
		fetch("http://localhost:4000/api/profile", {
			method: "POST",
			body: JSON.stringify({
				id,
				userId: localStorage.getItem("_id"),
                profile
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				alert(data.message);
				//navigate("/profile");
			})
			.catch((err) => console.error(err));
        dispProfile()
	}, [id]);
	/*const handleSubmitReply = (e) => {
		e.preventDefault();
		addReply();
		setReply("");
	}; */

    return (
        <>
            <NavPro />
            <main className='profile'>
                <h2 className='profileTitle'>Profile Page</h2>
                    <div className='profile__container'>
                        <h3>UserName: {profile.username}</h3>
                        <h3>UserName: mprodhan</h3>
                        <h3>email: {profile.email}</h3>
                        <h3>email: mustafizur.prodhan2@gmail.com</h3>
                    </div>
            </main>
        </>
    );
});

export default Profile;