const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Contact = require('../models/Contact'); // Assuming you have a Contact model

const MY_WA_NUMBER = process.env.MY_WA_NUMBER || "918329446654"; // fallback

// GET list of chats (all conversations, with optional contact name)
// This returns chats grouped by wa_id, showing last message and if any message sent/received
router.get('/chats', async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ timestamp: -1 });



    const chatMap = new Map();

    for (const m of messages) {
      const from = m.from;
      const to = m.to;

      if (!from || !to) continue;

      // Identify the other party's number
      const otherNumber = from === MY_WA_NUMBER ? to : from;

      if (!chatMap.has(otherNumber)) {
        chatMap.set(otherNumber, {
          wa_id: otherNumber,
          name: otherNumber, // fallback name, replace below if found
          lastMessage: m.body,
          lastTime: m.timestamp,
          hasFromMe: from === MY_WA_NUMBER,
          hasToMe: to === MY_WA_NUMBER
        });
      } else {
        const chat = chatMap.get(otherNumber);
        if (from === MY_WA_NUMBER) chat.hasFromMe = true;
        if (to === MY_WA_NUMBER) chat.hasToMe = true;

        // Update last message/time if this message is newer
        if (m.timestamp > chat.lastTime) {
          chat.lastMessage = m.body;
          chat.lastTime = m.timestamp;
        }
      }
    }

  

    // OPTIONAL: Relax filter to show chats with either sent or received messages,
    // because sometimes there is only one side of conversation.
    // If you want strictly two-way conversations, keep filter as is.

    const filteredChats = Array.from(chatMap.values()).filter(
      c => c.hasFromMe || c.hasToMe
    );


    // Fetch contact names from Contact collection to enrich chats
    const waIds = filteredChats.map(c => c.wa_id);
    const contacts = await Contact.find({ wa_id: { $in: waIds } });

    const contactMap = new Map(contacts.map(c => [c.wa_id, c.name]));

    // Replace fallback name with contact name if available
    for (const chat of filteredChats) {
      if (contactMap.has(chat.wa_id)) {
        chat.name = contactMap.get(chat.wa_id);
      }
    }

    // Sort chats by lastTime descending (most recent first)
    filteredChats.sort((a, b) => b.lastTime - a.lastTime);

    res.json(filteredChats);
  } catch (err) {
    console.error('Fetch chats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET messages for a single contact (both sides)
router.get('/:wa_id', async (req, res) => {
  try {
    const { wa_id } = req.params;
    const messages = await Message.find({
      $or: [
        { from: wa_id, to: MY_WA_NUMBER },
        { from: MY_WA_NUMBER, to: wa_id }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages.map(m => ({
      id: m.msg_id || m.id,
      text: m.body,
      timestamp: m.timestamp,
      fromMe: m.from === MY_WA_NUMBER,
      status: m.status || "read"
    })));
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST send a new message
router.post("/", async (req, res) => {
  try {
    const { wa_id, text } = req.body;
    if (!wa_id || !text) {
      return res.status(400).json({ error: "wa_id and text are required" });
    }

    const timestamp = new Date();

    const newMessage = await Message.create({
      id: timestamp.getTime().toString(),
      msg_id: `local-${timestamp.getTime()}`,
      wa_id,
      body: text,
      timestamp,
      from_me: true,
      from: MY_WA_NUMBER,
      to: wa_id,
      status: "sent"
    });

    res.status(201).json({
      id: newMessage.id,
      text: newMessage.body,
      timestamp: newMessage.timestamp,
      fromMe: true,
      status: "sent"
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
