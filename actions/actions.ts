"use server"

import { Player } from "@/app/generated/prisma/client"
import { prisma } from "@/lib/db"
import { generateRoomCode } from "@/utils/generateRoomCode"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const createRoomAndHost = async (formData: FormData) => {
    const name = String(formData.get("name") ?? "").trim()

    const code = await generateRoomCode()

   const room = await prisma.room.create({
        data: {
            code
        }
   })

    const host = await prisma.player.create({
        data: {
            name,
            roomId: room.id,
            isHost: true
        }
    })

    const cookie = await cookies()
    cookie.set(room.code, host.id, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 6,
    })

    console.log('room & host created')
    redirect(`/room/${room.code}`)
}

export const createPlayer = async (formData: FormData) => {
    const name = String(formData.get("name") ?? "").trim()
    const code = String(formData.get("code") ?? "").trim()

    const room = await prisma.room.findUnique({
        where: {
            code
        }
    })

    if(!room) return console.log("room not found")

    const player = await prisma.player.create({
        data: {
            name,
            roomId: room.id
        }
    })

    const cookie = await cookies()
    cookie.set(room.code, player.id, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 6,
    })

    console.log('player created')
    redirect(`/room/${room.code}`)
}

const WORDS = ["guitar", "volcano", "sandwich", "octopus", "umbrella", "car", "sunset", "dog", "ball", "running"]

const pickWord = () => {
    return WORDS[Math.floor(Math.random() * WORDS.length)]
}

const pickDrawer = (players: Player[]) => {
    return players[Math.floor(Math.random() * players.length)]
}

export const startGame = async (roomCode: string) => {
    const room = await prisma.room.findUnique({
        where: { code: roomCode },
        include: { players: true },
    })

    if(!room) return console.log("room doesnt exist") 

    const word = pickWord()
    const drawer = pickDrawer(room.players)
    
    await prisma.round.create({
        data: {
            word,
            drawerId: drawer.id,
            roomId: room.id
        }
    })
 
    await fetch(`${process.env.SOCKET_SERVER_URL}/broadcast`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "socket-secret": process.env.SOCKET_SECRET!,
        },
        body: JSON.stringify({
        roomId: roomCode,
        drawerId: drawer.id,
        word
        }),
    });
};