import { createPlayer, createRoomAndHost } from "@/actions/actions";

export default function Home() {
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <form className="border" action={createRoomAndHost}>
          <h1>CREATE ROOM</h1>
          <input name="name" type="text" placeholder="player-name"/><br/>
          <button>CREATE</button>
        </form>
        <form className="border" action={createPlayer}>
          <h1>JOIN ROOM</h1>
          <input name="name" type="text" placeholder="player-name"/><br/>
          <input name="code" type="text" placeholder="room-code"/><br/>
          <button>JOIN</button>
        </form>
    </div>
  );
}