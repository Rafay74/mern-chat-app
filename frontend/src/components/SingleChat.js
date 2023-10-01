import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { getSender, getSenderFull } from '../config/ChatLogic';
import { ArrowBackIcon } from '@chakra-ui/icons';
import axios from 'axios'
import ProfileModal from './miscellanous/ProfileModal'
import UpdateGroupChatModal from './miscellanous/UpdateGroupChatModal'
import '../components/style.css'
import ScrollableChat from './ScrollableChat';
import './style.css'
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:5000";   //changes to real ipl
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const toast = useToast();
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing indicator logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength)
    };


    const fetchMessages = async (e) => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            console.log(messages)


            setMessages(data);
            setLoading(false)

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })

        }


    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on('connection', () => setSocketConnected(true));
        socket.on('typing', () => setTyping(true))
        socket.on('stop typing', () => setIsTyping(false))

    }, [])


    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat
    }, [selectedChat]);


    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give notification
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain);
                }

            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop Typing ', selectedChat)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit('newMessage', data)
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };





    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSenderFull(user, selectedChat.users)}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />


                            </>
                        )}
                    </Text>

                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" /> :
                            <div>

                                <ScrollableChat messages={messages} />
                            </div>}

                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? <div>Loading...</div> : (<div></div>)}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder='Enter message'
                                onChange={typingHandler}>

                            </Input>
                        </FormControl>

                    </Box>

                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};


export default SingleChat;
