require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB error:', err); process.exit(1); });

// routes
const messagesRouter = require('./routes/messages');
app.use('/api/messages', messagesRouter);

// health
app.get('/', (req,res)=> res.send('Backend is up'));

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log(`Server listening on ${port}`));
