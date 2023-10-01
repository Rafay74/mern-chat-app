export const isSameSenderMargin = (messages, m, i, userId) => {
    // Check if the current and next messages exist
    if (i < messages.length - 1 && messages[i] && messages[i + 1]) {
        const currentSender = messages[i].sender;
        const nextSender = messages[i + 1].sender;

        // Check if sender properties exist and compare _id
        if (currentSender && nextSender && currentSender._id === nextSender._id && currentSender._id !== userId) {
            return 33;
        } else if (
            (currentSender && nextSender && currentSender._id !== nextSender._id && currentSender._id !== userId) ||
            (i === messages.length - 1 && currentSender && currentSender._id !== userId)
        ) {
            return 0;
        }
    }

    // Default case: return "auto"
    return "auto";
};



export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameUser = (messages, m, i) => {
    // Check if 'm' and 'messages[i - 1]' are defined and if they have 'sender' with '_id'
    if (m && m.sender && m.sender._id && messages[i - 1] && messages[i - 1].sender && messages[i - 1].sender._id) {
        return messages[i - 1].sender._id === m.sender._id;
    }

    return false; // Handle cases where data is missing
};


export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};
