import React, { useContext, useEffect, useState } from "react";
import "./myStyle.css";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { myContext } from "./MainContainer";
import { useNavigate } from "react-router-dom";

function AvailGroups() {
  const { refresh, setRefresh, socket } = useContext(myContext);
  const [groups, setGroups] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));

  const gradients = [
    "bg-gradient-to-r from-blue-500 to-indigo-600",
    "bg-gradient-to-r from-purple-500 to-pink-600",
    "bg-gradient-to-r from-emerald-400 to-teal-500",
    "bg-gradient-to-r from-orange-400 to-rose-500"
  ];

  useEffect(() => {
    if (socket) {
      const handleGroupUpdate = (data) => {
        if (data.type === "JOIN_ACCEPTED") {
          setToastMsg(`Your request to join "${data.groupName}" was accepted!`);
        } else if (data.type === "JOIN_REJECTED") {
          setToastMsg(`Your request to join "${data.groupName}" was rejected.`);
        } else if (data.type === "NEW_REQUEST") {
          setToastMsg(`New request for "${data.groupName}"!`);
        }
        
        setTimeout(() => setToastMsg(null), 4000);
        
        // Force UI re-fetch
        setRefresh(prev => !prev);
      };

      socket.on("group-updated", handleGroupUpdate);

      return () => {
        socket.off("group-updated", handleGroupUpdate);
      };
    }
  }, [socket, setRefresh]);

  useEffect(() => {
    if (!userData || !userData.data || !userData.data.token) {
        navigate('/');
        return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios.get("http://localhost:5050/chat/fetchGroup", config).then((response) => {
      setGroups(response.data);
    });
  }, [refresh, userData?.data?.token, navigate]);

  return (
    <AnimatePresence>
      <motion.div>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg shadow-indigo-500/30 font-semibold text-sm flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {toastMsg}
          </motion.div>
        )}
      </motion.div>
      <motion.div
        className="flex-1 flex flex-col bg-white h-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Explore Groups</h1>
            <p className="text-sm text-slate-500 mt-0.5">Discover and join communities</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input type="text" placeholder="Search groups..." className="pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all w-[240px] text-slate-700 placeholder:text-slate-400" />
            </div>
            <button onClick={() => navigate('/app/group')} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-semibold text-sm hover:bg-indigo-100 transition-colors flex items-center gap-2">
              <GroupAddIcon className="w-4 h-4" /> Create
            </button>
            <button onClick={() => setRefresh(!refresh)} className="p-2.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
              <RefreshIcon />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-slate-50/50">
          {(() => {
            const adminGroups = groups.filter(g => g.groupAdmin?._id === userData.data.id && g.joinRequests?.length > 0);
            if (adminGroups.length > 0) {
              return (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-slate-800 mb-4 px-2 tracking-tight">Pending Requests (Your Groups)</h2>
                  <div className="flex flex-col gap-4">
                    {adminGroups.map(group => (
                      <div key={"pending-"+group._id} className="bg-white border text-sm border-indigo-100 rounded-2xl shadow-sm p-4">
                        <h3 className="font-semibold text-indigo-900 mb-3 ml-1">Requests for &quot;{group.chatName}&quot;</h3>
                        <div className="flex flex-col gap-3">
                          {group.joinRequests.map(reqUser => (
                            <div key={reqUser._id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-800">{reqUser.name}</span>
                                <span className="text-xs text-slate-500">{reqUser.email}</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={async () => {
                                  try {
                                    const config = { headers: { Authorization: `Bearer ${userData.data.token}` } };
                                    await axios.put("http://localhost:5050/chat/acceptJoinRequest", { chatId: group._id, userId: reqUser._id }, config);
                                    setRefresh(!refresh);
                                  } catch(e) {}
                                }} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-sm transition-colors text-xs">Accept</button>
                                <button onClick={async () => {
                                  try {
                                    const config = { headers: { Authorization: `Bearer ${userData.data.token}` } };
                                    await axios.put("http://localhost:5050/chat/rejectJoinRequest", { chatId: group._id, userId: reqUser._id }, config);
                                    setRefresh(!refresh);
                                  } catch(e) {}
                                }} className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg shadow-sm transition-colors text-xs">Reject</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}
          <h2 className="text-xl font-bold text-slate-800 mb-4 px-2 tracking-tight">Public Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group, index) => {
              const bgGradient = gradients[index % gradients.length];
              const nameInitial = group.chatName ? group.chatName[0].toUpperCase() : "G";
              return (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, delay: index * 0.05 }} key={group._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all flex flex-col group relative">
                  <div className={`h-24 ${bgGradient} relative shrink-0 p-4`}>
                    <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{group.users ? group.users.length : 0} Members</div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 relative mt-[-32px]">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl font-bold text-slate-700 mb-3 shadow-indigo-100 border-2">{nameInitial}</div>
                    <h2 className="text-[17px] font-bold text-slate-800 tracking-tight leading-tight mb-1 truncate">{group.chatName}</h2>
                    <div className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-4">{group.groupAdmin?.name ? `Admin: ${group.groupAdmin.name}` : "A public group for members."}</div>
                    <div className="mt-auto pt-4 flex items-center gap-2 border-t border-slate-50">
                      {
  (() => {
    const isMember = group.users?.some(u => u._id === userData.data.id);
    const hasRequested = group.joinRequests?.some(u => u._id === userData.data.id);
    const isAdmin = group.groupAdmin?._id === userData.data.id;

    if (isAdmin) return null;

    if (isMember) {
      return (
        <button onClick={() => navigate(`/app/chat/${group._id}&${group.chatName}`)} className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">Open Chat</button>
      );
    }
    
    if (hasRequested) {
      return (
        <button disabled className="flex-1 h-10 bg-slate-300 text-slate-500 rounded-xl text-sm font-semibold cursor-not-allowed">Requested</button>
      );
    }

    return (
      <button onClick={async () => { 
        const config = { headers: { Authorization: `Bearer ${userData.data.token}` } }; 
        try { 
          await axios.put("http://localhost:5050/chat/requestJoinGroup", { chatId: group._id }, config); 
          setRefresh(!refresh); 
        } catch(e) {} 
      }} className="flex-1 h-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/20">Request to Join</button>
    );
  })()
}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AvailGroups;







