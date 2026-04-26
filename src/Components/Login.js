import { React, useState } from "react";
import logo from "../Images/live-chat-logo.png";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

function LogIn() {
  const [showLogin, setShowLogin] = useState(true);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [logInStatus, setLogInStatus] = useState("");
  const [signInStatus, setSignInStatus] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogIn = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        apiUrl("/user/login"),
        {
          name: data.name,
          password: data.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("userData", JSON.stringify(response));
      navigate("/app");
    } catch (error) {
      setLogInStatus(error?.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        apiUrl("/user/register"),
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("userData", JSON.stringify(response));
      navigate("/app");
    } catch (error) {
      setSignInStatus(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress />
      </Backdrop>

      <div className="page-shell flex items-center justify-center p-4 bg-[#f4f7ff] relative overflow-hidden min-h-screen">
        
        <style>
          {`
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-15px); }
              100% { transform: translateY(0px); }
            }
            .clay-float {
              animation: float 5s ease-in-out infinite;
            }
          `}
        </style>

        {/* Playful background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 transform translate-x-1/3 translate-y-1/3"></div>
        
        <div className="flex flex-col md:flex-row w-full max-w-5xl items-center justify-center gap-8 md:gap-20 z-10">
          
          {/* Floating Illustration */}
          <div className="md:w-1/2 flex flex-col items-end justify-center p-4 hidden md:flex">
            <img 
              src="/signup.png" 
              alt="Signup Illustration" 
              className="w-full max-w-[450px] object-contain mix-blend-multiply clay-float"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
              }}
            />
          </div>

          {/* Login/Signup Card */}
          <div className="w-full max-w-[400px] p-8 sm:p-10 flex flex-col justify-center bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src={logo} alt="Live chat logo" className="h-8 w-8 rounded-lg" />
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Live Chat</h1>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-blue-600">
                {showLogin ? "Welcome Back" : "Career Portal"}
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                {showLogin ? "Sign in to your account" : "Join us and chat with clarity"}
              </p>
            </div>

            {showLogin ? (
              <div className="flex flex-col gap-4">
                {logInStatus && (
                  <div className="rounded-lg px-3 py-2 bg-red-50 text-red-600 border border-red-100 text-xs font-medium text-center">
                    {logInStatus}
                  </div>
                )}
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">User name</label>
                  <input 
                    type="text"
                    name="name"
                    placeholder="Enter your username"
                    onChange={handleChange}
                    onKeyDown={(e) => e.code === "Enter" && handleLogIn()}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border text-black border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Password</label>
                  <input 
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    onKeyDown={(e) => e.code === "Enter" && handleLogIn()}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex justify-end">
                  <button className="text-xs text-blue-600 font-medium hover:underline transition-colors mt-1 mb-2">
                    Forgot password?
                  </button>
                </div>

                <button onClick={handleLogIn} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full py-3 text-sm rounded-lg transition-all">
                  Sign in as User
                </button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  Don't have an account? <button onClick={() => setShowLogin(false)} className="text-blue-600 font-semibold hover:underline">Sign up here</button>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {signInStatus && (
                  <div className="rounded-lg px-3 py-2 bg-red-50 text-red-600 border border-red-100 text-xs font-medium text-center">
                    {signInStatus}
                  </div>
                )}
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">User name</label>
                  <input 
                    type="text"
                    name="name"
                    placeholder="Choose a username"
                    onChange={handleChange}
                    onKeyDown={(e) => e.code === "Enter" && handleSignUp()}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Email</label>
                  <input 
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    onKeyDown={(e) => e.code === "Enter" && handleSignUp()}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Password</label>
                  <input 
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    onChange={handleChange}
                    onKeyDown={(e) => e.code === "Enter" && handleSignUp()}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <button onClick={handleSignUp} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full py-3 text-sm rounded-lg transition-all mt-2">
                  Create Account
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-3">
                  Already have an account? <button onClick={() => setShowLogin(true)} className="text-blue-600 font-semibold hover:underline">Sign in here</button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;
