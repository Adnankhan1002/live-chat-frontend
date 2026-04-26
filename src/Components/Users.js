import React, { useContext, useEffect, useState } from "react";
import "./myStyle.css";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Users() {
   
  const { refresh, setRefresh } = useContext(myContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  


  
  
 

  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token} `,
      },
    };
    axios.get("http://localhost:5050/user/fetchUsers", config).then((data) => {
      console.log("UData refreshed in Users panel ");
      setUsers(data.data);
    });
  }, [refresh, userData.data.token]);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.24 }}
        className="flex-1 h-full bg-slate-50 flex flex-col"
      >
        <div className='px-4 pt-4 md:px-8 md:pt-8 shrink-0'>
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-slate-900 mb-1'>Contacts</h1>
              <p className='text-[13px] md:text-[15px] text-slate-500'>Manage and connect with your contacts</p>
            </div>
            <button className='w-full md:w-auto h-[42px] md:h-11 px-5 rounded-xl bg-indigo-500 text-white font-semibold text-sm flex justify-center items-center gap-2 hover:bg-indigo-600 transition-colors shadow-sm shadow-indigo-500/20 whitespace-nowrap shrink-0'>
              <PersonAddIcon fontSize='small' />
              Add Contact
            </button>
          </div>

          <div className='relative mb-4 md:mb-6'>
            <SearchIcon className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search contacts by name or role...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full h-12 md:h-14 bg-white border border-slate-200 rounded-xl md:rounded-2xl pl-11 pr-4 text-[14px] md:text-[15px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow'
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 md:px-8 md:pb-8 custom-scrollbar">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            <AnimatePresence>
            {filteredUsers.map((user, index) => {
              const avatarColors = [
                'bg-blue-500', 'bg-emerald-500', 'bg-fuchsia-500', 
                'bg-orange-500', 'bg-cyan-500', 'bg-violet-500'
              ];
              const colorClass = avatarColors[index % avatarColors.length];
              const initials = user.name?.slice(0, 2)?.toUpperCase() || 'US';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  viewport={{ once: true, margin: "0px 0px -20px 0px" }}
                  transition={{ 
                    duration: 0.4, 
                    delay: (index % 12) * 0.05, 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 24 
                  }}
                  className='bg-white border border-slate-200 rounded-[20px] md:rounded-[24px] p-4 md:p-5 flex flex-col hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300'
                  key={user._id || index}
                >
                  <div className='flex items-start justify-between mb-3 md:mb-4'>
                    <div className='relative'>
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white text-[17px] md:text-xl font-bold shadow-sm ${colorClass}`}>
                        {initials}
                      </div>
                      <div className='absolute -bottom-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-emerald-500 border-2 border-white rounded-full'></div>
                    </div>
                    <IconButton size="small" className="text-slate-400 hover:text-slate-600 -mr-2 -mt-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </IconButton>
                  </div>

                  <div className='mb-3 md:mb-4'>
                    <h3 className='text-[16px] md:text-[17px] font-bold text-slate-800 truncate'>{user.name}</h3>
                    <p className='text-[12px] md:text-[13px] text-slate-500 mt-0.5'>Software Engineer</p>
                  </div>

                  <div className='space-y-1.5 md:space-y-2 mb-4 md:mb-6'>
                    <div className='flex items-center gap-2.5 text-slate-500'>
                      <MailOutlineIcon className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                      <span className='text-[12px] md:text-[13px] truncate'>{user.email || 'user@company.com'}</span>
                    </div>
                    <div className='flex items-center gap-2.5 text-slate-500'>
                      <PhoneOutlinedIcon className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                      <span className='text-[12px] md:text-[13px]'>+1 (555) 000-0000</span>
                    </div>
                  </div>

                  <div className='mt-auto pt-2 flex items-center gap-2'>
                    <button 
                      onClick={async () => {
                        const config = { headers: { Authorization: `Bearer ${userData.data.token}` } };
                        try {
                          const { data } = await axios.post("http://localhost:5050/chat/access", { userId: user._id }, config);
                          dispatch(refreshSidebarFun());
                          setRefresh(!refresh);
                          navigate(`/app/chat/${data._id}&${user.name}`);
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                      className='flex-1 h-9 md:h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-[10px] md:rounded-xl text-[13px] md:text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/20'
                    >
                      Message
                    </button>
                    <button className='w-9 h-9 md:w-11 md:h-11 rounded-[10px] md:rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-50 hover:border-amber-200 transition-colors'>
                      <svg className="w-[18px] h-[18px] md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.898 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Users;
