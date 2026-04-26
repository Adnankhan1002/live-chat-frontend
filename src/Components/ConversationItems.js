import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

function ConversationItems( {props}) {
  const lightTheme = (useSelector((state)=>state.themeKey));
  const navigate = useNavigate();
  return (
    <div className='conv'onClick={()=>{navigate('chat')}}>
       <p className='con-icon'>{props.name[0]}</p>
       <p className='con-name'>{props.name}</p>
       <p className='con-lastM'>{props.lastMessage}</p>
       <p className='con-time'>{props.timestamp}</p>
   
    </div>
    
   

   
  )
}

export default ConversationItems