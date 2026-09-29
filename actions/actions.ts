"use server"

import { prisma } from "@/lib/db"
import { generateRoomCode } from "@/utils/generateRoomCode"

export const createRoomAndHost = async (formData: FormData) => {
    const name = String(formData.get("name") ?? "").trim()

    const code = await generateRoomCode()

   const room = await prisma.room.create({
        data: {
            code
        }
   })

    await prisma.player.create({
        data: {
            name,
            roomId: room.id,
            isHost: true
        }
    })

    console.log('room & host created')
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

    await prisma.player.create({
        data: {
            name,
            roomId: room.id
        }
    })

    console.log('player created')
}