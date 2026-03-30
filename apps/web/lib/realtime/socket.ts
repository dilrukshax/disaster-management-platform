"use client";

import { io, Socket } from "socket.io-client";
import { fetchPublicConfig } from "../config/public";

let socketPromise: Promise<Socket> | null = null;

export async function getRealtimeSocket(): Promise<Socket> {
  if (socketPromise) {
    return socketPromise;
  }

  socketPromise = (async () => {
    const config = await fetchPublicConfig();
    const socket = io(config.notificationWsUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true
    });

    return socket;
  })();

  return socketPromise;
}

export async function subscribeUserChannel(userId: string): Promise<Socket> {
  const socket = await getRealtimeSocket();
  socket.emit("subscribe:user", userId);
  return socket;
}

export async function subscribeMissionChannel(requestId: string): Promise<Socket> {
  const socket = await getRealtimeSocket();
  socket.emit("subscribe:mission", requestId);
  return socket;
}

export async function disconnectRealtimeSocket(): Promise<void> {
  if (!socketPromise) {
    return;
  }

  const socket = await socketPromise;
  socket.disconnect();
  socketPromise = null;
}
