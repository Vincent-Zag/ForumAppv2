import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Replies from "./components/Replies";
<<<<<<< HEAD
import Profile from "./components/Profile";

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/dashboard' element={<Home/>} />
                    <Route path='/:id/replies' element={<Replies />} />
                    <Route path='/profile' element={<Profile />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
=======
import Landing from "./components/Landing";

const App = () => {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/landing" element={<Landing />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard" element={<Home />} />
					<Route path="/:id/replies" element={<Replies />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
>>>>>>> e7ea23c (Added landing page and route to it in App)
};

export default App;
