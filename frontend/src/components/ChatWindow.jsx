import React, { useEffect, useRef, useState } from "react";
import { fetchMessages } from "../api";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  wa_id,
  chats = [],
  onBack,
  onNewMessageSidebar,
  toggleSidebar,
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef();

  const chatUser = chats.find((c) => c.wa_id === wa_id);

  useEffect(() => {
    if (!wa_id) {
      setMessages([]);
      return;
    }
    setLoading(true);
    fetchMessages(wa_id)
      .then((res) => setMessages(res))
      .catch((e) => {
        console.error(e);
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, [wa_id]);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
    if (typeof onNewMessageSidebar === "function") {
      onNewMessageSidebar(wa_id, msg.text);
    }
  };

  if (!wa_id) {
    return (
      <div className="chat-empty">
        <div className="big">Select a chat</div>
        <div className="small">or start a new conversation</div>
      </div>
    );
  }

  // Check window width to control visibility of buttons
  const isMobile = window.innerWidth < 768;

  return (
    <div className="chat-window">
      <div className="chat-header">
        {isMobile && (
          <button
            className="menu-btn"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        )}
        {isMobile && (
          <button className="back-btn" onClick={onBack} aria-label="Go Back">
            ←
          </button>
        )}
        <div className="avatar-large">
          {chatUser?.name ? chatUser.name[0].toUpperCase() : "U"}
        </div>
        <div className="header-info">
          <div className="h-name">{chatUser?.name || chatUser?.wa_id}</div>
        </div>
      </div>

   <div className="messages" ref={scrollerRef}>
  {loading ? (
    <div className="loading">Loading messages…</div>
  ) : (
    messages.map((m) => (
      <MessageBubble
        key={m.id || m._id || Math.random()}
        msg={m}
        isOnline={chatUser?.online}
      />
    ))
  )}
</div>



      <MessageInput wa_id={wa_id} onNewMessage={handleNewMessage} />
    </div>
  );
}
