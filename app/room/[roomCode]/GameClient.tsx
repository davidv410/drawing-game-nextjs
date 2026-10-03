"use client"

import { useEffect } from "react"
import { io } from "socket.io-client"

export default function GameClient({ roomId, playerId }: {roomId: string, playerId: string}) {
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: { roomId: roomId, playerId: playerId }
    })

    socket.on("connect", () => {
      console.log("connected! socket id:", socket.id)
    })

    socket.on("drawer_broadcast", (data) => {
      console.log("round started:", data)
    })

    socket.on("round_started", (data) => {
      console.log("round started:", data)
    })

    return () => {
      socket.disconnect()
    }
  }, [roomId, playerId])

  return (<></>)
}