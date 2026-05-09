import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { PhoneOff, Mic, MicOff, Video, VideoOff, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { t } = useTranslation();
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const initCall = async () => {
      // 1. Get Camera/Mic Access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 2. Setup RTCPeerConnection
        // In a real app you'd use a STUN/TURN server like Twilio or Google's public stun
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;

        // Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        // 3. Handle incoming remote stream
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // 4. Handle ICE candidates (send to remote peer via socket)
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('webrtc_signal', {
              roomId,
              signalData: { type: 'candidate', candidate: event.candidate }
            });
          }
        };

        // Join room and notify others
        socket.emit('join_video_room', roomId);

        // Define socket listeners for WebRTC signals
        socket.on('user_joined', async (userId) => {
          // User joined, create an offer
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socket.emit('webrtc_signal', {
            roomId: roomId,
            signalData: { type: 'offer', offer: offer }
          });
        });

        socket.on('webrtc_signal', async (data) => {
          if (data.type === 'offer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit('webrtc_signal', {
              roomId: roomId,
              signalData: { type: 'answer', answer: answer }
            });
          } else if (data.type === 'answer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          } else if (data.type === 'candidate') {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        });

      } catch (err) {
        console.error("Failed to start video stream", err);
      }
    };

    initCall();

    return () => {
      socket.off('user_joined');
      socket.off('webrtc_signal');
      socket.emit('leave_video_room', roomId);
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [socket, roomId]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    // Explicitly shut down all media tracks immediately when ending the call
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
    }
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => {
        track.stop();
      });
      localVideoRef.current.srcObject = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    navigate(-1); // Go back
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top Header with Close Option */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/80 font-medium text-sm tracking-wide uppercase">
            {t('Live Video Call')}
          </span>
        </div>
        <button 
          onClick={endCall}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title={t('Close')}
        >
          <X size={20} />
        </button>
      </div>

      {/* Remote Video (Main) */}
      <div className="flex-1 relative bg-neutral-900">
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        
        {/* Placeholder if remote isn't ready */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
            <Video size={40} className="text-white/20" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-medium">{t('Connecting...')}</p>
            <p className="text-white/40 text-sm">{t('Waiting for the other person to join')}</p>
          </div>
        </div>
        
        {/* Local Video (PiP) */}
        <div className="absolute bottom-28 right-4 w-32 h-48 md:w-48 md:h-64 bg-zinc-800 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
          <video 
            ref={localVideoRef} 
            muted 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover mirror"
            style={{ transform: 'scaleX(-1)' }}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </div>
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center space-x-12 pb-10">
        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={toggleMute}
            className={`group p-4 rounded-full transition-all duration-300 ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            {isMuted ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="group-hover:scale-110 transition-transform" />}
          </button>
          <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{isMuted ? t('Unmute') : t('Mute')}</span>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={endCall}
            className="group p-6 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-300 shadow-2xl shadow-red-600/40 text-white hover:scale-110 active:scale-90"
            title={t('End Call')}
          >
            <PhoneOff size={32} />
          </button>
          <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{t('End Call')}</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={toggleVideo}
            className={`group p-4 rounded-full transition-all duration-300 ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} className="group-hover:scale-110 transition-transform" />}
          </button>
          <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{isVideoOff ? t('Start Cam') : t('Stop Cam')}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
