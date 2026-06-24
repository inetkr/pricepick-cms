// 'use client';

// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { Socket } from 'socket.io-client';
// import { useAuthContext } from 'src/auth/hooks';
// import { DialogMessageIcon, useDialogMessage } from './dialog-message-context';
// import { getSocketClient } from 'src/lib/socket-client';
// import { STORAGE_KEY } from 'src/auth/context/authContext';

// const SocketContext = createContext<Socket | null>(null);
// export const useSocket = () => useContext(SocketContext);

// type SocketProviderProps = { children: ReactNode };

// const SOCKET_EVENTS = [
//   'socket_create_post_from_nickname_in_admin',
//   'socket_create_post_from_file_in_admin',
//   'socket_create_post_from_url_in_admin',
// ];

// export const SocketProvider = ({ children }: SocketProviderProps) => {
//   const { user } = useAuthContext();
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const { showMessageIcon } = useDialogMessage();

//   useEffect(() => {
//     const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) || '' : '';
//     if (!user || !token) return;

//     const socketInstance = getSocketClient(user.id, token);
//     setSocket(socketInstance);

//     socketInstance.on('connect', () => {
//       console.log('Socket connected:', socketInstance.id);
//     });

//     socketInstance.on('message', (message) => {
//       console.log('New message:', message);
//     });

//     const handleSocketEvent = (data: any) => {
//       console.log('Socket event received:', data);
//       try {
//         showMessageIcon(
//           data.message,
//           data.is_success ? DialogMessageIcon.success : DialogMessageIcon.alert
//         );
//       } catch (e) {
//         console.error('Failed to parse socket event data:', e);
//       }
//     };

//     SOCKET_EVENTS.forEach((event) => socketInstance.on(event, handleSocketEvent));

//     socketInstance.on('disconnect', (reason) => {
//       console.log('Socket disconnected:', reason);
//       // Attempt to reconnect if not already reconnecting
//       if (socketInstance.disconnected && !socketInstance.active) {
//         socketInstance.connect();
//       }
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, [user?.id, showMessageIcon]);

//   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// };
