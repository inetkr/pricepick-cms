// lib/socket.ts
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocketClient = (uid: string, token: string) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ['websocket'],
      query: {
        uid,
        token,
      },
    });
  }
  return socket;
};
