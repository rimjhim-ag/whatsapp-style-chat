import React from "react";

/*
 Expected message object shape:
 {
   id: "...",
   text: "hello",
   timestamp: 1691760000000,
   fromMe: true/false,
   status: "sent"|"delivered"|"read"
 }
*/

export default function MessageBubble({ msg, isOnline }) {
  const time = msg.timestamp
    ? new Date(msg.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const isMe = !!msg.fromMe;

  const ticks = () => {
    if (!isMe) return null;

    // If recipient is online, show double ticks always
    if (isOnline) return <span className="tick tick-read">✓✓</span>;

    if (msg.status === "read") return <span className="tick tick-read">✓✓</span>;
    if (msg.status === "delivered") return <span className="tick">✓✓</span>;
    return <span className="tick">✓</span>;
  };

  return (
    <div className={`msg-row ${isMe ? "me" : "them"}`}>
      <div className="bubble">
        <div className="txt">{msg.text}</div>
        <div className="chat-time">
          <span className="time">{time}</span>
          {ticks()}
        </div>
      </div>
    </div>
  );
}


