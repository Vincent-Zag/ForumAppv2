import React from "react";
import { useNavigate } from "react-router-dom";

const NavPro = () => {
    const navigate = useNavigate();

    const handleHome = (e) => {
        e.preventDefault();
        navigate("/dashboard");
    };

    const signOut = () => {
		localStorage.removeItem("_id");
		navigate("/");
	};

    return (
        <nav className='navbar'>
            <div className="'navbarRight">
                <h2 onClick={handleHome}>Home</h2>
            </div>
            <div className='navbarRight'>
                <button onClick={signOut}>Sign out</button>
            </div>
        </nav>
    );
};

export default NavPro;