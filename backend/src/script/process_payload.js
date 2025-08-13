const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// load .env from project root or backend/.env if that's where your env is
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Contact = require('../models/Contact');
const Message = require('../models/Message');
 // models is under src

const MY_NUMBER = process.env.MY_WA_NUMBER || '918329446654';

async function updateStatus(s) {
  const id = s.id || s.msg_id || s.message_id || s.meta_msg_id || s.reference || null;
  const newStatus = s.status || s.status_type || s.state || 'unknown';
  if (!id) return;

  await Message.findOneAndUpdate(
    { $or: [{ msg_id: id }, { meta_msg_id: id }] },
    { $set: { status: newStatus, raw_status: s } }
  );
}
// fallback for simulation
async function upsertContact(c) {
  if (!c.wa_id) return;
  await Contact.findOneAndUpdate(
    { wa_id: c.wa_id },
    { name: c.profile?.name || c.wa_id },
    { upsert: true, new: true }
  );
}

async function upsertMessage(m, contacts, myNumber) {
  const msg_id = m.id || m.msg_id || m.message_id;
  const from = m.from;
  // Determine to: if from me, to is contact; else to is me
  const to = from === myNumber
    ? (contacts[0]?.wa_id || null)
    : myNumber;

  // Find contact by wa_id (other party)
  const wa_id = from === myNumber ? to : from;
  const contact = contacts.find(c => c.wa_id === wa_id);
  const contactName = contact ? contact.profile.name : wa_id;

  const doc = {
    msg_id,
    wa_id,
    contact_name: contactName,
    from,
    to,
    body: (m.text && m.text.body) || m.body || m.message || '',
    type: m.type || 'text',
    timestamp: m.timestamp ? new Date(Number(m.timestamp) * 1000) : new Date(),
    from_me: from === myNumber,
    raw: m
  };

  await Message.findOneAndUpdate(
    { msg_id },
    { $set: doc },
    { upsert: true, new: true }
  );
}

async function processFile(fullpath) {
  const raw = JSON.parse(fs.readFileSync(fullpath, 'utf8'));

  if (raw.metaData?.entry && Array.isArray(raw.metaData.entry)) {
    for (const e of raw.metaData.entry) {
      if (e.changes) {
        for (const ch of e.changes) {
          const contacts = ch.value?.contacts || [];
          // Save contacts first
          for (const c of contacts) await upsertContact(c);

          const msgs = ch.value?.messages || [];
          const myNumber = ch.value?.metadata?.display_phone_number || MY_NUMBER;
          for (const m of msgs) await upsertMessage(m, contacts, myNumber);

          const statuses = ch.value?.statuses || [];
          for (const s of statuses) await updateStatus(s);
        }
      }
      if (e.statuses) {
        for (const s of e.statuses) await updateStatus(s);
      }
    }
  }
}

async function main(folder) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  console.log(' Connected to DB');

  const files = fs.readdirSync(folder).filter(f => f.endsWith('.json'));
  for (const f of files) {
    console.log(' Processing', f);
    await processFile(path.join(folder, f));
  }
  console.log(' Done processing all files');
  await mongoose.disconnect();
}

if (require.main === module) {
  const folder = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, '../payloads/payloads_message'); // go up one level

  console.log('🔍 Looking for payload folder at:', folder);

  if (!fs.existsSync(folder)) {
    console.error(' Payload folder not found at:', folder);
    process.exit(1);
  }

  main(folder).catch(err => {
    console.error(' Error processing payloads:', err);
    process.exit(1);
  });
}
