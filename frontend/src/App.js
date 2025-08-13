import React, { useEffect, useState } from "react";
import { fetchChats } from "./api";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import "./index.css";

function App() {
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  // Fetch chats once
  useEffect(() => {
    fetchChats()
      .then((data) => setChats(data))
      .catch((e) => console.error(e));
  }, []);

  // Sync sidebar visibility on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(selectedId === null);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSelect = (wa_id) => {
    setSelectedId(wa_id);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const updateChatListOnNewMessage = (wa_id, text) => {
    setChats((prev) => {
      let updated = [...prev];
      const idx = updated.findIndex((c) => c.wa_id === wa_id);
      const now = new Date();

      if (idx !== -1) {
        updated[idx] = {
          ...updated[idx],
          lastMessage: text,
          lastTime: now.toISOString(),
        };
      } else {
        updated.push({
          wa_id,
          name: wa_id,
          lastMessage: text,
          lastTime: now.toISOString(),
        });
      }

      updated.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
      return updated;
    });
  };

  const toggleSidebar = () => setShowSidebar((v) => !v);

  return (
    <div className="app-root">
      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? "visible" : "hidden"}`}>
        <div className="sidebar-header">
          <div className="brand">WhatsApp</div>
          {/* Close button on mobile */}
          {window.innerWidth < 768 && (
            <button
              onClick={() => setShowSidebar(false)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "var(--wh-green)",
                fontSize: "20px",
                cursor: "pointer",
              }}
              aria-label="Close Sidebar"
            >
              ✕
            </button>
          )}
        </div>
        <ChatList chats={chats} onSelect={onSelect} selectedId={selectedId} />
      </div>

      {/* Main chat window */}
      <div className="main">
        <ChatWindow
          wa_id={selectedId}
          chats={chats}
          onBack={() => setShowSidebar(true)}
          onNewMessageSidebar={updateChatListOnNewMessage}
          toggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}

export default App;
