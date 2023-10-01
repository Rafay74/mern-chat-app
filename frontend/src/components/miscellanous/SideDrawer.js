import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogic'


const SideDrawer = () => {
    const toast = useToast()
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState()
    const history = useHistory()
    const { user } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const {
        setSelectedChat,
        notification,
        setNotification,
        chats,
        users,
        setChats,
    } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push('/')
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }

    }

    const accessChat = async (userId) => {
        console.log(userId);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };


    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="white"
            w="100%"
            p="5px 10px 5px 10px"
            borderWidth="5px"
        >
            {/* Search Users */}
            <Tooltip label="Search Users" hasArrow placement='bottom-end'>
                <Button variant="ghost" onClick={onOpen}>
                    <i className="fa fa-search"></i>
                    <Text display={{ base: 'none', md: 'flex' }} px="4">
                        Search User
                    </Text>
                </Button>
            </Tooltip>

            {/* Talkwave */}
            <Text fontSize="2xl" fontFamily="Work sans">
                Talkwave
            </Text>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Menu>
                    <MenuButton p={1}>
                        <BellIcon fontSize="2xl" m={1} />
                    </MenuButton>
                    <MenuList pl={2}>
                        {notification.length === 0 ? (
                            <MenuItem>No New Messages</MenuItem>
                        ) : (
                            notification.map((notif) => (
                                <MenuItem key={notif._id} onClick={() => {
                                    setSelectedChat(notif.chat)
                                    setNotification(notification.filter((n) => n !== notif))
                                }}>
                                    {notif.chat.isGroupChat
                                        ? `New message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`
                                    }
                                </MenuItem>
                            ))
                        )}
                    </MenuList>

                </Menu>

                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size='sm' cursor='pointer' name={user.name}></Avatar>
                    </MenuButton>

                    <MenuList>
                        <MenuItem>My Profile</MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>

            {/* Drawer Button */}
            <Button onClick={onOpen}>Open Drawer</Button>

            {/* <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader borderBottom="1px">Search Users</DrawerHeader>
                        <DrawerBody>
                            <Box d="flex" pb={2}>
                                <Input
                                    placeholder="Search by name or email"
                                    mr={2}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                /><Button onClick={handleSearch}>Go</Button>
                            </Box>
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer> */}

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box d="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </Box >
    );
}

export default SideDrawer;
