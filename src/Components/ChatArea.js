import React, { useState,useRef,useContext,useEffect } from 'react'
import './myStyle.css'
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send'
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import MessageSelf from './Selfmessage'
import MessageOthers from './Othermessage';
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import { useNavigate } from "react-router-dom";
import VideoCall from './VideoCall';
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { apiUrl } from '../config/api';




function Chatarea() {
  const socketRef = useRef(null);
  const activeChatRef = useRef(null);
 
  
   const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [genText, setGenText] = useState(true);
  const [genImage, setGenImage] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
   
  const userData = JSON.parse(localStorage.getItem("userData"));
  const authToken = userData?.data?.token;
  
  const [allMessages, setAllMessages] = useState([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  // console.log("Chat area id : ", chat_id._id);
  // const refresh = useSelector((state) => state.refreshKey);
  const { setRefresh, socket } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [isAudioOnlyCall, setIsAudioOnlyCall] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [incomingCallData, setIncomingCallData] = useState(null);


  useEffect(()=>{
    socketRef.current = socket;
    socketRef.current.on( "connect",()=>{
      console.log("connected",socketRef.current.id);
  
    });

    socketRef.current.on("welcome",(msg)=>{
      console.log(msg);

    });
    socketRef.current.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    socketRef.current.on("offer", (data) => {
      // Triggered when someone else initiates a call
      if (!callActive && !incomingCallData) {
        setIncomingCallData({
          offer: data.offer,
          isAudioOnly: data.isAudioOnly || false,
          callerName: data.callerName || chat_user,
        });
      }
    });

    socketRef.current.on("call-rejected", () => {
      setCallActive(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("welcome");
        socketRef.current.off("disconnect");
        socketRef.current.off("offer");
        socketRef.current.off("call-rejected");
        // socketRef.current.disconnect();  // Do NOT disconnect global socket
        socketRef.current = null;
      }
    }
  
  }, [socket, callActive, incomingCallData, chat_user])

  
  
  const SendMessage = async ()=>{
    const trimmedMessage = messageContent.trim();
    if (!trimmedMessage) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }

    try {
      const response = await axios.post(
        apiUrl('/message/'),
        {
          chatId: chat_id,
          text: trimmedMessage,
        },
        config
      );

      if (socketRef.current) {
        socketRef.current.emit('new message', response.data);
      }
      setMessageContent("");
      setAllMessages((prevMessages) => [...prevMessages, response.data]);
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }

 
    
  };
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleIncomingMessage = (msg) => {
      console.log("message received", msg);
      
      // Ensure we only add the message if it actually belongs to the current open chat to avoid leak
      const msgChatId = msg?.chat?._id || msg?.chat;
      if (msgChatId === activeChatRef.current) {
        setAllMessages((prevMessages) => [...prevMessages, msg]);
      }
    };
  
    socket.on("recv-message", handleIncomingMessage);
  
    return () => {
      socket.off("recv-message", handleIncomingMessage);
    };
  }, [socket]);
  
useEffect(() => {
  if (messagesEndRef.current) {
   messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [allMessages]);
 
  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    axios
      .get(apiUrl(`/message/${chat_id}`), config)
      .then(({ data }) => {
       
        setAllMessages(data);
        setloaded(true);
      });

      axios
        .get(apiUrl(`/chat/fetch/${chat_id}`), config)
        .then(({ data }) => {
          setIsGroupChat(data.isGroupChat);
        }).catch(err => console.log("Error fetching chat info", err));

    socketRef.current.emit("join chat", chat_id);
    activeChatRef.current = chat_id;

    return () => {
      if (socketRef.current && activeChatRef.current) {
        socketRef.current.emit("leave chat", activeChatRef.current);
      }
    };
  }, [chat_id, authToken]);

  //toggle modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    
    setAiResponse(""); // Clear AI response when opening modal
  };
  //fetch ai data
  const askAI= async() => {
   
      try {
        setLoading(true);
        const response = await axios.post(apiUrl('/api/Gemini'),{
           generateText: genText,
           generateImage: genImage,
         content : question 
        });
        setAiResponse(response.data);
        setQuestion("");
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    const handleDelete = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        };
          await axios.delete(apiUrl(`/chat/delete/${chat_id}`),config);
          setRefresh(prev => !prev);
          
          navigate('/app/welcome');
           // Refresh the chat after deletion
      } catch (error) {
          console.log("Error deleting message:", error);
      }
  };
   const handleExitGroup = async()=>{
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      await axios.get(apiUrl(`/chat/exit/${chat_id}`),config);
       setRefresh(prev => !prev);
     navigate('/app/welcome');
      
    }
    catch(err){
      console.log(err)
    }

   }
  
 
  if (!loaded) {
    return (
      <div className="flex-1 p-5 flex flex-col gap-3">
        <Skeleton variant="rectangular" sx={{ width: "100%", borderRadius: "16px" }} height={70} />
        <Skeleton variant="rectangular" sx={{ width: "100%", borderRadius: "16px", flexGrow: 1 }} />
        <Skeleton variant="rectangular" sx={{ width: "100%", borderRadius: "16px" }} height={60} />
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col bg-white h-full'>
      {/* Header */}
      <div className='h-[84px] px-8 flex items-center justify-between border-b border-slate-100 shrink-0'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className='w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold shadow-sm'>
              {chat_user[0]?.toUpperCase()}
            </div>
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full'></div>
          </div>
          <div className='flex flex-col'>
            <h2 className='text-[18px] font-bold text-slate-800 leading-tight'>{chat_user}</h2>
            <span className='text-[13px] text-slate-500 font-medium'>Active now</span>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          
          {/* Audio Call Button */}
          <IconButton onClick={() => { setIsAudioOnlyCall(true); setCallActive(true); }} className='text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors' size="small" title="Audio Call">
             <CallIcon />
          </IconButton>
          
          {/* Video Call Button */}
          <IconButton onClick={() => { setIsAudioOnlyCall(false); setCallActive(true); }} className='text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors' size="small" title="Video Call">
             <VideocamIcon />
          </IconButton>

          <div className='w-px h-6 bg-slate-200 mx-1'></div>

          <button onClick={toggleModal} className='h-10 px-4 bg-purple-50 text-indigo-600 rounded-full text-[14px] font-semibold flex items-center gap-2 hover:bg-purple-100 transition-colors'>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            AI Generate
          </button>
          <button className='h-10 px-4 bg-orange-50 text-orange-500 rounded-full text-[14px] font-semibold flex items-center gap-2 hover:bg-orange-100 transition-colors'>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Whiteboard
          </button>
          
          <div className='w-px h-6 bg-slate-200 mx-1'></div>
          
          {isGroupChat && (
            <IconButton onClick={handleExitGroup} title="Leave Group" size="small" className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </IconButton>
          )}
          <IconButton onClick={handleDelete} title="Delete Chat" size="small" className="text-slate-400 hover:text-red-500">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* AI Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-[24px] shadow-2xl w-[480px] text-center border border-slate-100">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Ask Katie Bot</h2>
            <p className="text-slate-500 mb-4">How can I help you today?</p>
            <div className="flex justify-center gap-3 mb-6">
              <button 
                onClick={() => setGenText(!genText)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors border ${genText ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
              >
                Text Generation
              </button>
              <button 
                onClick={() => setGenImage(!genImage)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors border ${genImage ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
              >
                Image Generation
              </button>
            </div>
            <input
              type="text"
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-700 transition-all mb-6"
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="flex justify-center gap-3">
              <button onClick={toggleModal} className="flex-1 h-12 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button disabled={loading} onClick={askAI} className="flex-1 h-12 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-70">
                {loading ? "Thinking..." : "Submit"}
              </button>
            </div>
            {aiResponse && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl text-left border border-slate-100 max-h-48 overflow-y-auto custom-scrollbar">
                <h3 className="font-bold text-slate-800 mb-2">AI Response:</h3>
                <p className="text-slate-600 text-[15px] whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {callActive && (
        <VideoCall 
           socket={socketRef.current} 
           roomId={chat_id} 
           isAudioOnly={isAudioOnlyCall} 
           incomingOffer={incomingOffer}
           callerName={userData.data.name}
           onClose={() => { setCallActive(false); setIncomingOffer(null); }} 
        />
      )}

      {/* Incoming Call Ringing Overlay */}
      {incomingCallData && !callActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-md z-[110]">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl w-[360px] text-center border border-slate-100 animate-bounce-slow">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full flex flex-col items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden">
               <span className="text-3xl font-bold z-10">{incomingCallData.callerName?.[0]?.toUpperCase()}</span>
               <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-30"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{incomingCallData.callerName}</h2>
            <p className="text-slate-500 mb-8 font-medium">Incoming {incomingCallData.isAudioOnly ? "Audio" : "Video"} Call...</p>
            
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => {
                  socketRef.current.emit("reject-call", { roomId: chat_id });
                  setIncomingCallData(null);
                }}
                className="w-16 h-16 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-rose-500/30"
              >
                <CallEndIcon fontSize="large" />
              </button>
              <button 
                onClick={() => {
                  setIsAudioOnlyCall(incomingCallData.isAudioOnly);
                  setIncomingOffer(incomingCallData.offer);
                  setCallActive(true);
                  setIncomingCallData(null);
                }}
                className="w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-emerald-500/30 animate-pulse"
              >
                <PhoneInTalkIcon fontSize="large" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className='flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-[#f8fafc]'>
        <div className="flex justify-center mb-8">
          <span className="bg-white border border-slate-200 text-slate-500 text-[12px] font-bold px-4 py-1.5 rounded-full shadow-sm">
            Today
          </span>
        </div>
        <div className="flex flex-col">
          {allMessages.map((message, index) => {
            const sender = message.sender;
            const self_id = userData.data.id;
            if (sender._id === self_id) {
              return <MessageSelf props={message} key={index} />;
            } else {
              return <MessageOthers props={message} key={index} />;
            }
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className='p-6 bg-white shrink-0'>
        <div className='h-14 bg-slate-50 rounded-full border border-slate-200 flex items-center px-4 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm'>
          <div className='flex items-center gap-2 text-slate-400 mr-3'>
            <button className='hover:text-slate-600 transition-colors'><svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></button>
            <button className='hover:text-slate-600 transition-colors'><svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
          </div>
          
          <input 
            type="text" 
            placeholder="Type your message..." 
            className='flex-1 bg-transparent border-none outline-none text-[15px] text-slate-700 placeholder-slate-400'
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                SendMessage();
                
              }
            }} 
          />
          
          <div className='flex items-center gap-3 ml-3'>
            <button className='text-slate-400 hover:text-slate-600 transition-colors'>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <button 
              onClick={() => {
                SendMessage();
                
              }}
              className='h-10 px-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-[14px] font-semibold flex items-center gap-2 transition-colors shadow-sm shadow-indigo-500/20'
            >
              <SendIcon fontSize="small" className="-ml-1" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatarea;




