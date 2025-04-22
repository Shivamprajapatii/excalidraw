import axios from "axios";
import { BACKEND_URL } from "../config";
import {ChatRoomClient} from "./ChatRoomClient";

async function getChat(roomId : string) {
    const responce = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return  responce.data.messages
}

export async function ChatRoom({id} : {
    id : string
}){
    const messages = await getChat(id);
    return <ChatRoomClient id={id} messages={messages} />
}
