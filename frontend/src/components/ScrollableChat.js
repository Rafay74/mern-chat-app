import { Avatar, Tooltip } from "@chakra-ui/react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogic";
import { ChatState } from "../Context/ChatProvider";
import ScrollableFeed from 'react-scrollable-feed';


const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          // console.log("User ID:", user._id);
          // console.log("Message Sender ID:", m.sender?._id);
          // Check if m is a valid message object with an _id property
          if (m && m._id) {
            return (
              <div style={{ display: "flex" }} key={m._id}>
                {(m.sender &&
                  (isSameSender(messages, m, i, user._id) ||
                    isLastMessage(messages, i, user._id))) && (
                    <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                      <Avatar
                        mt="7px"
                        mr={1}
                        size="sm"
                        cursor="pointer"
                        name={m.sender.name}
                        src={m.sender.pic}
                      />
                    </Tooltip>
                  )}
                <span
                  style={{
                    backgroundColor: m.sender?._id === user._id ? "#BEE3F8" : "#B9F5D0",
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                >
                  {m.content}
                </span>
              </div>
            );
          } else {
            // Handle the case where m is not a valid message object
            console.warn(`Invalid message at index ${i}:`, m);
            return null; // Return null to skip rendering the invalid message
          }
        })}
    </ScrollableFeed>

  );
};



export default ScrollableChat;
