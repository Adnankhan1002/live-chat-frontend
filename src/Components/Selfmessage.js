import React from "react";

function MessageSelf(props){
    const messageObj = props.props || props;
    const timeLabel = new Date(messageObj.createdAt || Date.now()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase().replace(' ', '');
   
    return(
        <div className="flex flex-col items-end mb-2 w-full pr-4" >
            <div className="text-[12px] text-slate-400 font-medium mb-1 mr-1">{timeLabel}</div>
            <div className="max-w-[70%] bg-[#6c6de8] text-white rounded-[20px] rounded-tr-[4px] px-4 py-2.5 text-[15px] shadow-sm leading-relaxed whitespace-pre-wrap break-words">
                {messageObj.message || messageObj.text || messageObj.content}
            </div>
        </div>
    )
}
export default MessageSelf; 