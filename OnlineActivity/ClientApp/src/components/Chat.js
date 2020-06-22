﻿import React, {useRef, useState, useEffect} from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import IconSend from "@skbkontur/react-icons/Send3"
import {Post} from "./Post";
import * as signalR from "@microsoft/signalr";
import {getGameId, getUserId} from './WaitingRoom';
import './Chat.css';

let maxId = 4;
const createNewPost = (nickName, comment) => {
    return {
        id: maxId++,
        author: nickName,
        comment
    };
};


export const Chat = ({nickName, chatPosts, isGameLead = false}) => {
    const [posts, updatePosts] = useState(chatPosts);
    const [canSend, updateCanSend] = useState(false);
    const [chatConnection, setChatConnection] = useState(undefined);
    const inputRef = useRef(null);
    const userId = getUserId();
    const gameId = getGameId();

    useEffect(async () => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/chat")
            .build();

        connection.on("SendChatMessage", (drawLinesDto) => {
            updatePosts(current =>current.concat(createNewPost(drawLinesDto.userName, drawLinesDto.message)));
        });
        await connection.start();
        await connection.invoke("AddToGroup", {
            userId,
            gameId
        });
        setChatConnection(connection);

        return () => {
            chatConnection.invoke("RemoveFromGroup", {
                userId,
                gameId
            }).then(_ => chatConnection.stop().then(_ => setChatConnection(undefined)))
        }
    }, []);

    useEffect( () => {
        updatePosts(chatPosts);
    }, [chatPosts]);


    const onSubmit = async () => {
        const message = inputRef.current.value;
        if (!message) {
            return;
        }

        inputRef.current.value = '';
        updateCanSend(false);

        if (chatConnection) {
            await chatConnection.invoke("SendChatMessage", {
                userId,
                gameId,
                message
            });
        }
    };

    return (
        <div className={'chat'}>
            <div className={'chat_header_nickname'}>Ваш никнейм: {nickName}</div>
            <div className={'chat_header_post-id'}>
                {posts.map(post => (<Post key={post.id} post={post} activeReactions={isGameLead}/>))}
            </div>
            {!isGameLead && (
                <div className={'chat_word-form'}>
                    <input className={'chat_word-form_input'} placeholder={'Угадайте слово'} name={'guess-word'} ref={inputRef}
                           onChange={evt => updateCanSend(!!evt.target.value)} autoComplete={'off'}/>
                    <button className={'chat_word-form_button'} type={'button'} onClick={onSubmit} disabled={!canSend}>
                        <IconSend/>
                    </button>
                </div>
            )}
        </div>
    )
};

Chat.propTypes = {
    nickName: PropTypes.string.isRequired,
    isGameLead: PropTypes.bool,
    chatPosts: PropTypes.array
};