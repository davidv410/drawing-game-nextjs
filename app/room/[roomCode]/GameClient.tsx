"use client"

import { useEffect } from "react"
import { io } from "socket.io-client"

export default function GameClient({ roomId }: {roomId: string}) {
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: { roomId: roomId }
    })

    socket.on("connect", () => {
      console.log("connected! socket id:", socket.id)
    })

    socket.on("round_started", (data) => {
      console.log("round started:", data)
    })

    return () => {
      socket.disconnect()
    }
  }, [roomId])

  return (<></>)
}