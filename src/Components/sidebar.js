import React, { useEffect, useState ,useContext} from 'react'
import './myStyle.css'
import { IconButton } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from 'react-router-dom';
import { changeTheme } from '../Features/themeSlice';
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios';
import { myContext } from './MainContainer';
import { AnimatePresence, motion } from 'framer-motion';


function Sidebar() {
 
  const dispatch = useDispatch();
  const lightTheme=(useSelector((state)=>state.themeKey));
  const [conversations ,setConversations] = useState([]);
  const Navigate= useNavigate();
  const location = useLocation();
  const { refresh, setRefresh, socket } = useContext(myContext);

useEffect(() => {
  if (!socket) return;
  const handleIncomingSidebar = (msg) => {
    // Only refresh the sidebar to show the new message and active unread badge
    setRefresh(prev => !prev);
  };

  socket.on("recv-message", handleIncomingSidebar);
  return () => {
    socket.off("recv-message", handleIncomingSidebar);
  };
}, [socket, setRefresh]);

const userData = JSON.parse(localStorage.getItem('userData'));

const navItems = [
  { label: 'Dashboard', path: '/app/welcome', icon: <DashboardOutlinedIcon className='icon' /> },
  { label: 'Contacts', path: '/app/user', icon: <PersonAddIcon className='icon' /> },
  { label: 'Groups', path: '/app/Available', icon: <GroupAddIcon className='icon' /> },
];

const getInitials = (name) => {
  if (!name) {
    return 'U';
  }
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
};

useEffect(()=>{
  const config = {
    headers : {
      Authorization : `Bearer ${userData.data.token}`
    }
  }
  
  axios.get('http://localhost:5050/chat/fetch',config).then((response)=>{
    console.log( "test res",response)
    
    setConversations(response.data)
  })
  console.log(refresh)
  

},[refresh, userData.data.token])
  

  return (
    <aside className='w-[280px] min-w-[280px] h-full bg-white border-r border-slate-200 flex flex-col'>
      {/* Brand */}
      <div className='flex items-center gap-3 p-6 pb-4'>
        <div className='w-10 h-10 rounded-xl bg-indigo-500 shadow-md shadow-indigo-500/30 flex items-center justify-center text-white'>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
        <h1 className='text-[22px] font-bold text-slate-800 tracking-tight'>Chattr</h1>
      </div>

      {/* Search */}
      <div className='px-5 mb-6'>
        <div className='relative flex items-center'>
          <SearchIcon className='absolute left-3 text-slate-400' fontSize='small' />
          <input
            type='text'
            placeholder='Search...'
            className='w-full h-10 bg-slate-50 border border-slate-100 rounded-full pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all'
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className='px-4 mb-6 flex items-center gap-3'>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/app/welcome');
          return (
            <button
              key={item.path}
              title={item.label}
              onClick={() => Navigate(item.path)}
              className={`flex-1 h-[50px] rounded-[18px] flex items-center justify-center transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>

      {/* Recent Chats Header */}
      <div className='flex items-center justify-between px-6 mb-3'>
        <h3 className='text-sm font-bold text-slate-800'>Recent</h3>
        <button className='text-slate-400 hover:text-indigo-500 transition-colors'>
          <AddIcon fontSize='small' />
        </button>
      </div>

      {/* Recent Chats List */}
      <div className='flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar'>
        <AnimatePresence>
          {conversations.map((conversation, index) => {
            if (!conversation?.users || conversation.users.length === 1) {
              return null;
            }

            let name = '';
            if (conversation.isGroupChat) {
              name = conversation.chatName;
            } else {
              const other = conversation.users?.find((u) => u._id !== userData?.data?.id) || {};
              name = other?.name || 'Unknown User';
            }

            const latestText = conversation?.latestMessage?.message || 'Started a conversation';
            const hasUnread = Boolean(conversation?.latestMessage && conversation?.latestMessage?.sender?._id !== userData?.data?.id);
            const timeLabel = conversation?.updatedAt
              ? new Date(conversation.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase().replace(' ', '')
              : 'now';

            const initials = getInitials(name);
            // Cycle through some nice colors for avatars based on index
            const avatarColors = [
              'bg-blue-100 text-blue-600',
              'bg-purple-100 text-purple-600',
              'bg-pink-100 text-pink-600',
              'bg-indigo-100 text-indigo-600',
              'bg-emerald-100 text-emerald-600'
            ];
            const colorClass = avatarColors[index % avatarColors.length];

            return (
              <motion.button
                key={conversation._id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => Navigate(`/app/chat/${conversation._id}&${name}`)}
                className='w-full text-left rounded-2xl p-3 flex items-start gap-3 hover:bg-slate-50 transition-colors group relative'
              >
                <div className='relative'>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${colorClass}`}>
                    {initials}
                  </div>
                  <div className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full'></div>
                </div>
                <div className='flex-1 min-w-0 pt-0.5'>
                  <div className='flex items-center justify-between mb-0.5'>
                    <p className='text-[15px] font-bold text-slate-800 truncate pr-2'>{name}</p>
                    <span className={`text-[12px] whitespace-nowrap ${hasUnread ? 'text-indigo-600 font-semibold' : 'text-slate-400 font-medium'}`}>
                      {timeLabel}
                    </span>
                  </div>
                  <p className={`text-[13px] truncate ${hasUnread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                    {latestText}
                  </p>
                </div>
                {hasUnread && (
                  <div className='absolute top-1/2 -translate-y-1/2 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-sm shadow-indigo-500/40'>
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* User Profile Footer */}
      <div className='p-4 border-t border-slate-100 mt-auto'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <div className='w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm'>
                {getInitials(userData?.data?.name)}
              </div>
              <div className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full'></div>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-bold text-slate-800'>{userData?.data?.name || 'User'}</span>
              <span className='text-xs text-slate-500'>Online</span>
            </div>
          </div>
          <IconButton size="small" className="text-slate-400 group-hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinelinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinelinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </IconButton>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar


