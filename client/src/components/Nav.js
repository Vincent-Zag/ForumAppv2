import React from "react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/profile");
        navigate("/profile");
    };

    const loggedInUserId = localStorage.getItem("userId");

    const handleProfile = (e) => {
        e.preventDefault();
        if (loggedInUserId) {
        navigate(`/profile/${loggedInUserId}`);
        }
    };

   

    const signOut = () => {
		localStorage.removeItem("_id");
		navigate("/");
	};

    return (
        <nav className='navbar'>
<<<<<<< HEAD
            <div className="'navbarRight">
                <h2 onClick={handleSubmit}>User Profile</h2>
=======
            <div className="'navbarLeft">
                <h2 onClick={handleSubmit}>User Profile</h2>
            </div>
            <div className='navbarRight'>
                <button onClick={signOut}>Sign out</button>
            </div>
        </nav>
    );
};

export default Nav;