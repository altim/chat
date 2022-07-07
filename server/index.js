const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let listOfUsers = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("new_user", (data) => {
    const userAlreadyInTheList = listOfUsers.find(
      (item) => item.id === data.id
    );

    if (!userAlreadyInTheList) {
      listOfUsers.push(data);
    }

    io.emit("list_of_users", listOfUsers);
  });

  socket.on("new_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    listOfUsers = listOfUsers.filter((user) => user.id !== socket.id);
    io.emit("list_of_users", listOfUsers);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
