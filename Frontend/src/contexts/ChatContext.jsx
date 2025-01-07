import { createContext, useState } from "react";

export const ChatContext = createContext({});

export const AppProvider = ({ children }) => {
  const [isSidebar, setIsSidebar] = useState(true);
  const [message, setMessage] = useState("");
  const [MessageChat, SetMessagesChat] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [connectionError, setConnectionError] = useState(true);
  return (
    <ChatContext.Provider
      value={{
        isSidebar,
        setIsSidebar,
        message,
        setMessage,
        MessageChat,
        isSending,
        roomId,
        connectionError,
        SetMessagesChat,
        setIsSending,
        setRoomId,
        setConnectionError,
        setIsLoading,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
