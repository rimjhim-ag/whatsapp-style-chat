import React from "react";

export default function ChatList({ chats = [], onSelect, selectedId }) {
  return (
    <div className="chat-list">
      <div className="search-bar">
        <input
          placeholder="Search or start new chat"
          // optionally add onChange here for search filtering in future
        />
      </div>

      <div className="list">
        {chats.length > 0 ? (
          chats.map((c) => (
            <div
              key={c.wa_id}
              className={`chat-item ${selectedId === c.wa_id ? "active" : ""}`}
              onClick={() => onSelect(c.wa_id)}
            >
              <div className="avatar">
                {c.name ? c.name[0].toUpperCase() : "U"}
              </div>
              <div className="meta">
                <div className="name">{c.name || c.wa_id}</div>
                <div className="last">{c.lastMessage || ""}</div>
              </div>
              <div className="time">
                {c.lastTime
                  ? new Date(c.lastTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          ))
        ) : (
          <div className="empty">No chats found</div>
        )}
      </div>
    </div>
  );
}
