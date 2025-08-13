import React, { useState } from "react";
import { sendMessage } from "../api";


/*
 This component implements a small emoji panel (no external lib).
 When user sends, it posts { wa_id, text } to backend and expects saved message returned.
*/





/*
Expected message object shape:
{
  id: "...",
  text: "hello",
  timestamp: 1691760000000,
  fromMe: true/false,
  status: "sent" | "delivered" | "read"
}
*/

// ----------- MessageInput Component -----------

const EMOJIS = ["😀", "😁", "😂", "😅", "😍", "😎", "👍", "🙏", "🔥", "🎉"];

export default function MessageInput({ wa_id, onNewMessage }) {
  const [text, setText] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [sending, setSending] = useState(false);

  const onEmoji = (emoji) => setText((t) => t + emoji);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const saved = await sendMessage({ wa_id, text });
      onNewMessage(saved); // send back the saved message from backend
      setText("");
      setOpenEmoji(false);
    } catch (e) {
      console.error(e);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <button className="emoji-btn" onClick={() => setOpenEmoji(!openEmoji)}>
        😊
      </button>

      {openEmoji && (
        <div className="emoji-panel">
          {EMOJIS.map((em) => (
            <button
              key={em}
              className="emoji-item"
              onClick={() => onEmoji(em)}
              type="button"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      <textarea
        className="text-input"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        rows={1}
      />

      <button className="send-btn" onClick={handleSend} disabled={sending}>
        ➤
      </button>
    </div>
  );
}