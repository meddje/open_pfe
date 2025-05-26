import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Platform, AppState } from 'react-native';
import { DetectedObject } from '@/types/ObjectDetection';

interface ConnectionContextType {
  isConnected: boolean;
  isConnecting: boolean;
  serverUrl: string;
  setServerUrl: (url: string) => void;
  connect: () => void;
  disconnect: () => void;
  lastFrame: string | null;
  error: string | null;
}

// Use wss:// by default for production, ws:// for local development
const defaultServerUrl = __DEV__ 
  ? 'ws://192.168.1.100:8765'
  : 'wss://192.168.1.100:8765';

const ConnectionContext = createContext<ConnectionContextType>({
  isConnected: false,
  isConnecting: false,
  serverUrl: defaultServerUrl,
  setServerUrl: () => {},
  connect: () => {},
  disconnect: () => {},
  lastFrame: null,
  error: null,
});

export const useConnection = () => useContext(ConnectionContext);

interface ConnectionProviderProps {
  children: React.ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [serverUrl, setServerUrl] = useState(defaultServerUrl);
  const [lastFrame, setLastFrame] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const appState = useRef(AppState.currentState);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground, try to reconnect if needed
        if (!isConnected && !isConnecting) {
          connect();
        }
      } else if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // App is going to the background, disconnect to save resources
        disconnect();
      }
      
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isConnected, isConnecting]);

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  const connect = useCallback(() => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Close existing socket if it exists
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      // Create new WebSocket connection
      socketRef.current = new WebSocket(serverUrl);
      
      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
      };
      
      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'frame') {
            // Handle video frame
            setLastFrame(data.frame);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
      
      socketRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
        setIsConnecting(false);
        setIsConnected(false);
      };
      
      socketRef.current.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setIsConnecting(false);
      };
      
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to create connection');
      setIsConnecting(false);
    }
  }, [serverUrl, isConnected, isConnecting]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Function to send data to the server
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, [isConnected]);

  const value = {
    isConnected,
    isConnecting,
    serverUrl,
    setServerUrl,
    connect,
    disconnect,
    lastFrame,
    error,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};