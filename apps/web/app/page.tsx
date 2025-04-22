"use client"
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  return (
    <div>
      <h1>Join Room</h1>
      <input onChange={(e) => {
        setRoomId(e.target.value);
      }} type="text" value={roomId} placeholder="Enter room Id"/>

      <button onClick={() => {
        router.push(`/room/${roomId}`);
      }}>Join Room</button>
    </div>
  );
}
