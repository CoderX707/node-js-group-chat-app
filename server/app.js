const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const Message = require("./models/Message");
const User = require("./models/User");
const Group = require("./models/Group");

const app = express();
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ groupId, userId }) => {
    try {
      const messages = await Message.find({ groupId });
      messages.forEach((message) => {
        socket.emit("message", message);
      });

      socket.join(groupId);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });

  socket.on("chatMessage", async ({ groupId, message, userId }) => {
    try {
      const newMessage = new Message({ groupId, message, userId });
      const savedMessage = await newMessage.save();
      io.to(groupId).emit("message", savedMessage);
    } catch (error) {
      console.error("Error saving message to the database:", error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
