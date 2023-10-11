import React from "react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/dashboard");
    };

    const signOut = () => {
		localStorage.removeItem("_id");
		navigate("/");
	};

    return (
        <nav className='navbar'>
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