"use client"

import { useEffect, useRef, useState } from "react"
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

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)

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