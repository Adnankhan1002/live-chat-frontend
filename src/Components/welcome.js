import React from "react";
import logo from "../Images/live-chat-logo.png";
import bggg from "../Images/bggg.jpg";

function Welcome() {
  const userData = JSON.parse(localStorage.getItem('userData'))
  console.log(userData)
  return (
    
   
    <div className="screen-shell flex flex-col items-center h-full w-3/4 justify-center p-5">
    <div
    className="welcome-card h-full my-5 w-full"
    style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92)), url(${bggg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
  >
      <img src={logo} alt="logo" className="h-40 w-40 rounded-3xl shadow-lg bg-white p-4" />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">Welcome back</p>
        <h1 className="text-4xl font-black text-slate-900">Hi, {userData.data.name}</h1>
      </div>
      <p className="text-center text-slate-600 max-w-xl">
        Explore users, create groups, and keep conversations flowing in a cleaner, faster workspace.
      </p>
      </div>
  </div>
 


    
  );
}

export default Welcome;
