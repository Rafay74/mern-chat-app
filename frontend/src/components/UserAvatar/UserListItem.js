import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItem = ({ user: listItemUser, handleFunction }) => {
    const { user } = ChatState();

    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            bg="#E8E8E8"
            _hover={{
                background: "#38B2AC",
                color: "white",
            }}
            w="100%"
            d="flex"
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={listItemUser.name}
                src={listItemUser.pic}
            />
            <Box>
                <Text>{listItemUser.name}</Text>
                <Text fontSize="xs">
                    <b>Email : </b>
                    {listItemUser.email}
                </Text>
            </Box>
        </Box>
    );
};

export default UserListItem;
