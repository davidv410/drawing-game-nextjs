import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

const Room = async ({params}: {params: Promise<{roomCode: string}>}) => {
    const cookieStore = await cookies()

    const { roomCode } = await params
    const playerCookie = cookieStore.get(`${roomCode}`)

    if (!playerCookie) return <p>User doesnt exist</p>

    const room = await prisma.room.findUnique({
    where: { code: roomCode },
    include: { players: true },
    })

    if(!room) return <p>Room doesnt exist</p>

    const player = room.players.find(p => p.id  === playerCookie.value)

    if(!player) return <p>User doesnt exist</p>

    return(
        <>
            Hello from room {roomCode}<br/>

            List of players:
            {(room?.players ?? []).map(p => (
                <div key={p.id}>
                    <p>{p.name}{p.isHost && ' -host'}{player.id === p.id && ' -you'}</p>
                </div>
            ))}
            {player.isHost && <button>START GAME</button>}
        </>
    )
}

export default Room