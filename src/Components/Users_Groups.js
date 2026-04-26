import React from 'react'
import logo from '../Images/online.jpg'
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';

function Users_Groups() {
  const lightTheme = (useSelector((state)=>state.themeKey));
  return (
    <div className='flex flex-col w-3/4'>
      <div class="ug-header" className= { "w-full h-14  rounded-xl mx-1 mt-2 border-black flex justify-center " + (lightTheme ? " bg-white" : "dark ")} >
        <img src={logo} alt="Online users" className='h-7 w-7 mt-1'></img>
        <h1 className={'text-2xl font-bold p-1 text-center '+ (lightTheme? "text-black" : "text-white")} >
          Online Users
        </h1>

      </div>
      <div class="search-group" className={'h-12 w-full mt-1 mb-2 mx-1 rounded-xl flex justify-center ' + (lightTheme? "bg-white" : "dark")} >
        <div >

        <IconButton>
          <SearchIcon className={(lightTheme? "bg-white" : "dark")}/>
        </IconButton>
        </div>
     
        <input type="text" placeholder="Search" className={"search-input w-full h-10 rounded-lg pr-2 "+(lightTheme? "bg-white" : "dark")} />
       
        
      </div>
      <div className='overflow-y-auto scrollbar-hide '>
        <div className={'h-12 w-full mt-2 mx-1 rounded-lg text-center flex p-1 hover:bg-slate-100 '+(lightTheme? "bg-white" : "dark" )}>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1  hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1  hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1  hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1  hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1  hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1 hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1 hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1 hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1 hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1 hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1 hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1 hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
        <div className='h-12 w-full bg-white mt-2 mx-1 rounded-lg text-center flex p-1 hover:bg-zinc-100'>
          <p className='con-icon'>U</p>
          <h2 className='mt-2 mx-1 font-bold'>USER 1</h2>

        </div>
       
        
        
      </div>

      </div>
      )
      
}

export default Users_Groups