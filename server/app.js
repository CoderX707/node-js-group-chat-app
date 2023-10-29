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
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
// app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIo(server);

const users = {}; // Store user details {userId: socket.id}
const groups = {}; // Store group details {groupId: [userIds]}
const groupMessages = {}; // Store messages per group {groupId: [messages]}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', ({ groupId, userId }) => {
    // Add the user to the group
    if (groups[groupId]) {
      groups[groupId].push(userId);
    } else {
      groups[groupId] = [userId];
    }
    // Store the user's socket ID
    users[userId] = socket.id;

    socket.join(groupId);
    console.log('joinRoom', userId, groupId);

    // Send existing messages to the user when they join the room
    if (groupMessages[groupId]) {
      groupMessages[groupId].forEach((message) => {
        socket.emit('message', message);
      });
    }
  });

  socket.on('chatMessage', ({ groupId, message, userId }) => {
    console.log('chatMessage', groupId, message, userId);

    // Create a message object
    const newMessage = { message, userId, timestamp: new Date() };

    // Store the message
    if (!groupMessages[groupId]) {
      groupMessages[groupId] = [newMessage];
    } else {
      groupMessages[groupId].push(newMessage);
    }

    // Broadcast the message to all users in the group
    io.to(groupId).emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Remove the user from groups and users object on disconnect
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
