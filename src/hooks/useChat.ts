import {SERVER_URI} from '../constants';
import {useContext, useEffect, useRef, useState} from 'react'
import {io} from 'socket.io-client'
import {Context} from "../index";
import IMessageToSend from "../models/IMessageToSend";

export default function useChat(roomId: string | undefined) {
    const {store} = useContext(Context);
    const user = {
        userId: store.userId,
        roomId: roomId
    };
    const [messages, setMessages] = useState([]);

    const {current: socket} = useRef(
        io(// eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            SERVER_URI, {
                query: {
                    roomId: user.roomId,
                    userId: user.userId,
                    action: "message"
                }
            })
    );

    useEffect(() => {
        socket.emit('message:get')

        socket.on('message_list:update', (messages) => {
            setMessages(messages);
        })
    }, [])

    const sendMessage = async (message: IMessageToSend) => {
        if (message.pictures && message.pictures.length >= 0) {
            if (message.pictures.length === 0) {
                message.picture = message.pictures[0];
                delete message.pictures;
                socket.emit('message:add', message);
                return;
            } else {
                const pictures = message.pictures;
                const text = message.text;
                delete message.pictures;
                for (let index = 0; index < pictures.length - 1; index++) {
                    message.picture = pictures[index];
                    message.text = '';
                    socket.emit('message:add', message);
                }
                message.picture = pictures[pictures.length - 1];
                message.text = text;
                socket.emit('message:add', message);
                return;
            }
        }
        delete message.pictures;
        socket.emit('message:add', message);
    }

    const removeMessage = (message: string) => {
        socket.emit('message:remove', message)
    }

    const addToSeenBy = (messageId: string, userId: string) => {
        socket.emit('message:addToSeenBy', {_id: messageId, user: userId});
    }

    return {messages, sendMessage, removeMessage, addToSeenBy};
}