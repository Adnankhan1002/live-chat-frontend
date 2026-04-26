import React from "react";

function MessageOthers(props){
    const messageObj = props.props || props;
    const timeLabel = new Date(messageObj.createdAt || Date.now()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase().replace(' ', '');
    const senderName = messageObj.sender?.name || 'User';
    const initials = senderName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
      
    return(
        <div className="flex items-end gap-3 mb-2 w-full px-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[13px] font-bold shadow-sm shrink-0 mb-1">
                {initials}
            </div>
            <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-2 mb-1 ml-1">
                    <span className="text-[14px] font-bold text-slate-800">{senderName}</span>
                    <span className="text-[12px] text-slate-400 font-medium">{timeLabel}</span>
                </div>
                <div className="max-w-[85%] bg-white border border-slate-200 text-slate-700 rounded-[20px] rounded-tl-[4px] px-4 py-2.5 text-[15px] shadow-sm leading-relaxed whitespace-pre-wrap break-words">
                    {messageObj.message || messageObj.text || messageObj.content}
                </div>
            </div>
        </div>
    );
}

export default MessageOthers;