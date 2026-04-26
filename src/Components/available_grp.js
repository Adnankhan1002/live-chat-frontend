import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./myStyle.css";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

let cachedGroups = null;
let cachedGroupsToken = "";

function AvailGroups() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const fetchTriggerCountRef = useRef(0);
  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch (error) {
      return null;
    }
  }, []);
  const authToken = userData?.data?.token;

  const normalizeId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (typeof value.$oid === "string") return value.$oid;
      if (value._id) return normalizeId(value._id);
      if (value.id) return normalizeId(value.id);
    }
    return String(value);
  };

  const currentUserId = normalizeId(
    userData?.data?.id ||
      userData?.data?._id ||
      userData?.data?.user?.id ||
      userData?.data?.user?._id
  );
  const currentUserName = (userData?.data?.name || "").trim().toLowerCase();
  const isDev = process.env.NODE_ENV !== "production";

  const logFetchTrigger = useCallback((trigger, meta = {}) => {
    if (!isDev) {
      return;
    }

    fetchTriggerCountRef.current += 1;
    console.info(
      `[AvailGroups][fetchGroup #${fetchTriggerCountRef.current}] trigger=${trigger}`,
      meta
    );
  }, [isDev]);

  // Random gradients for group banners
  const gradients = [
    "bg-gradient-to-r from-blue-500 to-indigo-600",
    "bg-gradient-to-r from-purple-500 to-pink-600",
    "bg-gradient-to-r from-emerald-400 to-teal-500",
    "bg-gradient-to-r from-orange-400 to-rose-500"
  ];

  useEffect(() => {
    if (!authToken) {
      navigate('/');
    }
  }, [authToken, navigate]);

  const fetchGroups = useCallback(async (forceRefresh = false, trigger = "unknown") => {
    if (!authToken) {
      logFetchTrigger(trigger, { skipped: "no-auth-token" });
      return;
    }

    const cacheHit = !forceRefresh && cachedGroups && cachedGroupsToken === authToken;
    logFetchTrigger(trigger, { forceRefresh, cacheHit });

    if (cacheHit) {
      setGroups(cachedGroups);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const response = await axios.get(apiUrl("/chat/fetchGroup"), config);
    cachedGroups = response.data;
    cachedGroupsToken = authToken;
    setGroups(response.data);

    logFetchTrigger(trigger, {
      network: true,
      groupsCount: Array.isArray(response.data) ? response.data.length : 0,
    });
  }, [authToken, logFetchTrigger]);

  useEffect(() => {
    fetchGroups(false, "mount").catch((error) => {
      console.error("Failed to fetch groups:", error);
    });
  }, [fetchGroups]);

  return (
    <AnimatePresence>
      <motion.div
        className="flex-1 flex flex-col bg-white h-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Section */}
        <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Explore Groups</h1>
            <p className="text-sm text-slate-500 mt-0.5">Discover and join communities</p>
          </div>

          <div className="flex flex-row items-center gap-4">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search groups..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all w-[240px] text-slate-700 placeholder:text-slate-400"
              />
            </div>
            
            <button 
              onClick={() => navigate('/app/group')}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-semibold text-sm hover:bg-indigo-100 transition-colors flex items-center gap-2"
            >
              <GroupAddIcon className="w-4 h-4" />
              Create
            </button>

            <button 
              onClick={() => {
                fetchGroups(true, "manual-refresh").catch((error) => {
                  console.error("Failed to refresh groups:", error);
                });
              }}
              className="p-2.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
            >
              <RefreshIcon />
            </button>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6 custom-scrollbar bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {groups.map((group, index) => {
              const bgGradient = gradients[index % gradients.length];
              const nameInitial = group.chatName ? group.chatName[0].toUpperCase() : "G";
              const groupAdminId = normalizeId(group?.groupAdmin);
              const groupAdminName = (group?.groupAdmin?.name || "").trim().toLowerCase();
              const isCurrentUserAdminById = Boolean(
                groupAdminId && currentUserId && groupAdminId === currentUserId
              );
              const isCurrentUserAdminByName = Boolean(
                !isCurrentUserAdminById &&
                  groupAdminName &&
                  currentUserName &&
                  groupAdminName === currentUserName
              );
              const isCurrentUserAdmin = isCurrentUserAdminById || isCurrentUserAdminByName;
              const isCurrentUserMember = Array.isArray(group?.users)
                ? group.users.some((member) => normalizeId(member) === currentUserId)
                : false;
              const shouldShowJoinButton = !isCurrentUserAdmin && !isCurrentUserMember;

              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  key={group._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all flex flex-col group relative"
                >
                  <div className={`h-16 md:h-24 ${bgGradient} relative shrink-0 p-3 md:p-4`}>
                    {/* Badge */}
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/20 backdrop-blur-md text-white text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {group.users ? group.users.length : 0} Members
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-5 flex flex-col flex-1 relative mt-[-26px] md:mt-[-32px]">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl shadow-sm border-2 border-slate-100 flex items-center justify-center text-xl md:text-3xl font-bold text-slate-700 mb-2 md:mb-3 shadow-indigo-100">
                       {nameInitial}
                    </div>

                    <h2 className="text-[15px] md:text-[17px] font-bold text-slate-800 tracking-tight leading-tight mb-1 truncate">
                      {group.chatName}
                    </h2>
                    <div className="text-[12px] md:text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-3 md:mb-4">
                      {group.groupAdmin?.name ? `Admin: ${group.groupAdmin.name}` : "A public group for members."}
                    </div>

                    {shouldShowJoinButton && (
                      <div className="mt-auto pt-3 md:pt-4 flex items-center gap-2 border-t border-slate-50">
                        <button
                          onClick={() => {
                            const config = { headers: { Authorization: `Bearer ${authToken}` } };
                            axios.put(
                              apiUrl("/chat/joinGroup"),
                              { groupId: group._id },
                              config
                            ).then(() => {
                              fetchGroups(true, "join-success").catch((error) => {
                                console.error("Failed to fetch groups after join:", error);
                              });
                            });
                          }}
                          className="flex-1 h-9 md:h-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[13px] md:text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/20"
                        >
                          Join Group
                        </button>
                      </div>
                    )}
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