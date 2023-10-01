import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState();
    const [notification, setNotification] = useState([])
    const history = useHistory();

    useEffect(() => {
        {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            if (userInfo) {
                setUser(userInfo);
            } else {
                history.push('/');
            }
        }; // Adjust the delay time as needed
    }, [history]);

    console.log("user in ChatProvider:", user); // this lien when uncomment gives that error

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    );
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;
