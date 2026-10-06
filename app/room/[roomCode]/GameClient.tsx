"use client"

import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

export default function GameClient({ roomId, playerId }: {roomId: string, playerId: string}) {

  const socketRef = useRef<Socket | null>(null)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: { roomId: roomId, playerId: playerId }
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("connected! socket id:", socket.id)
    })

    socket.on("drawer_broadcast", (data) => {
      console.log("round started:", data)
    })

    socket.on("round_started", (data) => {
      console.log("round started:", data)
    })

    socket.on("stroke", (data: { x: number; y: number; drawing: boolean }) => {
        const context = contextRef.current
        if (!context) return

        if (data.drawing) {
          context.lineTo(data.x, data.y)
          context.stroke()
        } else {
          context.beginPath()
          context.moveTo(data.x, data.y)
        }
    })

    return () => {
      socket.disconnect()
    }
  }, [roomId, playerId])

    const canvas_width = 700
    const canvas_height = 700

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = canvas_width * 2
      canvas.height = canvas_height * 2
      canvas.style.width = `${canvas_width}px`
      canvas.style.height = `${canvas_height}px`

      const context = canvas.getContext("2d")
      if (!context) return

      context.scale(2, 2)
      context.lineCap = "round"
      context.strokeStyle = "black"
      context.lineWidth = 5
      contextRef.current = context
    }, [])

    const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const { offsetX, offsetY } = e.nativeEvent
      contextRef.current?.beginPath()
      contextRef.current!.moveTo(offsetX, offsetY)
      setIsDrawing(true)

      socketRef.current?.emit("stroke", { x: offsetX, y: offsetY, drawing: false })
    }

    const endDrawing = () => {
      contextRef.current!.closePath()
      setIsDrawing(false)
    }

    const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if(!isDrawing) return
      const { offsetX, offsetY } = e.nativeEvent
      contextRef.current!.lineTo(offsetX, offsetY)
      contextRef.current!.stroke()

      socketRef.current?.emit("stroke", { x: offsetX, y: offsetY, drawing: true })
    }

  return (
    <>
      <canvas
        className="bg-white"
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </>
  );
}