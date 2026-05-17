'use client';

import { useState, useCallback, useRef } from 'react';

export function useVoiceCall() {
  const [isCalling, setIsCalling] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const startCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      setIsCalling(true);
      
      // Initialize PeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      
      pcRef.current = pc;
      
      // Signalling logic would go here via Supabase/Socket.io
      console.log('Call started, local stream captured.');
    } catch (err) {
      console.error('Failed to start call:', err);
    }
  }, []);

  const endCall = useCallback(() => {
    localStream?.getTracks().forEach(track => track.stop());
    pcRef.current?.close();
    setLocalStream(null);
    setIsCalling(false);
    console.log('Call ended.');
  }, [localStream]);

  return { isCalling, startCall, endCall, localStream };
}
