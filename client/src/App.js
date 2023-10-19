import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Replies from "./components/Replies";
import Landing from "./components/Landing";
import Profile from "./components/Profile"; 
import NavComponent from "./components/NavComponent";
import "bootswatch/dist/quartz/bootstrap.min.css";


const App = () => {
  const [ userId, setUserId ] = useState("");
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setUserId = {setUserId} userId = {userId}/>} />
          <Route path="/landing" element={<Landing setUserId = {setUserId} userId = {userId}/>} />
          <Route path="/register" element={<Register setUserId = {setUserId} userId = {userId}/>} />
          <Route path="/dashboard" element={<Home setUserId = {setUserId} userId = {userId}/>} />
          <Route path="/:userId/profile" element={<Profile userId = {userId} setUserId = {setUserId}/>} /> 
          <Route path="/:userId/profile" element={<NavComponent setUserId = {setUserId} userId = {userId}/>} />
          <Route path="/:id/replies" element={<Replies setUserId = {setUserId} userId = {userId}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
