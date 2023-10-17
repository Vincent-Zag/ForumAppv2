import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Replies from "./components/Replies";
import Landing from "./components/Landing";
import Profile from "./components/Profile"; 
import NavComponent from "./components/NavComponent";
import "bootswatch/dist/quartz/bootstrap.min.css";
import NavComponent from "./components/NavComponent";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile/:userId" element={<Profile />} /> 
          <Route path="/profile/:userId" element={<NavComponent />} />
          <Route path="/:id/replies" element={<Replies />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
