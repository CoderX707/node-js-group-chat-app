import React, { useEffect, useState } from "react";
import MessageBody from "./MessageBody";
import MessageFooter from "./MessageFooter";
import MessageHeader from "./MessageHeader";
import io from "socket.io-client";

const socket = io();

export default function Index({
  group,
  isAdmin,
  handleCreateUser,
  userId,
  groupId,
}) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    setMessages([]);
    socket.emit("joinRoom", { groupId, userId });

    const handleMessage = (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: message.message, userId: message.userId },
      ]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [groupId, userId]);

  const sendMessage = () => {
    socket.emit("chatMessage", { groupId, message: messageInput, userId });
    setMessageInput("");
  };

  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen  card shadow-lg">
      <MessageHeader
        group={group}
        isAdmin={isAdmin}
        handleCreateUser={handleCreateUser}
      />
      <MessageBody chat={messages} userId={userId} />
     
      <MessageFooter
        value={messageInput}
        onchange={(e) => setMessageInput(e.target.value)}
        onClick={sendMessage}
      />
    </div>
  );
}
