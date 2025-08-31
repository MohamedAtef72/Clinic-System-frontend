// src/pages/Home.js
import React from "react";
import Navbar from "../components/Navbar";
import Content from "../components/Content";


const Home = () => {
  return (
    <div>
      {/* Navbar*/}
      <Navbar />
      {/* Main Content */}
      <Content />
    </div>
  );
};

export default Home;
