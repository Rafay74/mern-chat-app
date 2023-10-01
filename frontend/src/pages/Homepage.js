import React, { useEffect } from 'react';
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';

import Login from '../components/authentication/Login';
import Signup from '../components/authentication/Signup';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Homepage = () => {
    const history = useHistory()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        console.log("this is homepage one :", user)

        if (user) history.push("/chats"); //chats or chat?
    }, [history])




    return <Container maxW='x1' centerContent>
        <Box display="flex" justifyContent="center" p={3} bg={"white"} w="50%" m="40px 0 15px 0" borderRadius="lg" borderWidth="lpx">
            <Text fontSize="4xl" color="black" fontFamily="Work Sans" style={{ fontWeight: 'bold' }}>Talkwave</Text>
        </Box>

        <Box bg="white" w="50%" p={4} borderRadius="lg" borderWidth="1px">
            <Tabs variant='soft-rounded'>
                <TabList mb="1em">
                    <Tab width="50%" style={{ fontWeight: 'bold' }}>Login</Tab>
                    <Tab width="50%" style={{ fontWeight: 'bold' }}>Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {<Login />}
                    </TabPanel>
                    <TabPanel>
                        {<Signup />}
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </Box>
    </Container >
}

export default Homepage
