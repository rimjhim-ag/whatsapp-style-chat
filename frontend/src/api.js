const BASE_URL = process.env.REACT_APP_BACKEND_URL || " "; // your backend base URL

// Fetch the list of chats (contacts with last message info)
export async function fetchChats() {
  const res = await fetch(`${BASE_URL}/chats`);
  if (!res.ok) throw new Error("Failed to fetch chats");
  const data = await res.json();

  // data format: [{ wa_id, name, lastMessage, lastTime, hasFromMe, hasToMe }]
  return data.map(chat => ({
    wa_id: chat.wa_id,
    name: chat.name,
    lastMessage: chat.lastMessage,
    lastTime: new Date(chat.lastTime), // convert to Date if needed
    hasFromMe: chat.hasFromMe,
    hasToMe: chat.hasToMe,
  }));
}

// Fetch messages for a specific contact (wa_id)
export async function fetchMessages(wa_id) {
  const res = await fetch(`${BASE_URL}/${wa_id}`);
  if (!res.ok) throw new Error("Failed to fetch messages");

  const data = await res.json();

  // backend sends messages as:
  // { id, text, timestamp, fromMe, status }
  return data.map(m => ({
    id: m.id,
    text: m.text,
    timestamp: new Date(m.timestamp), // convert ISO string to Date
    fromMe: m.fromMe, // boolean indicating sent by me or not
    status: m.status || "read"
  }));
}

// Send a new message to wa_id
// payload: { wa_id: string, text: string }
export async function sendMessage(payload) {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to send message");

  const data = await res.json();

  // returned object shape: { id, text, timestamp, fromMe, status }
  return {
    id: data.id,
    text: data.text,
    timestamp: new Date(data.timestamp),
    fromMe: data.fromMe,
    status: data.status,
  };
}
