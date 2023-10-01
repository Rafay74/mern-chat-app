import SideDrawer from "../components/miscellanous/SideDrawer";
import MyChat from "../components/miscellanous/MyChat";
import MyChatBox from "../components/miscellanous/MyChatBox";
import { ChatState } from "../Context/ChatProvider";
import { Box } from '@chakra-ui/react';
import { useState } from "react";
const Chatpage = () => {
    const [fetchAgain, setFetchAgain] = useState()
    const { user } = ChatState();

    return (
        <div style={{ width: '100%' }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChat fetchAgain={fetchAgain} />}
                {user && <MyChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>



        </div >
    )
}

export default Chatpage
