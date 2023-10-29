const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(cors());

const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIo(server);

const users = {};
const groups = {};
const groupMessages = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', ({ groupId, userId }) => {
    if (groups[groupId]) {
      groups[groupId].push(userId);
    } else {
      groups[groupId] = [userId];
    }
    users[userId] = socket.id;

    socket.join(groupId);
    console.log('joinRoom', userId, groupId);

    if (groupMessages[groupId]) {
      groupMessages[groupId].forEach((message) => {
        socket.emit('message', message);
      });
    }
  });

  socket.on('chatMessage', ({ groupId, message, userId }) => {
    console.log('chatMessage', groupId, message, userId);

    const newMessage = { message, userId, timestamp: new Date() };

    if (!groupMessages[groupId]) {
      groupMessages[groupId] = [newMessage];
    } else {
      groupMessages[groupId].push(newMessage);
    }

    io.to(groupId).emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const userId = Object.keys(users).find((key) => users[key] === socket.id);
    if (userId) {
      for (const groupId in groups) {
        if (groups[groupId].includes(userId)) {
          groups[groupId] = groups[groupId].filter((id) => id !== userId);
          if (groups[groupId].length === 0) {
            delete groups[groupId];
          }
          break;
        }
      }
      delete users[userId];
    }
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
