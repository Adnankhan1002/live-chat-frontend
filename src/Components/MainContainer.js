import React, { createContext, useState, useEffect } from 'react'
import './myStyle.css'
import Sidebar from './sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AnimatePresence, motion } from "framer-motion";
import { SOCKET_URL } from '../config/api';

export const myContext = createContext();

// Create a single global socket instance outside the component
const socket = io(SOCKET_URL, { autoConnect: false });

function MainContainer() {
  const [refresh, setRefresh] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Connect socket and perform setup
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.data && userData.data.id) {
      if (socket.connected) {
        socket.emit("setup", userData.data.id);
      } else {
        socket.on("connect", () => {
          socket.emit("setup", userData.data.id);
        });
        socket.connect();
      }
    }

    const handleGlobalMessage = (msg) => {
      // Don't ring or toast if we are actively looking at the sender's chat!
      const currentChatId = window.location.pathname.split("/app/chat/")[1]?.split("&")[0];
      const incomingChatId = msg?.chat?._id || msg?.chat;
      
      if (currentChatId === incomingChatId) return;

      const senderName = msg?.sender?.name || "Someone";
      
      // Attempt to play a quiet, classic message alert "pop" sound using simple web audio api so no asset files are needed
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      } catch(e) {}

      // Show Visual Toast popup
      setToastMsg({ title: `New message from ${senderName}`, message: msg.message });
      
      // Auto-hide popup after 4 seconds
      setTimeout(() => setToastMsg(null), 4000);
    };

    socket.on("recv-message", handleGlobalMessage);

    return () => {
      socket.off("recv-message", handleGlobalMessage);
      socket.disconnect();
    };
  }, []);

  // Automatically show the sidebar on mobile if we are exactly at /app or /app/
  const showSidebarOnMobile = ['/app', '/app/'].includes(location.pathname);

  return (
    <div className='MainContainer app-shell flex w-screen h-screen overflow-hidden bg-[#f8fafc]'>
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-6 right-6 z-[9999] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 min-w-[280px] max-w-[360px] flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setToastMsg(null)}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className="font-bold text-[15px] text-slate-800 tracking-tight leading-tight mb-0.5">{toastMsg.title}</span>
               <span className="text-[13px] text-slate-500 truncate w-full">{toastMsg.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <myContext.Provider value={{ refresh, setRefresh, socket }}>
        
        {/* SIDEBAR: 
            - On desktop (md:), always visible (md:flex), fixed width 280px.
            - On mobile, only visible if showSidebarOnMobile is true, takes full width. 
        */}
        <div className={`${showSidebarOnMobile ? 'flex w-full' : 'hidden'} md:flex md:w-[280px] shrink-0 h-full border-r border-slate-200 bg-white z-10`}>
          <Sidebar className="w-full" />
        </div>

        {/* OUTLET / MAIN CONTENT:
            - On desktop (md:), always visible (md:flex), takes remaining width.
            - On mobile, only visible if showSidebarOnMobile is FALSE. 
        */}
        <div className={`flex-1 ${!showSidebarOnMobile ? 'flex flex-col w-full' : 'hidden'} md:flex md:flex-col h-full relative relative z-0`}>
          
          {/* Mobile Back Header (Appears only on mobile when looking at a component) */}
          {!showSidebarOnMobile && (
             <div className="md:hidden h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-50">
                <button 
                  onClick={() => navigate('/app')} 
                  className="flex items-center gap-1.5 text-slate-600 font-semibold hover:text-indigo-600 transition-colors"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                   </svg>
                   Menu
                </button>
                <div className="text-sm font-black text-slate-800 tracking-tight">Chattr</div>
             </div>
          )}

          {/* Children Routes Render Here */}
          <div className="flex-1 overflow-hidden relative">
             <Outlet/>
          </div>
        </div>
       
      </myContext.Provider>
    </div>
  ); 
}

export default MainContainer;



