import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

const VideoCall = ({ socket, roomId, isAudioOnly, incomingOffer, callerName, onClose }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(isAudioOnly);
  const [callStatus, setCallStatus] = useState(incomingOffer ? "Connecting..." : "Calling...");

  useEffect(() => {
    // Only configure peer connection if socket is verified alive
    if (!socket) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnectionRef.current = pc;

    const iceCandidateQueue = [];

    const initCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: !isAudioOnly,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { candidate: event.candidate, roomId });
          }
        };

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setCallStatus("Connected");
          }
        };

        if (incomingOffer) {
          // Receiver logic
          setCallStatus("Answering...");
          await pc.setRemoteDescription(incomingOffer);
          
          while (iceCandidateQueue.length > 0) {
            await pc.addIceCandidate(iceCandidateQueue.shift());
          }

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { answer, roomId });
        } else {
          // Caller logic
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { offer, roomId, isAudioOnly, callerName });
        }

      } catch (err) {
        console.error("Error accessing media devices", err);
        setCallStatus("Failed to access camera/mic");
      }
    };

    socket.on("answer", async (remoteAnswer) => {
      try {
        await pc.setRemoteDescription(remoteAnswer);
        while (iceCandidateQueue.length > 0) {
           await pc.addIceCandidate(iceCandidateQueue.shift());
        }
      } catch(err) {
        console.error("Failed handling remote answer", err);
      }
    });

    socket.on("call-rejected", () => {
      setCallStatus("Call Rejected");
      setTimeout(onClose, 2000);
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(candidate);
        } else {
          iceCandidateQueue.push(candidate);
        }
      } catch (err) {
        console.error("ICE error:", err);
      }
    });

    initCall();

    return () => {
      // Clean up event listeners
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-rejected");
      
      // Clean up local media tracks
      if (localVideoRef.current && localVideoRef.current.srcObject) {
         localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      
      // Clean up peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [socket, roomId, isAudioOnly]);

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (!isAudioOnly && localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 text-white text-xl font-bold bg-slate-800/80 px-6 py-2 rounded-full backdrop-blur z-10 shadow-lg">
        {callStatus}
      </div>
      
      <div className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
        {!isVideoOff && callStatus !== "Connected" && (
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}
        <video 
           ref={remoteVideoRef} 
           autoPlay 
           playsInline 
           className="w-full h-full object-cover"
           style={{ display: isAudioOnly ? 'none' : 'block' }}
        />
        {isAudioOnly && (
            <div className="w-40 h-40 bg-indigo-500 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-xl">
               Audio
            </div>
        )}
        <div className={`absolute bottom-4 right-4 w-48 aspect-video bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl ${isAudioOnly ? 'hidden' : 'block'}`}>
           <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform scale-x-[-1]"
           />
        </div>
      </div>

      <div className="mt-8 flex gap-6 bg-slate-800/80 backdrop-blur px-8 py-4 rounded-full border border-slate-700 shadow-xl">
         <IconButton onClick={toggleMute} sx={{ color: isMuted ? '#ef4444' : 'white', bgcolor: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: isMuted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)' } }}>
            {isMuted ? <MicOffIcon /> : <MicIcon />}
         </IconButton>
         
         {!isAudioOnly && (
            <IconButton onClick={toggleVideo} sx={{ color: isVideoOff ? '#ef4444' : 'white', bgcolor: isVideoOff ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: isVideoOff ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)' } }}>
               {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
            </IconButton>
         )}

         <IconButton onClick={onClose} sx={{ color: 'white', bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}>
            <CallEndIcon />
         </IconButton>
      </div>
    </div>
  );
};

export default VideoCall;