import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(){
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhOTFlZTAxYi0zYjJlLTQ3NzYtOTZkNC1hYzRjYzA5Yjg5NGEiLCJpYXQiOjE3NDUxOTY2NTN9.xFUGAnYj7ivnKW83T6giweIAlX7M3IYghGctZ8uWrFc`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }
}